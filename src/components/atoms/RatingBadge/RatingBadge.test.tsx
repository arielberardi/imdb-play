import { render, screen } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import { RatingBadge } from "./RatingBadge";

describe("RatingBadge", () => {
  it("renders formatted rating with max rating", () => {
    render(<RatingBadge rating={8.45} />);

    expect(screen.getByText("8.4")).toBeInTheDocument();
    expect(screen.getByText("/10")).toBeInTheDocument();
  });

  it("hides max rating when configured", () => {
    render(<RatingBadge rating={7.2} showMaxRating={false} />);

    expect(screen.getByText("7.2")).toBeInTheDocument();
    expect(screen.queryByText("/10")).not.toBeInTheDocument();
  });
});
