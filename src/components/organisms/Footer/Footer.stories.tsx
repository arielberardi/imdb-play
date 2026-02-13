import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer } from "./Footer";

const meta = {
  title: "Organisms/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPageContent: Story = {
  args: {},
  render: () => (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Page Content</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          This demonstrates the footer at the bottom of a page with content.
        </p>
      </main>
      <Footer />
    </div>
  ),
};
