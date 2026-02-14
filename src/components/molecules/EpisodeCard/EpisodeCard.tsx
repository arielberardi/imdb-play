"use client";

import { Episode } from "@/lib/imdb";
import Image from "next/image";
import { useState } from "react";
import styles from "./EpisodeCard.module.css";

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const stillUrl = episode.stillPath ? `https://image.tmdb.org/t/p/w300${episode.stillPath}` : null;

  const episodeNumber = `E${episode.episodeNumber.toString().padStart(2, "0")}`;

  return (
    <div className={styles.episodeCard}>
      <div className={styles.still}>
        {stillUrl && !hasImageError ? (
          <Image
            src={stillUrl}
            alt={episode.name}
            width={300}
            height={169}
            className={styles.image}
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.episodeNumber}>{episodeNumber}</span>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.header}>
          <span className={styles.episodeNumber}>{episodeNumber}</span>
          {episode.runtime && <span className={styles.runtime}>{episode.runtime}m</span>}
        </div>

        <h3 className={styles.title}>{episode.name}</h3>

        {episode.overview && <p className={styles.overview}>{episode.overview}</p>}
      </div>
    </div>
  );
}
