import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/button--primary/);

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button").className).toMatch(/button--secondary/);

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button").className).toMatch(/button--ghost/);

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button").className).toMatch(/button--danger/);
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole("button").className).toMatch(/button--small/);

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole("button").className).toMatch(/button--medium/);

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole("button").className).toMatch(/button--large/);
  });

  it("shows loading spinner when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/button--loading/);
    expect(button).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies fullWidth class when fullWidth is true", () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole("button").className).toMatch(/button--fullWidth/);
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>,
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Loading
      </Button>,
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("merges custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/button/);
    expect(button.className).toContain("custom-class");
  });

  it("has type='button' by default", () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
