import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import styles from "./Icon.module.css";

interface IconProps {
  icon: LucideIcon;
  size?: "small" | "medium" | "large" | number;
  className?: string;
  ariaLabel?: string;
}

export function Icon({
  icon: LucideIconComponent,
  size = "medium",
  className,
  ariaLabel,
}: IconProps) {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const iconSize = typeof size === "number" ? size : sizeMap[size];

  return (
    <LucideIconComponent
      size={iconSize}
      className={clsx(styles.icon, className)}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
}
