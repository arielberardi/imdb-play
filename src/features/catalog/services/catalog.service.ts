import { MediaType, TitleType, type Prisma } from "@/generated/prisma";
import { parsePositiveIntId } from "@/lib/ids";
import prisma from "@/lib/prisma";
import type { Episode, Genre, PaginatedResponse, Title, TitleDetails, Trailer } from "../types";

const PAGE_SIZE = 20;

function mapTitleTypeToMediaType(titleType: TitleType): MediaType {
  return titleType === TitleType.MOVIE ? MediaType.MOVIE : MediaType.SERIES;
}

function mapTitleRowToTitle(row: {
  id: number;
  titleType: TitleType;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: Date | null;
  runtimeMinutes: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  voteAverage: number | null;
  voteCount: number;
  popularity: number;
  genres?: Array<{ genre: Genre }>;
}): Title {
  return {
    id: String(row.id),
    title: row.title,
    originalTitle: row.originalTitle,
    mediaType: mapTitleTypeToMediaType(row.titleType),
    overview: row.overview,
    releaseDate: row.releaseDate?.toISOString() ?? null,
    runtime: row.runtimeMinutes,
    genres: row.genres?.map((entry) => entry.genre) ?? [],
    posterPath: row.posterUrl,
    backdropPath: row.backdropUrl,
    rating: row.voteAverage,
    voteAverage: row.voteAverage,
    voteCount: row.voteCount,
    popularity: row.popularity,
  };
}

export async function listTrendingTitles(limit: number = PAGE_SIZE): Promise<Title[]> {
  const rows = await prisma.title.findMany({
    orderBy: [{ popularity: "desc" }, { voteCount: "desc" }],
    take: limit,
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  return rows.map(mapTitleRowToTitle);
}

export async function listPopularTitlesByType(
  mediaType: MediaType,
  page: number = 1,
): Promise<PaginatedResponse<Title>> {
  const titleType = mediaType === MediaType.MOVIE ? TitleType.MOVIE : TitleType.SERIES;
  const [totalResults, rows] = await Promise.all([
    prisma.title.count({
      where: {
        titleType,
      },
    }),
    prisma.title.findMany({
      where: {
        titleType,
      },
      orderBy: [{ voteCount: "desc" }, { voteAverage: "desc" }, { popularity: "desc" }],
      take: PAGE_SIZE,
      skip: Math.max(0, page - 1) * PAGE_SIZE,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    }),
  ]);

  return {
    results: rows.map(mapTitleRowToTitle),
    page,
    totalPages: Math.max(1, Math.ceil(totalResults / PAGE_SIZE)),
    totalResults,
  };
}

export async function listTitlesByGenre(
  mediaType: MediaType,
  genreId: number,
  page: number = 1,
): Promise<PaginatedResponse<Title>> {
  const titleType = mediaType === MediaType.MOVIE ? TitleType.MOVIE : TitleType.SERIES;
  const where = {
    titleType,
    genres: {
      some: {
        genreId,
      },
    },
  } as const;

  const [totalResults, rows] = await Promise.all([
    prisma.title.count({ where }),
    prisma.title.findMany({
      where,
      orderBy: [{ voteCount: "desc" }, { voteAverage: "desc" }, { popularity: "desc" }],
      take: PAGE_SIZE,
      skip: Math.max(0, page - 1) * PAGE_SIZE,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    }),
  ]);

  return {
    results: rows.map(mapTitleRowToTitle),
    page,
    totalPages: Math.max(1, Math.ceil(totalResults / PAGE_SIZE)),
    totalResults,
  };
}

export async function listGenres(mediaType: MediaType): Promise<Genre[]> {
  const titleType = mediaType === MediaType.MOVIE ? TitleType.MOVIE : TitleType.SERIES;
  const rows = await prisma.genre.findMany({
    where: {
      titles: {
        some: {
          title: {
            titleType,
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return rows;
}

export async function searchCatalogTitles(
  query: string,
  page: number = 1,
): Promise<PaginatedResponse<Title>> {
  const cleanQuery = query.trim();

  if (cleanQuery.length === 0) {
    return {
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    };
  }

  const where: Prisma.TitleWhereInput = {
    OR: [
      { title: { contains: cleanQuery, mode: "insensitive" } },
      { originalTitle: { contains: cleanQuery, mode: "insensitive" } },
      { overview: { contains: cleanQuery, mode: "insensitive" } },
    ],
  };

  const [totalResults, rows] = await Promise.all([
    prisma.title.count({ where }),
    prisma.title.findMany({
      where,
      orderBy: [{ voteCount: "desc" }, { voteAverage: "desc" }, { popularity: "desc" }],
      take: PAGE_SIZE,
      skip: Math.max(0, page - 1) * PAGE_SIZE,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    }),
  ]);

  return {
    results: rows.map(mapTitleRowToTitle),
    page,
    totalPages: Math.max(1, Math.ceil(totalResults / PAGE_SIZE)),
    totalResults,
  };
}

export async function getTitleDetailsById(id: string): Promise<TitleDetails | null> {
  const parsedId = parsePositiveIntId(id);
  if (!parsedId) {
    return null;
  }

  const row = await prisma.title.findUnique({
    where: { id: parsedId },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
      cast: {
        orderBy: [{ castOrder: "asc" }, { createdAt: "asc" }],
        include: {
          person: true,
        },
      },
      trailers: {
        orderBy: [{ official: "desc" }, { createdAt: "desc" }],
      },
      seasons: {
        orderBy: {
          seasonNumber: "asc",
        },
      },
    },
  });

  if (!row) {
    return null;
  }

  return {
    ...mapTitleRowToTitle(row),
    tagline: row.tagline,
    status: row.status,
    originalLanguage: row.originalLanguage ?? "en",
    credits: {
      cast: row.cast.map((entry) => ({
        id: String(entry.person.id),
        name: entry.person.name,
        character: entry.character ?? undefined,
        profilePath: entry.person.profilePath,
      })),
      crew: [],
    },
    trailers: row.trailers.map<Trailer>((trailer) => ({
      id: String(trailer.id),
      key: trailer.key,
      name: trailer.name,
      site: trailer.site,
      type: trailer.type,
      official: trailer.official,
    })),
    seasons: row.seasons.map((season) => ({
      id: String(season.id),
      seasonNumber: season.seasonNumber,
      name: season.name,
      overview: season.overview,
      posterPath: season.posterPath,
      episodeCount: season.episodeCount,
      airDate: season.airDate?.toISOString() ?? null,
    })),
  };
}

export async function getEpisodesBySeason(tvId: string, seasonNumber: number): Promise<Episode[]> {
  const parsedTitleId = parsePositiveIntId(tvId);
  if (!parsedTitleId) {
    return [];
  }

  const season = await prisma.season.findUnique({
    where: {
      titleId_seasonNumber: {
        titleId: parsedTitleId,
        seasonNumber,
      },
    },
    include: {
      episodes: {
        orderBy: {
          episodeNumber: "asc",
        },
      },
    },
  });

  if (!season) {
    return [];
  }

  return season.episodes.map((episode) => ({
    id: String(episode.id),
    episodeNumber: episode.episodeNumber,
    name: episode.name,
    overview: episode.overview,
    stillPath: episode.stillPath,
    airDate: episode.airDate?.toISOString() ?? null,
    runtime: episode.runtime,
    voteAverage: episode.voteAverage,
    voteCount: episode.voteCount,
  }));
}
