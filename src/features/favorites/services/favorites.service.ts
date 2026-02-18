import type { FavoriteItem } from "@/features/favorites/types";
import type { MediaType } from "@/generated/prisma";
import { parsePositiveIntId } from "@/lib/ids";
import prisma from "@/lib/prisma";

export async function addFavorite(
  userId: string | number,
  titleId: string | number,
  mediaType: MediaType,
): Promise<void> {
  const parsedUserId = parsePositiveIntId(userId);
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedUserId || !parsedTitleId) {
    return;
  }

  await prisma.favorite.upsert({
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

export async function removeFavorite(
  userId: string | number,
  titleId: string | number,
): Promise<void> {
  const parsedUserId = parsePositiveIntId(userId);
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedUserId || !parsedTitleId) {
    return;
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: parsedUserId,
      titleId: parsedTitleId,
    },
  });
}

export async function isFavorite(
  userId: string | number,
  titleId: string | number,
): Promise<boolean> {
  const parsedUserId = parsePositiveIntId(userId);
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedUserId || !parsedTitleId) {
    return false;
  }

  const favorite = await prisma.favorite.findUnique({
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

  return favorite !== null;
}

export async function listUserFavorites(userId: string | number): Promise<FavoriteItem[]> {
  const parsedUserId = parsePositiveIntId(userId);
  if (!parsedUserId) {
    return [];
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: parsedUserId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return favorites.map((item) => ({
    ...item,
    id: String(item.id),
    userId: String(item.userId),
    titleId: String(item.titleId),
  }));
}

export async function getFavoritesCount(userId: string | number): Promise<number> {
  const parsedUserId = parsePositiveIntId(userId);
  if (!parsedUserId) {
    return 0;
  }

  return prisma.favorite.count({
    where: {
      userId: parsedUserId,
    },
  });
}
