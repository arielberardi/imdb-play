import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavbarView } from "./NavbarView";

const meta = {
  title: "Organisms/Navbar",
  component: NavbarView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onSignOut: () => {},
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavbarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: null,
  },
};

export const LoggedIn: Story = {
  args: {
    user: {
      id: 1,
      email: "member@imdbplay.dev",
    },
  },
  render: () => (
    <NavbarView
      user={{
        id: 1,
        email: "member@imdbplay.dev",
      }}
      onSignOut={() => {}}
    />
  ),
};

export const LoggedOut: Story = {
  args: {
    user: null,
  },
};

export const Mobile: Story = {
  args: {
    user: null,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const Desktop: Story = {
  args: {
    user: null,
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const WithContent: Story = {
  args: {
    user: null,
  },
  render: () => (
    <main>
      <NavbarView user={null} onSignOut={() => {}} />
    </main>
  ),
};
