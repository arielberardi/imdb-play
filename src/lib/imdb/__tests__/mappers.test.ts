import { describe, expect, it, vi } from "vitest";

// Mock Prisma client to avoid browser compatibility issues
vi.mock("@/generated/prisma", () => ({
  MediaType: {
    MOVIE: "MOVIE",
    SERIES: "SERIES",
  },
}));

import tmdbCreditsFixture from "../__fixtures__/tmdb-credits.json";
import tmdbEpisodeFixture from "../__fixtures__/tmdb-episode.json";
import tmdbMovieFixture from "../__fixtures__/tmdb-movie.json";
import tmdbSeasonFixture from "../__fixtures__/tmdb-season.json";
import tmdbTvShowFixture from "../__fixtures__/tmdb-tv-show.json";
import tmdbVideosFixture from "../__fixtures__/tmdb-videos.json";
import { MediaType } from "../index";
import {
  mapTmdbCastMember,
  mapTmdbCrewMember,
  mapTmdbEpisode,
  mapTmdbGenre,
  mapTmdbMovieToTitle,
  mapTmdbSeason,
  mapTmdbTvShowToTitle,
  mapTmdbVideo,
} from "../mappers";
import type {
  TmdbCastMember,
  TmdbCredits,
  TmdbCrewMember,
  TmdbEpisode,
  TmdbMovie,
  TmdbSeason,
  TmdbTvShow,
  TmdbVideo,
  TmdbVideosResponse,
} from "../providers/tmdb-types";

