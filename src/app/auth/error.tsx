"use client";

import { Button } from "@/components/atoms/Button";
import styles from "../shared-error.module.css";

interface AuthErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  console.error("Auth route error:", error);

  return (
    <section className={styles.error} role="alert">
      <div className={styles.content}>
        <h1 className={styles.title}>Authentication Unavailable</h1>
        <p className={styles.message}>
          We couldn&apos;t complete this authentication step. Please try again.
        </p>
        <div className={styles.actions}>
          <Button onClick={reset}>Try Again</Button>
        </div>
      </div>
    </section>
  );
}
