import type { MediaType } from "@/generated/prisma";

export interface AddToWatchlistInput {
  imdbId: string;
  mediaType: MediaType;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  imdbId: string;
  mediaType: MediaType;
  createdAt: Date;
}

export interface WatchlistActionResult {
  success: boolean;
  message?: string;
}
