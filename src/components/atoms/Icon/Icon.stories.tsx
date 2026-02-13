import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Film, Heart, Home, Play, Search, Star, Tv, User } from "lucide-react";
import { Icon } from "./Icon";

const meta = {
  title: "Atoms/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: Heart,
  },
};

export const Small: Story = {
  args: {
    icon: Star,
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    icon: Play,
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    icon: Search,
    size: "large",
  },
};

export const CustomSize: Story = {
  args: {
    icon: User,
    size: 48,
  },
};

export const AllCommonIcons: Story = {
  args: {
    icon: Heart,
  },
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Icon icon={Heart} ariaLabel="Favorite" />
      <Icon icon={Play} ariaLabel="Play" />
      <Icon icon={Star} ariaLabel="Rating" />
      <Icon icon={Search} ariaLabel="Search" />
      <Icon icon={User} ariaLabel="User" />
      <Icon icon={Home} ariaLabel="Home" />
      <Icon icon={Film} ariaLabel="Film" />
      <Icon icon={Tv} ariaLabel="TV Series" />
    </div>
  ),
};
