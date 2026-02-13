import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tag } from "./Tag";

const meta = {
  title: "Atoms/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["small", "medium"],
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Tag",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Tag",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success Tag",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning Tag",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger Tag",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    children: "Small Tag",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    children: "Medium Tag",
  },
};

export const WithRemoveButton: Story = {
  args: {
    children: "Removable Tag",
    onRemove: () => console.log("Remove clicked"),
  },
};

export const AllVariants: Story = {
  args: {
    children: "Tag",
  },
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Tag variant="default">Default</Tag>
      <Tag variant="primary">Primary</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="danger">Danger</Tag>
    </div>
  ),
};

export const WithAndWithoutRemove: Story = {
  args: {
    children: "Tag",
  },
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Tag>Without Remove</Tag>
      <Tag onRemove={() => console.log("Remove clicked")}>With Remove</Tag>
    </div>
  ),
};
