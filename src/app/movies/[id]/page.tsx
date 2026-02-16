import { Skeleton } from "@/components/atoms/Skeleton";
import AssetDetailsHero from "@/components/organisms/AssetDetailsHero";
import CastList from "@/components/organisms/CastList";
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

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const t = await getTranslations("metadata.movieDetails");
  const { id } = await params;

  try {
    const details = await getTitleDetailsAction(id);
    if (!details || details.mediaType !== MediaType.MOVIE) {
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
    logger.error({ route: "/movies/[id]", titleId: id, error }, "Failed to load movie metadata");
    return {
      title: t("unavailable"),
    };
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  let details;

  try {
    details = await getTitleDetailsAction(id);
    if (!details || details.mediaType !== MediaType.MOVIE) {
      notFound();
    }
  } catch (error) {
    logger.error(
      {
        route: "/movies/[id]",
        titleId: id,
        mediaType: MediaType.MOVIE,
        error,
      },
      "Failed to load movie details",
    );
    throw new Error("Failed to load movie details");
  }

  const user = await getOptionalUser();
  const userState = await getUserTitleState(id, user?.id);

  return (
    <main>
      <AssetDetailsHero
        details={details}
        mediaType="movie"
        userState={userState}
        isAuthenticated={Boolean(user)}
      />

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
