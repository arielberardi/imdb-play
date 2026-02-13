import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilterChips } from "./FilterChips";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
}));

describe("FilterChips", () => {
  const mockGenres = [
    { id: 1, name: "Action" },
    { id: 2, name: "Comedy" },
  ];

  it("renders all genres plus All option", () => {
    render(<FilterChips genres={mockGenres} basePath="/films" />);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Comedy")).toBeInTheDocument();
  });

  it("generates correct links", () => {
    render(<FilterChips genres={mockGenres} basePath="/films" />);

    const allLink = screen.getByText("All").closest("a");
    expect(allLink).toHaveAttribute("href", "/films");

    const actionLink = screen.getByText("Action").closest("a");
    expect(actionLink).toHaveAttribute("href", "/films?genre=Action");
  });
});
