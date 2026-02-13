import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "circular", "rectangular", "rounded"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: "text",
    width: 200,
  },
};

export const Circular: Story = {
  args: {
    variant: "circular",
    width: 50,
    height: 50,
  },
};

export const Rectangular: Story = {
  args: {
    variant: "rectangular",
    width: 300,
    height: 200,
  },
};

export const Rounded: Story = {
  args: {
    variant: "rounded",
    width: 200,
    height: 300,
  },
};

export const CustomDimensions: Story = {
  args: {
    variant: "rounded",
    width: "100%",
    height: 400,
  },
  parameters: {
    layout: "padded",
  },
};

export const CardPlaceholder: Story = {
  args: {
    variant: "rounded",
    width: "100%",
    height: 300,
  },
  render: () => (
    <div style={{ width: 200 }}>
      <Skeleton variant="rounded" width="100%" height={300} />
      <div style={{ marginTop: 8 }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  ),
};
