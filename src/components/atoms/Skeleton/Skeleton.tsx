import { clsx } from "clsx";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ variant = "rectangular", width, height, className }: SkeletonProps) {
  const style: React.CSSProperties = {};

  if (width !== undefined) {
    style.width = typeof width === "number" ? `${width}px` : width;
  }
  if (height !== undefined) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }

  return (
    <div
      className={clsx(styles.skeleton, styles[`skeleton--${variant}`], className)}
      style={style}
      aria-busy="true"
      aria-label="Loading"
    />
  );
}
