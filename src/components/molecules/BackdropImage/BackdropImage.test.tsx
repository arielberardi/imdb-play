import { render, screen } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import { BackdropImage } from "./BackdropImage";

describe("BackdropImage", () => {
  it("renders placeholder when no backdrop", () => {
    const { container } = render(<BackdropImage backdropPath={null} title="Movie" />);

    expect(container.querySelector("img")).toBeNull();
  });

  it("renders image with translated alt", () => {
    render(<BackdropImage backdropPath="/path.jpg" title="Movie" />);

    expect(screen.getByAltText("Movie backdrop")).toBeInTheDocument();
  });
});
