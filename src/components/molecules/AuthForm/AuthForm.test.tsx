import { render, screen, waitFor } from "@/lib/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthForm } from "./AuthForm";

describe("AuthForm", () => {
  it("renders sign in variant", () => {
    render(<AuthForm mode="sign-in" action={async () => ({ success: false })} />);

    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("validates sign up password length", async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ success: false });
    render(<AuthForm mode="sign-up" action={action} />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "short");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });

  it("submits valid data and shows server errors", async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({
      success: false,
      message: "Invalid email or password.",
    });
    render(<AuthForm mode="sign-in" action={action} />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(action).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
