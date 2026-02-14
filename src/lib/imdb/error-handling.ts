import { ImdbNotFoundError } from "./errors";

export function isImdbNotFoundError(error: unknown): boolean {
  return error instanceof ImdbNotFoundError;
}

export function toUserSafeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error("An unexpected error occurred while loading title data.");
}
