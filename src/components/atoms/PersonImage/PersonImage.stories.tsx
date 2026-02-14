import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PersonImage } from "./PersonImage";

const meta = {
  title: "Atoms/PersonImage",
  component: PersonImage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "number", min: 50, max: 300, step: 10 },
    },
  },
} satisfies Meta<typeof PersonImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    profilePath: "/nWFHB18gxV5XIPiV9KjNrP5xgvA.jpg",
    name: "Tom Hardy",
    size: 150,
  },
};

export const WithoutImage: Story = {
  args: {
    profilePath: null,
    name: "John Doe",
    size: 150,
  },
};

export const SingleInitial: Story = {
  args: {
    profilePath: null,
    name: "Madonna",
    size: 150,
  },
};

export const LongName: Story = {
  args: {
    profilePath: null,
    name: "Benedict Cumberbatch",
    size: 150,
  },
};

export const SmallSize: Story = {
  args: {
    profilePath: "/nWFHB18gxV5XIPiV9KjNrP5xgvA.jpg",
    name: "Tom Hardy",
    size: 80,
  },
};

export const LargeSize: Story = {
  args: {
    profilePath: "/nWFHB18gxV5XIPiV9KjNrP5xgvA.jpg",
    name: "Tom Hardy",
    size: 200,
  },
};
