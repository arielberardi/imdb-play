import logger from "@/lib/logger";

interface RateLimitResult {
  count: number;
  ttlMs: number;
}

interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<RateLimitResult>;
}

interface InMemoryRateLimitEntry {
  count: number;
  expiresAtMs: number;
}

export interface RateLimitCheckOptions {
  keyPrefix: string;
  key: string;
  limit: number;
  windowMs: number;
}

export class RateLimitExceededError extends Error {
  public readonly retryAfterSeconds: number;

  public constructor(retryAfterSeconds: number) {
    super("Rate limit exceeded");
    this.name = "RateLimitExceededError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

class InMemoryRateLimitStore implements RateLimitStore {
  private readonly entries = new Map<string, InMemoryRateLimitEntry>();

  public async increment(key: string, windowMs: number): Promise<RateLimitResult> {
    const nowMs = Date.now();
    const existing = this.entries.get(key);

    if (!existing || existing.expiresAtMs <= nowMs) {
      const expiresAtMs = nowMs + windowMs;
      this.entries.set(key, {
        count: 1,
        expiresAtMs,
      });

      return {
        count: 1,
        ttlMs: windowMs,
      };
    }

    existing.count += 1;

    return {
      count: existing.count,
      ttlMs: Math.max(existing.expiresAtMs - nowMs, 0),
    };
  }
}

class UpstashRestRateLimitStore implements RateLimitStore {
  private readonly url: string;
  private readonly token: string;

  public constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  public async increment(key: string, windowMs: number): Promise<RateLimitResult> {
    const response = await fetch(`${this.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PTTL", key],
        ["PEXPIRE", key, String(windowMs), "NX"],
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Upstash rate limit failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error("Upstash rate limit response is malformed");
    }

    const count = this.readNumberResult(payload, 0);
    const pttl = this.readNumberResult(payload, 1);

    return {
      count,
      ttlMs: pttl > 0 ? pttl : windowMs,
    };
  }

  private readNumberResult(payload: unknown[], index: number): number {
    const item = payload[index] as { result?: unknown } | undefined;
    if (!item || typeof item.result !== "number") {
      throw new Error("Upstash rate limit response is missing numeric result");
    }

    return item.result;
  }
}

const inMemoryRateLimitStore = new InMemoryRateLimitStore();

function getRateLimitStore(): RateLimitStore {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return inMemoryRateLimitStore;
  }

  return new UpstashRestRateLimitStore(url, token);
}

export async function enforceRateLimit(options: RateLimitCheckOptions): Promise<void> {
  const { keyPrefix, key, limit, windowMs } = options;
  const normalizedKey = `rate-limit:${keyPrefix}:${key}`;
  const rateLimitStore = getRateLimitStore();

  try {
    const result = await rateLimitStore.increment(normalizedKey, windowMs);

    if (result.count <= limit) {
      return;
    }

    const retryAfterSeconds = Math.max(1, Math.ceil(result.ttlMs / 1000));
    throw new RateLimitExceededError(retryAfterSeconds);
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      throw error;
    }

    logger.warn(
      {
        keyPrefix,
        key,
      },
      "Rate limit store failed, allowing request",
    );
  }
}
