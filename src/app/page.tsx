import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { Rail, type RailItem } from "@/components/molecules/Rail/Rail";
import { getOptionalUser } from "@/features/auth";
import { listUserFavorites } from "@/features/favorites/services/favorites.service";
import { listContinueWatching } from "@/features/progress/services/progress.service";
import { MediaType } from "@/generated/prisma";
import { FocusRegionProvider } from "@/lib/a11y/focus-region";
import { getPopularMovies, getPopularSeries, getTrending, type Title } from "@/lib/imdb";
import { enrichContinueWatching, enrichFavorites } from "@/lib/personalized-content";
import { Suspense } from "react";
import styles from "./page.module.css";

export const revalidate = 3600;

const FALLBACK_POSTER = "https://placehold.co/200x300/1f1f1f/a3a3a3?text=No+Image";

function mapTitleToRailItem(title: Title): RailItem {
  return {
    id: title.id,
    title: title.title,
    imageUrl: title.posterPath
      ? `https://image.tmdb.org/t/p/w500${title.posterPath}`
      : FALLBACK_POSTER,
    rating: title.rating ?? undefined,
    year: title.releaseDate ? new Date(title.releaseDate).getFullYear() : undefined,
    href: title.mediaType === MediaType.MOVIE ? `/movies/${title.id}` : `/series/${title.id}`,
    mediaType: title.mediaType === MediaType.MOVIE ? "movie" : "series",
  };
}

export default async function Home() {
  const user = await getOptionalUser();

  return (
    <FocusRegionProvider>
      <div className={styles.container}>
        {user && (
          <>
            <Suspense fallback={<RailSkeleton />}>
              <ContinueWatchingRail userId={user.id} />
            </Suspense>
            <Suspense fallback={<RailSkeleton />}>
              <TrendingRail />
            </Suspense>
            <Suspense fallback={<RailSkeleton />}>
              <FavoritesRail userId={user.id} />
            </Suspense>
          </>
        )}

        {!user && (
          <Suspense fallback={<RailSkeleton />}>
            <TrendingRail />
          </Suspense>
        )}

        <Suspense fallback={<RailSkeleton />}>
          <PopularMoviesRail />
        </Suspense>

        <Suspense fallback={<RailSkeleton />}>
          <PopularSeriesRail />
        </Suspense>
      </div>
    </FocusRegionProvider>
  );
}

async function ContinueWatchingRail({ userId }: { userId: string }) {
  const progress = await listContinueWatching(userId);
  if (progress.length === 0) {
    return null;
  }

  const items = await enrichContinueWatching(progress);
  if (items.length === 0) {
    return null;
  }

  return <Rail title="Continue Watching" items={items} regionOrder={1} regionId="home-continue" />;
}

async function FavoritesRail({ userId }: { userId: string }) {
  const favorites = await listUserFavorites(userId);
  if (favorites.length === 0) {
    return null;
  }

  const items = await enrichFavorites(favorites);
  if (items.length === 0) {
    return null;
  }

  return <Rail title="My Favorites" items={items} regionOrder={3} regionId="home-favorites" />;
}

async function TrendingRail() {
  const titles = await getTrending("all", "week");
  const items = titles.slice(0, 20).map(mapTitleToRailItem);

  return <Rail title="Trending Now" items={items} regionOrder={2} regionId="home-trending" />;
}

async function PopularMoviesRail() {
  const response = await getPopularMovies();
  const items = response.results.slice(0, 20).map(mapTitleToRailItem);

  return (
    <Rail title="Popular Movies" items={items} regionOrder={4} regionId="home-popular-movies" />
  );
}

async function PopularSeriesRail() {
  const response = await getPopularSeries();
  const items = response.results.slice(0, 20).map(mapTitleToRailItem);

  return (
    <Rail title="Popular Series" items={items} regionOrder={5} regionId="home-popular-series" />
  );
}

function RailSkeleton() {
  return (
    <section className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeletonTitle}>
        <Skeleton width="180px" height="24px" />
      </div>
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} width="200px" height="300px" />
        ))}
      </div>
    </section>
  );
}
