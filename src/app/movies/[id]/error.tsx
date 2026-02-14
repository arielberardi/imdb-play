"use client";

import { Button } from "@/components/atoms/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./error.module.css";

interface MovieDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MovieDetailError({ reset }: MovieDetailErrorProps) {
  const t = useTranslations("errors.movieDetails");
  const tButtons = useTranslations("common.buttons");

  return (
    <main className={styles.error}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.message}>{t("message")}</p>

        <div className={styles.actions}>
          <Button onClick={reset}>{tButtons("tryAgain")}</Button>
          <Link href="/films">
            <Button variant="secondary">{t("backToMovies")}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
