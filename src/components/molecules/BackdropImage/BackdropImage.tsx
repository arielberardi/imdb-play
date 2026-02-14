"use client";

import Image from "next/image";
import styles from "./BackdropImage.module.css";

interface BackdropImageProps {
  backdropPath: string | null;
  title: string;
}

export function BackdropImage({ backdropPath, title }: BackdropImageProps) {
  const imageUrl = backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : "";

  if (!imageUrl) {
    return <div className={styles.backdropPlaceholder} />;
  }

  return (
    <div className={styles.backdrop}>
      <Image
        src={imageUrl}
        alt={`${title} backdrop`}
        fill
        priority
        className={styles.image}
        sizes="100vw"
        quality={90}
      />
      <div className={styles.gradient} />
    </div>
  );
}
