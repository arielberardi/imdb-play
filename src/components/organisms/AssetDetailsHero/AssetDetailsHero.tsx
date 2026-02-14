import { ActionButtons } from "@/components/molecules/ActionButtons";
import { BackdropImage } from "@/components/molecules/BackdropImage";
import { TitleMetadata } from "@/components/molecules/TitleMetadata";
import { TitleDetails } from "@/lib/imdb";
import type { UserTitleState } from "@/lib/personalized-content/user-state";
import Image from "next/image";
import styles from "./AssetDetailsHero.module.css";

interface AssetDetailsHeroProps {
  details: TitleDetails;
  mediaType: "movie" | "series";
  userState?: UserTitleState;
}

export default function AssetDetailsHero({ details, mediaType, userState }: AssetDetailsHeroProps) {
  const posterUrl = details.posterPath
    ? `https://image.tmdb.org/t/p/w500${details.posterPath}`
    : "";

  return (
    <section className={styles.assetDetailsHero}>
      <BackdropImage backdropPath={details.backdropPath} title={details.title} />

      <div className={styles.content}>
        <div className={styles.poster}>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${details.title} poster`}
              width={300}
              height={450}
              priority
              className={styles.posterImage}
            />
          ) : (
            <div className={styles.posterPlaceholder}>
              <span>{details.title}</span>
            </div>
          )}
        </div>

        <div className={styles.metadata}>
          <TitleMetadata details={details} />
          <ActionButtons
            trailers={details.trailers || []}
            imdbId={details.id}
            mediaType={mediaType}
            initialIsFavorite={userState?.isFavorite ?? false}
            initialIsInWatchlist={userState?.isInWatchlist ?? false}
          />
        </div>
      </div>
    </section>
  );
}
