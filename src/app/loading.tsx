import { Skeleton } from "@/components/atoms/Skeleton";
import { getTranslations } from "next-intl/server";
import styles from "./loading.module.css";

export default async function Loading() {
  const t = await getTranslations("common");

  return (
    <div className={styles.loading} aria-busy="true" aria-label={t("loading")}>
      {/* Hero skeleton */}
      <div className={styles.loading__hero}>
        <Skeleton variant="rectangular" height={500} />
      </div>

      {/* Rails skeleton */}
      <div className={styles.loading__rails}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.loading__rail}>
            <Skeleton variant="text" width={200} height={24} />
            <div className={styles.loading__cards}>
              {Array.from({ length: 6 }).map((_, j) => (
                <Skeleton key={j} variant="rounded" width={200} height={300} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
