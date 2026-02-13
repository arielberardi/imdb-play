import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchBar } from "./SearchBar";

const meta = {
  title: "Molecules/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSearch: (query: string) => console.log("Search:", query),
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Search for your favorite movies...",
    onSearch: (query: string) => console.log("Search:", query),
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "Inception",
    onSearch: (query: string) => console.log("Search:", query),
  },
};

export const Interactive: Story = {
  args: {
    placeholder: "Try typing something...",
    onSearch: (query: string) => console.log("Search:", query),
  },
  parameters: {
    layout: "padded",
  },
};

export const FullWidth: Story = {
  args: {
    placeholder: "Search...",
    onSearch: (query: string) => console.log("Search:", query),
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
};
