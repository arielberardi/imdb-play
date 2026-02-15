import { Skeleton } from "@/components/atoms/Skeleton";
import styles from "./loading.module.css";

export default function MovieDetailLoading() {
  return (
    <main className={styles.loading}>
      {/* Hero Section Skeleton */}
      <div className={styles.hero}>
        <div className={styles.backdrop}>
          <Skeleton width="100%" height="100%" />
        </div>

        <div className={styles.content}>
          <div className={styles.poster}>
            <Skeleton width="300px" height="450px" />
          </div>

          <div className={styles.metadata}>
            {/* Title */}
            <Skeleton width="400px" height="48px" className={styles.spaceMd} />

            {/* Rating and Year */}
            <div className={styles.inlineRowLg}>
              <Skeleton width="80px" height="32px" />
              <Skeleton width="60px" height="32px" />
            </div>

            {/* Genres */}
            <div className={styles.inlineRowSm}>
              <Skeleton width="80px" height="28px" />
              <Skeleton width="100px" height="28px" />
              <Skeleton width="90px" height="28px" />
            </div>

            {/* Description */}
            <div className={styles.spaceXl}>
              <Skeleton width="100%" height="20px" className={styles.spaceSm} />
              <Skeleton width="100%" height="20px" className={styles.spaceSm} />
              <Skeleton width="100%" height="20px" className={styles.spaceSm} />
              <Skeleton width="80%" height="20px" />
            </div>

            {/* Action Buttons */}
            <div className={styles.inlineRowMd}>
              <Skeleton width="140px" height="48px" />
              <Skeleton width="48px" height="48px" variant="circular" />
              <Skeleton width="48px" height="48px" variant="circular" />
            </div>
          </div>
        </div>
      </div>

      {/* Cast List Skeleton */}
      <div className={styles.sectionPad}>
        <Skeleton width="150px" height="24px" className={styles.spaceLg} />
        <div className={styles.inlineList}>
          {[...Array(10)].map((_, i) => (
            <div key={i} className={styles.inlineListItem}>
              <Skeleton width="150px" height="150px" variant="circular" />
              <Skeleton width="120px" height="16px" />
              <Skeleton width="100px" height="14px" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
