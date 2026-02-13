import { DEFAULT_TIMEOUT, MAX_RETRIES, TMDB_BASE_URL } from "./constants";
import { ImdbHttpError, ImdbNetworkError, ImdbNotFoundError, ImdbRateLimitError } from "./errors";

/**
 * Options for the API fetch function
 */
export interface FetchOptions {
  /**
   * Next.js ISR revalidation time in seconds
   * @default false (no caching)
   */
  revalidate?: number | false;

  /**
   * Next.js cache strategy
   * @default undefined (use revalidate)
   */
  cache?: "force-cache" | "no-store";

  /**
   * Request timeout in milliseconds
   * @default 10000 (10 seconds)
   */
  timeout?: number;

  /**
   * Number of retries for 429 and 5xx errors
   * @default 2
   */
  retries?: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
}

/**
 * Sleep utility for retry backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Low-level fetch wrapper with timeout, retry, and error handling
 *
 * @param endpoint - API endpoint (e.g., "/movie/popular")
 * @param options - Fetch options
 * @returns Typed API response
 * @throws {ImdbNetworkError} On network failures or timeout
 * @throws {ImdbNotFoundError} On 404 responses
 * @throws {ImdbRateLimitError} On 429 responses (after retries)
 * @throws {ImdbHttpError} On other HTTP errors
 *
 * @example
 * ```ts
 * const response = await apiFetch<TmdbMovie>("/movie/550", { revalidate: 3600 });
 * console.log(response.data.title);
 * ```
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { revalidate = false, cache, timeout = DEFAULT_TIMEOUT, retries = MAX_RETRIES } = options;

  const apiKey = process.env.IMDB_API_KEY;
  if (!apiKey) {
    throw new ImdbNetworkError("IMDB_API_KEY is not configured");
  }

  // Build full URL with API key
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${apiKey}`;

  // Build Next.js fetch options
  const fetchOptions: RequestInit = {};

  if (cache) {
    fetchOptions.cache = cache;
  } else if (revalidate !== false) {
    fetchOptions.next = { revalidate };
  }

  // Retry loop with exponential backoff
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        // 404: Resource not found
        if (response.status === 404) {
          throw new ImdbNotFoundError(`Resource not found: ${endpoint}`);
        }

        // 429: Rate limit exceeded - retry with backoff
        if (response.status === 429) {
          lastError = new ImdbRateLimitError("Rate limit exceeded");

          if (attempt < retries) {
            const backoffMs = Math.pow(2, attempt) * 1000; // 1s, 2s
            await sleep(backoffMs);
            continue;
          }

          throw lastError;
        }

        // 5xx: Server errors - retry with backoff
        if (response.status >= 500 && response.status < 600) {
          lastError = new ImdbHttpError(response.status, `Server error: ${response.statusText}`);

          if (attempt < retries) {
            const backoffMs = Math.pow(2, attempt) * 1000; // 1s, 2s
            await sleep(backoffMs);
            continue;
          }

          throw lastError;
        }

        // Other HTTP errors (4xx except 404 and 429)
        throw new ImdbHttpError(response.status, `HTTP error: ${response.statusText}`);
      }

      // Parse and return successful response
      const data = (await response.json()) as T;

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Re-throw our custom errors
      if (
        error instanceof ImdbNotFoundError ||
        error instanceof ImdbHttpError ||
        error instanceof ImdbRateLimitError
      ) {
        throw error;
      }

      // Handle abort (timeout)
      if (error instanceof Error && error.name === "AbortError") {
        lastError = new ImdbNetworkError(`Request timeout after ${timeout}ms: ${endpoint}`);

        if (attempt < retries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          await sleep(backoffMs);
          continue;
        }

        throw lastError;
      }

      // Handle network errors
      lastError = new ImdbNetworkError(
        error instanceof Error ? `Network error: ${error.message}` : "Unknown network error",
      );

      if (attempt < retries) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        await sleep(backoffMs);
        continue;
      }

      throw lastError;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError || new ImdbNetworkError("Request failed after retries");
}
