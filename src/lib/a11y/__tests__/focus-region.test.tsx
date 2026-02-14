import { FocusRegionProvider, useFocusRegion } from "@/lib/a11y/focus-region";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";

interface RegionHarnessProps {
  id: string;
  order: number;
  itemCount: number;
  onFocusAtIndex: (index: number) => void;
  moveDirection?: "next" | "previous";
}

function RegionHarness({
  id,
  order,
  itemCount,
  onFocusAtIndex,
  moveDirection = "next",
}: RegionHarnessProps) {
  const lastFocusedIndexRef = useRef(0);
  const { focusNextRegion, focusPreviousRegion } = useFocusRegion(id, {
    order,
    itemCount,
    getLastFocusedIndex: () => lastFocusedIndexRef.current,
    focusAtIndex: (index) => {
      lastFocusedIndexRef.current = index;
      onFocusAtIndex(index);
    },
  });

  return (
    <button
      onClick={() => {
        if (moveDirection === "next") {
          focusNextRegion(1);
        } else {
          focusPreviousRegion(1);
        }
      }}
    >
      Move from {id}
    </button>
  );
}

describe("useFocusRegion", () => {
  it("focuses the next region and keeps preferred index", async () => {
    const user = userEvent.setup();
    const firstFocusSpy = vi.fn();
    const secondFocusSpy = vi.fn();

    render(
      <FocusRegionProvider>
        <RegionHarness id="rail-1" order={1} itemCount={4} onFocusAtIndex={firstFocusSpy} />
        <RegionHarness id="rail-2" order={2} itemCount={3} onFocusAtIndex={secondFocusSpy} />
      </FocusRegionProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Move from rail-1" }));

    expect(secondFocusSpy).toHaveBeenCalledWith(1);
    expect(firstFocusSpy).not.toHaveBeenCalled();
  });

  it("focuses the previous region", async () => {
    const user = userEvent.setup();
    const firstFocusSpy = vi.fn();
    const secondFocusSpy = vi.fn();

    render(
      <FocusRegionProvider>
        <RegionHarness id="rail-1" order={1} itemCount={2} onFocusAtIndex={firstFocusSpy} />
        <RegionHarness
          id="rail-2"
          order={2}
          itemCount={2}
          onFocusAtIndex={secondFocusSpy}
          moveDirection="previous"
        />
      </FocusRegionProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Move from rail-2" }));

    expect(firstFocusSpy).toHaveBeenCalledWith(1);
    expect(secondFocusSpy).not.toHaveBeenCalled();
  });
});
