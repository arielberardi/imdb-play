import { AuthRequiredError } from "@/features/auth/errors";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSession, destroySession, getOptionalUser, requireUser } from "../session.service";

const cookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    session: {
      create: vi.fn(),
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

describe("session.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue(cookieStore as never);
  });

  it("creates session record and cookie", async () => {
    vi.mocked(prisma.session.create).mockResolvedValue({
      id: "session-1",
      userId: "user-1",
      token: "token",
      issuedAt: new Date(),
      expiresAt: new Date(),
      revokedAt: null,
    });

    await createSession("user-1");

    expect(prisma.session.create).toHaveBeenCalled();
    expect(cookieStore.set).toHaveBeenCalled();
  });

  it("returns null when cookie has no token", async () => {
    cookieStore.get.mockReturnValue(undefined);

    const result = await getOptionalUser();

    expect(result).toBeNull();
  });

  it("returns user from valid session", async () => {
    cookieStore.get.mockReturnValue({ value: "token-1" });
    vi.mocked(prisma.session.findUnique).mockResolvedValue({
      id: "session-1",
      userId: "user-1",
      token: "token-1",
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      user: {
        id: "user-1",
        email: "test@example.com",
      },
    } as never);

    const result = await getOptionalUser();

    expect(result).toEqual({
      id: "user-1",
      email: "test@example.com",
    });
  });

  it("throws auth error when requireUser has no session", async () => {
    cookieStore.get.mockReturnValue(undefined);

    await expect(requireUser()).rejects.toBeInstanceOf(AuthRequiredError);
  });

  it("revokes session and clears cookie on destroy", async () => {
    cookieStore.get.mockReturnValue({ value: "token-1" });

    await destroySession();

    expect(prisma.session.updateMany).toHaveBeenCalled();
    expect(cookieStore.delete).toHaveBeenCalled();
  });
});
