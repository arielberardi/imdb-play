import { getTranslations } from "next-intl/server";
import Link from "next/link";
import styles from "./not-found.module.css";

export default async function NotFound() {
  const t = await getTranslations("notFound.global");

  return (
    <section className={styles.notFound}>
      <div className={styles.notFound__content}>
        <h1 className={styles.notFound__title}>{t("title")}</h1>
        <h2 className={styles.notFound__subtitle}>{t("subtitle")}</h2>
        <p className={styles.notFound__message}>{t("message")}</p>
        <Link href="/" className={styles.notFound__link}>
          {t("goHome")}
        </Link>
      </div>
    </section>
  );
}
