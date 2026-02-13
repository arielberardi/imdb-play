import { MediaType } from "@/generated/prisma";
import { apiFetch } from "./client";
import {
  CACHE_REVALIDATE_CATALOG,
  CACHE_REVALIDATE_DETAILS,
  CACHE_REVALIDATE_SEARCH,
  CACHE_REVALIDATE_TRAILERS,
} from "./constants";
import {
  mapTmdbEpisode,
  mapTmdbMovieToTitle,
  mapTmdbSeason,
  mapTmdbTvShowToTitle,
  mapTmdbVideo,
} from "./mappers";
import type {
  TmdbGenre,
  TmdbMovie,
  TmdbMultiSearchResult,
  TmdbPaginatedResponse,
  TmdbSeason,
  TmdbTvShow,
  TmdbVideo,
} from "./providers/tmdb-types";
import type {
  Credits,
  Episode,
  Genre,
  PaginatedResponse,
  Season,
  Title,
  TitleDetails,
  Trailer,
} from "./types";

/**
 * Get trending titles for a specific time window
 *
 * @param mediaType - Type of media: 'movie', 'tv', or 'all'
 * @param timeWindow - Time window: 'day' or 'week'
 * @returns Array of trending titles
 *
 * @example
 * ```ts
 * const trending = await getTrending('movie', 'week');
 * ```
 */
export async function getTrending(
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week",
): Promise<Title[]> {
  const endpoint = `/trending/${mediaType}/${timeWindow}`;

  const response = await apiFetch<TmdbPaginatedResponse<TmdbMovie | TmdbTvShow>>(endpoint, {
    revalidate: CACHE_REVALIDATE_CATALOG,
  });

  // Filter adult content and map to Title
  const titles = response.data.results
    .filter((item) => !item.adult)
    .map((item) => {
      // Determine if it's a movie or TV show based on properties
      if ("title" in item) {
        return mapTmdbMovieToTitle(item as TmdbMovie);
      } else {
        return mapTmdbTvShowToTitle(item as TmdbTvShow);
      }
    });

  return titles;
}

/**
 * Get popular movies with pagination
 *
 * @param page - Page number (1-indexed)
 * @returns Paginated response of popular movies
 *
 * @example
 * ```ts
 * const movies = await getPopularMovies(1);
 * console.log(movies.results); // Array of Title
 * ```
 */
export async function getPopularMovies(page: number = 1): Promise<PaginatedResponse<Title>> {
  const endpoint = `/movie/popular?page=${page}`;

  const response = await apiFetch<TmdbPaginatedResponse<TmdbMovie>>(endpoint, {
    revalidate: CACHE_REVALIDATE_CATALOG,
  });

  // Filter adult content and map to Title
  const results = response.data.results.filter((movie) => !movie.adult).map(mapTmdbMovieToTitle);

  return {
    results,
    page: response.data.page,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
  };
}

/**
 * Get popular TV series with pagination
 *
 * @param page - Page number (1-indexed)
 * @returns Paginated response of popular TV series
 *
 * @example
 * ```ts
 * const series = await getPopularSeries(1);
 * console.log(series.results); // Array of Title
 * ```
 */
export async function getPopularSeries(page: number = 1): Promise<PaginatedResponse<Title>> {
  const endpoint = `/tv/popular?page=${page}`;

  const response = await apiFetch<TmdbPaginatedResponse<TmdbTvShow>>(endpoint, {
    revalidate: CACHE_REVALIDATE_CATALOG,
  });

  // Filter adult content and map to Title
  const results = response.data.results.filter((tv) => !tv.adult).map(mapTmdbTvShowToTitle);

  return {
    results,
    page: response.data.page,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
  };
}

/**
 * Get titles filtered by genre
 *
 * @param mediaType - Type of media: MOVIE or SERIES
 * @param genreId - TMDB genre ID
 * @param page - Page number (1-indexed)
 * @returns Paginated response of titles in the genre
 *
 * @example
 * ```ts
 * const actionMovies = await getByGenre(MediaType.MOVIE, 28, 1);
 * ```
 */
