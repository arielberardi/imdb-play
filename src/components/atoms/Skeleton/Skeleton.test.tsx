import { render, screen } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders with loading semantics", () => {
    render(<Skeleton />);

    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("applies numeric width and height", () => {
    render(<Skeleton width={120} height={24} />);

    const el = screen.getByLabelText("Loading");
    expect(el).toHaveStyle({ width: "120px", height: "24px" });
  });
});
