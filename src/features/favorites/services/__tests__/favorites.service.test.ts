import { MediaType } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addFavorite,
  getFavoritesCount,
  isFavorite,
  listUserFavorites,
  removeFavorite,
} from "../favorites.service";

vi.mock("@/lib/prisma", () => ({
  default: {
    favorite: {
      upsert: vi.fn(),
      deleteMany: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe("favorites.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("upserts favorite", async () => {
    await addFavorite("user-1", "tt1", MediaType.MOVIE);

    expect(prisma.favorite.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_titleId: { userId: "user-1", titleId: "tt1" } },
      }),
    );
  });

  it("removes favorite", async () => {
    await removeFavorite("user-1", "tt1");

    expect(prisma.favorite.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1", titleId: "tt1" },
    });
  });

  it("returns true when favorite exists", async () => {
    vi.mocked(prisma.favorite.findUnique).mockResolvedValue({ id: "fav-1" } as never);

    await expect(isFavorite("user-1", "tt1")).resolves.toBe(true);
  });

  it("returns false when favorite does not exist", async () => {
    vi.mocked(prisma.favorite.findUnique).mockResolvedValue(null);

    await expect(isFavorite("user-1", "tt1")).resolves.toBe(false);
  });

  it("lists favorites for a user", async () => {
    vi.mocked(prisma.favorite.findMany).mockResolvedValue([
      {
        id: "fav-1",
        userId: "user-1",
        titleId: "tt1",
        mediaType: MediaType.MOVIE,
        createdAt: new Date(),
      },
    ] as never);

    const result = await listUserFavorites("user-1");

    expect(result).toHaveLength(1);
    expect(prisma.favorite.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("counts favorites for a user", async () => {
    vi.mocked(prisma.favorite.count).mockResolvedValue(3);

    await expect(getFavoritesCount("user-1")).resolves.toBe(3);
  });
});
