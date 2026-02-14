import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RatingBadge } from "./RatingBadge";

const meta = {
  title: "Atoms/RatingBadge",
  component: RatingBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    rating: {
      control: { type: "number", min: 0, max: 10, step: 0.1 },
    },
    maxRating: {
      control: { type: "number", min: 1, max: 10, step: 1 },
    },
    showMaxRating: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof RatingBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rating: 7.5,
  },
};

export const HighRating: Story = {
  args: {
    rating: 9.2,
  },
};

export const MediumRating: Story = {
  args: {
    rating: 6.8,
  },
};

export const LowRating: Story = {
  args: {
    rating: 3.5,
  },
};

export const PerfectScore: Story = {
  args: {
    rating: 10.0,
  },
};

export const WithoutMaxRating: Story = {
  args: {
    rating: 8.7,
    showMaxRating: false,
  },
};

export const CustomMaxRating: Story = {
  args: {
    rating: 4.2,
    maxRating: 5,
  },
};
