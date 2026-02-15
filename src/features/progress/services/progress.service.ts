import type { ProgressItem } from "@/features/progress/types";
import type { MediaType } from "@/generated/prisma";
import prisma from "@/lib/prisma";

function toProgressPercent(progressSeconds: number, durationSeconds: number): number {
  if (durationSeconds <= 0) {
    return 0;
  }

  const percent = (progressSeconds / durationSeconds) * 100;
  return Math.max(0, Math.min(100, percent));
}

function withProgressPercent(item: {
  id: string;
  userId: string;
  titleId: string;
  mediaType: MediaType;
  progressSeconds: number;
  durationSeconds: number;
  updatedAt: Date;
}): ProgressItem {
  return {
    ...item,
    progressPercent: toProgressPercent(item.progressSeconds, item.durationSeconds),
  };
}

export async function upsertProgress(
  userId: string,
  titleId: string,
  mediaType: MediaType,
  progressSeconds: number,
  durationSeconds: number,
): Promise<ProgressItem> {
  const progress = await prisma.continueWatching.upsert({
    where: {
      userId_titleId: {
        userId,
        titleId,
      },
    },
    update: {
      mediaType,
      progressSeconds,
      durationSeconds,
    },
    create: {
      userId,
      titleId,
      mediaType,
      progressSeconds,
      durationSeconds,
    },
  });

  return withProgressPercent(progress);
}

export async function getProgress(userId: string, titleId: string): Promise<ProgressItem | null> {
  const progress = await prisma.continueWatching.findUnique({
    where: {
      userId_titleId: {
        userId,
        titleId,
      },
    },
  });

  if (!progress) {
    return null;
  }

  return withProgressPercent(progress);
}

export async function listContinueWatching(userId: string): Promise<ProgressItem[]> {
  const items = await prisma.continueWatching.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return items.map(withProgressPercent).filter((item) => item.progressPercent < 95);
}

export async function removeProgress(userId: string, titleId: string): Promise<void> {
  await prisma.continueWatching.deleteMany({
    where: {
      userId,
      titleId,
    },
  });
}