describe("mappers", () => {
  describe("mapTmdbGenre", () => {
    it("maps genre correctly", () => {
      const genre = mapTmdbGenre({ id: 18, name: "Drama" });

      expect(genre).toEqual({
        id: 18,
        name: "Drama",
      });
    });
  });

  describe("mapTmdbMovieToTitle", () => {
    it("maps movie with all fields correctly", () => {
      const movie = tmdbMovieFixture as TmdbMovie;
      const title = mapTmdbMovieToTitle(movie);

      expect(title).toEqual({
        id: "550",
        imdbId: "tt0137523",
        title: "Fight Club",
        originalTitle: "Fight Club",
        mediaType: MediaType.MOVIE,
        overview: expect.any(String),
        releaseDate: "1999-10-15",
        runtime: 139,
        genres: [{ id: 18, name: "Drama" }],
        posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        backdropPath: "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
        rating: 8.433,
        voteCount: 26280,
        popularity: 61.416,
      });
    });

    it("maps movie with missing optional fields to null", () => {
      const movie: TmdbMovie = {
        id: 1,
        title: "Test Movie",
        original_title: "Test Movie",
        overview: "Test overview",
        release_date: "",
        poster_path: null,
        backdrop_path: null,
        vote_average: 0,
        vote_count: 0,
        popularity: 0,
        adult: false,
      };

      const title = mapTmdbMovieToTitle(movie);

      expect(title.releaseDate).toBeNull();
      expect(title.runtime).toBeNull();
      expect(title.genres).toEqual([]);
      expect(title.posterPath).toBeNull();
      expect(title.backdropPath).toBeNull();
      expect(title.rating).toBeNull();
      expect(title.imdbId).toBeNull();
    });

    it("normalizes empty strings to null", () => {
      const movie: TmdbMovie = {
        id: 1,
        imdb_id: "",
        title: "Test",
        original_title: "Test",
        overview: "Test",
        release_date: "   ",
        poster_path: "",
        backdrop_path: "  ",
        vote_average: 5,
        vote_count: 10,
        popularity: 1,
        adult: false,
      };

      const title = mapTmdbMovieToTitle(movie);

      expect(title.imdbId).toBeNull();
      expect(title.releaseDate).toBeNull();
      expect(title.posterPath).toBeNull();
      expect(title.backdropPath).toBeNull();
    });
  });

  describe("mapTmdbTvShowToTitle", () => {
    it("maps TV show with all fields correctly", () => {
      const tv = tmdbTvShowFixture as TmdbTvShow;
      const title = mapTmdbTvShowToTitle(tv);

      expect(title).toEqual({
        id: "1396",
        imdbId: "tt0903747",
        title: "Breaking Bad",
        originalTitle: "Breaking Bad",
        mediaType: MediaType.SERIES,
        overview: expect.any(String),
        releaseDate: "2008-01-20",
        runtime: 45,
        genres: [
          { id: 18, name: "Drama" },
          { id: 80, name: "Crime" },
        ],
        posterPath: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        backdropPath: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
        rating: 8.9,
        voteCount: 12234,
        popularity: 321.597,
      });
    });

    it("maps TV show with missing optional fields to null", () => {
      const tv: TmdbTvShow = {
        id: 1,
        name: "Test Show",
        original_name: "Test Show",
        overview: "Test overview",
        first_air_date: "",
        poster_path: null,
        backdrop_path: null,
        vote_average: 0,
        vote_count: 0,
        popularity: 0,
        adult: false,
      };

      const title = mapTmdbTvShowToTitle(tv);

      expect(title.releaseDate).toBeNull();
      expect(title.runtime).toBeNull();
      expect(title.genres).toEqual([]);
      expect(title.posterPath).toBeNull();
      expect(title.backdropPath).toBeNull();
      expect(title.rating).toBeNull();
      expect(title.imdbId).toBeNull();
    });

    it("uses first episode runtime from array", () => {
      const tv: TmdbTvShow = {
        id: 1,
        name: "Test",
        original_name: "Test",
        overview: "Test",
        first_air_date: "2020-01-01",
        episode_run_time: [45, 60],
        poster_path: null,
        backdrop_path: null,
        vote_average: 7,
        vote_count: 100,
        popularity: 50,
        adult: false,
      };

      const title = mapTmdbTvShowToTitle(tv);

      expect(title.runtime).toBe(45);
    });

    it("handles empty episode runtime array", () => {
      const tv: TmdbTvShow = {
        id: 1,
        name: "Test",
        original_name: "Test",
        overview: "Test",
        first_air_date: "2020-01-01",
        episode_run_time: [],
        poster_path: null,
        backdrop_path: null,
        vote_average: 7,
        vote_count: 100,
        popularity: 50,
        adult: false,
      };

      const title = mapTmdbTvShowToTitle(tv);

      expect(title.runtime).toBeNull();
    });
  });

  describe("mapTmdbVideo", () => {
    it("maps YouTube video correctly", () => {
      const videos = tmdbVideosFixture as TmdbVideosResponse;
      const youtubeVideo = videos.results[0] as TmdbVideo;
      const trailer = mapTmdbVideo(youtubeVideo);

      expect(trailer).toEqual({
        id: "5c9294240e0a267cd516835f",
        key: "SUXWAEX2jlg",
        name: "Fight Club | #TBT Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
      });
    });

    it("returns null for non-YouTube videos", () => {
      const videos = tmdbVideosFixture as TmdbVideosResponse;
      const vimeoVideo = videos.results[2] as TmdbVideo;
      const trailer = mapTmdbVideo(vimeoVideo);

      expect(trailer).toBeNull();
    });
  });

  describe("mapTmdbCastMember", () => {
    it("maps cast member correctly", () => {
      const credits = tmdbCreditsFixture as TmdbCredits;
      const castMember = credits.cast[0] as TmdbCastMember;
      const person = mapTmdbCastMember(castMember);

      expect(person).toEqual({
        id: 287,
        name: "Brad Pitt",
        character: "Tyler Durden",
        profilePath: "/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      });
    });

    it("handles null profile path", () => {
      const castMember: TmdbCastMember = {
        id: 1,
        name: "Test Actor",
        character: "Test Character",
        profile_path: null,
      };

      const person = mapTmdbCastMember(castMember);

      expect(person.profilePath).toBeNull();
    });
  });

  describe("mapTmdbCrewMember", () => {
    it("maps crew member correctly", () => {
      const credits = tmdbCreditsFixture as TmdbCredits;
      const crewMember = credits.crew[0] as TmdbCrewMember;
      const person = mapTmdbCrewMember(crewMember);

      expect(person).toEqual({
        id: 7467,
        name: "David Fincher",
        job: "Director",
        profilePath: "/tpEczFclQZeKAiCeKZZ0adRvtfz.jpg",
      });
    });

    it("handles null profile path", () => {
      const credits = tmdbCreditsFixture as TmdbCredits;
      const crewMember = credits.crew[1] as TmdbCrewMember;
      const person = mapTmdbCrewMember(crewMember);

      expect(person.profilePath).toBeNull();
    });
  });

  describe("mapTmdbEpisode", () => {
    it("maps episode correctly", () => {
      const episode = tmdbEpisodeFixture as TmdbEpisode;
      const mapped = mapTmdbEpisode(episode);

      expect(mapped).toEqual({
        id: 62085,
        episodeNumber: 1,
        name: "Pilot",
        overview: expect.any(String),
        stillPath: "/ydlY3iPfeOAvu8gVqrxPoMvzNCn.jpg",
        airDate: "2008-01-20",
        runtime: 58,
      });
    });

    it("handles missing optional fields", () => {
      const episode: TmdbEpisode = {
        id: 1,
        episode_number: 1,
        name: "Test",
        overview: "Test",
        still_path: null,
        air_date: null,
        runtime: null,
      };

      const mapped = mapTmdbEpisode(episode);

      expect(mapped.stillPath).toBeNull();
      expect(mapped.airDate).toBeNull();
      expect(mapped.runtime).toBeNull();
    });
  });

  describe("mapTmdbSeason", () => {
    it("maps season with episodes correctly", () => {
      const season = tmdbSeasonFixture as TmdbSeason;
      const mapped = mapTmdbSeason(season);

      expect(mapped).toEqual({
        id: 3572,
        seasonNumber: 1,
        name: "Season 1",
        overview: expect.any(String),
        posterPath: "/1BP4xYv9ZG4ZVHkn63XSKXoHn4z.jpg",
        episodeCount: 7,
        airDate: "2008-01-20",
        episodes: expect.arrayContaining([
          expect.objectContaining({
            id: 62085,
            episodeNumber: 1,
            name: "Pilot",
          }),
          expect.objectContaining({
            id: 62086,
            episodeNumber: 2,
            name: "Cat's in the Bag...",
          }),
        ]),
      });
    });

    it("handles season without episodes", () => {
      const season: TmdbSeason = {
        id: 1,
        season_number: 1,
        name: "Season 1",
        overview: "Test",
        poster_path: null,
        episode_count: 10,
        air_date: "2020-01-01",
      };

      const mapped = mapTmdbSeason(season);

      expect(mapped.episodes).toBeUndefined();
    });
  });
});
