import { Icon } from "@/components/atoms/Icon";
import { Rail } from "@/components/molecules/Rail/Rail";
import { searchTitles } from "@/lib/imdb/queries";
import type { Title } from "@/lib/imdb/types";
import { Film, Search } from "lucide-react";
import styles from "./SearchResults.module.css";

interface SearchResultsProps {
  query: string;
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
    href: title.mediaType === "MOVIE" ? `/movies/${title.id}` : `/series/${title.id}`,
  }));
}

export async function SearchResults({ query }: SearchResultsProps) {
  // Empty state: No query entered
  if (!query.trim()) {
    return (
      <section className={styles.emptyState}>
        <Icon icon={Search} size="large" className={styles.emptyIcon} />
        <h2 className={styles.emptyTitle}>Start Your Search</h2>
        <p className={styles.emptyMessage}>
          Enter a movie or TV show name above to find what you&apos;re looking for
        </p>
      </section>
    );
  }

  // Fetch search results
  const response = await searchTitles(query, 1);

  // Empty state: No results found
  if (response.results.length === 0) {
    return (
      <section className={styles.noResults}>
        <Icon icon={Film} size="large" className={styles.noResultsIcon} />
        <h2 className={styles.noResultsTitle}>No Results Found</h2>
        <p className={styles.noResultsMessage}>
          We couldn&apos;t find any titles matching <strong>&ldquo;{query}&rdquo;</strong>
        </p>
        <p className={styles.noResultsSuggestion}>
          Try adjusting your search or checking your spelling
        </p>
      </section>
    );
  }

  // Success state: Display results
  const railItems = transformTitlesToRailItems(response.results);
  const resultCount = response.totalResults;

  return (
    <section className={styles.results}>
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>Results for &ldquo;{query}&rdquo;</h2>
        <p className={styles.resultsCount}>
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </p>
      </div>
      <Rail title="" items={railItems} />
    </section>
  );
}
