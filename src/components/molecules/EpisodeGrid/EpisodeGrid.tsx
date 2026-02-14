"use client";

import { EpisodeCard } from "@/components/molecules/EpisodeCard";
import { Episode } from "@/lib/imdb";
import styles from "./EpisodeGrid.module.css";

interface EpisodeGridProps {
  episodes: Episode[];
}

export function EpisodeGrid({ episodes }: EpisodeGridProps) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No episodes available for this season.</p>
      </div>
    );
  }

  return (
    <div className={styles.episodeGrid}>
      {episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
    </div>
  );
}
