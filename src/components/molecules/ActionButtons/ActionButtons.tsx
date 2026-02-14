"use client";

import { Button } from "@/components/atoms/Button";
import TrailerModal from "@/components/organisms/TrailerModal";
import { addFavoriteAction, removeFavoriteAction } from "@/features/favorites/server-actions";
import {
  addToWatchlistAction,
  removeFromWatchlistAction,
} from "@/features/watchlist/server-actions";
import { MediaType } from "@/generated/prisma";
import { Trailer } from "@/lib/imdb";
import { Check, Heart, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useOptimistic, useState, useTransition } from "react";
import styles from "./ActionButtons.module.css";

interface ActionButtonsProps {
  trailers: Trailer[];
  imdbId: string;
  mediaType: "movie" | "series";
  initialIsFavorite?: boolean;
  initialIsInWatchlist?: boolean;
}

function toPrismaMediaType(mediaType: "movie" | "series"): MediaType {
  return mediaType === "movie" ? MediaType.MOVIE : MediaType.SERIES;
}

export function ActionButtons({
  trailers,
  imdbId,
  mediaType,
  initialIsFavorite = false,
  initialIsInWatchlist = false,
}: ActionButtonsProps) {
  const t = useTranslations("assetDetails.actions");
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [favoriteState, setFavoriteState] = useOptimistic(initialIsFavorite);
  const [watchlistState, setWatchlistState] = useOptimistic(initialIsInWatchlist);

  const hasTrailers = trailers.length > 0;

  const onToggleFavorite = () => {
    startTransition(async () => {
      const nextFavoriteState = !favoriteState;
      setFavoriteState(nextFavoriteState);

      const result = nextFavoriteState
        ? await addFavoriteAction({
            imdbId,
            mediaType: toPrismaMediaType(mediaType),
          })
        : await removeFavoriteAction(imdbId);

      if (!result.success) {
        setFavoriteState(!nextFavoriteState);
      }
    });
  };

  const onToggleWatchlist = () => {
    startTransition(async () => {
      const nextWatchlistState = !watchlistState;
      setWatchlistState(nextWatchlistState);

      const result = nextWatchlistState
        ? await addToWatchlistAction({
            imdbId,
            mediaType: toPrismaMediaType(mediaType),
          })
        : await removeFromWatchlistAction(imdbId);

      if (!result.success) {
        setWatchlistState(!nextWatchlistState);
      }
    });
  };

  return (
    <div className={styles.actionButtons}>
      <Button
        onClick={() => setIsTrailerModalOpen(true)}
        disabled={!hasTrailers}
        className={styles.playButton}
      >
        {hasTrailers ? t("playTrailer") : t("noTrailer")}
      </Button>

      <button
        type="button"
        className={`${styles.iconButton} ${favoriteState ? styles.activeFavorite : ""}`}
        title={favoriteState ? t("removeFavoritesTitle") : t("addFavoritesTitle")}
        onClick={onToggleFavorite}
        disabled={isPending}
        aria-label={favoriteState ? t("removeFavoritesAria") : t("addFavoritesAria")}
      >
        <Heart size={20} fill={favoriteState ? "currentColor" : "none"} />
      </button>

      <button
        type="button"
        className={`${styles.iconButton} ${watchlistState ? styles.activeWatchlist : ""}`}
        title={watchlistState ? t("removeWatchlistTitle") : t("addWatchlistTitle")}
        onClick={onToggleWatchlist}
        disabled={isPending}
        aria-label={watchlistState ? t("removeWatchlistAria") : t("addWatchlistAria")}
      >
        {watchlistState ? <Check size={20} /> : <Plus size={20} />}
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
