import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TitleType } from "../src/generated/prisma/index.js";

const TMDB_SERVER: string = "https://api.themoviedb.org/3";
const TMDB_IMAGE_SERVER = "https://image.tmdb.org/t/p/original";
const NUMBER_OF_MOVIES = 100;
const NUMBER_OF_SERIES = 100;
const DISCOVERY_BUFFER = 80;
const MAX_RETRIES = 4;
const CAST_LIMIT = 10;
const TRAILER_LIMIT = 3;
const FETCH_CONCURRENCY = 6;
const SLEEP_BASE_MS = 500;
const TX_MAX_WAIT_MS = 30_000;
const TX_TIMEOUT_MS = 10 * 60 * 1000;

interface TMDBDiscoveryResult {
  id: number;
}

interface TMDBDiscoveryResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBGenreResponse {
  genres: TMDBGenre[];
}

interface TMDBCastMember {
  id: number;
  name: string;
  character: string | null;
  order: number;
  profile_path: string | null;
}

interface TMDBCreditsResponse {
  cast: TMDBCastMember[];
}

interface TMDBVideo {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface TMDBVideosResponse {
  results: TMDBVideo[];
}

interface TMDBMovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string | null;
  runtime: number | null;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  tagline: string | null;
  status: string | null;
  original_language: string | null;
  genres: TMDBGenre[];
  credits: TMDBCreditsResponse;
  videos: TMDBVideosResponse;
}

interface TMDBSeasonSummary {
  season_number: number;
}

interface TMDBSeriesDetail {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string | null;
  episode_run_time: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  tagline: string | null;
  status: string | null;
  original_language: string | null;
  genres: TMDBGenre[];
  seasons: TMDBSeasonSummary[];
  credits: TMDBCreditsResponse;
  videos: TMDBVideosResponse;
}

interface TMDBEpisodeDetail {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
}

interface TMDBSeasonDetail {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
  episodes: TMDBEpisodeDetail[];
}

function toImageUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }

  return `${TMDB_IMAGE_SERVER}${path}`;
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isDefined<T>(value: T | null): value is T {
  return value !== null;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) {
    return Promise.resolve([]);
  }

  const results: R[] = new Array<R>(items.length);
  let index = 0;

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  });

  return Promise.all(workers).then(() => results);
}

async function fetchJson<T>(endpoint: string, allowNotFound = false): Promise<T | null> {
  const url = `${TMDB_SERVER}/${endpoint}`;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
    });

    if (allowNotFound && response.status === 404) {
      return null;
    }

    if (response.ok) {
      return (await response.json()) as T;
    }

    const canRetry = response.status === 429 || response.status >= 500;
    if (!canRetry || attempt === MAX_RETRIES - 1) {
      throw new Error(`Failed to fetch ${url} (${response.status})`);
    }

    const waitMs = SLEEP_BASE_MS * 2 ** attempt;
    await sleep(waitMs);
  }

  return null;
}

async function discoverIds(kind: "movie" | "tv", target: number): Promise<number[]> {
  const ids = new Set<number>();
  let page = 1;
  let totalPages = 1;

  while (ids.size < target + DISCOVERY_BUFFER && page <= totalPages) {
    const endpoint = `discover/${kind}?include_adult=false&include_video=false&sort_by=popularity.desc&page=${page}&language=en-US`;
    const payload = await fetchJson<TMDBDiscoveryResponse<TMDBDiscoveryResult>>(endpoint);

    if (!payload) {
      break;
    }

    totalPages = payload.total_pages;
    payload.results.forEach((item) => {
      ids.add(item.id);
    });
    page += 1;
  }

  return Array.from(ids);
}

