"use client";

import { Button } from "@/components/atoms/Button";
import logger from "@/lib/logger";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import styles from "./error.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations("errors.global");
  const tButtons = useTranslations("common.buttons");

  useEffect(() => {
    logger.error(
      {
        route: "/",
        error,
      },
      "Route error",
    );
  }, [error]);

  return (
    <section role="alert" className={styles.error}>
      <div className={styles.error__content}>
        <h1 className={styles.error__title}>{t("title")}</h1>
        <p className={styles.error__message}>{t("message")}</p>
        {error.digest && (
          <p className={styles.error__digest}>{t("errorId", { digest: error.digest })}</p>
        )}
        <Button variant="primary" onClick={reset}>
          {tButtons("tryAgain")}
        </Button>
      </div>
    </section>
  );
}
