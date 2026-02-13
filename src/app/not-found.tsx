import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.notFound}>
      <div className={styles.notFound__content}>
        <h1 className={styles.notFound__title}>404</h1>
        <h2 className={styles.notFound__subtitle}>Page Not Found</h2>
        <p className={styles.notFound__message}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className={styles.notFound__link}>
          Go Home
        </Link>
      </div>
    </section>
  );
}
