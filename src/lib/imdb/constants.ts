/**
 * TMDB API configuration constants
 */

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const DEFAULT_TIMEOUT = 10000; // 10 seconds

export const MAX_RETRIES = 2;

export const CACHE_REVALIDATE_CATALOG = 3600; // 1 hour

export const CACHE_REVALIDATE_SEARCH = 1800; // 30 minutes

export const CACHE_REVALIDATE_DETAILS = 3600; // 1 hour

export const CACHE_REVALIDATE_TRAILERS = 7200; // 2 hours

/**
 * TMDB Movie Genres
 * Source: https://developers.themoviedb.org/3/genres/get-movie-list
 */
export const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
] as const;

/**
 * TMDB TV Genres
 * Source: https://developers.themoviedb.org/3/genres/get-tv-list
 */
export const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
] as const;