function selectTrailers(videos: TMDBVideo[]): TMDBVideo[] {
  const filtered = videos.filter((video) => {
    if (!video.key || !video.site) {
      return false;
    }

    return video.site === "YouTube" || video.site === "Vimeo";
  });

  const sorted = filtered.sort((a, b) => {
    if (a.official !== b.official) {
      return a.official ? -1 : 1;
    }

    if (a.type === "Trailer" && b.type !== "Trailer") {
      return -1;
    }

    if (a.type !== "Trailer" && b.type === "Trailer") {
      return 1;
    }

    return 0;
  });

  return sorted.slice(0, TRAILER_LIMIT);
}

async function fetchMovieDetail(tmdbId: number): Promise<TMDBMovieDetail | null> {
  const endpoint = `movie/${tmdbId}?append_to_response=credits,videos&language=en-US`;
  return fetchJson<TMDBMovieDetail>(endpoint, true);
}

async function fetchSeriesDetail(tmdbId: number): Promise<TMDBSeriesDetail | null> {
  const endpoint = `tv/${tmdbId}?append_to_response=credits,videos&language=en-US`;
  return fetchJson<TMDBSeriesDetail>(endpoint, true);
}

async function fetchSeasonDetail(
  tmdbSeriesId: number,
  seasonNumber: number,
): Promise<TMDBSeasonDetail | null> {
  const endpoint = `tv/${tmdbSeriesId}/season/${seasonNumber}?language=en-US`;
  return fetchJson<TMDBSeasonDetail>(endpoint, true);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed catalog data.");
  }

  if (!process.env.TMDB_API_KEY || !process.env.TMDB_API_TOKEN) {
    throw new Error("Missing access keys to TheMovie DB");
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  const [movieGenrePayload, tvGenrePayload, discoveredMovieIds, discoveredSeriesIds] =
    await Promise.all([
      fetchJson<TMDBGenreResponse>("genre/movie/list?language=en-US"),
      fetchJson<TMDBGenreResponse>("genre/tv/list?language=en-US"),
      discoverIds("movie", NUMBER_OF_MOVIES),
      discoverIds("tv", NUMBER_OF_SERIES),
    ]);

  if (!movieGenrePayload || !tvGenrePayload) {
    throw new Error("Failed to fetch genres from TMDB.");
  }

  const movieDetails = (
    await mapWithConcurrency(discoveredMovieIds, FETCH_CONCURRENCY, async (tmdbId) =>
      fetchMovieDetail(tmdbId),
    )
  )
    .filter(isDefined)
    .filter((item) => item.title && item.title.trim().length > 0)
    .slice(0, NUMBER_OF_MOVIES);

  const seriesDetails = (
    await mapWithConcurrency(discoveredSeriesIds, FETCH_CONCURRENCY, async (tmdbId) =>
      fetchSeriesDetail(tmdbId),
    )
  )
    .filter(isDefined)
    .filter((item) => item.name && item.name.trim().length > 0)
    .slice(0, NUMBER_OF_SERIES);

  if (movieDetails.length < NUMBER_OF_MOVIES) {
    throw new Error(
      `Could not fetch enough movie details from TMDB. Found ${movieDetails.length}.`,
    );
  }

  if (seriesDetails.length < NUMBER_OF_SERIES) {
    throw new Error(
      `Could not fetch enough series details from TMDB. Found ${seriesDetails.length}.`,
    );
  }

  const seasonDetailsBySeriesId = new Map<number, TMDBSeasonDetail[]>();
  await mapWithConcurrency(seriesDetails, 4, async (series) => {
    const seasonNumbers = Array.from(
      new Set(
        (series.seasons ?? [])
          .map((season) => season.season_number)
          .filter((seasonNumber) => seasonNumber > 0),
      ),
    ).sort((a, b) => a - b);

    const seasonDetails = (
      await mapWithConcurrency(seasonNumbers, 3, async (seasonNumber) =>
        fetchSeasonDetail(series.id, seasonNumber),
      )
    ).filter(isDefined);

    seasonDetailsBySeriesId.set(series.id, seasonDetails);
    return seasonDetails.length;
  });

  const genreNames = new Set<string>();
  [...movieGenrePayload.genres, ...tvGenrePayload.genres].forEach((genre) => {
    if (genre.name && genre.name.trim().length > 0) {
      genreNames.add(genre.name.trim());
    }
  });

  movieDetails.forEach((movie) => {
    movie.genres.forEach((genre) => {
      if (genre.name?.trim()) {
        genreNames.add(genre.name.trim());
      }
    });
  });

  seriesDetails.forEach((series) => {
    series.genres.forEach((genre) => {
      if (genre.name?.trim()) {
        genreNames.add(genre.name.trim());
      }
    });
  });

  const sortedGenreNames = Array.from(genreNames).sort((a, b) => a.localeCompare(b));
  const genreIdByName = new Map<string, number>();
  const personDbIdByTmdbId = new Map<number, number>();

  await prisma.$transaction(
    async (tx) => {
      await tx.episode.deleteMany();
      await tx.season.deleteMany();
      await tx.titleCast.deleteMany();
      await tx.person.deleteMany();
      await tx.trailer.deleteMany();
      await tx.titleGenre.deleteMany();
      await tx.favorite.deleteMany();
      await tx.watchlist.deleteMany();
      await tx.continueWatching.deleteMany();
      await tx.title.deleteMany();
      await tx.genre.deleteMany();

      if (sortedGenreNames.length > 0) {
        for (const name of sortedGenreNames) {
          const createdGenre = await tx.genre.create({
            data: {
              name,
            },
          });
          genreIdByName.set(name, createdGenre.id);
        }
      }

      for (const movie of movieDetails) {
        const createdTitle = await tx.title.create({
          data: {
            titleType: TitleType.MOVIE,
            title: movie.title,
            originalTitle: movie.original_title || movie.title,
            overview: movie.overview || "",
            releaseDate: toDate(movie.release_date),
            runtimeMinutes: movie.runtime,
            posterUrl: toImageUrl(movie.poster_path),
            backdropUrl: toImageUrl(movie.backdrop_path),
            voteAverage: movie.vote_average,
            voteCount: movie.vote_count,
            popularity: movie.popularity,
            tagline: movie.tagline,
            status: movie.status,
            originalLanguage: movie.original_language || "en",
          },
        });
        const titleId = createdTitle.id;

        const titleGenreRows = movie.genres
          .map((genre) => genreIdByName.get(genre.name))
          .filter((genreId): genreId is number => typeof genreId === "number")
          .map((genreId) => ({ titleId, genreId }));

        if (titleGenreRows.length > 0) {
          await tx.titleGenre.createMany({
            data: titleGenreRows,
            skipDuplicates: true,
          });
        }

        const castMembers = (movie.credits?.cast ?? []).slice(0, CAST_LIMIT);
        const titleCastRows: Array<{
          titleId: number;
          personId: number;
          character: string | null;
          castOrder: number | null;
        }> = [];

        for (const castMember of castMembers) {
          let personId = personDbIdByTmdbId.get(castMember.id);

          if (!personId) {
            const createdPerson = await tx.person.create({
              data: {
                name: castMember.name,
                profilePath: toImageUrl(castMember.profile_path),
              },
            });
            personId = createdPerson.id;
            personDbIdByTmdbId.set(castMember.id, personId);
          }

          titleCastRows.push({
            titleId,
            personId,
            character: castMember.character || null,
            castOrder: castMember.order,
          });
        }

        if (titleCastRows.length > 0) {
          await tx.titleCast.createMany({
            data: titleCastRows,
            skipDuplicates: true,
          });
        }

        const trailers = selectTrailers(movie.videos?.results ?? []);
        if (trailers.length > 0) {
          await tx.trailer.createMany({
            data: trailers.map((trailer) => ({
              titleId,
              key: trailer.key,
              name: trailer.name,
              site: trailer.site,
              type: trailer.type,
              official: Boolean(trailer.official),
            })),
            skipDuplicates: true,
          });
        }
      }

      for (const series of seriesDetails) {
        const runtimeMinutes = Array.isArray(series.episode_run_time)
          ? (series.episode_run_time[0] ?? null)
          : null;

        const createdTitle = await tx.title.create({
          data: {
            titleType: TitleType.SERIES,
            title: series.name,
            originalTitle: series.original_name || series.name,
            overview: series.overview || "",
            releaseDate: toDate(series.first_air_date),
            runtimeMinutes,
            posterUrl: toImageUrl(series.poster_path),
            backdropUrl: toImageUrl(series.backdrop_path),
            voteAverage: series.vote_average,
            voteCount: series.vote_count,
            popularity: series.popularity,
            tagline: series.tagline,
            status: series.status,
            originalLanguage: series.original_language || "en",
          },
        });
        const titleId = createdTitle.id;

        const titleGenreRows = series.genres
          .map((genre) => genreIdByName.get(genre.name))
          .filter((genreId): genreId is number => typeof genreId === "number")
          .map((genreId) => ({ titleId, genreId }));

        if (titleGenreRows.length > 0) {
          await tx.titleGenre.createMany({
            data: titleGenreRows,
            skipDuplicates: true,
          });
        }

        const castMembers = (series.credits?.cast ?? []).slice(0, CAST_LIMIT);
        const titleCastRows: Array<{
          titleId: number;
          personId: number;
          character: string | null;
          castOrder: number | null;
        }> = [];

        for (const castMember of castMembers) {
          let personId = personDbIdByTmdbId.get(castMember.id);

          if (!personId) {
            const createdPerson = await tx.person.create({
              data: {
                name: castMember.name,
                profilePath: toImageUrl(castMember.profile_path),
              },
            });
            personId = createdPerson.id;
            personDbIdByTmdbId.set(castMember.id, personId);
          }

          titleCastRows.push({
            titleId,
            personId,
            character: castMember.character || null,
            castOrder: castMember.order,
          });
        }

        if (titleCastRows.length > 0) {
          await tx.titleCast.createMany({
            data: titleCastRows,
            skipDuplicates: true,
          });
        }

        const trailers = selectTrailers(series.videos?.results ?? []);
        if (trailers.length > 0) {
          await tx.trailer.createMany({
            data: trailers.map((trailer) => ({
              titleId,
              key: trailer.key,
              name: trailer.name,
              site: trailer.site,
              type: trailer.type,
              official: Boolean(trailer.official),
            })),
            skipDuplicates: true,
          });
        }

        const seasonDetails = seasonDetailsBySeriesId.get(series.id) ?? [];
        for (const season of seasonDetails) {
          const createdSeason = await tx.season.create({
            data: {
              titleId,
              seasonNumber: season.season_number,
              name: season.name || `Season ${season.season_number}`,
              overview: season.overview || "",
              posterPath: toImageUrl(season.poster_path),
              episodeCount: season.episodes?.length ?? 0,
              airDate: toDate(season.air_date),
            },
          });
          const seasonId = createdSeason.id;

          const episodeRows = (season.episodes ?? []).map((episode) => ({
            seasonId,
            episodeNumber: episode.episode_number,
            name: episode.name || `Episode ${episode.episode_number}`,
            overview: episode.overview || "",
            stillPath: toImageUrl(episode.still_path),
            airDate: toDate(episode.air_date),
            runtime: episode.runtime,
            voteAverage: episode.vote_average,
            voteCount: episode.vote_count,
          }));

          if (episodeRows.length > 0) {
            await tx.episode.createMany({
              data: episodeRows,
              skipDuplicates: true,
            });
          }
        }
      }
    },
    {
      maxWait: TX_MAX_WAIT_MS,
      timeout: TX_TIMEOUT_MS,
    },
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
