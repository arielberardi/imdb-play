import { clsx } from "clsx";
import { Loader } from "lucide-react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "medium",
  isLoading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        fullWidth && styles["button--fullWidth"],
        isLoading && styles["button--loading"],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader className={styles.button__spinner} aria-hidden="true" />}
      <span className={clsx(isLoading && styles.button__content)}>{children}</span>
    </button>
  );
}
