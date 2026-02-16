import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import styles from "../info-page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("infoPages.privacy.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("infoPages.privacy");

  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <header className={styles.section}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>
        </header>

        <section className={styles.section} aria-labelledby="privacy-data">
          <h2 id="privacy-data" className={styles.heading}>
            {t("data.heading")}
          </h2>
          <ul className={styles.list}>
            <li>{t("data.itemOne")}</li>
            <li>{t("data.itemTwo")}</li>
            <li>{t("data.itemThree")}</li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="privacy-use">
          <h2 id="privacy-use" className={styles.heading}>
            {t("usage.heading")}
          </h2>
          <p className={styles.text}>{t("usage.body")}</p>
        </section>

        <section className={styles.section} aria-labelledby="privacy-contact">
          <h2 id="privacy-contact" className={styles.heading}>
            {t("contact.heading")}
          </h2>
          <p className={styles.text}>
            {t("contact.prefix")}{" "}
            <a className={styles.link} href="mailto:privacy@imdbplay.example">
              {t("contact.email")}
            </a>
            {t("contact.suffix")}
          </p>
        </section>

        <p className={styles.muted}>{t("lastRevised")}</p>
      </article>
    </main>
  );
}
