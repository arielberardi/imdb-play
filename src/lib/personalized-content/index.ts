import type { RailItem } from "@/components/molecules/Rail";
import { getTitleDetailsById } from "@/features/catalog/services/catalog.service";
import type { FavoriteItem } from "@/features/favorites";
import type { ProgressItem } from "@/features/progress";
import { MediaType } from "@/generated/prisma";

const FALLBACK_POSTER = "https://placehold.co/200x300/1f1f1f/a3a3a3?text=No+Image";

function toPosterUrl(path: string | null): string {
  if (!path) {
    return FALLBACK_POSTER;
  }

  return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w500${path}`;
}

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
        const details = await getTitleDetailsById(favorite.titleId);
        if (!details) {
          return null;
        }

        return {
          id: favorite.titleId,
          title: details.title,
          imageUrl: toPosterUrl(details.posterPath),
          rating: details.rating ?? undefined,
          year: details.releaseDate ? new Date(details.releaseDate).getFullYear() : undefined,
          href: toHref(favorite.titleId, favorite.mediaType),
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
        const details = await getTitleDetailsById(progress.titleId);
        if (!details) {
          return null;
        }

        return {
          id: progress.titleId,
          title: details.title,
          imageUrl: toPosterUrl(details.posterPath),
          rating: details.rating ?? undefined,
          year: details.releaseDate ? new Date(details.releaseDate).getFullYear() : undefined,
          href: toHref(progress.titleId, progress.mediaType),
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
