import type { Season } from "@/features/catalog";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SeasonTabs } from "./SeasonTabs";

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
  {
    id: 3,
    seasonNumber: 3,
    name: "Season 3",
    episodeCount: 8,
    overview: "Third season",
  },
];

describe("SeasonTabs", () => {
  it("renders all season tabs", () => {
    render(<SeasonTabs seasons={mockSeasons} selectedSeasonNumber={1} onSeasonChange={() => {}} />);

    expect(screen.getByRole("tab", { name: "Season 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Season 2" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Season 3" })).toBeInTheDocument();
  });

  it("marks selected season as active", () => {
    render(<SeasonTabs seasons={mockSeasons} selectedSeasonNumber={2} onSeasonChange={() => {}} />);

    const season2Tab = screen.getByRole("tab", { name: "Season 2" });
    expect(season2Tab).toHaveAttribute("aria-selected", "true");
    expect(season2Tab.className).toMatch(/active/);
  });

  it("calls onSeasonChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onSeasonChange = vi.fn();

    render(
      <SeasonTabs seasons={mockSeasons} selectedSeasonNumber={1} onSeasonChange={onSeasonChange} />,
    );

    await user.click(screen.getByRole("tab", { name: "Season 3" }));
    expect(onSeasonChange).toHaveBeenCalledWith(3);
  });

  it("does not call onSeasonChange when clicking already selected tab", async () => {
    const user = userEvent.setup();
    const onSeasonChange = vi.fn();

    render(
      <SeasonTabs seasons={mockSeasons} selectedSeasonNumber={1} onSeasonChange={onSeasonChange} />,
    );

    await user.click(screen.getByRole("tab", { name: "Season 1" }));
    expect(onSeasonChange).toHaveBeenCalledWith(1);
  });

  it("renders single season correctly", () => {
    render(
      <SeasonTabs seasons={[mockSeasons[0]]} selectedSeasonNumber={1} onSeasonChange={() => {}} />,
    );

    expect(screen.getByRole("tab", { name: "Season 1" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Season 2" })).not.toBeInTheDocument();
  });
});
