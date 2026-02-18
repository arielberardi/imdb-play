"use client";

import { Icon } from "@/components/atoms/Icon";
import { useHorizontalScroll } from "@/lib/a11y/use-horizontal-scroll";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./FilterChips.module.css";

interface FilterChipsProps {
  genres: ReadonlyArray<{ id: number; name: string }>;
  basePath: "/films" | "/series";
}

export function FilterChips({ genres, basePath }: FilterChipsProps) {
  const namespace = basePath === "/films" ? "films" : "series";
  const t = useTranslations(namespace);
  const tA11y = useTranslations("common.a11y");
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get("genre");
  const { containerRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight } =
    useHorizontalScroll();
  const showNavigation = canScrollLeft || canScrollRight;

  return (
    <div className={styles.wrapper}>
      {showNavigation && canScrollLeft && (
        <button
          type="button"
          className={clsx(styles.navButton, styles.navButtonLeft)}
          onClick={scrollLeft}
          aria-label={tA11y("scrollLeft")}
        >
          <Icon icon={ChevronLeft} size="small" />
        </button>
      )}

      <div
        ref={containerRef}
        className={clsx(styles.container, showNavigation && styles.containerWithNav)}
      >
        <Link href={basePath} className={clsx(styles.chip, !selectedGenre && styles.active)}>
          {t("allFilter")}
        </Link>
        {genres.map((genre) => {
          const isActive = selectedGenre === genre.name;
          return (
            <Link
              key={genre.id}
              href={`${basePath}?genre=${encodeURIComponent(genre.name)}`}
              className={clsx(styles.chip, isActive && styles.active)}
            >
              {genre.name}
            </Link>
          );
        })}
      </div>

      {showNavigation && canScrollRight && (
        <button
          type="button"
          className={clsx(styles.navButton, styles.navButtonRight)}
          onClick={scrollRight}
          aria-label={tA11y("scrollRight")}
        >
          <Icon icon={ChevronRight} size="small" />
        </button>
      )}
    </div>
  );
}
