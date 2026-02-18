import type { ProgressItem } from "@/features/progress/types";
import type { MediaType } from "@/generated/prisma";
import { parsePositiveIntId } from "@/lib/ids";
import prisma from "@/lib/prisma";

function toProgressPercent(progressSeconds: number, durationSeconds: number): number {
  if (durationSeconds <= 0) {
    return 0;
  }

  const percent = (progressSeconds / durationSeconds) * 100;
  return Math.max(0, Math.min(100, percent));
}

function withProgressPercent(item: {
  id: number;
  userId: number;
  titleId: number;
  mediaType: MediaType;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: Date;
}): ProgressItem {
  return {
    ...item,
    id: String(item.id),
    userId: String(item.userId),
    titleId: String(item.titleId),
    progressPercent: toProgressPercent(item.progressSeconds, item.durationSeconds),
  };
}

export async function upsertProgress(
  userId: string | number,
  titleId: string | number,
  mediaType: MediaType,
  progressSeconds: number,
  durationSeconds: number,
): Promise<ProgressItem> {
  const parsedUserId = parsePositiveIntId(userId);
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedUserId || !parsedTitleId) {
    throw new Error("Invalid userId or titleId for progress update.");
  }

  const progress = await prisma.continueWatching.upsert({
    where: {
      userId_titleId: {
        userId: parsedUserId,
        titleId: parsedTitleId,
      },
    },
    update: {
      mediaType,
      progressSeconds,
      durationSeconds,
    },
    create: {
      userId: parsedUserId,
      titleId: parsedTitleId,
      mediaType,
      progressSeconds,
      durationSeconds,
    },
  });

  return withProgressPercent(progress);
}

export async function getProgress(
  userId: string | number,
  titleId: string | number,
): Promise<ProgressItem | null> {
  const parsedUserId = parsePositiveIntId(userId);
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedUserId || !parsedTitleId) {
    return null;
  }

  const progress = await prisma.continueWatching.findUnique({
    where: {
      userId_titleId: {
        userId: parsedUserId,
        titleId: parsedTitleId,
      },
    },
  });

  if (!progress) {
    return null;
  }

  return withProgressPercent(progress);
}

export async function listContinueWatching(userId: string | number): Promise<ProgressItem[]> {
  const parsedUserId = parsePositiveIntId(userId);
  if (!parsedUserId) {
    return [];
  }

  const items = await prisma.continueWatching.findMany({
    where: {
      userId: parsedUserId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return items.map(withProgressPercent).filter((item) => item.progressPercent < 95);
}

export async function removeProgress(
  userId: string | number,
  titleId: string | number,
): Promise<void> {
  const parsedUserId = parsePositiveIntId(userId);
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedUserId || !parsedTitleId) {
    return;
  }

  await prisma.continueWatching.deleteMany({
    where: {
      userId: parsedUserId,
      titleId: parsedTitleId,
    },
  });
}
