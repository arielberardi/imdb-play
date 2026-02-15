import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { FilterChips } from "@/components/molecules/FilterChips/FilterChips";
import { Rail } from "@/components/molecules/Rail/Rail";
import {
  getMovieGenresAction,
  getPopularMoviesAction,
  getTitlesByGenreAction,
  type Title,
} from "@/features/catalog";
import { MediaType } from "@/generated/prisma";
import { FocusRegionProvider } from "@/lib/a11y/focus-region";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import styles from "./films.module.css";

interface FilmsPageProps {
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
    href: `/movies/${title.id}`,
  }));
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const t = await getTranslations("films");
  const params = await searchParams;
  const selectedGenre = params.genre;
  const genres = await getMovieGenresAction();

  return (
    <FocusRegionProvider>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t("title")}</h1>
          <FilterChips genres={genres} basePath="/films" />
        </div>

        <Suspense fallback={<RailSkeleton />}>
          <FilmsContent selectedGenre={selectedGenre} />
        </Suspense>
      </main>
    </FocusRegionProvider>
  );
}

async function FilmsContent({ selectedGenre }: { selectedGenre?: string }) {
  const t = await getTranslations("films");
  let movies;
  let title = t("popularTitle");

  if (selectedGenre) {
    const genres = await getMovieGenresAction();
    const genre = genres.find((g) => g.name === selectedGenre);
    if (genre) {
      const response = await getTitlesByGenreAction({
        mediaType: MediaType.MOVIE,
        genreId: genre.id,
      });
      movies = response.results;
      title = t("genreTitle", { genre: selectedGenre });
    } else {
      const response = await getPopularMoviesAction();
      movies = response.results;
    }
  } else {
    const response = await getPopularMoviesAction();
    movies = response.results;
  }

  const railItems = transformTitlesToRailItems(movies);

  return (
    <section className={styles.resultsSection}>
      <Rail title={title} items={railItems} regionOrder={1} regionId="films-results" />
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
