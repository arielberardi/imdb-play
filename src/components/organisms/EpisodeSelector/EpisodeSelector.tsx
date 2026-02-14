"use client";

import { Skeleton } from "@/components/atoms/Skeleton";
import { EpisodeGrid } from "@/components/molecules/EpisodeGrid";
import { SeasonTabs } from "@/components/molecules/SeasonTabs";
import { getEpisodes } from "@/lib/imdb/queries";
import type { Episode, Season } from "@/lib/imdb/types";
import logger from "@/lib/logger";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styles from "./EpisodeSelector.module.css";

interface EpisodeSelectorProps {
  tvId: string;
  seasons: Season[];
}

export default function EpisodeSelector({ tvId, seasons }: EpisodeSelectorProps) {
  const t = useTranslations("assetDetails.episodes");

  // Filter out "Specials" (season 0) and sort by season number
  const validSeasons = seasons
    .filter((season) => season.seasonNumber > 0)
    .sort((a, b) => a.seasonNumber - b.seasonNumber);

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(
    validSeasons[0]?.seasonNumber || 1,
  );
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const episodesData = await getEpisodes(tvId, selectedSeasonNumber);
        setEpisodes(episodesData);
      } catch (err) {
        logger.error(
          {
            component: "EpisodeSelector",
            tvId,
            seasonNumber: selectedSeasonNumber,
            error: err,
          },
          "Failed to fetch episodes",
        );
        setError(t("loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodes();
  }, [tvId, selectedSeasonNumber, t]);

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeasonNumber(seasonNumber);
  };

  if (validSeasons.length === 0) {
    return (
      <div className={styles.noEpisodes}>
        <p>{t("unavailable")}</p>
      </div>
    );
  }

  return (
    <section className={styles.episodeSelector}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("title")}</h2>

        <SeasonTabs
          seasons={validSeasons}
          selectedSeasonNumber={selectedSeasonNumber}
          onSeasonChange={handleSeasonChange}
        />

        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.episodeGrid}>
              {[...Array(10)].map((_, i) => (
                <div key={i} className={styles.episodeSkeleton}>
                  <Skeleton
                    width="100%"
                    height="180px"
                    style={{ marginBottom: "var(--spacing-sm)" }}
                  />
                  <Skeleton
                    width="60%"
                    height="20px"
                    style={{ marginBottom: "var(--spacing-xs)" }}
                  />
                  <Skeleton
                    width="100%"
                    height="16px"
                    style={{ marginBottom: "var(--spacing-xs)" }}
                  />
                  <Skeleton width="100%" height="16px" />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && <EpisodeGrid episodes={episodes} />}
      </div>
    </section>
  );
}