export async function getByGenre(
  mediaType: MediaType,
  genreId: number,
  page: number = 1,
): Promise<PaginatedResponse<Title>> {
  const tmdbMediaType = mediaType === MediaType.MOVIE ? "movie" : "tv";
  const endpoint = `/discover/${tmdbMediaType}?with_genres=${genreId}&page=${page}`;

  if (mediaType === MediaType.MOVIE) {
    const response = await apiFetch<TmdbPaginatedResponse<TmdbMovie>>(endpoint, {
      revalidate: CACHE_REVALIDATE_CATALOG,
    });

    const results = response.data.results.filter((movie) => !movie.adult).map(mapTmdbMovieToTitle);

    return {
      results,
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
  } else {
    const response = await apiFetch<TmdbPaginatedResponse<TmdbTvShow>>(endpoint, {
      revalidate: CACHE_REVALIDATE_CATALOG,
    });

    const results = response.data.results.filter((tv) => !tv.adult).map(mapTmdbTvShowToTitle);

    return {
      results,
      page: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
  }
}

/**
 * Search for titles by query string
 *
 * @param query - Search query
 * @param page - Page number (1-indexed)
 * @returns Paginated response of matching titles
 *
 * @example
 * ```ts
 * const results = await searchTitles('breaking bad', 1);
 * ```
 */
export async function searchTitles(
  query: string,
  page: number = 1,
): Promise<PaginatedResponse<Title>> {
  const endpoint = `/search/multi?query=${encodeURIComponent(query)}&page=${page}`;

  const response = await apiFetch<TmdbPaginatedResponse<TmdbMultiSearchResult>>(endpoint, {
    revalidate: CACHE_REVALIDATE_SEARCH,
  });

  // Filter to only movies and TV shows (exclude persons), filter adult content, and map
  const results = response.data.results
    .filter((item) => (item.media_type === "movie" || item.media_type === "tv") && !item.adult)
    .map((item) => {
      if (item.media_type === "movie") {
        return mapTmdbMovieToTitle({
          id: item.id,
          title: item.title || "",
          original_title: item.original_title || "",
          overview: item.overview || "",
          release_date: item.release_date || "",
          poster_path: item.poster_path ?? null,
          backdrop_path: item.backdrop_path ?? null,
          vote_average: item.vote_average || 0,
          vote_count: item.vote_count || 0,
          popularity: item.popularity || 0,
          adult: item.adult || false,
        });
      } else {
        return mapTmdbTvShowToTitle({
          id: item.id,
          name: item.name || "",
          original_name: item.original_name || "",
          overview: item.overview || "",
          first_air_date: item.first_air_date || "",
          poster_path: item.poster_path ?? null,
          backdrop_path: item.backdrop_path ?? null,
          vote_average: item.vote_average || 0,
          vote_count: item.vote_count || 0,
          popularity: item.popularity || 0,
          adult: item.adult || false,
        });
      }
    });

  return {
    results,
    page: response.data.page,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
  };
}

/**
 * Get detailed information for a specific title
 *
 * @param id - TMDB title ID
 * @param mediaType - Type of media: MOVIE or SERIES
 * @returns Detailed title information with credits and trailers
 *
 * @example
 * ```ts
 * const details = await getTitleDetails('550', MediaType.MOVIE);
 * console.log(details.credits.cast);
 * ```
 */
export async function getTitleDetails(id: string, mediaType: MediaType): Promise<TitleDetails> {
  const tmdbMediaType = mediaType === MediaType.MOVIE ? "movie" : "tv";
  const endpoint = `/${tmdbMediaType}/${id}?append_to_response=credits,videos,external_ids`;

  if (mediaType === MediaType.MOVIE) {
    const response = await apiFetch<TmdbMovie>(endpoint, {
      revalidate: CACHE_REVALIDATE_DETAILS,
    });

    const movie = response.data;
    const baseTitle = mapTmdbMovieToTitle(movie);

    // Map credits
    const credits: Credits = {
      cast:
        movie.credits?.cast.map((member) => ({
          id: member.id,
          name: member.name,
          character: member.character,
          profilePath: member.profile_path,
        })) ?? [],
      crew:
        movie.credits?.crew.map((member) => ({
          id: member.id,
          name: member.name,
          job: member.job,
          profilePath: member.profile_path,
        })) ?? [],
    };

    // Map trailers (filter YouTube only)
    const trailers: Trailer[] =
      movie.videos?.results.map(mapTmdbVideo).filter((t): t is Trailer => t !== null) ?? [];

    return {
      ...baseTitle,
      tagline: movie.tagline || null,
      status: movie.status || null,
      originalLanguage: movie.original_language || "en",
      credits,
      trailers,
    };
  } else {
    const response = await apiFetch<TmdbTvShow>(endpoint, {
      revalidate: CACHE_REVALIDATE_DETAILS,
    });

    const tv = response.data;
    const baseTitle = mapTmdbTvShowToTitle(tv);

    // Map credits
    const credits: Credits = {
      cast:
        tv.credits?.cast.map((member) => ({
          id: member.id,
          name: member.name,
          character: member.character,
          profilePath: member.profile_path,
        })) ?? [],
      crew:
        tv.credits?.crew.map((member) => ({
          id: member.id,
          name: member.name,
          job: member.job,
          profilePath: member.profile_path,
        })) ?? [],
    };

    // Map trailers (filter YouTube only)
    const trailers: Trailer[] =
      tv.videos?.results.map(mapTmdbVideo).filter((t): t is Trailer => t !== null) ?? [];

    // Map seasons
    const seasons: Season[] = tv.seasons?.map(mapTmdbSeason) ?? [];

    return {
      ...baseTitle,
      tagline: tv.tagline || null,
      status: tv.status || null,
      originalLanguage: tv.original_language || "en",
      credits,
      trailers,
      seasons,
    };
  }
}

/**
 * Get trailers for a specific title
 *
 * @param id - TMDB title ID
 * @param mediaType - Type of media: MOVIE or SERIES
 * @returns Array of YouTube trailers
 *
 * @example
 * ```ts
 * const trailers = await getTitleTrailers('550', MediaType.MOVIE);
 * ```
 */
export async function getTitleTrailers(id: string, mediaType: MediaType): Promise<Trailer[]> {
  const tmdbMediaType = mediaType === MediaType.MOVIE ? "movie" : "tv";
  const endpoint = `/${tmdbMediaType}/${id}/videos`;

  const response = await apiFetch<{ results: TmdbVideo[] }>(endpoint, {
    revalidate: CACHE_REVALIDATE_TRAILERS,
  });

  // Filter YouTube videos only
  const trailers = response.data.results.map(mapTmdbVideo).filter((t): t is Trailer => t !== null);

  return trailers;
}

/**
 * Get all seasons for a TV series
 *
 * @param tvId - TMDB TV series ID
 * @returns Array of seasons with episode counts
 *
 * @example
 * ```ts
 * const seasons = await getSeasons('1396');
 * ```
 */
export async function getSeasons(tvId: string): Promise<Season[]> {
  const endpoint = `/tv/${tvId}`;

  const response = await apiFetch<TmdbTvShow>(endpoint, {
    revalidate: CACHE_REVALIDATE_DETAILS,
  });

  return response.data.seasons?.map(mapTmdbSeason) ?? [];
}

/**
 * Get episodes for a specific season of a TV series
 *
 * @param tvId - TMDB TV series ID
 * @param seasonNumber - Season number (1-indexed)
 * @returns Array of episodes in the season
 *
 * @example
 * ```ts
 * const episodes = await getEpisodes('1396', 1);
 * ```
 */
export async function getEpisodes(tvId: string, seasonNumber: number): Promise<Episode[]> {
  const endpoint = `/tv/${tvId}/season/${seasonNumber}`;

  const response = await apiFetch<TmdbSeason>(endpoint, {
    revalidate: CACHE_REVALIDATE_DETAILS,
  });

  return response.data.episodes?.map(mapTmdbEpisode) ?? [];
}

/**
 * Get list of available genres
 *
 * @param mediaType - Type of media: MOVIE or SERIES
 * @returns Array of genres
 *
 * @example
 * ```ts
 * const genres = await getGenreList(MediaType.MOVIE);
 * ```
 */
export async function getGenreList(mediaType: MediaType): Promise<Genre[]> {
  const tmdbMediaType = mediaType === MediaType.MOVIE ? "movie" : "tv";
  const endpoint = `/genre/${tmdbMediaType}/list`;

  const response = await apiFetch<{ genres: TmdbGenre[] }>(endpoint, {
    revalidate: CACHE_REVALIDATE_CATALOG,
  });

  return response.data.genres.map((genre) => ({
    id: genre.id,
    name: genre.name,
  }));
}
