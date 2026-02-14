import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Prisma client to avoid browser compatibility issues
vi.mock("@/generated/prisma", () => ({
  MediaType: {
    MOVIE: "MOVIE",
    SERIES: "SERIES",
  },
}));

import tmdbMovieFixture from "../__fixtures__/tmdb-movie.json";
import tmdbSeasonFixture from "../__fixtures__/tmdb-season.json";
import tmdbTvShowFixture from "../__fixtures__/tmdb-tv-show.json";
import tmdbVideosFixture from "../__fixtures__/tmdb-videos.json";
import { ImdbNotFoundError } from "../errors";
import { MediaType } from "../index";
import type {
  TmdbMovie,
  TmdbPaginatedResponse,
  TmdbSeason,
  TmdbTvShow,
} from "../providers/tmdb-types";
import {
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
} from "../queries";

// Mock the client
vi.mock("../client", () => ({
  apiFetch: vi.fn(),
}));

// Import after mock
import { apiFetch } from "../client";

describe("queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTrending", () => {
    it("fetches and maps trending titles", async () => {
      const mockResponse: TmdbPaginatedResponse<TmdbMovie> = {
        results: [tmdbMovieFixture as TmdbMovie],
        page: 1,
        total_pages: 1,
        total_results: 1,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const titles = await getTrending("movie", "week");

      expect(apiFetch).toHaveBeenCalledWith("/trending/movie/week", {
        revalidate: 21600,
      });
      expect(titles).toHaveLength(1);
      expect(titles[0].id).toBe("550");
      expect(titles[0].title).toBe("Fight Club");
      expect(titles[0].mediaType).toBe(MediaType.MOVIE);
    });

    it("filters out adult content", async () => {
      const adultMovie: TmdbMovie = {
        ...tmdbMovieFixture,
        adult: true,
      } as TmdbMovie;

      const mockResponse: TmdbPaginatedResponse<TmdbMovie> = {
        results: [tmdbMovieFixture as TmdbMovie, adultMovie],
        page: 1,
        total_pages: 1,
        total_results: 2,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const titles = await getTrending("movie");

      expect(titles).toHaveLength(1);
      expect(titles[0].adult).toBeUndefined(); // Adult field not in Title type
    });

    it("handles mixed movie and TV results", async () => {
      const mockResponse = {
        results: [tmdbMovieFixture, tmdbTvShowFixture],
        page: 1,
        total_pages: 1,
        total_results: 2,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const titles = await getTrending("all");

      expect(titles).toHaveLength(2);
      expect(titles[0].mediaType).toBe(MediaType.MOVIE);
      expect(titles[1].mediaType).toBe(MediaType.SERIES);
    });
  });

  describe("getPopularMovies", () => {
    it("fetches and maps popular movies with pagination", async () => {
      const mockResponse: TmdbPaginatedResponse<TmdbMovie> = {
        results: [tmdbMovieFixture as TmdbMovie],
        page: 1,
        total_pages: 500,
        total_results: 10000,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const response = await getPopularMovies(1);

      expect(apiFetch).toHaveBeenCalledWith("/movie/popular?page=1", {
        revalidate: 21600,
      });
      expect(response.results).toHaveLength(1);
      expect(response.page).toBe(1);
      expect(response.totalPages).toBe(500);
      expect(response.totalResults).toBe(10000);
    });

    it("filters out adult content", async () => {
      const adultMovie: TmdbMovie = {
        ...tmdbMovieFixture,
        adult: true,
      } as TmdbMovie;

      const mockResponse: TmdbPaginatedResponse<TmdbMovie> = {
        results: [tmdbMovieFixture as TmdbMovie, adultMovie],
        page: 1,
        total_pages: 1,
        total_results: 2,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const response = await getPopularMovies();

      expect(response.results).toHaveLength(1);
    });
  });

  describe("getPopularSeries", () => {
    it("fetches and maps popular TV series", async () => {
      const mockResponse: TmdbPaginatedResponse<TmdbTvShow> = {
        results: [tmdbTvShowFixture as TmdbTvShow],
        page: 1,
        total_pages: 100,
        total_results: 2000,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const response = await getPopularSeries(2);

      expect(apiFetch).toHaveBeenCalledWith("/tv/popular?page=2", {
        revalidate: 21600,
      });
      expect(response.results).toHaveLength(1);
      expect(response.results[0].mediaType).toBe(MediaType.SERIES);
      expect(response.page).toBe(1);
    });
  });

  describe("getByGenre", () => {
    it("fetches movies by genre", async () => {
      const mockResponse: TmdbPaginatedResponse<TmdbMovie> = {
        results: [tmdbMovieFixture as TmdbMovie],
        page: 1,
        total_pages: 50,
        total_results: 1000,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const response = await getByGenre(MediaType.MOVIE, 18, 1);

      expect(apiFetch).toHaveBeenCalledWith("/discover/movie?with_genres=18&page=1", {
        revalidate: 21600,
      });
      expect(response.results).toHaveLength(1);
      expect(response.results[0].mediaType).toBe(MediaType.MOVIE);
    });

    it("fetches TV series by genre", async () => {
      const mockResponse: TmdbPaginatedResponse<TmdbTvShow> = {
        results: [tmdbTvShowFixture as TmdbTvShow],
        page: 1,
        total_pages: 30,
        total_results: 600,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const response = await getByGenre(MediaType.SERIES, 80);

      expect(apiFetch).toHaveBeenCalledWith("/discover/tv?with_genres=80&page=1", {
        revalidate: 21600,
      });
      expect(response.results).toHaveLength(1);
      expect(response.results[0].mediaType).toBe(MediaType.SERIES);
    });
  });

  describe("searchTitles", () => {
    it("searches and maps multi-search results", async () => {
      const mockResponse = {
        results: [
          {
            id: 550,
            media_type: "movie",
            title: "Fight Club",
            original_title: "Fight Club",
            overview: "Test overview",
            release_date: "1999-10-15",
            poster_path: "/test.jpg",
            backdrop_path: "/test2.jpg",
            vote_average: 8.4,
            vote_count: 1000,
            popularity: 50,
            adult: false,
          },
          {
            id: 1396,
            media_type: "tv",
            name: "Breaking Bad",
            original_name: "Breaking Bad",
            overview: "Test overview",
            first_air_date: "2008-01-20",
            poster_path: "/test.jpg",
            backdrop_path: "/test2.jpg",
            vote_average: 8.9,
            vote_count: 2000,
            popularity: 100,
            adult: false,
          },
          {
            id: 287,
            media_type: "person",
            name: "Brad Pitt",
          },
        ],
        page: 1,
        total_pages: 5,
        total_results: 100,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const response = await searchTitles("test query", 1);

      expect(apiFetch).toHaveBeenCalledWith("/search/multi?query=test%20query&page=1", {
        revalidate: 900,
      });
      expect(response.results).toHaveLength(2); // Person filtered out
      expect(response.results[0].mediaType).toBe(MediaType.MOVIE);
      expect(response.results[1].mediaType).toBe(MediaType.SERIES);
    });

    it("filters out adult content and persons", async () => {
      const mockResponse = {
        results: [
          {
            id: 1,
            media_type: "movie",
            title: "Clean Movie",
            adult: false,
          },
          {
            id: 2,
            media_type: "movie",
            title: "Adult Movie",
            adult: true,
          },
          {
            id: 3,
            media_type: "person",
            name: "Actor",
          },
        ],
        page: 1,
        total_pages: 1,
        total_results: 3,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const response = await searchTitles("test");

      expect(response.results).toHaveLength(1);
      expect(response.results[0].id).toBe("1");
    });
  });

  describe("getTitleDetails", () => {
    it("fetches movie details with credits and trailers", async () => {
      const movieWithDetails = {
        ...tmdbMovieFixture,
        credits: {
          cast: [
            {
              id: 287,
              name: "Brad Pitt",
              character: "Tyler Durden",
              profile_path: "/test.jpg",
            },
          ],
          crew: [
            {
              id: 7467,
              name: "David Fincher",
              job: "Director",
              profile_path: "/test2.jpg",
            },
          ],
        },
        videos: tmdbVideosFixture,
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: movieWithDetails,
        status: 200,
      });

      const details = await getTitleDetails("550", MediaType.MOVIE);

      expect(apiFetch).toHaveBeenCalledWith(
        "/movie/550?append_to_response=credits,videos,external_ids",
        {
          revalidate: 3600,
        },
      );
      expect(details.id).toBe("550");
      expect(details.credits.cast).toHaveLength(1);
      expect(details.credits.crew).toHaveLength(1);
      expect(details.trailers.length).toBeGreaterThan(0);
      expect(details.trailers.every((t) => t.site === "YouTube")).toBe(true);
    });

    it("fetches TV series details with seasons", async () => {
      const tvWithDetails = {
        ...tmdbTvShowFixture,
        credits: {
          cast: [],
          crew: [],
        },
        videos: { results: [] },
        seasons: [tmdbSeasonFixture],
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: tvWithDetails,
        status: 200,
      });

      const details = await getTitleDetails("1396", MediaType.SERIES);

      expect(apiFetch).toHaveBeenCalledWith(
        "/tv/1396?append_to_response=credits,videos,external_ids",
        {
          revalidate: 3600,
        },
      );
      expect(details.id).toBe("1396");
      expect(details.seasons).toBeDefined();
      expect(details.seasons?.length).toBeGreaterThan(0);
    });

    it("propagates 404 errors", async () => {
      vi.mocked(apiFetch).mockRejectedValue(new ImdbNotFoundError("Not found"));

      await expect(getTitleDetails("999999", MediaType.MOVIE)).rejects.toThrow(ImdbNotFoundError);
    });
  });

  describe("getTitleTrailers", () => {
    it("fetches and filters YouTube trailers", async () => {
      vi.mocked(apiFetch).mockResolvedValue({
        data: tmdbVideosFixture,
        status: 200,
      });

      const trailers = await getTitleTrailers("550", MediaType.MOVIE);

      expect(apiFetch).toHaveBeenCalledWith("/movie/550/videos", {
        revalidate: 3600,
      });
      expect(trailers.every((t) => t.site === "YouTube")).toBe(true);
      expect(trailers.length).toBeLessThan(tmdbVideosFixture.results.length); // Vimeo filtered
    });
  });

  describe("getSeasons", () => {
    it("fetches seasons for a TV series", async () => {
      const tvWithSeasons = {
        ...tmdbTvShowFixture,
        seasons: [tmdbSeasonFixture as TmdbSeason],
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: tvWithSeasons,
        status: 200,
      });

      const seasons = await getSeasons("1396");

      expect(apiFetch).toHaveBeenCalledWith("/tv/1396", {
        revalidate: 3600,
      });
      expect(seasons).toHaveLength(1);
      expect(seasons[0].seasonNumber).toBe(1);
    });
  });

  describe("getEpisodes", () => {
    it("fetches episodes for a season", async () => {
      vi.mocked(apiFetch).mockResolvedValue({
        data: tmdbSeasonFixture,
        status: 200,
      });

      const episodes = await getEpisodes("1396", 1);

      expect(apiFetch).toHaveBeenCalledWith("/tv/1396/season/1", {
        revalidate: 3600,
      });
      expect(episodes.length).toBeGreaterThan(0);
      expect(episodes[0].episodeNumber).toBe(1);
    });
  });

  describe("getGenreList", () => {
    it("fetches movie genres", async () => {
      const mockResponse = {
        genres: [
          { id: 28, name: "Action" },
          { id: 18, name: "Drama" },
        ],
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const genres = await getGenreList(MediaType.MOVIE);

      expect(apiFetch).toHaveBeenCalledWith("/genre/movie/list", {
        revalidate: 21600,
      });
      expect(genres).toHaveLength(2);
      expect(genres[0].name).toBe("Action");
    });

    it("fetches TV genres", async () => {
      const mockResponse = {
        genres: [{ id: 80, name: "Crime" }],
      };

      vi.mocked(apiFetch).mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const genres = await getGenreList(MediaType.SERIES);

      expect(apiFetch).toHaveBeenCalledWith("/genre/tv/list", {
        revalidate: 21600,
      });
      expect(genres).toHaveLength(1);
    });
  });
});
