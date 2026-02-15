import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { FilterChips } from "@/components/molecules/FilterChips/FilterChips";
import { Rail } from "@/components/molecules/Rail/Rail";
import {
  getPopularSeriesAction,
  getSeriesGenresAction,
  getTitlesByGenreAction,
  type Title,
} from "@/features/catalog";
import { MediaType } from "@/generated/prisma";
import { FocusRegionProvider } from "@/lib/a11y/focus-region";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import styles from "./series.module.css";

interface SeriesPageProps {
  searchParams: Promise<{ genre?: string }>;
}

function transformTitlesToRailItems(titles: Title[]) {
  return titles.map((title) => ({
    id: title.id,
    title: title.title,
    imageUrl: title.posterPath
      ? title.posterPath.startsWith("http")
        ? title.posterPath
        : `https://image.tmdb.org/t/p/w500${title.posterPath}`
      : "https://placehold.co/200x300/1f1f1f/a3a3a3?text=No+Image",
    rating: title.rating ?? undefined,
    year: title.releaseDate ? new Date(title.releaseDate).getFullYear() : undefined,
    href: `/series/${title.id}`,
  }));
}

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const t = await getTranslations("series");
  const params = await searchParams;
  const selectedGenre = params.genre;
  const genres = await getSeriesGenresAction();

  return (
    <FocusRegionProvider>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t("title")}</h1>
          <FilterChips genres={genres} basePath="/series" />
        </div>

        <Suspense fallback={<RailSkeleton />}>
          <SeriesContent selectedGenre={selectedGenre} />
        </Suspense>
      </main>
    </FocusRegionProvider>
  );
}

async function SeriesContent({ selectedGenre }: { selectedGenre?: string }) {
  const t = await getTranslations("series");
  let series;
  let title = t("popularTitle");

  if (selectedGenre) {
    const genres = await getSeriesGenresAction();
    const genre = genres.find((g) => g.name === selectedGenre);
    if (genre) {
      const response = await getTitlesByGenreAction({
        mediaType: MediaType.SERIES,
        genreId: genre.id,
      });
      series = response.results;
      title = t("genreTitle", { genre: selectedGenre });
    } else {
      const response = await getPopularSeriesAction();
      series = response.results;
    }
  } else {
    const response = await getPopularSeriesAction();
    series = response.results;
  }

  const railItems = transformTitlesToRailItems(series);

  return (
    <section className={styles.resultsSection}>
      <Rail title={title} items={railItems} regionOrder={1} regionId="series-results" />
    </section>
  );
}

function RailSkeleton() {
  return (
    <div className={styles.skeleton}>
      <Skeleton width="200px" height="24px" />
      <div className={styles.cardGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} width="200px" height="300px" />
        ))}
      </div>
    </div>
  );
}
