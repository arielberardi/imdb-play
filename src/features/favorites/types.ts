import type { MediaType } from "@/generated/prisma";

export interface AddFavoriteInput {
  titleId: string;
  mediaType: MediaType;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  titleId: string;
  mediaType: MediaType;
  createdAt: Date;
}

export interface FavoriteActionResult {
  success: boolean;
  message?: string;
}
