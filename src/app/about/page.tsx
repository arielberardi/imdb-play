import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import styles from "../info-page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("infoPages.about.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("infoPages.about");

  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <header className={styles.section}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>
        </header>

        <section className={styles.section} aria-labelledby="about-mission">
          <h2 id="about-mission" className={styles.heading}>
            {t("mission.heading")}
          </h2>
          <p className={styles.text}>{t("mission.body")}</p>
        </section>

        <section className={styles.section} aria-labelledby="about-values">
          <h2 id="about-values" className={styles.heading}>
            {t("values.heading")}
          </h2>
          <ul className={styles.list}>
            <li>{t("values.itemOne")}</li>
            <li>{t("values.itemTwo")}</li>
            <li>{t("values.itemThree")}</li>
          </ul>
        </section>

        <p className={styles.muted}>{t("lastUpdated")}</p>
      </article>
    </main>
  );
}
