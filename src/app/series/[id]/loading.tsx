import { Skeleton } from "@/components/atoms/Skeleton";
import styles from "./loading.module.css";

export default function SeriesDetailLoading() {
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
            <Skeleton width="400px" height="48px" style={{ marginBottom: "var(--spacing-md)" }} />

            {/* Rating and Year */}
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-md)",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              <Skeleton width="80px" height="32px" />
              <Skeleton width="60px" height="32px" />
            </div>

            {/* Genres */}
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-sm)",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              <Skeleton width="80px" height="28px" />
              <Skeleton width="100px" height="28px" />
              <Skeleton width="90px" height="28px" />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "var(--spacing-xl)" }}>
              <Skeleton width="100%" height="20px" style={{ marginBottom: "var(--spacing-sm)" }} />
              <Skeleton width="100%" height="20px" style={{ marginBottom: "var(--spacing-sm)" }} />
              <Skeleton width="100%" height="20px" style={{ marginBottom: "var(--spacing-sm)" }} />
              <Skeleton width="80%" height="20px" />
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
              <Skeleton width="140px" height="48px" />
              <Skeleton width="48px" height="48px" variant="circular" />
              <Skeleton width="48px" height="48px" variant="circular" />
            </div>
          </div>
        </div>
      </div>

      {/* Episode Selector Skeleton */}
      <div style={{ padding: "var(--spacing-2xl)" }}>
        <Skeleton width="150px" height="24px" style={{ marginBottom: "var(--spacing-lg)" }} />
        <div
          style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-xl)" }}
        >
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} width="100px" height="40px" />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--spacing-md)",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              <Skeleton width="100%" height="180px" style={{ marginBottom: "var(--spacing-sm)" }} />
              <Skeleton width="60%" height="20px" style={{ marginBottom: "var(--spacing-xs)" }} />
              <Skeleton width="100%" height="16px" />
            </div>
          ))}
        </div>
      </div>

      {/* Cast List Skeleton */}
      <div style={{ padding: "var(--spacing-2xl)" }}>
        <Skeleton width="150px" height="24px" style={{ marginBottom: "var(--spacing-lg)" }} />
        <div style={{ display: "flex", gap: "var(--spacing-md)", overflowX: "hidden" }}>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--spacing-sm)",
              }}
            >
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
