import { render, screen } from "@/lib/test-utils";
import { describe, expect, it, vi } from "vitest";
import { Navbar } from "./Navbar";

vi.mock("@/features/auth", () => ({
  getOptionalUser: vi.fn(),
  signOutAction: vi.fn(),
}));

import { getOptionalUser } from "@/features/auth";

describe("Navbar", () => {
  it("renders sign in when no user", async () => {
    vi.mocked(getOptionalUser).mockResolvedValue(null);

    render(await Navbar());

    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("renders user email when signed in", async () => {
    vi.mocked(getOptionalUser).mockResolvedValue({ id: "user-1", email: "user@example.com" });

    render(await Navbar());

    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Out" })).toBeInTheDocument();
  });
});
