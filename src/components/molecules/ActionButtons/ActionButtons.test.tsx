import type { Trailer } from "@/features/catalog";
import { render, screen, waitFor } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ActionButtons } from "./ActionButtons";

const addFavoriteActionMock = vi.fn().mockResolvedValue({ success: true });
const removeFavoriteActionMock = vi.fn().mockResolvedValue({ success: true });
const addToWatchlistActionMock = vi.fn().mockResolvedValue({ success: true });
const removeFromWatchlistActionMock = vi.fn().mockResolvedValue({ success: true });

vi.mock("@/features/favorites/server-actions", () => ({
  addFavoriteAction: addFavoriteActionMock,
  removeFavoriteAction: removeFavoriteActionMock,
}));

vi.mock("@/features/watchlist/server-actions", () => ({
  addToWatchlistAction: addToWatchlistActionMock,
  removeFromWatchlistAction: removeFromWatchlistActionMock,
}));

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
    render(<ActionButtons trailers={mockTrailers} titleId="550" mediaType="movie" />);
    expect(screen.getByRole("button", { name: /play trailer/i })).toBeInTheDocument();
  });

  it("renders disabled button when no trailers", () => {
    render(<ActionButtons trailers={[]} titleId="550" mediaType="movie" />);
    const button = screen.getByRole("button", { name: /no trailer available/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("opens trailer modal when play button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionButtons trailers={mockTrailers} titleId="550" mediaType="movie" />);

    await user.click(screen.getByRole("button", { name: /play trailer/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes trailer modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionButtons trailers={mockTrailers} titleId="550" mediaType="movie" />);

    await user.click(screen.getByRole("button", { name: /play trailer/i }));
    await user.click(screen.getByLabelText("Close trailer"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls favorite add action", async () => {
    const user = userEvent.setup();
    render(<ActionButtons trailers={mockTrailers} titleId="550" mediaType="movie" />);

    await user.click(screen.getByLabelText("Add to favorites"));

    await waitFor(() => {
      expect(addFavoriteActionMock).toHaveBeenCalledWith({ titleId: "550", mediaType: "MOVIE" });
    });
  });

  it("calls watchlist add action", async () => {
    const user = userEvent.setup();
    render(<ActionButtons trailers={mockTrailers} titleId="550" mediaType="movie" />);

    await user.click(screen.getByLabelText("Add to watchlist"));

    await waitFor(() => {
      expect(addToWatchlistActionMock).toHaveBeenCalledWith({ titleId: "550", mediaType: "MOVIE" });
    });
  });
});
