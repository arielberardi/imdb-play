import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function MovieNotFound() {
  return (
    <main className={styles.notFound}>
      <div className={styles.content}>
        <h1 className={styles.title}>Movie Not Found</h1>
        <p className={styles.message}>
          The movie you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>

        <div className={styles.actions}>
          <Link href="/films">
            <Button>Browse Movies</Button>
          </Link>
          <Link href="/search">
            <Button variant="secondary">Search</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
