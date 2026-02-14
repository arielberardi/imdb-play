import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  const t = useTranslations("layout.footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className={styles.footer}>
      <div className={styles.footer__container}>
        <nav className={styles.footer__links} aria-label={t("navAriaLabel")}>
          <Link href="/about" className={styles.footer__link}>
            {t("about")}
          </Link>
          <Link href="/terms" className={styles.footer__link}>
            {t("terms")}
          </Link>
          <Link href="/privacy" className={styles.footer__link}>
            {t("privacy")}
          </Link>
          <Link href="/contact" className={styles.footer__link}>
            {t("contact")}
          </Link>
        </nav>
        <p className={styles.footer__copyright}>{t("copyright", { year: currentYear })}</p>
      </div>
    </footer>
  );
}
