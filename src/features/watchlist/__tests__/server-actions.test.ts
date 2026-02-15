import { AuthRequiredError } from "@/features/auth/errors";
import { MediaType } from "@/generated/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addToWatchlistAction,
  listWatchlistAction,
  removeFromWatchlistAction,
} from "../server-actions";

vi.mock("@/features/auth/services/session.service", () => ({
  requireUser: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("../services/watchlist.service", () => ({
  addToWatchlist: vi.fn(),
  listUserWatchlist: vi.fn(),
  removeFromWatchlist: vi.fn(),
}));

import { requireUser } from "@/features/auth/services/session.service";
import { revalidatePath } from "next/cache";
import {
  addToWatchlist,
  listUserWatchlist,
  removeFromWatchlist,
} from "../services/watchlist.service";

describe("watchlist server-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation error for invalid add payload", async () => {
    const result = await addToWatchlistAction({ titleId: "", mediaType: MediaType.MOVIE });

    expect(result.success).toBe(false);
    expect(addToWatchlist).not.toHaveBeenCalled();
  });

  it("returns auth message for add", async () => {
    vi.mocked(requireUser).mockRejectedValue(new AuthRequiredError());

    const result = await addToWatchlistAction({ titleId: "tt1", mediaType: MediaType.MOVIE });

    expect(result).toEqual({ success: false, message: "Please sign in to manage your watchlist." });
  });

  it("adds watchlist item and revalidates", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1", email: "x@y.com" });

    const result = await addToWatchlistAction({ titleId: "tt1", mediaType: MediaType.SERIES });

    expect(result).toEqual({ success: true });
    expect(addToWatchlist).toHaveBeenCalledWith("user-1", "tt1", MediaType.SERIES);
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("rejects blank remove input", async () => {
    const result = await removeFromWatchlistAction(" ");

    expect(result).toEqual({ success: false, message: "Title id is required." });
  });

  it("removes watchlist item", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1", email: "x@y.com" });

    const result = await removeFromWatchlistAction("tt1");

    expect(result).toEqual({ success: true });
    expect(removeFromWatchlist).toHaveBeenCalledWith("user-1", "tt1");
  });

  it("lists watchlist and falls back to empty", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1", email: "x@y.com" });
    vi.mocked(listUserWatchlist).mockResolvedValue([]);

    await expect(listWatchlistAction()).resolves.toEqual([]);

    vi.mocked(requireUser).mockRejectedValue(new AuthRequiredError());
    await expect(listWatchlistAction()).resolves.toEqual([]);
  });
});
