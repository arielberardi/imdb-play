import type { MediaType } from "@/generated/prisma";

export interface UpsertProgressInput {
  titleId: string;
  mediaType: MediaType;
  progressSeconds: number;
  durationSeconds: number;
}

export interface ProgressItem {
  id: string;
  userId: string;
  titleId: string;
  mediaType: MediaType;
  progressSeconds: number;
  durationSeconds: number;
  progressPercent: number;
  updatedAt: Date;
}

export interface ProgressActionResult {
  success: boolean;
  message?: string;
}
