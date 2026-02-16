import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import styles from "../info-page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("infoPages.terms.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TermsPage() {
  const t = await getTranslations("infoPages.terms");

  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <header className={styles.section}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>
        </header>

        <section className={styles.section} aria-labelledby="terms-account">
          <h2 id="terms-account" className={styles.heading}>
            {t("account.heading")}
          </h2>
          <p className={styles.text}>{t("account.body")}</p>
        </section>

        <section className={styles.section} aria-labelledby="terms-acceptable-use">
          <h2 id="terms-acceptable-use" className={styles.heading}>
            {t("acceptableUse.heading")}
          </h2>
          <ul className={styles.list}>
            <li>{t("acceptableUse.itemOne")}</li>
            <li>{t("acceptableUse.itemTwo")}</li>
            <li>{t("acceptableUse.itemThree")}</li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="terms-changes">
          <h2 id="terms-changes" className={styles.heading}>
            {t("changes.heading")}
          </h2>
          <p className={styles.text}>{t("changes.body")}</p>
        </section>

        <p className={styles.muted}>{t("effectiveDate")}</p>
      </article>
    </main>
  );
}
