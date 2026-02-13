"use client";

import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

export function SearchBarWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle search with debounced URL update
  const handleSearch = useCallback(
    (newQuery: string) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce URL update to prevent history pollution
      debounceTimerRef.current = setTimeout(() => {
        const trimmedQuery = newQuery.trim();
        if (trimmedQuery) {
          router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        } else {
          router.push("/search");
        }
      }, 300);
    },
    [router],
  );

  // Sync with URL on mount (for direct navigation and back/forward)
  const currentQuery = searchParams.get("q") || "";

  return (
    <SearchBar
      defaultValue={currentQuery}
      onSearch={handleSearch}
      placeholder="Search for movies and TV shows..."
    />
  );
}
