"use client";

import { Button } from "@/components/atoms/Button";
import styles from "../shared-error.module.css";

interface SearchErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SearchError({ error, reset }: SearchErrorProps) {
  console.error("Search route error:", error);

  return (
    <section className={styles.error} role="alert">
      <div className={styles.content}>
        <h1 className={styles.title}>Search Unavailable</h1>
        <p className={styles.message}>
          Search is temporarily unavailable. Please retry in a moment.
        </p>
        <div className={styles.actions}>
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </section>
  );
}
