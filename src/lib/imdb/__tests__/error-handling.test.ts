import { describe, expect, it } from "vitest";
import { isImdbNotFoundError, toUserSafeError } from "../error-handling";
import { ImdbNotFoundError } from "../errors";

describe("error handling helpers", () => {
  it("identifies ImdbNotFoundError correctly", () => {
    const notFound = new ImdbNotFoundError("Not found");
    expect(isImdbNotFoundError(notFound)).toBe(true);
    expect(isImdbNotFoundError(new Error("Generic"))).toBe(false);
    expect(isImdbNotFoundError("unexpected")).toBe(false);
  });

  it("returns Error instances as-is for user-safe throws", () => {
    const error = new Error("Test");
    expect(toUserSafeError(error)).toBe(error);
  });

  it("wraps non-error values into a safe Error", () => {
    const error = toUserSafeError({ reason: "bad" });
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("unexpected error");
  });
});
