import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AssetCard } from "./AssetCard";

const meta = {
  title: "Molecules/AssetCard",
  component: AssetCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AssetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Movie: Story = {
  args: {
    id: "1",
    title: "The Shawshank Redemption",
    imageUrl: "https://placehold.co/200x300/1f1f1f/a3a3a3?text=Movie+Poster",
    href: "/movies/1",
    rating: 9.3,
    year: 1994,
    mediaType: "movie",
  },
};

export const Series: Story = {
  args: {
    id: "2",
    title: "Breaking Bad",
    imageUrl: "https://placehold.co/200x300/1f1f1f/a3a3a3?text=Series+Poster",
    href: "/series/2",
    rating: 9.5,
    year: 2008,
    mediaType: "series",
  },
};

export const WithProgress: Story = {
  args: {
    id: "3",
    title: "The Dark Knight",
    imageUrl: "https://placehold.co/200x300/1f1f1f/a3a3a3?text=Movie+Poster",
    href: "/movies/3",
    rating: 9.0,
    year: 2008,
    mediaType: "movie",
    showProgress: true,
    progressPercent: 65,
  },
};

export const Favorite: Story = {
  args: {
    id: "4",
    title: "Inception",
    imageUrl: "https://placehold.co/200x300/1f1f1f/a3a3a3?text=Movie+Poster",
    href: "/movies/4",
    rating: 8.8,
    year: 2010,
    mediaType: "movie",
    isFavorite: true,
  },
};

export const Minimal: Story = {
  args: {
    id: "5",
    title: "Unknown Title",
    imageUrl: "https://placehold.co/200x300/1f1f1f/a3a3a3?text=No+Data",
    href: "/movies/5",
  },
};

export const AllFeatures: Story = {
  args: {
    id: "6",
    title: "The Godfather",
    imageUrl: "https://placehold.co/200x300/1f1f1f/a3a3a3?text=Movie+Poster",
    href: "/movies/6",
    rating: 9.2,
    year: 1972,
    mediaType: "movie",
    isFavorite: true,
    showProgress: true,
    progressPercent: 45,
  },
};

export const LoadingState: Story = {
  args: {
    id: "loading",
    title: "Loading...",
    imageUrl: "",
    href: "#",
  },
  render: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Skeleton } = require("@/components/atoms/Skeleton");
    return (
      <div style={{ width: 200 }}>
        <Skeleton variant="rounded" width="100%" height={300} />
        <div style={{ marginTop: 8 }}>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
    );
  },
};
