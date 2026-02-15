import { render, screen } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import { EpisodeGrid } from "./EpisodeGrid";

describe("EpisodeGrid", () => {
  it("renders empty message when no episodes", () => {
    render(<EpisodeGrid episodes={[]} />);

    expect(screen.getByText("No episodes available for this season.")).toBeInTheDocument();
  });

  it("renders episode cards", () => {
    render(
      <EpisodeGrid
        episodes={[
          {
            id: "ep-1",
            episodeNumber: 1,
            name: "Pilot",
            overview: "First episode",
            stillPath: null,
            airDate: null,
            runtime: 45,
          },
        ]}
      />,
    );

    expect(screen.getByText("Pilot")).toBeInTheDocument();
  });
});
