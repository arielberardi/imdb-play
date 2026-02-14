import { Skeleton } from "@/components/atoms/Skeleton";
import AssetDetailsHero from "@/components/organisms/AssetDetailsHero";
import CastList from "@/components/organisms/CastList";
import EpisodeSelector from "@/components/organisms/EpisodeSelector";
import { getTitleDetails, MediaType } from "@/lib/imdb";
import { isImdbNotFoundError, toUserSafeError } from "@/lib/imdb/error-handling";
import logger from "@/lib/logger";
import { getUserTitleState } from "@/lib/personalized-content/user-state";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import styles from "./page.module.css";

interface SeriesDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SeriesDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const details = await getTitleDetails(id, MediaType.SERIES);
    const year = details.releaseDate ? new Date(details.releaseDate).getFullYear() : "";
    const backdropUrl = details.backdropPath
      ? `https://image.tmdb.org/t/p/original${details.backdropPath}`
      : "";

    return {
      title: `${details.title}${year ? ` (${year})` : ""} - IMDb Play`,
      description: details.overview || `Watch ${details.title} on IMDb Play`,
      openGraph: {
        title: details.title,
        description: details.overview || "",
        images: backdropUrl ? [backdropUrl] : [],
      },
    };
  } catch (error) {
    if (isImdbNotFoundError(error)) {
      return {
        title: "Series Not Found - IMDb Play",
      };
    }

    return {
      title: "Series Temporarily Unavailable - IMDb Play",
    };
  }
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { id } = await params;
  let details;

  try {
    details = await getTitleDetails(id, MediaType.SERIES);
  } catch (error) {
    if (isImdbNotFoundError(error)) {
      notFound();
    }

    logger.error(
      {
        route: "/series/[id]",
        imdbId: id,
        mediaType: MediaType.SERIES,
        error,
      },
      "Failed to load series details",
    );
    throw toUserSafeError(error);
  }

  const userState = await getUserTitleState(id);

  return (
    <main>
      <AssetDetailsHero details={details} mediaType="series" userState={userState} />

      {details.seasons && details.seasons.length > 0 && (
        <Suspense fallback={<EpisodeSelectorSkeleton />}>
          <EpisodeSelector tvId={id} seasons={details.seasons} />
        </Suspense>
      )}

      {details.credits.cast.length > 0 && (
        <Suspense fallback={<CastListSkeleton />}>
          <CastList cast={details.credits.cast.slice(0, 20)} />
        </Suspense>
      )}
    </main>
  );
}

function CastListSkeleton() {
  return (
    <div className={styles.castSkeleton}>
      <Skeleton width="150px" height="24px" className={styles.castSkeletonTitle} />
      <div className={styles.castSkeletonList}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className={styles.castSkeletonItem}>
            <Skeleton width="150px" height="150px" variant="circular" />
            <Skeleton width="120px" height="16px" />
            <Skeleton width="100px" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EpisodeSelectorSkeleton() {
  return (
    <div className={styles.episodeSkeleton}>
      <Skeleton width="150px" height="24px" className={styles.episodeSkeletonTitle} />
      <div className={styles.episodeSkeletonTabs}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} width="100px" height="40px" />
        ))}
      </div>
      <div className={styles.episodeSkeletonGrid}>
        {[...Array(10)].map((_, i) => (
          <div key={i}>
            <Skeleton width="100%" height="180px" className={styles.episodeSkeletonCardImage} />
            <Skeleton width="60%" height="20px" className={styles.episodeSkeletonCardTitle} />
            <Skeleton width="100%" height="16px" />
          </div>
        ))}
      </div>
    </div>
  );
}
