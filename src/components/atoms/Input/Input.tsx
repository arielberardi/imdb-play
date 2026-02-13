import { clsx } from "clsx";
import { forwardRef, useId } from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div
        className={clsx(styles.input__wrapper, fullWidth && styles["input__wrapper--fullWidth"])}
      >
        {label && (
          <label htmlFor={inputId} className={styles.input__label}>
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={clsx(styles.input, error && styles["input--error"], className)}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={clsx(errorId, helperId).trim() || undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className={styles.input__error} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className={styles.input__helper}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
