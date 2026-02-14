import type { Episode } from "@/lib/imdb";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EpisodeCard } from "./EpisodeCard";

const meta = {
  title: "Molecules/EpisodeCard",
  component: EpisodeCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EpisodeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEpisode: Episode = {
  id: 63056,
  name: "Pilot",
  episodeNumber: 1,
  overview:
    "When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.",
  stillPath: "/ydlY3iPfeOAvu8gVqrxPoMvzNCn.jpg",
  runtime: 58,
  voteAverage: 7.7,
  airDate: "2008-01-20",
};

export const Default: Story = {
  args: {
    episode: mockEpisode,
  },
};

export const WithoutStill: Story = {
  args: {
    episode: {
      ...mockEpisode,
      stillPath: null,
    },
  },
};

export const WithoutRuntime: Story = {
  args: {
    episode: {
      ...mockEpisode,
      runtime: undefined,
    },
  },
};

export const WithoutOverview: Story = {
  args: {
    episode: {
      ...mockEpisode,
      overview: "",
    },
  },
};

export const LongOverview: Story = {
  args: {
    episode: {
      ...mockEpisode,
      overview:
        "This is a very long overview that will be truncated after two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  },
};

export const ShortTitle: Story = {
  args: {
    episode: {
      ...mockEpisode,
      name: "Pilot",
    },
  },
};

export const LongTitle: Story = {
  args: {
    episode: {
      ...mockEpisode,
      name: "The One Where Everyone Finds Out About Monica and Chandler",
    },
  },
};
