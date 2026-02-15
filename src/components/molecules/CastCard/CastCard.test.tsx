import { render, screen } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import { CastCard } from "./CastCard";

describe("CastCard", () => {
  it("renders actor name and character", () => {
    render(
      <CastCard
        person={{
          id: "1",
          name: "Actor",
          character: "Hero",
          profilePath: null,
        }}
      />,
    );

    expect(screen.getByText("Actor")).toBeInTheDocument();
    expect(screen.getByText(/Hero/)).toBeInTheDocument();
  });
});
