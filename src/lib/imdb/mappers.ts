import { MediaType } from "@/generated/prisma";
import type {
  TmdbCastMember,
  TmdbCrewMember,
  TmdbEpisode,
  TmdbGenre,
  TmdbMovie,
  TmdbSeason,
  TmdbTvShow,
  TmdbVideo,
} from "./providers/tmdb-types";
import type { Episode, Genre, Person, Season, Title, Trailer } from "./types";

/**
 * Normalize empty strings to null
 */
function normalizeString(value: string | null | undefined): string | null {
  if (!value || value.trim() === "") {
    return null;
  }
  return value;
}

/**
 * Map TMDB genre to internal genre type
 */
export function mapTmdbGenre(genre: TmdbGenre): Genre {
  return {
    id: genre.id,
    name: genre.name,
  };
}

/**
 * Map TMDB movie to internal Title type
 */
export function mapTmdbMovieToTitle(movie: TmdbMovie): Title {
  return {
    id: String(movie.id),
    imdbId: normalizeString(movie.imdb_id),
    title: movie.title,
    originalTitle: movie.original_title,
    mediaType: MediaType.MOVIE,
    overview: movie.overview,
    releaseDate: normalizeString(movie.release_date),
    runtime: movie.runtime ?? null,
    genres: movie.genres?.map(mapTmdbGenre) ?? [],
    posterPath: normalizeString(movie.poster_path),
    backdropPath: normalizeString(movie.backdrop_path),
    rating: movie.vote_average > 0 ? movie.vote_average : null,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
  };
}

/**
 * Map TMDB TV show to internal Title type
 */
export function mapTmdbTvShowToTitle(tv: TmdbTvShow): Title {
  // Use first episode runtime or null
  const runtime =
    tv.episode_run_time && tv.episode_run_time.length > 0 ? tv.episode_run_time[0] : null;

  return {
    id: String(tv.id),
    imdbId: normalizeString(tv.external_ids?.imdb_id),
    title: tv.name,
    originalTitle: tv.original_name,
    mediaType: MediaType.SERIES,
    overview: tv.overview,
    releaseDate: normalizeString(tv.first_air_date),
    runtime,
    genres: tv.genres?.map(mapTmdbGenre) ?? [],
    posterPath: normalizeString(tv.poster_path),
    backdropPath: normalizeString(tv.backdrop_path),
    rating: tv.vote_average > 0 ? tv.vote_average : null,
    voteCount: tv.vote_count,
    popularity: tv.popularity,
  };
}

/**
 * Map TMDB video to internal Trailer type
 * Returns null if video is not from YouTube
 */
export function mapTmdbVideo(video: TmdbVideo): Trailer | null {
  // Only include YouTube videos
  if (video.site !== "YouTube") {
    return null;
  }

  return {
    id: video.id,
    key: video.key,
    name: video.name,
    site: video.site,
    type: video.type,
    official: video.official,
  };
}

/**
 * Map TMDB cast member to internal Person type
 */
export function mapTmdbCastMember(member: TmdbCastMember): Person {
  return {
    id: member.id,
    name: member.name,
    character: member.character,
    profilePath: normalizeString(member.profile_path),
  };
}

/**
 * Map TMDB crew member to internal Person type
 */
export function mapTmdbCrewMember(member: TmdbCrewMember): Person {
  return {
    id: member.id,
    name: member.name,
    job: member.job,
    profilePath: normalizeString(member.profile_path),
  };
}

/**
 * Map TMDB episode to internal Episode type
 */
export function mapTmdbEpisode(episode: TmdbEpisode): Episode {
  return {
    id: episode.id,
    episodeNumber: episode.episode_number,
    name: episode.name,
    overview: episode.overview,
    stillPath: normalizeString(episode.still_path),
    airDate: normalizeString(episode.air_date),
    runtime: episode.runtime ?? null,
  };
}

/**
 * Map TMDB season to internal Season type
 */
export function mapTmdbSeason(season: TmdbSeason): Season {
  return {
    id: season.id,
    seasonNumber: season.season_number,
    name: season.name,
    overview: season.overview,
    posterPath: normalizeString(season.poster_path),
    episodeCount: season.episode_count,
    airDate: normalizeString(season.air_date),
    episodes: season.episodes?.map(mapTmdbEpisode),
  };
}
