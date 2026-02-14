"use client";

import { Button } from "@/components/atoms/Button";
import logger from "@/lib/logger";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import styles from "../shared-error.module.css";

interface AuthErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  const t = useTranslations("errors.auth");
  const tButtons = useTranslations("common.buttons");

  useEffect(() => {
    logger.error(
      {
        route: "/auth",
        error,
      },
      "Auth route error",
    );
  }, [error]);

  return (
    <section className={styles.error} role="alert">
      <div className={styles.content}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.message}>{t("message")}</p>
        <div className={styles.actions}>
          <Button onClick={reset}>{tButtons("tryAgain")}</Button>
        </div>
      </div>
    </section>
  );
}
