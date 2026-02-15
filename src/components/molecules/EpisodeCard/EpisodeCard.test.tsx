import type { Episode } from "@/features/catalog";
import { render } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import { EpisodeCard } from "./EpisodeCard";

const mockEpisode: Episode = {
  id: 63056,
  name: "Pilot",
  episodeNumber: 1,
  overview: "The first episode of the series.",
  stillPath: "/ydlY3iPfeOAvu8gVqrxPoMvzNCn.jpg",
  runtime: 58,
  airDate: "2008-01-20",
};

describe("EpisodeCard", () => {
  // NOTE: Image rendering tests are covered by Storybook due to Next.js Image mocking limitations
  // in Vitest browser mode. See AssetCard.test.tsx for details.

  it("renders placeholder when still image is not available", () => {
    const episodeWithoutStill = { ...mockEpisode, stillPath: null };
    const { container } = render(<EpisodeCard episode={episodeWithoutStill} />);
    const placeholder = container.querySelector('[class*="placeholder"]');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent("E01");
  });

  it("formats episode number with leading zero for single digits", () => {
    const episodeWithoutStill = { ...mockEpisode, stillPath: null };
    const { container } = render(<EpisodeCard episode={episodeWithoutStill} />);
    const placeholder = container.querySelector('[class*="placeholder"]');
    expect(placeholder).toHaveTextContent("E01");
  });

  it("formats double-digit episode numbers correctly", () => {
    const episode10 = { ...mockEpisode, episodeNumber: 10, stillPath: null };
    const { container } = render(<EpisodeCard episode={episode10} />);
    const placeholder = container.querySelector('[class*="placeholder"]');
    expect(placeholder).toHaveTextContent("E10");
  });
});
