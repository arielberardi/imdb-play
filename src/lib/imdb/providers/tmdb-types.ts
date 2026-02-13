/**
 * Internal TMDB API response types
 * These types represent the raw responses from The Movie Database API
 * and should NOT be exported from the public API
 */

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovie {
  id: number;
  imdb_id?: string;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  runtime?: number;
  genres?: TmdbGenre[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  tagline?: string;
  status?: string;
  original_language?: string;
  credits?: TmdbCredits;
  videos?: TmdbVideosResponse;
}

export interface TmdbTvShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  episode_run_time?: number[];
  genres?: TmdbGenre[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  tagline?: string;
  status?: string;
  original_language?: string;
  credits?: TmdbCredits;
  videos?: TmdbVideosResponse;
  seasons?: TmdbSeason[];
  external_ids?: {
    imdb_id?: string;
  };
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface TmdbCredits {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TmdbVideosResponse {
  results: TmdbVideo[];
}

export interface TmdbEpisode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
}

export interface TmdbSeason {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  episode_count: number;
  air_date: string | null;
  episodes?: TmdbEpisode[];
}

export interface TmdbPaginatedResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TmdbMultiSearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  adult?: boolean;
}
