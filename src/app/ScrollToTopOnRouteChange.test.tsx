import { render } from "@/lib/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollToTopOnRouteChange } from "./ScrollToTopOnRouteChange";

const mockUsePathname = vi.fn(() => "/");
const mockUseSearchParams = vi.fn(() => new URLSearchParams());

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

describe("ScrollToTopOnRouteChange", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  it("scrolls to top on initial render and route changes", () => {
    const { rerender } = render(<ScrollToTopOnRouteChange />);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: "auto" });

    mockUsePathname.mockReturnValue("/films");
    rerender(<ScrollToTopOnRouteChange />);
    expect(window.scrollTo).toHaveBeenCalledTimes(2);

    mockUseSearchParams.mockReturnValue(new URLSearchParams("genre=Action"));
    rerender(<ScrollToTopOnRouteChange />);
    expect(window.scrollTo).toHaveBeenCalledTimes(3);
  });
});
