import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { YouTubeEmbed } from "./YouTubeEmbed";

const meta = {
  title: "Molecules/YouTubeEmbed",
  component: YouTubeEmbed,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof YouTubeEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    videoKey: "BdJKm16Co6M",
    title: "Fight Club - Official Trailer",
  },
};

export const AnotherTrailer: Story = {
  args: {
    videoKey: "SUXWAEX2jlg",
    title: "Inception - Trailer",
  },
};
