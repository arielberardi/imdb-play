import { clsx } from "clsx";
import { X } from "lucide-react";
import styles from "./Tag.module.css";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "small" | "medium";
  onRemove?: () => void;
}

export function Tag({ children, variant = "default", size = "medium", onRemove }: TagProps) {
  return (
    <span className={clsx(styles.tag, styles[`tag--${variant}`], styles[`tag--${size}`])}>
      <span className={styles.tag__content}>{children}</span>
      {onRemove && (
        <button type="button" onClick={onRemove} className={styles.tag__remove} aria-label="Remove">
          <X size={size === "small" ? 12 : 14} />
        </button>
      )}
    </span>
  );
}
