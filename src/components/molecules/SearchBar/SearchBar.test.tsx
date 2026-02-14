import { render, screen, waitFor } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("renders with default placeholder", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search for movies and tv shows/i)).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(<SearchBar placeholder="Search for content..." />);
    expect(screen.getByPlaceholderText(/search for content/i)).toBeInTheDocument();
  });

  it("renders with default value", () => {
    render(<SearchBar defaultValue="inception" />);
    expect(screen.getByDisplayValue(/inception/i)).toBeInTheDocument();
  });

  it("allows user to type", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByRole("textbox");

    await user.type(input, "batman");
    expect(input).toHaveValue("batman");
  });

  it("shows clear button when input has value", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();

    await user.type(screen.getByRole("textbox"), "test");
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByRole("textbox");

    await user.type(input, "test query");
    expect(input).toHaveValue("test query");

    await user.click(screen.getByRole("button", { name: /clear search/i }));
    expect(input).toHaveValue("");
  });

  it("debounces onSearch callback", async () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox"), "search");

    // Wait for debounce to complete
    await waitFor(
      () => {
        expect(handleSearch).toHaveBeenCalledWith("search");
      },
      { timeout: 1000 },
    );
  });

  it("calls onSearch immediately on Enter key", async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "query{Enter}");

    await waitFor(
      () => {
        expect(handleSearch).toHaveBeenCalledWith("query");
      },
      { timeout: 1000 },
    );
  });

  it("calls onSearch with empty string when cleared", async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);

    await user.type(screen.getByRole("textbox"), "test");
    await user.click(screen.getByRole("button", { name: /clear search/i }));

    await waitFor(
      () => {
        expect(handleSearch).toHaveBeenCalledWith("");
      },
      { timeout: 1000 },
    );
  });

  it("applies custom className", () => {
    render(<SearchBar className="custom-class" />);
    const container = screen.getByRole("textbox").parentElement?.parentElement;
    expect(container?.className).toMatch(/searchBar/);
    expect(container?.className).toContain("custom-class");
  });

  it("renders search icon", () => {
    render(<SearchBar />);
    const container = screen.getByRole("textbox").parentElement?.parentElement;
    expect(container?.querySelector("svg")).toBeInTheDocument();
  });
});
