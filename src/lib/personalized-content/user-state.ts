import { getOptionalUser } from "@/features/auth";
import { isFavorite } from "@/features/favorites/services/favorites.service";
import { getProgress } from "@/features/progress/services/progress.service";
import { isInWatchlist } from "@/features/watchlist/services/watchlist.service";
import { parsePositiveIntId } from "@/lib/ids";

export interface UserTitleState {
  isFavorite: boolean;
  isInWatchlist: boolean;
  progress: {
    progressSeconds: number;
    durationSeconds: number;
    progressPercent: number;
  } | null;
}

export async function getUserTitleState(
  titleId: string,
  userId?: string | number,
): Promise<UserTitleState> {
  const parsedTitleId = parsePositiveIntId(titleId);
  if (!parsedTitleId) {
    return {
      isFavorite: false,
      isInWatchlist: false,
      progress: null,
    };
  }

  let resolvedUserId = userId;

  if (!resolvedUserId) {
    const user = await getOptionalUser();
    resolvedUserId = user?.id;
  }

  if (!resolvedUserId) {
    return {
      isFavorite: false,
      isInWatchlist: false,
      progress: null,
    };
  }

  const [favorite, watchlist, progress] = await Promise.all([
    isFavorite(resolvedUserId, parsedTitleId),
    isInWatchlist(resolvedUserId, parsedTitleId),
    getProgress(resolvedUserId, parsedTitleId),
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
