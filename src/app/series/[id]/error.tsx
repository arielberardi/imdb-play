"use client";

import { Button } from "@/components/atoms/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./error.module.css";

interface SeriesDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SeriesDetailError({ reset }: SeriesDetailErrorProps) {
  const t = useTranslations("errors.seriesDetails");
  const tButtons = useTranslations("common.buttons");

  return (
    <main className={styles.error}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.message}>{t("message")}</p>

        <div className={styles.actions}>
          <Button onClick={reset}>{tButtons("tryAgain")}</Button>
          <Link href="/series">
            <Button variant="secondary">{t("backToSeries")}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
