"use client";

import { EpisodeCard } from "@/components/molecules/EpisodeCard";
import { Episode } from "@/lib/imdb";
import { useTranslations } from "next-intl";
import styles from "./EpisodeGrid.module.css";

interface EpisodeGridProps {
  episodes: Episode[];
}

export function EpisodeGrid({ episodes }: EpisodeGridProps) {
  const t = useTranslations("assetDetails.episodes");

  if (!episodes || episodes.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t("emptySeason")}</p>
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
