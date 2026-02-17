"use server";

import { MediaType } from "@/generated/prisma";
import { publicRateLimitedAction } from "@/lib/safe-action";
import { z } from "zod";
import {
  getEpisodesBySeason,
  getTitleDetailsById,
  listGenres,
  listPopularTitlesByType,
  listTitlesByGenre,
  listTrendingTitles,
  searchCatalogTitles,
} from "./services/catalog.service";
import type { Episode, Genre, PaginatedResponse, Title, TitleDetails } from "./types";

const emptyPaginatedResponse: PaginatedResponse<Title> = {
  results: [],
  page: 1,
  totalPages: 1,
  totalResults: 0,
};

const trendingSchema = z.object({
  limit: z.number().int().positive().optional(),
});

const popularSchema = z.object({
  page: z.number().int().positive().optional(),
});

const listByGenreSchema = z.object({
  mediaType: z.nativeEnum(MediaType),
  genreId: z.number().int().positive(),
  page: z.number().int().positive().optional(),
});

const searchSchema = z.object({
  query: z.string(),
  page: z.number().int().positive().optional(),
});

const titleDetailsSchema = z.object({
  id: z.string().trim().min(1),
});

const episodesSchema = z.object({
  tvId: z.string().trim().min(1),
  seasonNumber: z.number().int().positive(),
});

const getTrendingTitlesSafeAction = publicRateLimitedAction({
  keyPrefix: "catalog:trending",
  limit: 60,
  windowMs: 60_000,
})
  .inputSchema(trendingSchema)
  .action(async ({ parsedInput }) => {
    return listTrendingTitles(parsedInput.limit ?? 20);
  });

const getPopularMoviesSafeAction = publicRateLimitedAction({
  keyPrefix: "catalog:popular-movies",
  limit: 60,
  windowMs: 60_000,
})
  .inputSchema(popularSchema)
  .action(async ({ parsedInput }) => {
    return listPopularTitlesByType(MediaType.MOVIE, parsedInput.page ?? 1);
  });

const getPopularSeriesSafeAction = publicRateLimitedAction({
  keyPrefix: "catalog:popular-series",
  limit: 60,
  windowMs: 60_000,
})
  .inputSchema(popularSchema)
  .action(async ({ parsedInput }) => {
    return listPopularTitlesByType(MediaType.SERIES, parsedInput.page ?? 1);
  });

const getTitlesByGenreSafeAction = publicRateLimitedAction({
  keyPrefix: "catalog:genre",
  limit: 60,
  windowMs: 60_000,
})
  .inputSchema(listByGenreSchema)
  .action(async ({ parsedInput }) => {
    return listTitlesByGenre(parsedInput.mediaType, parsedInput.genreId, parsedInput.page ?? 1);
  });

const searchTitlesSafeAction = publicRateLimitedAction({
  keyPrefix: "catalog:search",
  limit: 60,
  windowMs: 60_000,
})
  .inputSchema(searchSchema)
  .action(async ({ parsedInput }) => {
    return searchCatalogTitles(parsedInput.query, parsedInput.page ?? 1);
  });

const getTitleDetailsSafeAction = publicRateLimitedAction({
  keyPrefix: "catalog:details",
  limit: 120,
  windowMs: 60_000,
})
  .inputSchema(titleDetailsSchema)
  .action(async ({ parsedInput }) => {
    return getTitleDetailsById(parsedInput.id);
  });

const getMovieGenresSafeAction = publicRateLimitedAction({
  keyPrefix: "catalog:genres-movies",
  limit: 120,
  windowMs: 60_000,
}).action(async () => {
  return listGenres(MediaType.MOVIE);
});

const getSeriesGenresSafeAction = publicRateLimitedAction({
  keyPrefix: "catalog:genres-series",
  limit: 120,
  windowMs: 60_000,
}).action(async () => {
  return listGenres(MediaType.SERIES);
});

const getEpisodesSafeAction = publicRateLimitedAction({
  keyPrefix: "catalog:episodes",
  limit: 120,
  windowMs: 60_000,
})
  .inputSchema(episodesSchema)
  .action(async ({ parsedInput }) => {
    return getEpisodesBySeason(parsedInput.tvId, parsedInput.seasonNumber);
  });

export async function getTrendingTitlesAction(limit: number = 20): Promise<Title[]> {
  const parsed = trendingSchema.safeParse({ limit });
  const result = await getTrendingTitlesSafeAction(parsed.success ? parsed.data : { limit: 20 });
  return result.data ?? [];
}

export async function getPopularMoviesAction(page: number = 1): Promise<PaginatedResponse<Title>> {
  const parsed = popularSchema.safeParse({ page });
  const result = await getPopularMoviesSafeAction(parsed.success ? parsed.data : { page: 1 });
  return result.data ?? emptyPaginatedResponse;
}

export async function getPopularSeriesAction(page: number = 1): Promise<PaginatedResponse<Title>> {
  const parsed = popularSchema.safeParse({ page });
  const result = await getPopularSeriesSafeAction(parsed.success ? parsed.data : { page: 1 });
  return result.data ?? emptyPaginatedResponse;
}

export async function getTitlesByGenreAction(input: {
  mediaType: MediaType;
  genreId: number;
  page?: number;
}): Promise<PaginatedResponse<Title>> {
  const parsed = listByGenreSchema.safeParse(input);
  if (!parsed.success) {
    return emptyPaginatedResponse;
  }

  const result = await getTitlesByGenreSafeAction(parsed.data);
  return result.data ?? emptyPaginatedResponse;
}

export async function searchTitlesAction(
  query: string,
  page: number = 1,
): Promise<PaginatedResponse<Title>> {
  const parsed = searchSchema.safeParse({ query, page });
  const result = await searchTitlesSafeAction(parsed.success ? parsed.data : { query, page: 1 });

  return result.data ?? emptyPaginatedResponse;
}

export async function getTitleDetailsAction(id: string): Promise<TitleDetails | null> {
  const parsed = titleDetailsSchema.safeParse({ id });
  if (!parsed.success) {
    return null;
  }

  const result = await getTitleDetailsSafeAction(parsed.data);
  return result.data ?? null;
}

export async function getMovieGenresAction(): Promise<Genre[]> {
  const result = await getMovieGenresSafeAction();
  return result.data ?? [];
}

export async function getSeriesGenresAction(): Promise<Genre[]> {
  const result = await getSeriesGenresSafeAction();
  return result.data ?? [];
}

export async function getEpisodesAction(input: {
  tvId: string;
  seasonNumber: number;
}): Promise<Episode[]> {
  const parsed = episodesSchema.safeParse(input);
  if (!parsed.success) {
    return [];
  }

  const result = await getEpisodesSafeAction(parsed.data);
  return result.data ?? [];
}
