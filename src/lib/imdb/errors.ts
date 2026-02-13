/**
 * Base error class for all IMDb API related errors
 */
export class ImdbApiError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ImdbApiError";
  }
}

/**
 * Network-level errors (timeout, connection refused, DNS failure)
 */
export class ImdbNetworkError extends ImdbApiError {
  public constructor(message = "Network request failed") {
    super(message);
    this.name = "ImdbNetworkError";
  }
}

/**
 * HTTP-level errors (4xx, 5xx status codes except 404 and 429)
 */
export class ImdbHttpError extends ImdbApiError {
  public readonly status: number;

  public constructor(status: number, message: string) {
    super(message);
    this.name = "ImdbHttpError";
    this.status = status;
  }
}

/**
 * Resource not found (404 status code)
 */
export class ImdbNotFoundError extends ImdbApiError {
  public constructor(message = "Resource not found") {
    super(message);
    this.name = "ImdbNotFoundError";
  }
}

/**
 * Validation errors (malformed requests, missing required fields)
 */
export class ImdbValidationError extends ImdbApiError {
  public constructor(message = "Validation failed") {
    super(message);
    this.name = "ImdbValidationError";
  }
}

/**
 * Rate limit exceeded (429 status code)
 */
export class ImdbRateLimitError extends ImdbApiError {
  public constructor(message = "Rate limit exceeded") {
    super(message);
    this.name = "ImdbRateLimitError";
  }
}
