import styles from "./RatingBadge.module.css";

interface RatingBadgeProps {
  rating: number;
  maxRating?: number;
  showMaxRating?: boolean;
  className?: string;
}

export function RatingBadge({
  rating,
  maxRating = 10,
  showMaxRating = true,
  className,
}: RatingBadgeProps) {
  const formattedRating = rating.toFixed(1);

  return (
    <div className={`${styles.ratingBadge} ${className || ""}`}>
      <span className={styles.star}>★</span>
      <span className={styles.rating}>
        {formattedRating}
        {showMaxRating && <span className={styles.maxRating}>/{maxRating}</span>}
      </span>
    </div>
  );
}
