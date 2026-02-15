import { render, screen } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";
import CastList from "./CastList";

describe("CastList", () => {
  it("returns nothing for empty cast", () => {
    const { container } = render(<CastList cast={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders cast section and names", () => {
    render(
      <CastList
        cast={[
          { id: "1", name: "Actor One", profilePath: null, character: "Hero" },
          { id: "2", name: "Actor Two", profilePath: null },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Cast" })).toBeInTheDocument();
    expect(screen.getByText("Actor One")).toBeInTheDocument();
    expect(screen.getByText(/Hero/)).toBeInTheDocument();
  });
});
