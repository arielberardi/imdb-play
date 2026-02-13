import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import styles from "./SearchSkeleton.module.css";

export function SearchSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonHeader}>
        <Skeleton width="300px" height="32px" />
        <Skeleton width="150px" height="20px" />
      </div>
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} width="100%" height="300px" variant="rounded" />
        ))}
      </div>
    </div>
  );
}
