"use client";

import { Season } from "@/lib/imdb";
import styles from "./SeasonTabs.module.css";

interface SeasonTabsProps {
  seasons: Season[];
  selectedSeasonNumber: number;
  onSeasonChange: (seasonNumber: number) => void;
}

export function SeasonTabs({ seasons, selectedSeasonNumber, onSeasonChange }: SeasonTabsProps) {
  return (
    <div className={styles.seasonTabs}>
      <div className={styles.tabsContainer}>
        {seasons.map((season) => (
          <button
            key={season.seasonNumber}
            className={`${styles.tab} ${
              selectedSeasonNumber === season.seasonNumber ? styles.active : ""
            }`}
            onClick={() => onSeasonChange(season.seasonNumber)}
            aria-selected={selectedSeasonNumber === season.seasonNumber}
            role="tab"
          >
            {season.name}
          </button>
        ))}
      </div>
    </div>
  );
}
