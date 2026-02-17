import { AuthRequiredError } from "@/features/auth/errors";
import { requireUser } from "@/features/auth/services/session.service";
import type { AuthUser } from "@/features/auth/types";
import logger from "@/lib/logger";
import { enforceRateLimit, RateLimitExceededError } from "@/lib/rate-limit";
import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

interface RateLimitedActionOptions {
  keyPrefix: string;
  limit: number;
  windowMs: number;
}

interface AuthActionContext {
  user: AuthUser;
}

export type ActionServerError = "UNAUTHORIZED" | "RATE_LIMITED" | "INTERNAL_SERVER_ERROR";

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error("Unknown safe action error");
}

function mapServerError(error: unknown): ActionServerError {
  if (error instanceof AuthRequiredError) {
    return "UNAUTHORIZED";
  }

  if (error instanceof RateLimitExceededError) {
    return "RATE_LIMITED";
  }

  const resolvedError = toError(error);
  logger.error(
    {
      name: resolvedError.name,
      message: resolvedError.message,
    },
    "Safe action execution failed",
  );

  return "INTERNAL_SERVER_ERROR";
}

async function getClientIdentifier(): Promise<string> {
  try {
    const requestHeaders = await headers();
    const forwardedFor = requestHeaders.get("x-forwarded-for");

    if (forwardedFor && forwardedFor.length > 0) {
      const firstAddress = forwardedFor.split(",")[0]?.trim();
      return firstAddress && firstAddress.length > 0 ? firstAddress : "unknown";
    }

    const realIp = requestHeaders.get("x-real-ip");
    return realIp && realIp.length > 0 ? realIp : "unknown";
  } catch {
    return "unknown";
  }
}

const baseActionClient = createSafeActionClient<"flattened", ActionServerError>({
  defaultValidationErrorsShape: "flattened",
  handleServerError: mapServerError,
});

const authActionClient = baseActionClient.use(async ({ next }) => {
  const user = await requireUser();

  return next({
    ctx: {
      user,
    },
  });
});

export function publicRateLimitedAction(options: RateLimitedActionOptions) {
  return baseActionClient.use(async ({ next }) => {
    const clientIdentifier = await getClientIdentifier();

    await enforceRateLimit({
      keyPrefix: options.keyPrefix,
      key: clientIdentifier,
      limit: options.limit,
      windowMs: options.windowMs,
    });

    return next();
  });
}

export function authRateLimitedAction(options: RateLimitedActionOptions) {
  return authActionClient.use(async ({ next, ctx }) => {
    const authCtx = ctx as AuthActionContext;

    await enforceRateLimit({
      keyPrefix: options.keyPrefix,
      key: authCtx.user.id,
      limit: options.limit,
      windowMs: options.windowMs,
    });

    return next({
      ctx: {
        user: authCtx.user,
      },
    });
  });
}
