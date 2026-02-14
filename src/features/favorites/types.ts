import type { MediaType } from "@/generated/prisma";

export interface AddFavoriteInput {
  imdbId: string;
  mediaType: MediaType;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  imdbId: string;
  mediaType: MediaType;
  createdAt: Date;
}

export interface FavoriteActionResult {
  success: boolean;
  message?: string;
}
