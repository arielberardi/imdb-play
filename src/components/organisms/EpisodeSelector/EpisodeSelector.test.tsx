import { describe, expect, it, vi } from "vitest";

// Mock Prisma client to avoid browser compatibility issues
vi.mock("@/generated/prisma", () => ({
  MediaType: {
    MOVIE: "MOVIE",
    SERIES: "SERIES",
  },
}));

import type { Season } from "@/lib/imdb/types";
import { render, screen } from "@/lib/test-utils";
import EpisodeSelector from "./EpisodeSelector";

// NOTE: Full functionality tests (episode fetching, season switching) are covered by E2E tests
// due to the complexity of mocking async data fetching in Vitest browser mode.
// This file tests the component's static rendering and edge cases.

const mockSeasons: Season[] = [
  {
    id: 1,
    seasonNumber: 1,
    name: "Season 1",
    episodeCount: 10,
    overview: "First season",
  },
  {
    id: 2,
    seasonNumber: 2,
    name: "Season 2",
    episodeCount: 12,
    overview: "Second season",
  },
];

describe("EpisodeSelector", () => {
  it("renders episodes section title", () => {
    render(<EpisodeSelector tvId="1234" seasons={mockSeasons} />);
    expect(screen.getByText("Episodes")).toBeInTheDocument();
  });

  it("renders season tabs", () => {
    render(<EpisodeSelector tvId="1234" seasons={mockSeasons} />);
    expect(screen.getByRole("tab", { name: "Season 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Season 2" })).toBeInTheDocument();
  });

  it("filters out season 0 (specials)", () => {
    const seasonsWithSpecials: Season[] = [
      {
        id: 0,
        seasonNumber: 0,
        name: "Specials",
        episodeCount: 5,
        overview: "Special episodes",
      },
      ...mockSeasons,
    ];

    render(<EpisodeSelector tvId="1234" seasons={seasonsWithSpecials} />);
    expect(screen.queryByRole("tab", { name: "Specials" })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Season 1" })).toBeInTheDocument();
  });

  it("shows message when no valid seasons", () => {
    const specialsOnly: Season[] = [
      {
        id: 0,
        seasonNumber: 0,
        name: "Specials",
        episodeCount: 5,
        overview: "Special episodes",
      },
    ];

    render(<EpisodeSelector tvId="1234" seasons={specialsOnly} />);
    expect(screen.getByText(/episode information not available/i)).toBeInTheDocument();
  });
});
