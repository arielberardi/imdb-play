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
    await addToWatchlist("user-1", "tt1", MediaType.SERIES);

    expect(prisma.watchlist.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_titleId: { userId: "user-1", titleId: "tt1" } },
      }),
    );
  });

  it("removes watchlist item", async () => {
    await removeFromWatchlist("user-1", "tt1");

    expect(prisma.watchlist.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1", titleId: "tt1" },
    });
  });

  it("returns true when item is in watchlist", async () => {
    vi.mocked(prisma.watchlist.findUnique).mockResolvedValue({ id: "w1" } as never);

    await expect(isInWatchlist("user-1", "tt1")).resolves.toBe(true);
  });

  it("returns false when item is not in watchlist", async () => {
    vi.mocked(prisma.watchlist.findUnique).mockResolvedValue(null);

    await expect(isInWatchlist("user-1", "tt1")).resolves.toBe(false);
  });

  it("lists watchlist items", async () => {
    vi.mocked(prisma.watchlist.findMany).mockResolvedValue([
      {
        id: "w1",
        userId: "user-1",
        titleId: "tt1",
        mediaType: MediaType.MOVIE,
        createdAt: new Date(),
      },
    ] as never);

    const result = await listUserWatchlist("user-1");

    expect(result).toHaveLength(1);
    expect(prisma.watchlist.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("counts watchlist items", async () => {
    vi.mocked(prisma.watchlist.count).mockResolvedValue(4);

    await expect(getWatchlistCount("user-1")).resolves.toBe(4);
  });
});
