import type { Season } from "@/features/catalog";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { SeasonTabs } from "./SeasonTabs";

const meta = {
  title: "Molecules/SeasonTabs",
  component: SeasonTabs,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(1);
      return (
        <Story
          args={{
            selectedSeasonNumber,
            onSeasonChange: setSelectedSeasonNumber,
          }}
        />
      );
    },
  ],
} satisfies Meta<typeof SeasonTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Default: Story = {
  args: {
    seasons: mockSeasons,
    selectedSeasonNumber: 1,
    onSeasonChange: () => {},
  },
};

export const ManySeasons: Story = {
  args: {
    seasons: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      seasonNumber: i + 1,
      name: `Season ${i + 1}`,
      episodeCount: 10,
      overview: `Season ${i + 1} overview`,
    })),
    selectedSeasonNumber: 1,
    onSeasonChange: () => {},
  },
};

export const SingleSeason: Story = {
  args: {
    seasons: [mockSeasons[0]],
    selectedSeasonNumber: 1,
    onSeasonChange: () => {},
  },
};
