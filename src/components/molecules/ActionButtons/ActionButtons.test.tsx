import type { Trailer } from "@/lib/imdb";
import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ActionButtons } from "./ActionButtons";

const mockTrailers: Trailer[] = [
  {
    id: "1",
    key: "BdJKm16Co6M",
    name: "Official Trailer",
    site: "YouTube",
    type: "Trailer",
    official: true,
  },
];

describe("ActionButtons", () => {
  it("renders play trailer button when trailers exist", () => {
    render(<ActionButtons trailers={mockTrailers} />);
    expect(screen.getByRole("button", { name: /play trailer/i })).toBeInTheDocument();
  });

  it("renders disabled button when no trailers", () => {
    render(<ActionButtons trailers={[]} />);
    const button = screen.getByRole("button", { name: /no trailer available/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("renders favorite button placeholder", () => {
    render(<ActionButtons trailers={mockTrailers} />);
    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it("renders watchlist button placeholder", () => {
    render(<ActionButtons trailers={mockTrailers} />);
    expect(screen.getByLabelText("Add to watchlist")).toBeInTheDocument();
  });

  it("opens trailer modal when play button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionButtons trailers={mockTrailers} />);

    const playButton = screen.getByRole("button", { name: /play trailer/i });
    await user.click(playButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes trailer modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionButtons trailers={mockTrailers} />);

    // Open modal
    const playButton = screen.getByRole("button", { name: /play trailer/i });
    await user.click(playButton);

    // Close modal
    const closeButton = screen.getByLabelText("Close trailer");
    await user.click(closeButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("favorite and watchlist buttons are disabled (Phase 9 placeholder)", () => {
    render(<ActionButtons trailers={mockTrailers} />);
    expect(screen.getByLabelText("Add to favorites")).toBeDisabled();
    expect(screen.getByLabelText("Add to watchlist")).toBeDisabled();
  });
});
