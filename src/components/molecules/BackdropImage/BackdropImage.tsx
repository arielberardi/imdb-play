"use client";

import { useTranslations } from "next-intl";
import styles from "./BackdropImage.module.css";

interface BackdropImageProps {
  backdropPath: string | null;
  title: string;
}

export function BackdropImage({ backdropPath, title }: BackdropImageProps) {
  const t = useTranslations("assetDetails");
  const imageUrl = backdropPath
    ? backdropPath.startsWith("http")
      ? backdropPath
      : `https://image.tmdb.org/t/p/original${backdropPath}`
    : "";

  if (!imageUrl) {
    return <div className={styles.backdropPlaceholder} />;
  }

  return (
    <div className={styles.backdrop}>
      <img
        src={imageUrl}
        alt={t("backdropAlt", { title })}
        className={styles.image}
        sizes="100vw"
      />
      <div className={styles.gradient} />
    </div>
  );
}
