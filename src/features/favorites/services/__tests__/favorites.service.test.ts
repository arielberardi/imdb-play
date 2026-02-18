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
    await addFavorite("1", "10", MediaType.MOVIE);

    expect(prisma.favorite.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_titleId: { userId: 1, titleId: 10 } },
      }),
    );
  });

  it("removes favorite", async () => {
    await removeFavorite("1", "10");

    expect(prisma.favorite.deleteMany).toHaveBeenCalledWith({
      where: { userId: 1, titleId: 10 },
    });
  });

  it("returns true when favorite exists", async () => {
    vi.mocked(prisma.favorite.findUnique).mockResolvedValue({ id: 1 } as never);

    await expect(isFavorite("1", "10")).resolves.toBe(true);
  });

  it("returns false when favorite does not exist", async () => {
    vi.mocked(prisma.favorite.findUnique).mockResolvedValue(null);

    await expect(isFavorite("1", "10")).resolves.toBe(false);
  });

  it("lists favorites for a user", async () => {
    vi.mocked(prisma.favorite.findMany).mockResolvedValue([
      {
        id: "fav-1",
        userId: 1,
        titleId: 10,
        mediaType: MediaType.MOVIE,
        createdAt: new Date(),
      },
    ] as never);

    const result = await listUserFavorites("1");

    expect(result).toHaveLength(1);
    expect(result[0]?.titleId).toBe("10");
    expect(prisma.favorite.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      orderBy: { createdAt: "desc" },
    });
  });

  it("counts favorites for a user", async () => {
    vi.mocked(prisma.favorite.count).mockResolvedValue(3);

    await expect(getFavoritesCount("1")).resolves.toBe(3);
  });
});
