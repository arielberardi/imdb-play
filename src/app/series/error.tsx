"use client";

import { Button } from "@/components/atoms/Button";
import logger from "@/lib/logger";
import { useEffect } from "react";
import styles from "../shared-error.module.css";

interface SeriesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SeriesError({ error, reset }: SeriesErrorProps) {
  useEffect(() => {
    logger.error(
      {
        route: "/series",
        error,
      },
      "Series route error",
    );
  }, [error]);

  return (
    <section className={styles.error} role="alert">
      <div className={styles.content}>
        <h1 className={styles.title}>Series Unavailable</h1>
        <p className={styles.message}>
          We couldn&apos;t load this series catalog right now. Please try again.
        </p>
        <div className={styles.actions}>
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </section>
  );
}
