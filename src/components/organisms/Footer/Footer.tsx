import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className={styles.footer}>
      <div className={styles.footer__container}>
        <nav className={styles.footer__links} aria-label="Footer">
          <Link href="/about" className={styles.footer__link}>
            About
          </Link>
          <Link href="/terms" className={styles.footer__link}>
            Terms
          </Link>
          <Link href="/privacy" className={styles.footer__link}>
            Privacy
          </Link>
          <Link href="/contact" className={styles.footer__link}>
            Contact
          </Link>
        </nav>
        <p className={styles.footer__copyright}>
          &copy; {currentYear} IMDB Play. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
