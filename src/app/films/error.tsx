"use client";

import { Button } from "@/components/atoms/Button";
import styles from "../shared-error.module.css";

interface FilmsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FilmsError({ error, reset }: FilmsErrorProps) {
  console.error("Films route error:", error);

  return (
    <section className={styles.error} role="alert">
      <div className={styles.content}>
        <h1 className={styles.title}>Movies Unavailable</h1>
        <p className={styles.message}>
          We couldn&apos;t load this movie catalog right now. Please try again.
        </p>
        <div className={styles.actions}>
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </section>
  );
}
