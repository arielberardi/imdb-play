import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TitleType } from "../src/generated/prisma/index.js";

const MOVIE_TARGET = 120;
const SERIES_TARGET = 120;
const PERSONS_PER_TITLE = 5;
const SEASONS_PER_SERIES = 2;
const EPISODES_PER_SEASON = 8;

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function asUtcYearDate(year) {
  if (typeof year !== "number" || Number.isNaN(year) || year < 1870 || year > 2100) {
    return null;
  }
  return new Date(Date.UTC(year, 0, 1));
}

function buildPosterUrl(titleId) {
  return `https://placehold.co/500x750/1f1f1f/e5e5e5?text=${encodeURIComponent(titleId)}`;
}

function buildBackdropUrl(titleId) {
  return `https://placehold.co/1280x720/121212/e5e5e5?text=${encodeURIComponent(titleId)}`;
}

function toUniqueByTitle(items) {
  const seen = new Set();
  const deduped = [];
  for (const item of items) {
    const key = item.title.trim().toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(item);
  }
  return deduped;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  return response.text();
}

async function loadMovies() {
  const url = "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json";
  const data = await fetchJson(url);

  if (!Array.isArray(data)) {
    throw new Error("Movies source returned invalid payload.");
  }

  const candidates = data
    .map((movie, index) => {
      const title = typeof movie.title === "string" ? movie.title.trim() : "";
      if (!title) {
        return null;
      }

      const year = typeof movie.year === "number" ? movie.year : null;
      const releaseDate = asUtcYearDate(year);
      const genres = Array.isArray(movie.genres)
        ? movie.genres.filter((genre) => typeof genre === "string" && genre.trim().length > 0)
        : [];
      const cast = Array.isArray(movie.cast)
        ? movie.cast.filter((name) => typeof name === "string" && name.trim().length > 0)
        : [];

      return {
        id: `mv-${slugify(title)}-${year ?? "unknown"}-${index}`,
        titleType: TitleType.MOVIE,
        title,
        originalTitle: title,
        releaseDate,
        runtimeMinutes: 110,
        genres,
        cast,
      };
    })
    .filter(Boolean);

  const deduped = toUniqueByTitle(candidates);
  return deduped.slice(0, MOVIE_TARGET);
}

async function loadSeries() {
  const url = "https://gist.githubusercontent.com/luckyshot/7b7b34982ace4ee2710c/raw/tvshows.js";
  const raw = await fetchText(url);
  const jsonStart = raw.indexOf("{");
  if (jsonStart < 0) {
    throw new Error("Series source returned invalid payload.");
  }

  const parsed = JSON.parse(raw.slice(jsonStart));
  const names = Array.isArray(parsed.shows) ? parsed.shows : [];

  const candidates = names
    .map((name, index) => {
      if (typeof name !== "string" || name.trim().length === 0) {
        return null;
      }
      const title = name.trim();
      const syntheticYear = 1990 + (index % 30);
      return {
        id: `tv-${slugify(title)}-${index}`,
        titleType: TitleType.SERIES,
        title,
        originalTitle: title,
        releaseDate: asUtcYearDate(syntheticYear),
        runtimeMinutes: 45,
        genres: ["Drama"],
        cast: [],
      };
    })
    .filter(Boolean);

  const deduped = toUniqueByTitle(candidates);
  return deduped.slice(0, SERIES_TARGET);
}

function buildGenreRows(titles) {
  const genreIdByName = new Map();
  const genres = [];
  let nextId = 1;

  for (const title of titles) {
    for (const genreName of title.genres) {
      if (!genreIdByName.has(genreName)) {
        genreIdByName.set(genreName, nextId);
        genres.push({ id: nextId, name: genreName });
        nextId += 1;
      }
    }
  }

  return { genres, genreIdByName };
}

function buildTitleGenreRows(titles, genreIdByName) {
  const rows = [];
  for (const title of titles) {
    for (const genreName of title.genres) {
      const genreId = genreIdByName.get(genreName);
      if (!genreId) {
        continue;
      }
      rows.push({
        id: `title-genre-${title.id}-${genreId}`,
        titleId: title.id,
        genreId,
      });
    }
  }
  return rows;
}

