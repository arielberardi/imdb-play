import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FilterChips } from "./FilterChips";

const meta = {
  title: "Molecules/FilterChips",
  component: FilterChips,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockGenres = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Science Fiction" },
];

export const Films: Story = {
  args: {
    genres: mockGenres,
    basePath: "/films",
  },
};

export const Series: Story = {
  args: {
    genres: mockGenres,
    basePath: "/series",
  },
};
