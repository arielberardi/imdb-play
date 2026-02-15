import type { WatchlistItem } from "@/features/watchlist/types";
import type { MediaType } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function addToWatchlist(
  userId: string,
  titleId: string,
  mediaType: MediaType,
): Promise<void> {
  await prisma.watchlist.upsert({
    where: {
      userId_titleId: {
        userId,
        titleId,
      },
    },
    update: {
      mediaType,
    },
    create: {
      userId,
      titleId,
      mediaType,
    },
  });
}

export async function removeFromWatchlist(userId: string, titleId: string): Promise<void> {
  await prisma.watchlist.deleteMany({
    where: {
      userId,
      titleId,
    },
  });
}

export async function isInWatchlist(userId: string, titleId: string): Promise<boolean> {
  const watchlistItem = await prisma.watchlist.findUnique({
    where: {
      userId_titleId: {
        userId,
        titleId,
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
