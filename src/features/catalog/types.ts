import type { MediaType } from "@/generated/prisma";

export interface Genre {
  id: number;
  name: string;
}

export interface Person {
  id: string | number;
  name: string;
  character?: string;
  job?: string;
  profilePath: string | null;
}

export interface Credits {
  cast: Person[];
  crew: Person[];
}

export interface Trailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface Episode {
  id: string | number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string | null;
  runtime: number | null | undefined;
  voteAverage?: number | null;
  voteCount?: number;
}

export interface Season {
  id: string | number;
  seasonNumber: number;
  name: string;
  overview: string;
  posterPath?: string | null;
  episodeCount: number;
  airDate?: string | null;
  episodes?: Episode[];
}

export interface Title {
  id: string;
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
  voteAverage: number | null;
  voteCount: number;
  popularity: number;
}

export interface TitleDetails extends Title {
  tagline: string | null;
  status: string | null;
  originalLanguage: string;
  credits: Credits;
  trailers: Trailer[];
  seasons?: Season[];
}

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}
