import type { Episode } from "@/features/catalog";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EpisodeGrid } from "./EpisodeGrid";

const meta = {
  title: "Molecules/EpisodeGrid",
  component: EpisodeGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EpisodeGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEpisodes: Episode[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Episode ${i + 1}: The Story Continues`,
  episodeNumber: i + 1,
  overview: `This is episode ${i + 1} of the series. An exciting adventure unfolds as the characters face new challenges.`,
  stillPath: i % 2 === 0 ? "/ydlY3iPfeOAvu8gVqrxPoMvzNCn.jpg" : null,
  runtime: 45 + Math.floor(Math.random() * 15),
  voteAverage: 7 + Math.random() * 2,
  airDate: `2024-01-${(i + 1).toString().padStart(2, "0")}`,
}));

export const Default: Story = {
  args: {
    episodes: mockEpisodes,
  },
};

export const FewEpisodes: Story = {
  args: {
    episodes: mockEpisodes.slice(0, 3),
  },
};

export const ManyEpisodes: Story = {
  args: {
    episodes: Array.from({ length: 24 }, (_, i) => ({
      ...mockEpisodes[0],
      id: i + 1,
      episodeNumber: i + 1,
      name: `Episode ${i + 1}`,
    })),
  },
};

export const NoEpisodes: Story = {
  args: {
    episodes: [],
  },
};
