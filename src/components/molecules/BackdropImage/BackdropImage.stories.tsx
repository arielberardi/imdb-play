import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BackdropImage } from "./BackdropImage";

const meta = {
  title: "Molecules/BackdropImage",
  component: BackdropImage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ height: "400px", position: "relative" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackdropImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithBackdrop: Story = {
  args: {
    backdropPath: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    title: "Fight Club",
  },
};

export const WithoutBackdrop: Story = {
  args: {
    backdropPath: null,
    title: "Unknown Movie",
  },
};
