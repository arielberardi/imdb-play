import type { TitleDetails } from "@/lib/imdb";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TitleMetadata } from "./TitleMetadata";

const meta = {
  title: "Molecules/TitleMetadata",
  component: TitleMetadata,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TitleMetadata>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockMovieDetails: TitleDetails = {
  id: "550",
  title: "Fight Club",
  overview:
    'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
  releaseDate: "1999-10-15",
  voteAverage: 8.4,
  voteCount: 27000,
  backdropPath: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
  posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  genres: [
    { id: 18, name: "Drama" },
    { id: 53, name: "Thriller" },
    { id: 35, name: "Comedy" },
  ],
  credits: { cast: [], crew: [] },
  trailers: [],
};

export const Default: Story = {
  args: {
    details: mockMovieDetails,
  },
};

export const WithoutGenres: Story = {
  args: {
    details: {
      ...mockMovieDetails,
      genres: [],
    },
  },
};

export const WithoutOverview: Story = {
  args: {
    details: {
      ...mockMovieDetails,
      overview: "",
    },
  },
};

export const LowRating: Story = {
  args: {
    details: {
      ...mockMovieDetails,
      voteAverage: 4.2,
    },
  },
};

export const HighRating: Story = {
  args: {
    details: {
      ...mockMovieDetails,
      voteAverage: 9.5,
    },
  },
};

export const LongTitle: Story = {
  args: {
    details: {
      ...mockMovieDetails,
      title: "The Lord of the Rings: The Fellowship of the Ring",
    },
  },
};

export const ManyGenres: Story = {
  args: {
    details: {
      ...mockMovieDetails,
      genres: [
        { id: 18, name: "Drama" },
        { id: 53, name: "Thriller" },
        { id: 35, name: "Comedy" },
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
      ],
    },
  },
};
