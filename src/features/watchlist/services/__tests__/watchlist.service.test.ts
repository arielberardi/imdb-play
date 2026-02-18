import { MediaType } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addToWatchlist,
  getWatchlistCount,
  isInWatchlist,
  listUserWatchlist,
  removeFromWatchlist,
} from "../watchlist.service";

vi.mock("@/lib/prisma", () => ({
  default: {
    watchlist: {
      upsert: vi.fn(),
      deleteMany: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe("watchlist.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("upserts watchlist record", async () => {
    await addToWatchlist("1", "10", MediaType.SERIES);

    expect(prisma.watchlist.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_titleId: { userId: 1, titleId: 10 } },
      }),
    );
  });

  it("removes watchlist item", async () => {
    await removeFromWatchlist("1", "10");

    expect(prisma.watchlist.deleteMany).toHaveBeenCalledWith({
      where: { userId: 1, titleId: 10 },
    });
  });

  it("returns true when item is in watchlist", async () => {
    vi.mocked(prisma.watchlist.findUnique).mockResolvedValue({ id: 1 } as never);

    await expect(isInWatchlist("1", "10")).resolves.toBe(true);
  });

  it("returns false when item is not in watchlist", async () => {
    vi.mocked(prisma.watchlist.findUnique).mockResolvedValue(null);

    await expect(isInWatchlist("1", "10")).resolves.toBe(false);
  });

  it("lists watchlist items", async () => {
    vi.mocked(prisma.watchlist.findMany).mockResolvedValue([
      {
        id: 1,
        userId: 1,
        titleId: 10,
        mediaType: MediaType.MOVIE,
        createdAt: new Date(),
      },
    ] as never);

    const result = await listUserWatchlist("1");

    expect(result).toHaveLength(1);
    expect(result[0]?.titleId).toBe("10");
    expect(prisma.watchlist.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      orderBy: { createdAt: "desc" },
    });
  });

  it("counts watchlist items", async () => {
    vi.mocked(prisma.watchlist.count).mockResolvedValue(4);

    await expect(getWatchlistCount("1")).resolves.toBe(4);
  });
});
