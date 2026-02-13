import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders with children", () => {
    render(<Tag>Action</Tag>);
    expect(screen.getByText(/action/i)).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    const { rerender } = render(<Tag variant="default">Default</Tag>);
    expect(screen.getByText(/default/i).parentElement?.className).toMatch(/tag--default/);

    rerender(<Tag variant="primary">Primary</Tag>);
    expect(screen.getByText(/primary/i).parentElement?.className).toMatch(/tag--primary/);

    rerender(<Tag variant="success">Success</Tag>);
    expect(screen.getByText(/success/i).parentElement?.className).toMatch(/tag--success/);

    rerender(<Tag variant="warning">Warning</Tag>);
    expect(screen.getByText(/warning/i).parentElement?.className).toMatch(/tag--warning/);

    rerender(<Tag variant="danger">Danger</Tag>);
    expect(screen.getByText(/danger/i).parentElement?.className).toMatch(/tag--danger/);
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Tag size="small">Small</Tag>);
    expect(screen.getByText(/small/i).parentElement?.className).toMatch(/tag--small/);

    rerender(<Tag size="medium">Medium</Tag>);
    expect(screen.getByText(/medium/i).parentElement?.className).toMatch(/tag--medium/);
  });

  it("does not render remove button when onRemove is not provided", () => {
    render(<Tag>No Remove</Tag>);
    expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
  });

  it("renders remove button when onRemove is provided", () => {
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>With Remove</Tag>);
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>Removable</Tag>);

    await user.click(screen.getByRole("button", { name: /remove/i }));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it("has proper aria-label on remove button", () => {
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>Tag</Tag>);
    expect(screen.getByRole("button", { name: /remove/i })).toHaveAttribute("aria-label", "Remove");
  });
});
