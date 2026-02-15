import type { MediaType } from "@/generated/prisma";

export interface AddToWatchlistInput {
  titleId: string;
  mediaType: MediaType;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  titleId: string;
  mediaType: MediaType;
  createdAt: Date;
}

export interface WatchlistActionResult {
  success: boolean;
  message?: string;
}
