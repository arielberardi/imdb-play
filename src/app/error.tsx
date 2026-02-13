"use client";

import { Button } from "@/components/atoms/Button";
import { useEffect } from "react";
import styles from "./error.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <section role="alert" className={styles.error}>
      <div className={styles.error__content}>
        <h1 className={styles.error__title}>Something went wrong</h1>
        <p className={styles.error__message}>
          We encountered an unexpected error. Please try again.
        </p>
        {error.digest && <p className={styles.error__digest}>Error ID: {error.digest}</p>}
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
      </div>
    </section>
  );
}
