"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./FilterChips.module.css";

interface FilterChipsProps {
  genres: ReadonlyArray<{ id: number; name: string }>;
  basePath: "/films" | "/series";
}

export function FilterChips({ genres, basePath }: FilterChipsProps) {
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get("genre");

  return (
    <div className={styles.container}>
      <Link href={basePath} className={`${styles.chip} ${!selectedGenre ? styles.active : ""}`}>
        All
      </Link>
      {genres.map((genre) => {
        const isActive = selectedGenre === genre.name;
        return (
          <Link
            key={genre.id}
            href={`${basePath}?genre=${encodeURIComponent(genre.name)}`}
            className={`${styles.chip} ${isActive ? styles.active : ""}`}
          >
            {genre.name}
          </Link>
        );
      })}
    </div>
  );
}
