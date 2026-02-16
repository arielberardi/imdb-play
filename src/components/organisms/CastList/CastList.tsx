"use client";

import { Icon } from "@/components/atoms/Icon";
import { CastCard } from "@/components/molecules/CastCard";
import type { Person } from "@/features/catalog";
import { useHorizontalScroll } from "@/lib/a11y/use-horizontal-scroll";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./CastList.module.css";

interface CastListProps {
  cast: Person[];
}

export default function CastList({ cast }: CastListProps) {
  const t = useTranslations("assetDetails");
  const tA11y = useTranslations("common.a11y");
  const { containerRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight } =
    useHorizontalScroll();
  const showNavigation = canScrollLeft || canScrollRight;

  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <section className={styles.castList}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("cast")}</h2>

        <div className={styles.scroller}>
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
            className={clsx(styles.rail, showNavigation && styles.railWithNav)}
          >
            {cast.map((person, index) => (
              <CastCard key={`${person.name}-${index}`} person={person} />
            ))}
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
      </div>
    </section>
  );
}
