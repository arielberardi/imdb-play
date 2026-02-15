"use server";

import { MediaType } from "@/generated/prisma";
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

const listByGenreSchema = z.object({
  mediaType: z.nativeEnum(MediaType),
  genreId: z.number().int().positive(),
  page: z.number().int().positive().optional(),
});

const episodesSchema = z.object({
  tvId: z.string().trim().min(1),
  seasonNumber: z.number().int().positive(),
});

export async function getTrendingTitlesAction(limit: number = 20): Promise<Title[]> {
  return listTrendingTitles(limit);
}

export async function getPopularMoviesAction(page: number = 1): Promise<PaginatedResponse<Title>> {
  return listPopularTitlesByType(MediaType.MOVIE, page);
}

export async function getPopularSeriesAction(page: number = 1): Promise<PaginatedResponse<Title>> {
  return listPopularTitlesByType(MediaType.SERIES, page);
}

export async function getTitlesByGenreAction(input: {
  mediaType: MediaType;
  genreId: number;
  page?: number;
}): Promise<PaginatedResponse<Title>> {
  const parsed = listByGenreSchema.safeParse(input);
  if (!parsed.success) {
    return {
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };
  }

  return listTitlesByGenre(parsed.data.mediaType, parsed.data.genreId, parsed.data.page ?? 1);
}

export async function searchTitlesAction(
  query: string,
  page: number = 1,
): Promise<PaginatedResponse<Title>> {
  return searchCatalogTitles(query, page);
}

export async function getTitleDetailsAction(id: string): Promise<TitleDetails | null> {
  const titleId = id.trim();
  if (titleId.length === 0) {
    return null;
  }

  return getTitleDetailsById(titleId);
}

export async function getMovieGenresAction(): Promise<Genre[]> {
  return listGenres(MediaType.MOVIE);
}

export async function getSeriesGenresAction(): Promise<Genre[]> {
  return listGenres(MediaType.SERIES);
}

export async function getEpisodesAction(input: {
  tvId: string;
  seasonNumber: number;
}): Promise<Episode[]> {
  const parsed = episodesSchema.safeParse(input);
  if (!parsed.success) {
    return [];
  }

  return getEpisodesBySeason(parsed.data.tvId, parsed.data.seasonNumber);
}
