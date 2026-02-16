import { Skeleton } from "@/components/atoms/Skeleton";
import AssetDetailsHero from "@/components/organisms/AssetDetailsHero";
import CastList from "@/components/organisms/CastList";
import EpisodeSelector from "@/components/organisms/EpisodeSelector";
import { getOptionalUser } from "@/features/auth";
import { getTitleDetailsAction } from "@/features/catalog";
import { MediaType } from "@/generated/prisma";
import logger from "@/lib/logger";
import { getUserTitleState } from "@/lib/personalized-content/user-state";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import styles from "./page.module.css";

interface SeriesDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SeriesDetailPageProps): Promise<Metadata> {
  const t = await getTranslations("metadata.seriesDetails");
  const { id } = await params;

  try {
    const details = await getTitleDetailsAction(id);
    if (!details || details.mediaType !== MediaType.SERIES) {
      return {
        title: t("notFound"),
      };
    }
    const year = details.releaseDate ? new Date(details.releaseDate).getFullYear() : "";
    const backdropUrl = details.backdropPath
      ? details.backdropPath.startsWith("http")
        ? details.backdropPath
        : `https://image.tmdb.org/t/p/original${details.backdropPath}`
      : "";

    return {
      title: `${details.title}${year ? ` (${year})` : ""}${t("titleSuffix")}`,
      description: details.overview || t("watchOnApp", { title: details.title }),
      openGraph: {
        title: details.title,
        description: details.overview || "",
        images: backdropUrl ? [backdropUrl] : [],
      },
    };
  } catch (error) {
    logger.error({ route: "/series/[id]", titleId: id, error }, "Failed to load series metadata");
    return {
      title: t("unavailable"),
    };
  }
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { id } = await params;
  let details;

  try {
    details = await getTitleDetailsAction(id);
    if (!details || details.mediaType !== MediaType.SERIES) {
      notFound();
    }
  } catch (error) {
    logger.error(
      {
        route: "/series/[id]",
        titleId: id,
        mediaType: MediaType.SERIES,
        error,
      },
      "Failed to load series details",
    );
    throw new Error("Failed to load series details");
  }

  const user = await getOptionalUser();
  const userState = await getUserTitleState(id, user?.id);

  return (
    <main>
      <AssetDetailsHero
        details={details}
        mediaType="series"
        userState={userState}
        isAuthenticated={Boolean(user)}
      />

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
