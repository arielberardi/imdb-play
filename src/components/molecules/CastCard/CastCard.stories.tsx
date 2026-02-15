import type { Person } from "@/features/catalog";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CastCard } from "./CastCard";

const meta = {
  title: "Molecules/CastCard",
  component: CastCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CastCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPerson: Person = {
  id: 2524,
  name: "Tom Hardy",
  character: "Max Rockatansky",
  profilePath: "/nWFHB18gxV5XIPiV9KjNrP5xgvA.jpg",
};

export const Default: Story = {
  args: {
    person: mockPerson,
  },
};

export const WithoutImage: Story = {
  args: {
    person: {
      ...mockPerson,
      profilePath: null,
    },
  },
};

export const WithoutCharacter: Story = {
  args: {
    person: {
      ...mockPerson,
      character: undefined,
    },
  },
};

export const LongNames: Story = {
  args: {
    person: {
      id: 1,
      name: "Benedict Cumberbatch",
      character: "Doctor Stephen Strange",
      profilePath: "/fBEucxECxGLKVHBznO0w4B3v6h0.jpg",
    },
  },
};