function buildPeopleAndCastRows(titles) {
  const people = [];
  const castRows = [];

  for (const title of titles) {
    const castNames = title.cast.length > 0 ? title.cast.slice(0, PERSONS_PER_TITLE) : [];
    const fallbackCount = PERSONS_PER_TITLE - castNames.length;
    const fallbackNames = Array.from({ length: fallbackCount }, (_, index) => `Performer ${index + 1}`);
    const finalNames = [...castNames, ...fallbackNames];

    finalNames.forEach((name, index) => {
      const personId = `nm-seed-${title.id}-${index + 1}`;
      people.push({
        id: personId,
        name,
        profilePath: null,
      });
      castRows.push({
        id: `cast-${title.id}-${personId}`,
        titleId: title.id,
        personId,
        character: `Character ${index + 1}`,
        castOrder: index + 1,
      });
    });
  }

  return { people, castRows };
}

function buildSeriesRows(seriesTitles) {
  const seasons = [];
  const episodes = [];

  for (const title of seriesTitles) {
    for (let seasonNumber = 1; seasonNumber <= SEASONS_PER_SERIES; seasonNumber += 1) {
      const seasonId = `se-${title.id}-${seasonNumber}`;
      seasons.push({
        id: seasonId,
        titleId: title.id,
        seasonNumber,
        name: `Season ${seasonNumber}`,
        overview: `Season ${seasonNumber} episodes for ${title.title}.`,
        posterPath: null,
        episodeCount: EPISODES_PER_SEASON,
        airDate: title.releaseDate ?? null,
      });

      for (let episodeNumber = 1; episodeNumber <= EPISODES_PER_SEASON; episodeNumber += 1) {
        episodes.push({
          id: `ep-${seasonId}-${episodeNumber}`,
          seasonId,
          episodeNumber,
          name: `Episode ${episodeNumber}`,
          overview: `Episode ${episodeNumber} of Season ${seasonNumber}.`,
          stillPath: null,
          airDate: title.releaseDate ?? null,
          runtime: 45,
          voteAverage: null,
          voteCount: 0,
        });
      }
    }
  }

  return { seasons, episodes };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed catalog data.");
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  const [movieTitles, seriesTitles] = await Promise.all([loadMovies(), loadSeries()]);
  const allTitles = [...movieTitles, ...seriesTitles];

  const { genres, genreIdByName } = buildGenreRows(allTitles);
  const titleGenres = buildTitleGenreRows(allTitles, genreIdByName);
  const { people, castRows } = buildPeopleAndCastRows(allTitles);
  const { seasons, episodes } = buildSeriesRows(seriesTitles);

  await prisma.$transaction(async (tx) => {
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

    if (genres.length > 0) {
      await tx.genre.createMany({ data: genres });
    }

    if (allTitles.length > 0) {
      await tx.title.createMany({
        data: allTitles.map((title, index) => ({
          id: title.id,
          titleType: title.titleType,
          title: title.title,
          originalTitle: title.originalTitle,
          overview: `${title.title} from seeded catalog data.`,
          releaseDate: title.releaseDate,
          runtimeMinutes: title.runtimeMinutes,
          posterUrl: buildPosterUrl(title.id),
          backdropUrl: buildBackdropUrl(title.id),
          voteAverage: 6.5 + (index % 30) / 10,
          voteCount: 1000 - (index % 500),
          popularity: 1000 - index,
          tagline: null,
          status: "Released",
          originalLanguage: "en",
        })),
      });
    }

    if (titleGenres.length > 0) {
      await tx.titleGenre.createMany({ data: titleGenres });
    }

    if (people.length > 0) {
      await tx.person.createMany({ data: people });
    }

    if (castRows.length > 0) {
      await tx.titleCast.createMany({ data: castRows });
    }

    if (seasons.length > 0) {
      await tx.season.createMany({ data: seasons });
    }

    if (episodes.length > 0) {
      await tx.episode.createMany({ data: episodes });
    }
  });

  console.log(
    `Seeded catalog: ${movieTitles.length} movies, ${seriesTitles.length} series, ${genres.length} genres.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
