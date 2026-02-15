import bcrypt from "bcrypt";
import { describe, expect, it, vi } from "vitest";
import { hashPassword, verifyPassword } from "../password.service";

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe("password.service", () => {
  it("hashes passwords using bcrypt", async () => {
    await hashPassword("password123");
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
  });

  it("verifies passwords using bcrypt", async () => {
    await verifyPassword("password123", "$2b$12$hash");
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "$2b$12$hash");
  });
});
