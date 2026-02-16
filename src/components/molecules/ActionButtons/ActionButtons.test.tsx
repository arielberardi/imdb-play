import type { Trailer } from "@/features/catalog";
import { render, screen, waitFor } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionButtons } from "./ActionButtons";

const mocks = vi.hoisted(() => ({
  addFavoriteActionMock: vi.fn().mockResolvedValue({ success: true }),
  removeFavoriteActionMock: vi.fn().mockResolvedValue({ success: true }),
  addToWatchlistActionMock: vi.fn().mockResolvedValue({ success: true }),
  removeFromWatchlistActionMock: vi.fn().mockResolvedValue({ success: true }),
  routerPushMock: vi.fn(),
  useRouterMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: mocks.useRouterMock,
}));

vi.mock("@/features/favorites/server-actions", () => ({
  addFavoriteAction: mocks.addFavoriteActionMock,
  removeFavoriteAction: mocks.removeFavoriteActionMock,
}));

vi.mock("@/features/watchlist/server-actions", () => ({
  addToWatchlistAction: mocks.addToWatchlistActionMock,
  removeFromWatchlistAction: mocks.removeFromWatchlistActionMock,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.useRouterMock.mockReturnValue({ push: mocks.routerPushMock } as never);
});

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
    render(
      <ActionButtons
        trailers={mockTrailers}
        titleId="550"
        mediaType="movie"
        isAuthenticated={true}
      />,
    );
    expect(screen.getByRole("button", { name: /play trailer/i })).toBeInTheDocument();
  });

  it("renders disabled button when no trailers", () => {
    render(<ActionButtons trailers={[]} titleId="550" mediaType="movie" isAuthenticated={true} />);
    const button = screen.getByRole("button", { name: /no trailer available/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("opens trailer modal when play button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ActionButtons
        trailers={mockTrailers}
        titleId="550"
        mediaType="movie"
        isAuthenticated={true}
      />,
    );

    await user.click(screen.getByRole("button", { name: /play trailer/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes trailer modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ActionButtons
        trailers={mockTrailers}
        titleId="550"
        mediaType="movie"
        isAuthenticated={true}
      />,
    );

    await user.click(screen.getByRole("button", { name: /play trailer/i }));
    await user.click(screen.getByLabelText("Close trailer"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls favorite add action", async () => {
    const user = userEvent.setup();
    render(
      <ActionButtons
        trailers={mockTrailers}
        titleId="550"
        mediaType="movie"
        isAuthenticated={true}
      />,
    );

    await user.click(screen.getByLabelText("Add to favorites"));

    await waitFor(() => {
      expect(mocks.addFavoriteActionMock).toHaveBeenCalledWith({
        titleId: "550",
        mediaType: "MOVIE",
      });
    });
  });

  it("calls watchlist add action", async () => {
    const user = userEvent.setup();
    render(
      <ActionButtons
        trailers={mockTrailers}
        titleId="550"
        mediaType="movie"
        isAuthenticated={true}
      />,
    );

    await user.click(screen.getByLabelText("Add to watchlist"));

    await waitFor(() => {
      expect(mocks.addToWatchlistActionMock).toHaveBeenCalledWith({
        titleId: "550",
        mediaType: "MOVIE",
      });
    });
  });

  it("hides favorite and watchlist buttons when user is not signed in", () => {
    render(
      <ActionButtons
        trailers={mockTrailers}
        titleId="550"
        mediaType="movie"
        isAuthenticated={false}
      />,
    );

    expect(screen.queryByLabelText("Add to favorites")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Add to watchlist")).not.toBeInTheDocument();
  });

  it("redirects to sign-in when unauthenticated user clicks play trailer", async () => {
    const user = userEvent.setup();
    render(
      <ActionButtons
        trailers={mockTrailers}
        titleId="550"
        mediaType="movie"
        isAuthenticated={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /play trailer/i }));

    expect(mocks.routerPushMock).toHaveBeenCalledWith("/auth/sign-in");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
