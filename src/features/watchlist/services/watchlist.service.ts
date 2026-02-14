import type { WatchlistItem } from "@/features/watchlist/types";
import type { MediaType } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function addToWatchlist(
  userId: string,
  imdbId: string,
  mediaType: MediaType,
): Promise<void> {
  await prisma.watchlist.upsert({
    where: {
      userId_imdbId: {
        userId,
        imdbId,
      },
    },
    update: {
      mediaType,
    },
    create: {
      userId,
      imdbId,
      mediaType,
    },
  });
}

export async function removeFromWatchlist(userId: string, imdbId: string): Promise<void> {
  await prisma.watchlist.deleteMany({
    where: {
      userId,
      imdbId,
    },
  });
}

export async function isInWatchlist(userId: string, imdbId: string): Promise<boolean> {
  const watchlistItem = await prisma.watchlist.findUnique({
    where: {
      userId_imdbId: {
        userId,
        imdbId,
      },
    },
    select: {
      id: true,
    },
  });

  return watchlistItem !== null;
}

export async function listUserWatchlist(userId: string): Promise<WatchlistItem[]> {
  return prisma.watchlist.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getWatchlistCount(userId: string): Promise<number> {
  return prisma.watchlist.count({
    where: {
      userId,
    },
  });
}
