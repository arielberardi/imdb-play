import { beforeEach, describe, expect, it, vi } from "vitest";
import { signInAction, signOutAction, signUpAction } from "../server-actions";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("../services/auth.service", () => ({
  createUser: vi.fn(),
  findUserByEmail: vi.fn(),
  verifyUserCredentials: vi.fn(),
}));

vi.mock("../services/password.service", () => ({
  hashPassword: vi.fn(),
}));

vi.mock("../services/session.service", () => ({
  createSession: vi.fn(),
  destroySession: vi.fn(),
}));

import { redirect } from "next/navigation";
import { createUser, findUserByEmail, verifyUserCredentials } from "../services/auth.service";
import { hashPassword } from "../services/password.service";
import { createSession, destroySession } from "../services/session.service";

describe("server-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation errors for invalid sign up input", async () => {
    const result = await signUpAction({
      email: "bad-email",
      password: "123",
    });

    expect(result.success).toBe(false);
    expect(result.messageKey).toBe("validation.fixFields");
    expect(result.fieldErrorKeys?.email).toBe("field.email.invalid");
    expect(result.fieldErrorKeys?.password).toBe("field.password.minLength");
  });

  it("returns duplicate email error on sign up", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      passwordHash: "hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await signUpAction({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.success).toBe(false);
    expect(result.messageKey).toBe("signUp.duplicateEmail");
    expect(result.fieldErrorKeys?.email).toBe("field.email.alreadyInUse");
  });

  it("creates user, session, and redirects on successful sign up", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(null);
    vi.mocked(hashPassword).mockResolvedValue("hash");
    vi.mocked(createUser).mockResolvedValue({
      id: 1,
      email: "test@example.com",
    });

    await signUpAction({
      email: "test@example.com",
      password: "password123",
    });

    expect(createSession).toHaveBeenCalledWith(1);
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("returns invalid credentials on failed sign in", async () => {
    vi.mocked(verifyUserCredentials).mockResolvedValue(null);

    const result = await signInAction({
      email: "test@example.com",
      password: "wrong-password",
    });

    expect(result.success).toBe(false);
    expect(result.messageKey).toBe("signIn.invalidCredentials");
  });

  it("creates session and redirects on successful sign in", async () => {
    vi.mocked(verifyUserCredentials).mockResolvedValue({
      id: 1,
      email: "test@example.com",
    });

    await signInAction({
      email: "test@example.com",
      password: "password123",
    });

    expect(createSession).toHaveBeenCalledWith(1);
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("destroys session and redirects on sign out", async () => {
    vi.mocked(destroySession).mockResolvedValue(undefined);

    await signOutAction();

    expect(destroySession).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
