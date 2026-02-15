import { MediaType } from "@/generated/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getEpisodesAction,
  getMovieGenresAction,
  getPopularMoviesAction,
  getPopularSeriesAction,
  getSeriesGenresAction,
  getTitleDetailsAction,
  getTitlesByGenreAction,
  getTrendingTitlesAction,
  searchTitlesAction,
} from "../server-actions";

vi.mock("../services/catalog.service", () => ({
  getEpisodesBySeason: vi.fn(),
  getTitleDetailsById: vi.fn(),
  listGenres: vi.fn(),
  listPopularTitlesByType: vi.fn(),
  listTitlesByGenre: vi.fn(),
  listTrendingTitles: vi.fn(),
  searchCatalogTitles: vi.fn(),
}));

import {
  getEpisodesBySeason,
  getTitleDetailsById,
  listGenres,
  listPopularTitlesByType,
  listTitlesByGenre,
  listTrendingTitles,
  searchCatalogTitles,
} from "../services/catalog.service";

describe("catalog server-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates trending titles", async () => {
    vi.mocked(listTrendingTitles).mockResolvedValue([]);

    await getTrendingTitlesAction(3);

    expect(listTrendingTitles).toHaveBeenCalledWith(3);
  });

  it("delegates movie and series popularity", async () => {
    vi.mocked(listPopularTitlesByType).mockResolvedValue({
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    });

    await getPopularMoviesAction(1);
    await getPopularSeriesAction(2);

    expect(listPopularTitlesByType).toHaveBeenNthCalledWith(1, MediaType.MOVIE, 1);
    expect(listPopularTitlesByType).toHaveBeenNthCalledWith(2, MediaType.SERIES, 2);
  });

  it("returns fallback response for invalid genre input", async () => {
    const result = await getTitlesByGenreAction({
      mediaType: MediaType.MOVIE,
      genreId: -1,
    });

    expect(result.results).toEqual([]);
    expect(listTitlesByGenre).not.toHaveBeenCalled();
  });

  it("delegates valid genre search", async () => {
    vi.mocked(listTitlesByGenre).mockResolvedValue({
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    });

    await getTitlesByGenreAction({ mediaType: MediaType.SERIES, genreId: 1, page: 2 });

    expect(listTitlesByGenre).toHaveBeenCalledWith(MediaType.SERIES, 1, 2);
  });

  it("trims title id before details lookup", async () => {
    vi.mocked(getTitleDetailsById).mockResolvedValue(null);

    await getTitleDetailsAction("  tt123  ");

    expect(getTitleDetailsById).toHaveBeenCalledWith("tt123");
  });

  it("returns null for empty title id", async () => {
    const result = await getTitleDetailsAction("   ");

    expect(result).toBeNull();
  });

  it("delegates movie and series genres", async () => {
    vi.mocked(listGenres).mockResolvedValue([]);

    await getMovieGenresAction();
    await getSeriesGenresAction();

    expect(listGenres).toHaveBeenNthCalledWith(1, MediaType.MOVIE);
    expect(listGenres).toHaveBeenNthCalledWith(2, MediaType.SERIES);
  });

  it("returns empty episodes for invalid input", async () => {
    const result = await getEpisodesAction({ tvId: "", seasonNumber: 0 });

    expect(result).toEqual([]);
    expect(getEpisodesBySeason).not.toHaveBeenCalled();
  });

  it("delegates valid episodes lookup", async () => {
    vi.mocked(getEpisodesBySeason).mockResolvedValue([]);

    await getEpisodesAction({ tvId: "tt123", seasonNumber: 1 });

    expect(getEpisodesBySeason).toHaveBeenCalledWith("tt123", 1);
  });

  it("delegates search", async () => {
    vi.mocked(searchCatalogTitles).mockResolvedValue({
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0,
    });

    await searchTitlesAction("matrix", 2);

    expect(searchCatalogTitles).toHaveBeenCalledWith("matrix", 2);
  });
});
