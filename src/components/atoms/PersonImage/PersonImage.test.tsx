import { render, screen } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import { PersonImage } from "./PersonImage";

describe("PersonImage", () => {
  // NOTE: Image rendering tests are covered by Storybook due to Next.js Image mocking limitations
  // in Vitest browser mode. See AssetCard.test.tsx for details.

  it("renders initials when profilePath is null", () => {
    render(<PersonImage profilePath={null} name="John Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders single initial for single-word names", () => {
    render(<PersonImage profilePath={null} name="Madonna" />);
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("renders first two initials for multi-word names", () => {
    render(<PersonImage profilePath={null} name="Benedict Cumberbatch" />);
    expect(screen.getByText("BC")).toBeInTheDocument();
  });

  it("applies custom size correctly", () => {
    const { container } = render(<PersonImage profilePath={null} name="John Doe" size={200} />);
    const placeholder = container.querySelector('[class*="placeholder"]');
    expect(placeholder).toHaveStyle({ width: "200px", height: "200px" });
  });

  it("uses default size of 150 when not specified", () => {
    const { container } = render(<PersonImage profilePath={null} name="John Doe" />);
    const placeholder = container.querySelector('[class*="placeholder"]');
    expect(placeholder).toHaveStyle({ width: "150px", height: "150px" });
  });

  it("uppercases initials", () => {
    render(<PersonImage profilePath={null} name="john doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
