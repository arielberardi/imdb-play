"use client";

import { Button } from "@/components/atoms/Button";
import TrailerModal from "@/components/organisms/TrailerModal";
import { Trailer } from "@/lib/imdb";
import { useState } from "react";
import styles from "./ActionButtons.module.css";

interface ActionButtonsProps {
  trailers: Trailer[];
}

export function ActionButtons({ trailers }: ActionButtonsProps) {
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);

  const hasTrailers = trailers && trailers.length > 0;

  return (
    <div className={styles.actionButtons}>
      <Button
        onClick={() => setIsTrailerModalOpen(true)}
        disabled={!hasTrailers}
        className={styles.playButton}
      >
        {hasTrailers ? "▶ Play Trailer" : "No Trailer Available"}
      </Button>

      {/* Placeholder buttons for Phase 9 */}
      <button
        className={styles.iconButton}
        title="Add to Favorites"
        disabled
        aria-label="Add to favorites"
      >
        ♥
      </button>

      <button
        className={styles.iconButton}
        title="Add to Watchlist"
        disabled
        aria-label="Add to watchlist"
      >
        +
      </button>

      {hasTrailers && (
        <TrailerModal
          isOpen={isTrailerModalOpen}
          onClose={() => setIsTrailerModalOpen(false)}
          trailers={trailers}
        />
      )}
    </div>
  );
}
