import type { Trailer } from "@/lib/imdb";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TrailerModal from "./TrailerModal";

const mockTrailers: Trailer[] = [
  {
    id: "1",
    key: "BdJKm16Co6M",
    name: "Official Trailer",
    site: "YouTube",
    type: "Trailer",
    official: true,
  },
  {
    id: "2",
    key: "SUXWAEX2jlg",
    name: "Teaser",
    site: "YouTube",
    type: "Teaser",
    official: false,
  },
];

describe("TrailerModal", () => {
  it("does not render when isOpen is false", () => {
    render(<TrailerModal isOpen={false} onClose={() => {}} trailers={mockTrailers} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true", () => {
    render(<TrailerModal isOpen={true} onClose={() => {}} trailers={mockTrailers} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("displays trailer name as title", () => {
    render(<TrailerModal isOpen={true} onClose={() => {}} trailers={mockTrailers} />);
    expect(screen.getByText("Official Trailer")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TrailerModal isOpen={true} onClose={onClose} trailers={mockTrailers} />);

    await user.click(screen.getByLabelText("Close trailer"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking outside modal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TrailerModal isOpen={true} onClose={onClose} trailers={mockTrailers} />);

    const overlay = screen.getByRole("dialog");
    await user.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not close when clicking inside modal content", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TrailerModal isOpen={true} onClose={onClose} trailers={mockTrailers} />);

    const title = screen.getByText("Official Trailer");
    await user.click(title);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when ESC key is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TrailerModal isOpen={true} onClose={onClose} trailers={mockTrailers} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("selects official trailer over non-official", () => {
    render(<TrailerModal isOpen={true} onClose={() => {}} trailers={mockTrailers} />);
    expect(screen.getByText("Official Trailer")).toBeInTheDocument();
  });

  it("has correct ARIA attributes", () => {
    render(<TrailerModal isOpen={true} onClose={() => {}} trailers={mockTrailers} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
  });
});
