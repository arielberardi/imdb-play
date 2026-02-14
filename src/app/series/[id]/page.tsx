import { Skeleton } from "@/components/atoms/Skeleton";
import AssetDetailsHero from "@/components/organisms/AssetDetailsHero";
import CastList from "@/components/organisms/CastList";
import EpisodeSelector from "@/components/organisms/EpisodeSelector";
import { getTitleDetails, MediaType } from "@/lib/imdb";
import { getUserTitleState } from "@/lib/personalized-content/user-state";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface SeriesDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SeriesDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const details = await getTitleDetails(id, MediaType.SERIES);

    if (!details) {
      return {
        title: "Series Not Found - IMDb Play",
      };
    }

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
  } catch {
    return {
      title: "Series Not Found - IMDb Play",
    };
  }
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { id } = await params;

  const [details, userState] = await Promise.all([
    getTitleDetails(id, MediaType.SERIES),
    getUserTitleState(id),
  ]);

  if (!details) {
    notFound();
  }

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
    <div style={{ padding: "var(--spacing-2xl)" }}>
      <Skeleton width="150px" height="24px" style={{ marginBottom: "var(--spacing-lg)" }} />
      <div style={{ display: "flex", gap: "var(--spacing-md)", overflowX: "hidden" }}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-sm)",
            }}
          >
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
    <div style={{ padding: "var(--spacing-2xl)" }}>
      <Skeleton width="150px" height="24px" style={{ marginBottom: "var(--spacing-lg)" }} />
      <div style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-xl)" }}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} width="100px" height="40px" />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "var(--spacing-md)",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i}>
            <Skeleton width="100%" height="180px" style={{ marginBottom: "var(--spacing-sm)" }} />
            <Skeleton width="60%" height="20px" style={{ marginBottom: "var(--spacing-xs)" }} />
            <Skeleton width="100%" height="16px" />
          </div>
        ))}
      </div>
    </div>
  );
}
