import { MediaType } from "@/generated/prisma";
import { render, screen } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import { TitleMetadata } from "./TitleMetadata";

const details = {
  id: "tt1",
  title: "My Title",
  originalTitle: "My Title",
  mediaType: MediaType.MOVIE,
  overview: "Overview text",
  releaseDate: "2024-01-01T00:00:00.000Z",
  runtime: 120,
  genres: [{ id: 1, name: "Action" }],
  posterPath: null,
  backdropPath: null,
  rating: 7.5,
  voteAverage: 7.5,
  voteCount: 100,
  popularity: 10,
  tagline: null,
  status: null,
  originalLanguage: "en",
  credits: { cast: [], crew: [] },
  trailers: [],
};

describe("TitleMetadata", () => {
  it("renders core details", () => {
    render(<TitleMetadata details={details} />);

    expect(screen.getByRole("heading", { name: "My Title" })).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Overview text")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });
});
