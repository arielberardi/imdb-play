/**
 * IMDb API Client
 *
 * Provides typed, cacheable access to movie and TV series data from The Movie Database (TMDB) API.
 *
 * ## Features
 * - Type-safe queries for movies and TV series
 * - Built-in Next.js ISR caching
 * - Automatic retry logic for rate limits and server errors
 * - Adult content filtering
 * - YouTube trailer support
 *
 * ## Usage
 *
 * ```ts
 * import { getTrending, getTitleDetails, MediaType } from '@/lib/imdb';
 *
 * // Get trending movies
 * const trending = await getTrending('movie', 'week');
 *
 * // Get title details
 * const details = await getTitleDetails('550', MediaType.MOVIE);
 * console.log(details.credits.cast);
 * console.log(details.trailers);
 * ```
 *
 * ## Error Handling
 *
 * All query functions may throw the following errors:
 * - `ImdbNetworkError` - Network failures, timeouts, or missing API key
 * - `ImdbNotFoundError` - Resource not found (404)
 * - `ImdbRateLimitError` - Rate limit exceeded after retries (429)
 * - `ImdbHttpError` - Other HTTP errors (4xx, 5xx)
 *
 * ## Caching Strategy
 *
 * - Catalog data (trending, popular, genres): 6 hours
 * - Search results: 15 minutes
 * - Detail pages: 1 hour
 * - Trailers: 1 hour
 *
 * @module @/lib/imdb
 */

// Export types
export type {
  Credits,
  Episode,
  Genre,
  PaginatedResponse,
  Person,
  Season,
  Title,
  TitleDetails,
  Trailer,
} from "./types";

// Export errors
export { isImdbNotFoundError, toUserSafeError } from "./error-handling";
export {
  ImdbApiError,
  ImdbHttpError,
  ImdbNetworkError,
  ImdbNotFoundError,
  ImdbRateLimitError,
  ImdbValidationError,
} from "./errors";

// Export query functions
export {
  getByGenre,
  getEpisodes,
  getGenreList,
  getPopularMovies,
  getPopularSeries,
  getSeasons,
  getTitleDetails,
  getTitleTrailers,
  getTrending,
  searchTitles,
} from "./queries";

// Re-export MediaType from Prisma for convenience
export { MediaType } from "@/generated/prisma";
