import type { FavoriteItem } from "@/features/favorites/types";
import type { MediaType } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function addFavorite(
  userId: string,
  titleId: string,
  mediaType: MediaType,
): Promise<void> {
  await prisma.favorite.upsert({
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

export async function removeFavorite(userId: string, titleId: string): Promise<void> {
  await prisma.favorite.deleteMany({
    where: {
      userId,
      titleId,
    },
  });
}

export async function isFavorite(userId: string, titleId: string): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
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

  return favorite !== null;
}

export async function listUserFavorites(userId: string): Promise<FavoriteItem[]> {
  return prisma.favorite.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFavoritesCount(userId: string): Promise<number> {
  return prisma.favorite.count({
    where: {
      userId,
    },
  });
}
