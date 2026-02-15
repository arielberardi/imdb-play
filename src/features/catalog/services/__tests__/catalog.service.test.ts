import { MediaType, TitleType } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getEpisodesBySeason,
  getTitleDetailsById,
  listGenres,
  listPopularTitlesByType,
  listTitlesByGenre,
  listTrendingTitles,
  searchCatalogTitles,
} from "../catalog.service";

vi.mock("@/lib/prisma", () => ({
  default: {
    title: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
    genre: {
      findMany: vi.fn(),
    },
    season: {
      findUnique: vi.fn(),
    },
  },
}));

const baseTitleRow = {
  id: "tt1",
  titleType: TitleType.MOVIE,
  title: "Title 1",
  originalTitle: "Title 1",
  overview: "Overview",
  releaseDate: new Date("2024-01-02"),
  runtimeMinutes: 120,
  posterUrl: "/poster.jpg",
  backdropUrl: "/backdrop.jpg",
  voteAverage: 7.8,
  voteCount: 10,
  popularity: 99,
  genres: [{ genre: { id: 1, name: "Action" } }],
};

describe("catalog.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists trending titles", async () => {
    vi.mocked(prisma.title.findMany).mockResolvedValue([baseTitleRow] as never);

    const result = await listTrendingTitles(5);

    expect(result).toHaveLength(1);
    expect(result[0]?.mediaType).toBe(MediaType.MOVIE);
    expect(prisma.title.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }));
  });

  it("lists popular titles with pagination metadata", async () => {
    vi.mocked(prisma.title.count).mockResolvedValue(21);
    vi.mocked(prisma.title.findMany).mockResolvedValue([
      { ...baseTitleRow, titleType: TitleType.SERIES },
    ] as never);

    const result = await listPopularTitlesByType(MediaType.SERIES, 2);

    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.results[0]?.mediaType).toBe(MediaType.SERIES);
  });

  it("lists titles by genre", async () => {
    vi.mocked(prisma.title.count).mockResolvedValue(1);
    vi.mocked(prisma.title.findMany).mockResolvedValue([baseTitleRow] as never);

    const result = await listTitlesByGenre(MediaType.MOVIE, 1, 1);

    expect(result.totalResults).toBe(1);
    expect(prisma.title.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          genres: { some: { genreId: 1 } },
        }),
      }),
    );
  });

  it("lists genres by media type", async () => {
    vi.mocked(prisma.genre.findMany).mockResolvedValue([{ id: 1, name: "Action" }] as never);

    const result = await listGenres(MediaType.MOVIE);

    expect(result[0]?.name).toBe("Action");
  });

  it("returns empty search result when query is blank", async () => {
    const result = await searchCatalogTitles("   ", 1);

    expect(result.results).toEqual([]);
    expect(prisma.title.count).not.toHaveBeenCalled();
  });

  it("searches catalog titles", async () => {
    vi.mocked(prisma.title.count).mockResolvedValue(1);
    vi.mocked(prisma.title.findMany).mockResolvedValue([baseTitleRow] as never);

    const result = await searchCatalogTitles("title", 1);

    expect(result.totalResults).toBe(1);
    expect(prisma.title.count).toHaveBeenCalled();
  });

  it("returns null when title details are missing", async () => {
    vi.mocked(prisma.title.findUnique).mockResolvedValue(null);

    await expect(getTitleDetailsById("missing")).resolves.toBeNull();
  });

  it("maps title details, cast, trailers, and seasons", async () => {
    vi.mocked(prisma.title.findUnique).mockResolvedValue({
      ...baseTitleRow,
      tagline: "tag",
      status: "released",
      originalLanguage: "en",
      cast: [
        {
          person: { id: "p1", name: "Actor", profilePath: "/actor.jpg" },
          character: "Lead",
        },
      ],
      trailers: [
        {
          id: "tr1",
          key: "abc",
          name: "Official Trailer",
          site: "YouTube",
          type: "Trailer",
          official: true,
        },
      ],
      seasons: [
        {
          id: "s1",
          seasonNumber: 1,
          name: "Season 1",
          overview: "Overview",
          posterPath: "/s1.jpg",
          episodeCount: 10,
          airDate: new Date("2024-01-01"),
        },
      ],
    } as never);

    const result = await getTitleDetailsById("tt1");

    expect(result?.trailers).toHaveLength(1);
    expect(result?.credits.cast).toHaveLength(1);
    expect(result?.seasons).toHaveLength(1);
  });

  it("returns empty array when season is missing", async () => {
    vi.mocked(prisma.season.findUnique).mockResolvedValue(null);

    await expect(getEpisodesBySeason("tt1", 1)).resolves.toEqual([]);
  });

  it("maps episodes by season", async () => {
    vi.mocked(prisma.season.findUnique).mockResolvedValue({
      episodes: [
        {
          id: "e1",
          episodeNumber: 1,
          name: "Pilot",
          overview: "Overview",
          stillPath: "/still.jpg",
          airDate: new Date("2024-01-01"),
          runtime: 45,
          voteAverage: 7.5,
          voteCount: 100,
        },
      ],
    } as never);

    const result = await getEpisodesBySeason("tt1", 1);

    expect(result).toHaveLength(1);
    expect(result[0]?.episodeNumber).toBe(1);
  });
});
