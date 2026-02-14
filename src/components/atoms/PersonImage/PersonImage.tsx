"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./PersonImage.module.css";

interface PersonImageProps {
  profilePath: string | null;
  name: string;
  size?: number;
}

export function PersonImage({ profilePath, name, size = 150 }: PersonImageProps) {
  const [hasError, setHasError] = useState(false);

  const imageUrl = profilePath ? `https://image.tmdb.org/t/p/w185${profilePath}` : null;

  if (!imageUrl || hasError) {
    // Fallback: Show initials
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className={styles.placeholder} style={{ width: size, height: size }}>
        <span className={styles.initials}>{initials}</span>
      </div>
    );
  }

  return (
    <div className={styles.imageContainer} style={{ width: size, height: size }}>
      <Image
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        sizes={`${size}px`}
        quality={75}
        className={styles.image}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
