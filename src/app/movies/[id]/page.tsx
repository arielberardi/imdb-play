import { Skeleton } from "@/components/atoms/Skeleton";
import AssetDetailsHero from "@/components/organisms/AssetDetailsHero";
import CastList from "@/components/organisms/CastList";
import { getTitleDetails, MediaType } from "@/lib/imdb";
import { isImdbNotFoundError, toUserSafeError } from "@/lib/imdb/error-handling";
import logger from "@/lib/logger";
import { getUserTitleState } from "@/lib/personalized-content/user-state";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import styles from "./page.module.css";

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const t = await getTranslations("metadata.movieDetails");
  const { id } = await params;

  try {
    const details = await getTitleDetails(id, MediaType.MOVIE);
    const year = details.releaseDate ? new Date(details.releaseDate).getFullYear() : "";
    const backdropUrl = details.backdropPath
      ? `https://image.tmdb.org/t/p/original${details.backdropPath}`
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
    if (isImdbNotFoundError(error)) {
      return {
        title: t("notFound"),
      };
    }

    return {
      title: t("unavailable"),
    };
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  let details;

  try {
    details = await getTitleDetails(id, MediaType.MOVIE);
  } catch (error) {
    if (isImdbNotFoundError(error)) {
      notFound();
    }

    logger.error(
      {
        route: "/movies/[id]",
        imdbId: id,
        mediaType: MediaType.MOVIE,
        error,
      },
      "Failed to load movie details",
    );
    throw toUserSafeError(error);
  }

  const userState = await getUserTitleState(id);

  return (
    <main>
      <AssetDetailsHero details={details} mediaType="movie" userState={userState} />

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
