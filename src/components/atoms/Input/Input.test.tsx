import { render, screen } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders without label", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it("links label to input with htmlFor and id", () => {
    render(<Input label="Email" id="email-input" />);
    const label = screen.getByText(/email/i);
    const input = screen.getByLabelText(/email/i);
    expect(label).toHaveAttribute("for", "email-input");
    expect(input).toHaveAttribute("id", "email-input");
  });

  it("shows error message when error prop is provided", () => {
    render(<Input label="Password" error="Password is required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Password is required");
  });

  it("sets aria-invalid when error is present", () => {
    render(<Input error="Invalid input" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("links error message with aria-describedby", () => {
    render(<Input id="test-input" error="Error message" />);
    const input = screen.getByRole("textbox");
    const errorId = input.getAttribute("aria-describedby");
    expect(errorId).toContain("test-input-error");
  });

  it("shows helper text when provided", () => {
    render(<Input helperText="Must be at least 8 characters" />);
    expect(screen.getByText(/must be at least 8 characters/i)).toBeInTheDocument();
  });

  it("does not show helper text when error is present", () => {
    render(<Input helperText="Helper text" error="Error message" />);
    expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
    expect(screen.getByText(/error message/i)).toBeInTheDocument();
  });

  it("applies fullWidth class when fullWidth is true", () => {
    render(<Input fullWidth />);
    const wrapper = screen.getByRole("textbox").parentElement;
    expect(wrapper?.className).toMatch(/input__wrapper--fullWidth/);
  });

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("allows user to type", async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole("textbox");

    await user.type(input, "Hello");
    expect(input).toHaveValue("Hello");
  });

  it("calls onChange handler", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    await user.type(screen.getByRole("textbox"), "a");
    expect(handleChange).toHaveBeenCalled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("merges custom className", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toMatch(/input/);
    expect(input.className).toContain("custom-class");
  });
});
