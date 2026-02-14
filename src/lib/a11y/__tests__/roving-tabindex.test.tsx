import { useRovingTabindex } from "@/lib/a11y/roving-tabindex";
import { render, screen } from "@/lib/test-utils";
import { describe, expect, it } from "vitest";

interface HarnessProps {
  count: number;
}

function Harness({ count }: HarnessProps) {
  const { getItemTabIndex, onItemFocus } = useRovingTabindex(count);

  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <button key={index} tabIndex={getItemTabIndex(index)} onFocus={() => onItemFocus(index)}>
          Item {index + 1}
        </button>
      ))}
    </div>
  );
}

describe("useRovingTabindex", () => {
  it("assigns tabIndex=0 only to the active item", () => {
    render(<Harness count={3} />);

    const first = screen.getByRole("button", { name: "Item 1" });
    const second = screen.getByRole("button", { name: "Item 2" });

    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("tabindex", "-1");
  });

  it("updates active item on focus", () => {
    render(<Harness count={3} />);

    const first = screen.getByRole("button", { name: "Item 1" });
    const third = screen.getByRole("button", { name: "Item 3" });

    third.focus();

    expect(third).toHaveAttribute("tabindex", "0");
    expect(first).toHaveAttribute("tabindex", "-1");
  });

  it("clamps the active index when item count shrinks", () => {
    const { rerender } = render(<Harness count={3} />);

    const third = screen.getByRole("button", { name: "Item 3" });
    third.focus();

    rerender(<Harness count={1} />);

    const first = screen.getByRole("button", { name: "Item 1" });
    expect(first).toHaveAttribute("tabindex", "0");
  });
});
