import prisma from "@/lib/prisma";
import { describe, expect, it, vi } from "vitest";
import { createUser, findUserByEmail, verifyUserCredentials } from "./auth.service";
import { verifyPassword } from "./password.service";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("./password.service", () => ({
  verifyPassword: vi.fn(),
}));

describe("auth.service", () => {
  it("finds user by email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      passwordHash: "hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await findUserByEmail("test@example.com");

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(user?.email).toBe("test@example.com");
  });

  it("creates a user with selected fields", async () => {
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
    } as never);

    const user = await createUser({
      email: "test@example.com",
      passwordHash: "hash",
    });

    expect(user).toEqual({
      id: "user-1",
      email: "test@example.com",
    });
  });

  it("returns null when user is not found during credential check", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await verifyUserCredentials({
      email: "missing@example.com",
      password: "password123",
    });

    expect(result).toBeNull();
  });

  it("returns user when credentials are valid", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      passwordHash: "hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(verifyPassword).mockResolvedValue(true);

    const result = await verifyUserCredentials({
      email: "test@example.com",
      password: "password123",
    });

    expect(result).toEqual({
      id: "user-1",
      email: "test@example.com",
    });
  });
});
