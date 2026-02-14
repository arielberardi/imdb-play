import { Skeleton } from "@/components/atoms/Skeleton";
import AssetDetailsHero from "@/components/organisms/AssetDetailsHero";
import CastList from "@/components/organisms/CastList";
import { getTitleDetails, MediaType } from "@/lib/imdb";
import { getUserTitleState } from "@/lib/personalized-content/user-state";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const details = await getTitleDetails(id, MediaType.MOVIE);

    if (!details) {
      return {
        title: "Movie Not Found - IMDb Play",
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
      title: "Movie Not Found - IMDb Play",
    };
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;

  const [details, userState] = await Promise.all([
    getTitleDetails(id, MediaType.MOVIE),
    getUserTitleState(id),
  ]);

  if (!details) {
    notFound();
  }

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
