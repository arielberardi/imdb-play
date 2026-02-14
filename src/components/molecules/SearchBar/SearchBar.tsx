"use client";

import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { clsx } from "clsx";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ defaultValue = "", onSearch, placeholder, className }: SearchBarProps) {
  const t = useTranslations("search");
  const resolvedPlaceholder = placeholder ?? t("placeholder");
  const [query, setQuery] = useState(defaultValue);

  // Debounced search effect
  useEffect(() => {
    if (!onSearch) return;

    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(query);
      }
    },
    [query, onSearch],
  );

  return (
    <div className={clsx(styles.searchBar, className)}>
      <div className={styles.searchBar__iconLeft}>
        <Icon icon={Search} size="small" />
      </div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={resolvedPlaceholder}
        className={styles.searchBar__input}
        fullWidth
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.searchBar__clear}
          aria-label={t("clearAriaLabel")}
        >
          <Icon icon={X} size="small" />
        </button>
      )}
    </div>
  );
}
