import type { MediaType } from "@/generated/prisma";

/**
 * Genre information
 */
export interface Genre {
  id: number;
  name: string;
}

/**
 * Person (cast or crew member)
 */
export interface Person {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profilePath: string | null;
}

/**
 * Cast and crew credits
 */
export interface Credits {
  cast: Person[];
  crew: Person[];
}

/**
 * Video trailer information
 */
export interface Trailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

/**
 * Episode information for TV series
 */
export interface Episode {
  id: number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string | null;
  runtime: number | null;
}

/**
 * Season information for TV series
 */
export interface Season {
  id: number;
  seasonNumber: number;
  name: string;
  overview: string;
  posterPath: string | null;
  episodeCount: number;
  airDate: string | null;
  episodes?: Episode[];
}

/**
 * Base title information (movie or TV series)
 */
export interface Title {
  id: string;
  imdbId: string | null;
  title: string;
  originalTitle: string;
  mediaType: MediaType;
  overview: string;
  releaseDate: string | null;
  runtime: number | null;
  genres: Genre[];
  posterPath: string | null;
  backdropPath: string | null;
  rating: number | null;
  voteCount: number;
  popularity: number;
}

/**
 * Extended title information with credits and trailers
 */
export interface TitleDetails extends Title {
  tagline: string | null;
  status: string | null;
  originalLanguage: string;
  credits: Credits;
  trailers: Trailer[];
  seasons?: Season[];
}

/**
 * Paginated API response wrapper
 */
export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}
