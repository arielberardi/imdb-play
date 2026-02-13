import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Rail } from "./Rail";

const meta = {
  title: "Molecules/Rail",
  component: Rail,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Rail>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockItems = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Movie ${i + 1}`,
  imageUrl: `https://placehold.co/200x300/1f1f1f/a3a3a3?text=Movie+${i + 1}`,
  rating: 7.0 + Math.random() * 2,
  year: 2020 + Math.floor(Math.random() * 5),
  href: `/movies/${i + 1}`,
}));

export const Default: Story = {
  args: {
    title: "Trending Now",
    items: mockItems.slice(0, 5),
  },
};

export const WithManyItems: Story = {
  args: {
    title: "Popular Movies",
    items: mockItems,
  },
};

export const EmptyState: Story = {
  args: {
    title: "No Results",
    items: [],
  },
};

export const LoadingState: Story = {
  args: {
    title: "Loading...",
    items: [],
  },
  render: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Skeleton } = require("@/components/atoms/Skeleton");
    return (
      <section className="rail">
        <h2
          style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", padding: "0 2rem" }}
        >
          Loading...
        </h2>
        <div style={{ display: "flex", gap: "1rem", padding: "0 2rem", overflowX: "auto" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ width: 200, flexShrink: 0 }}>
              <Skeleton variant="rounded" width="100%" height={300} />
              <div style={{ marginTop: 8 }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  },
};

export const MultipleRails: Story = {
  args: {
    title: "Multiple Rails",
    items: mockItems,
  },
  render: () => (
    <div>
      <Rail title="Trending Now" items={mockItems.slice(0, 8)} />
      <Rail title="Action Movies" items={mockItems.slice(0, 6)} />
      <Rail title="Comedy Series" items={mockItems.slice(0, 7)} />
    </div>
  ),
};
