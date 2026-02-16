import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import styles from "../info-page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("infoPages.contact.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("infoPages.contact");

  return (
    <main className={styles.page}>
      <article className={styles.content}>
        <header className={styles.section}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>
        </header>

        <section className={styles.section} aria-labelledby="contact-support">
          <h2 id="contact-support" className={styles.heading}>
            {t("support.heading")}
          </h2>
          <ul className={styles.list}>
            <li>
              {t("support.generalLabel")}{" "}
              <a className={styles.link} href="mailto:support@imdbplay.example">
                {t("support.generalEmail")}
              </a>
            </li>
            <li>
              {t("support.pressLabel")}{" "}
              <a className={styles.link} href="mailto:press@imdbplay.example">
                {t("support.pressEmail")}
              </a>
            </li>
            <li>
              {t("support.phoneLabel")}{" "}
              <a className={styles.link} href="tel:+18005550199">
                {t("support.phoneNumber")}
              </a>
            </li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="contact-office">
          <h2 id="contact-office" className={styles.heading}>
            {t("office.heading")}
          </h2>
          <p className={styles.text}>
            {t("office.lineOne")}
            <br />
            {t("office.lineTwo")}
            <br />
            {t("office.lineThree")}
          </p>
        </section>

        <p className={styles.muted}>{t("responseTime")}</p>
      </article>
    </main>
  );
}
