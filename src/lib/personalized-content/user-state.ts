import { getOptionalUser } from "@/features/auth";
import { isFavorite } from "@/features/favorites/services/favorites.service";
import { getProgress } from "@/features/progress/services/progress.service";
import { isInWatchlist } from "@/features/watchlist/services/watchlist.service";

export interface UserTitleState {
  isFavorite: boolean;
  isInWatchlist: boolean;
  progress: {
    progressSeconds: number;
    durationSeconds: number;
    progressPercent: number;
  } | null;
}

export async function getUserTitleState(imdbId: string): Promise<UserTitleState> {
  const user = await getOptionalUser();

  if (!user) {
    return {
      isFavorite: false,
      isInWatchlist: false,
      progress: null,
    };
  }

  const [favorite, watchlist, progress] = await Promise.all([
    isFavorite(user.id, imdbId),
    isInWatchlist(user.id, imdbId),
    getProgress(user.id, imdbId),
  ]);

  return {
    isFavorite: favorite,
    isInWatchlist: watchlist,
    progress: progress
      ? {
          progressSeconds: progress.progressSeconds,
          durationSeconds: progress.durationSeconds,
          progressPercent: progress.progressPercent,
        }
      : null,
  };
}
