import { AuthRequiredError } from "@/features/auth/errors";
import { MediaType } from "@/generated/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addFavoriteAction, listFavoritesAction, removeFavoriteAction } from "../server-actions";

vi.mock("@/features/auth/services/session.service", () => ({
  requireUser: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("../services/favorites.service", () => ({
  addFavorite: vi.fn(),
  listUserFavorites: vi.fn(),
  removeFavorite: vi.fn(),
}));

import { requireUser } from "@/features/auth/services/session.service";
import { revalidatePath } from "next/cache";
import { addFavorite, listUserFavorites, removeFavorite } from "../services/favorites.service";

describe("favorites server-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation error for invalid add payload", async () => {
    const result = await addFavoriteAction({ titleId: "", mediaType: MediaType.MOVIE });

    expect(result.success).toBe(false);
    expect(addFavorite).not.toHaveBeenCalled();
  });

  it("returns auth message for add when unauthenticated", async () => {
    vi.mocked(requireUser).mockRejectedValue(new AuthRequiredError());

    const result = await addFavoriteAction({ titleId: "1", mediaType: MediaType.MOVIE });

    expect(result).toEqual({ success: false, message: "Please sign in to save favorites." });
  });

  it("adds favorite and revalidates paths", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: 1, email: "x@y.com" });

    const result = await addFavoriteAction({ titleId: "1", mediaType: MediaType.MOVIE });

    expect(result).toEqual({ success: true });
    expect(addFavorite).toHaveBeenCalledWith(1, "1", MediaType.MOVIE);
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("returns validation error for remove with blank id", async () => {
    const result = await removeFavoriteAction("   ");

    expect(result).toEqual({ success: false, message: "Title id must be a positive integer." });
  });

  it("returns generic remove error", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: 1, email: "x@y.com" });
    vi.mocked(removeFavorite).mockRejectedValue(new Error("db"));

    const result = await removeFavoriteAction("1");

    expect(result).toEqual({ success: false, message: "Unable to remove favorite right now." });
  });

  it("lists favorites and falls back to empty array", async () => {
    vi.mocked(requireUser).mockResolvedValue({ id: 1, email: "x@y.com" });
    vi.mocked(listUserFavorites).mockResolvedValue([]);

    await expect(listFavoritesAction()).resolves.toEqual([]);

    vi.mocked(requireUser).mockRejectedValue(new AuthRequiredError());
    await expect(listFavoritesAction()).resolves.toEqual([]);
  });
});
