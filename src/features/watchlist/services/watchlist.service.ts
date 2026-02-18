import type { WatchlistItem } from "@/features/watchlist/types";
import type { MediaType } from "@/generated/prisma";
import { parsePositiveIntId } from "@/lib/ids";
import prisma from "@/lib/prisma";

export async function addToWatchlist(
  userId: string | number,
  titleId: string | number,
  mediaType: MediaType,
): Promise<void> {
  const parsedUserId = parsePositiveIntId(userId);
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedUserId || !parsedTitleId) {
    return;
  }

  await prisma.watchlist.upsert({
    where: {
      userId_titleId: {
        userId: parsedUserId,
        titleId: parsedTitleId,
      },
    },
    update: {
      mediaType,
    },
    create: {
      userId: parsedUserId,
      titleId: parsedTitleId,
      mediaType,
    },
  });
}

export async function removeFromWatchlist(
  userId: string | number,
  titleId: string | number,
): Promise<void> {
  const parsedUserId = parsePositiveIntId(userId);
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedUserId || !parsedTitleId) {
    return;
  }

  await prisma.watchlist.deleteMany({
    where: {
      userId: parsedUserId,
      titleId: parsedTitleId,
    },
  });
}

export async function isInWatchlist(
  userId: string | number,
  titleId: string | number,
): Promise<boolean> {
  const parsedUserId = parsePositiveIntId(userId);
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedUserId || !parsedTitleId) {
    return false;
  }

  const watchlistItem = await prisma.watchlist.findUnique({
    where: {
      userId_titleId: {
        userId: parsedUserId,
        titleId: parsedTitleId,
      },
    },
    select: {
      id: true,
    },
  });

  return watchlistItem !== null;
}

export async function listUserWatchlist(userId: string | number): Promise<WatchlistItem[]> {
  const parsedUserId = parsePositiveIntId(userId);
  if (!parsedUserId) {
    return [];
  }

  const watchlist = await prisma.watchlist.findMany({
    where: {
      userId: parsedUserId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return watchlist.map((item) => ({
    ...item,
    id: String(item.id),
    userId: String(item.userId),
    titleId: String(item.titleId),
  }));
}

export async function getWatchlistCount(userId: string | number): Promise<number> {
  const parsedUserId = parsePositiveIntId(userId);
  if (!parsedUserId) {
    return 0;
  }

  return prisma.watchlist.count({
    where: {
      userId: parsedUserId,
    },
  });
}
