import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import { FilterChips } from "@/components/molecules/FilterChips/FilterChips";
import { Rail } from "@/components/molecules/Rail/Rail";
import { MediaType } from "@/generated/prisma";
import { MOVIE_GENRES } from "@/lib/imdb/constants";
import { getByGenre, getPopularMovies } from "@/lib/imdb/queries";
import type { Title } from "@/lib/imdb/types";
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
      ? `https://image.tmdb.org/t/p/w500${title.posterPath}`
      : "https://placehold.co/200x300/1f1f1f/a3a3a3?text=No+Image",
    rating: title.rating ?? undefined,
    year: title.releaseDate ? new Date(title.releaseDate).getFullYear() : undefined,
    href: `/movies/${title.id}`,
  }));
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const params = await searchParams;
  const selectedGenre = params.genre;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Movies</h1>
        <FilterChips genres={MOVIE_GENRES} basePath="/films" />
      </div>

      <Suspense fallback={<RailSkeleton />}>
        <FilmsContent selectedGenre={selectedGenre} />
      </Suspense>
    </main>
  );
}

async function FilmsContent({ selectedGenre }: { selectedGenre?: string }) {
  let movies;
  let title = "Popular Movies";

  if (selectedGenre) {
    const genre = MOVIE_GENRES.find((g) => g.name === selectedGenre);
    if (genre) {
      const response = await getByGenre(MediaType.MOVIE, genre.id);
      movies = response.results;
      title = `${selectedGenre} Movies`;
    } else {
      const response = await getPopularMovies();
      movies = response.results;
    }
  } else {
    const response = await getPopularMovies();
    movies = response.results;
  }

  const railItems = transformTitlesToRailItems(movies);

  return (
    <section className={styles.resultsSection}>
      <Rail title={title} items={railItems} />
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
