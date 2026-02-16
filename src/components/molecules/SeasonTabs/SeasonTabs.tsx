"use client";

import { Icon } from "@/components/atoms/Icon";
import type { Season } from "@/features/catalog";
import { useHorizontalScroll } from "@/lib/a11y/use-horizontal-scroll";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./SeasonTabs.module.css";

interface SeasonTabsProps {
  seasons: Season[];
  selectedSeasonNumber: number;
  onSeasonChange: (seasonNumber: number) => void;
}

export function SeasonTabs({ seasons, selectedSeasonNumber, onSeasonChange }: SeasonTabsProps) {
  const t = useTranslations("common.a11y");
  const { containerRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight } =
    useHorizontalScroll();
  const showNavigation = canScrollLeft || canScrollRight;

  return (
    <div className={styles.seasonTabs}>
      <div className={styles.tabsScroller}>
        {showNavigation && canScrollLeft && (
          <button
            type="button"
            className={clsx(styles.navButton, styles.navButtonLeft)}
            onClick={scrollLeft}
            aria-label={t("scrollLeft")}
          >
            <Icon icon={ChevronLeft} size="small" />
          </button>
        )}

        <div
          ref={containerRef}
          className={clsx(styles.tabsContainer, showNavigation && styles.tabsContainerWithNav)}
        >
          {seasons.map((season) => (
            <button
              key={season.seasonNumber}
              className={clsx(
                styles.tab,
                selectedSeasonNumber === season.seasonNumber && styles.active,
              )}
              onClick={() => onSeasonChange(season.seasonNumber)}
              aria-selected={selectedSeasonNumber === season.seasonNumber}
              role="tab"
            >
              {season.name}
            </button>
          ))}
        </div>

        {showNavigation && canScrollRight && (
          <button
            type="button"
            className={clsx(styles.navButton, styles.navButtonRight)}
            onClick={scrollRight}
            aria-label={t("scrollRight")}
          >
            <Icon icon={ChevronRight} size="small" />
          </button>
        )}
      </div>
    </div>
  );
}
