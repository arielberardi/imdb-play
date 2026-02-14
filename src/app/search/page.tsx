import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SearchBarWrapper } from "./components/SearchBarWrapper";
import { SearchResults } from "./components/SearchResults";
import { SearchSkeleton } from "./components/SearchSkeleton";
import styles from "./search.module.css";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const t = await getTranslations("search");
  const params = await searchParams;
  const query = params.q || "";

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("title")}</h1>
        <SearchBarWrapper />
      </div>

      <Suspense key={query} fallback={<SearchSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}
