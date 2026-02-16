import type { Trailer } from "@/features/catalog";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionButtons } from "./ActionButtons";

const meta = {
  title: "Molecules/ActionButtons",
  component: ActionButtons,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ActionButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTrailers: Trailer[] = [
  {
    id: "1",
    key: "BdJKm16Co6M",
    name: "Official Trailer",
    site: "YouTube",
    type: "Trailer",
    official: true,
  },
  {
    id: "2",
    key: "SUXWAEX2jlg",
    name: "Teaser Trailer",
    site: "YouTube",
    type: "Teaser",
    official: true,
  },
];

export const WithTrailers: Story = {
  args: {
    trailers: mockTrailers,
    titleId: "550",
    mediaType: "movie",
    isAuthenticated: true,
  },
};

export const WithoutTrailers: Story = {
  args: {
    trailers: [],
    titleId: "550",
    mediaType: "movie",
    isAuthenticated: true,
  },
};

export const SingleTrailer: Story = {
  args: {
    trailers: [mockTrailers[0]],
    titleId: "550",
    mediaType: "movie",
    isAuthenticated: true,
  },
};
