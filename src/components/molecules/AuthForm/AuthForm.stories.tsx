import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthForm } from "./AuthForm";

const meta = {
  title: "Molecules/AuthForm",
  component: AuthForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AuthForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  args: {
    mode: "sign-in",
    action: async () => ({ success: false, message: "Demo action" }),
  },
};

export const SignUp: Story = {
  args: {
    mode: "sign-up",
    action: async () => ({ success: false, message: "Demo action" }),
  },
};
