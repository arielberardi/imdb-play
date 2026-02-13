import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Username",
    placeholder: "Enter your username",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "email@example.com",
    error: "Please enter a valid email address",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Password",
    type: "password",
    helperText: "Must be at least 8 characters",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    placeholder: "Cannot edit",
    disabled: true,
    value: "Disabled value",
  },
};

export const FullWidth: Story = {
  args: {
    label: "Full Width Input",
    placeholder: "This input takes full width",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
  },
};

export const WithValue: Story = {
  args: {
    label: "Name",
    defaultValue: "John Doe",
  },
};
