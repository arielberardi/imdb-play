"use client";

import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import styles from "./error.module.css";

interface MovieDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MovieDetailError({ reset }: MovieDetailErrorProps) {
  return (
    <main className={styles.error}>
      <div className={styles.content}>
        <h1 className={styles.title}>Something Went Wrong</h1>
        <p className={styles.message}>
          We couldn&apos;t load this movie&apos;s details. Please try again.
        </p>

        <div className={styles.actions}>
          <Button onClick={reset}>Try Again</Button>
          <Link href="/films">
            <Button variant="secondary">Back to Movies</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
