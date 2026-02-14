import type { RailItem } from "@/components/molecules/Rail";
import type { FavoriteItem } from "@/features/favorites";
import type { ProgressItem } from "@/features/progress";
import { MediaType } from "@/generated/prisma";
import { getTitleDetails } from "@/lib/imdb";

const FALLBACK_POSTER = "https://placehold.co/200x300/1f1f1f/a3a3a3?text=No+Image";

function toHref(id: string, mediaType: MediaType): string {
  return mediaType === MediaType.MOVIE ? `/movies/${id}` : `/series/${id}`;
}

function toMediaType(mediaType: MediaType): "movie" | "series" {
  return mediaType === MediaType.MOVIE ? "movie" : "series";
}

export async function enrichFavorites(favorites: FavoriteItem[]): Promise<RailItem[]> {
  const results = await Promise.all(
    favorites.map(async (favorite) => {
      try {
        const details = await getTitleDetails(favorite.imdbId, favorite.mediaType);

        return {
          id: favorite.imdbId,
          title: details.title,
          imageUrl: details.posterPath
            ? `https://image.tmdb.org/t/p/w500${details.posterPath}`
            : FALLBACK_POSTER,
          rating: details.rating ?? undefined,
          year: details.releaseDate ? new Date(details.releaseDate).getFullYear() : undefined,
          href: toHref(favorite.imdbId, favorite.mediaType),
          mediaType: toMediaType(favorite.mediaType),
          isFavorite: true,
        } satisfies RailItem;
      } catch {
        return null;
      }
    }),
  );

  return results.reduce<RailItem[]>((acc, item) => {
    if (item) {
      acc.push(item);
    }

    return acc;
  }, []);
}

export async function enrichContinueWatching(progressItems: ProgressItem[]): Promise<RailItem[]> {
  const results = await Promise.all(
    progressItems.map(async (progress) => {
      try {
        const details = await getTitleDetails(progress.imdbId, progress.mediaType);

        return {
          id: progress.imdbId,
          title: details.title,
          imageUrl: details.posterPath
            ? `https://image.tmdb.org/t/p/w500${details.posterPath}`
            : FALLBACK_POSTER,
          rating: details.rating ?? undefined,
          year: details.releaseDate ? new Date(details.releaseDate).getFullYear() : undefined,
          href: toHref(progress.imdbId, progress.mediaType),
          mediaType: toMediaType(progress.mediaType),
          showProgress: true,
          progressPercent: progress.progressPercent,
        } satisfies RailItem;
      } catch {
        return null;
      }
    }),
  );

  return results.reduce<RailItem[]>((acc, item) => {
    if (item) {
      acc.push(item);
    }

    return acc;
  }, []);
}
