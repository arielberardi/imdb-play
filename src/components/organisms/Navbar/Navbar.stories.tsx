import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Navbar } from "./Navbar";

const meta = {
  title: "Organisms/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoggedIn: Story = {
  args: {},
  render: () => {
    // This is a mock representation - actual auth will be in Phase 3
    return (
      <div>
        <Navbar />
        <div style={{ padding: "2rem", color: "var(--color-text-secondary)" }}>
          Note: Logged-in state will be implemented in Phase 3 with actual authentication.
        </div>
      </div>
    );
  },
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const Desktop: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};

export const WithContent: Story = {
  args: {},
  render: () => (
    <div>
      <Navbar />
      <main style={{ padding: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Page Content</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          This demonstrates the navbar with page content below it. The navbar is sticky and will
          remain at the top as you scroll.
        </p>
        <div style={{ height: "200vh", paddingTop: "2rem" }}>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Scroll down to see sticky behavior...
          </p>
        </div>
      </main>
    </div>
  ),
};
