import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "../validators";

describe("auth validators", () => {
  it("accepts valid sign up input", () => {
    const parsed = signUpSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid sign up email", () => {
    const parsed = signUpSchema.safeParse({
      email: "bad",
      password: "password123",
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects short sign up password", () => {
    const parsed = signUpSchema.safeParse({
      email: "test@example.com",
      password: "short",
    });

    expect(parsed.success).toBe(false);
  });

  it("trims sign in email", () => {
    const parsed = signInSchema.safeParse({
      email: "  test@example.com  ",
      password: "password123",
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) {
      throw new Error("Expected parsed success");
    }
    expect(parsed.data.email).toBe("test@example.com");
  });
});
