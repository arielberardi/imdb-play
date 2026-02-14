import { Button } from "@/components/atoms/Button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import styles from "./not-found.module.css";

export default async function MovieNotFound() {
  const t = await getTranslations("notFound.movieDetails");
  const tButtons = await getTranslations("common.buttons");

  return (
    <main className={styles.notFound}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.message}>{t("message")}</p>

        <div className={styles.actions}>
          <Link href="/films">
            <Button>{t("browseMovies")}</Button>
          </Link>
          <Link href="/search">
            <Button variant="secondary">{tButtons("search")}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
