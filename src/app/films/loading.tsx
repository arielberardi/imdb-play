import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import styles from "./films.module.css";

export default function FilmsLoading() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Skeleton width="150px" height="48px" />
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} width="80px" height="36px" variant="rounded" />
          ))}
        </div>
      </div>
      <div className={styles.skeleton}>
        <Skeleton width="200px" height="24px" />
        <div className={styles.cardGrid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} width="200px" height="300px" />
          ))}
        </div>
      </div>
    </main>
  );
}
