import { FocusRegionProvider } from "@/lib/a11y/focus-region";
import { fireEvent, render, screen, waitFor } from "@/lib/test-utils";
import { describe, expect, it, vi } from "vitest";
import { Rail, type RailItem } from "./Rail";

vi.mock("@/components/molecules/AssetCard", () => ({
  AssetCard: ({
    title,
    href,
    linkRef,
    linkTabIndex,
    onLinkFocus,
    onLinkMouseEnter,
    onLinkKeyDown,
  }: {
    title: string;
    href: string;
    linkRef?: (element: HTMLAnchorElement | null) => void;
    linkTabIndex?: 0 | -1;
    onLinkFocus?: () => void;
    onLinkMouseEnter?: () => void;
    onLinkKeyDown?: (event: unknown) => void;
  }) => (
    <a
      href={href}
      ref={linkRef}
      tabIndex={linkTabIndex}
      onFocus={onLinkFocus}
      onMouseEnter={onLinkMouseEnter}
      onKeyDown={onLinkKeyDown}
    >
      {title}
    </a>
  ),
}));

const firstRailItems: RailItem[] = [
  { id: "1", title: "First 1", imageUrl: "", href: "/movies/1" },
  { id: "2", title: "First 2", imageUrl: "", href: "/movies/2" },
];

const secondRailItems: RailItem[] = [
  { id: "3", title: "Second 1", imageUrl: "", href: "/movies/3" },
  { id: "4", title: "Second 2", imageUrl: "", href: "/movies/4" },
];

describe("Rail keyboard navigation", () => {
  it("moves focus with ArrowRight and ArrowLeft", () => {
    render(
      <FocusRegionProvider>
        <Rail title="Rail One" items={firstRailItems} regionOrder={1} regionId="rail-one" />
      </FocusRegionProvider>,
    );

    const first = screen.getByRole("link", { name: "First 1" });
    const second = screen.getByRole("link", { name: "First 2" });

    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: "ArrowLeft" });
    expect(first).toHaveFocus();
  });

  it("moves focus between rails with ArrowDown and ArrowUp", async () => {
    render(
      <FocusRegionProvider>
        <Rail title="Rail One" items={firstRailItems} regionOrder={1} regionId="rail-one" />
        <Rail title="Rail Two" items={secondRailItems} regionOrder={2} regionId="rail-two" />
      </FocusRegionProvider>,
    );

    const firstOne = screen.getByRole("link", { name: "First 1" });
    const firstTwo = screen.getByRole("link", { name: "First 2" });
    const secondOne = screen.getByRole("link", { name: "Second 1" });
    const secondTwo = screen.getByRole("link", { name: "Second 2" });

    fireEvent.focus(firstTwo);
    await waitFor(() => {
      expect(firstTwo).toHaveAttribute("tabindex", "0");
    });
    fireEvent.keyDown(firstTwo, { key: "ArrowDown" });
    await waitFor(() => {
      expect(secondTwo).toHaveFocus();
    });

    fireEvent.keyDown(secondTwo, { key: "ArrowUp" });
    await waitFor(() => {
      expect(firstTwo).toHaveFocus();
    });

    fireEvent.focus(firstOne);
    await waitFor(() => {
      expect(firstOne).toHaveAttribute("tabindex", "0");
    });
    fireEvent.keyDown(firstOne, { key: "ArrowDown" });
    await waitFor(() => {
      expect(secondOne).toHaveFocus();
    });
  });

  it("activates focused item with Space", () => {
    render(
      <FocusRegionProvider>
        <Rail title="Rail One" items={firstRailItems} regionOrder={1} regionId="rail-one" />
      </FocusRegionProvider>,
    );

    const first = screen.getByRole("link", { name: "First 1" });
    const clickSpy = vi.fn();
    first.addEventListener("click", clickSpy);

    first.focus();
    fireEvent.keyDown(first, { key: " " });

    expect(clickSpy).toHaveBeenCalled();
  });
});
