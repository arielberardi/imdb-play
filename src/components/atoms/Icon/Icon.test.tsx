import { render, screen } from "@/lib/test-utils";
import { Film } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("renders with aria-label", () => {
    render(<Icon icon={Film} ariaLabel="Film icon" />);

    expect(screen.getByLabelText("Film icon")).toBeInTheDocument();
  });

  it("supports numeric size", () => {
    const { container } = render(<Icon icon={Film} size={18} />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "18");
    expect(svg).toHaveAttribute("height", "18");
  });
});
