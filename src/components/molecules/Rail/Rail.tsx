"use client";

import { Icon } from "@/components/atoms/Icon";
import { AssetCard } from "@/components/molecules/AssetCard";
import { useFocusRegion } from "@/lib/a11y/focus-region";
import {
  isActivationKey,
  isArrowDown,
  isArrowLeft,
  isArrowRight,
  isArrowUp,
} from "@/lib/a11y/keymap";
import { useRovingTabindex } from "@/lib/a11y/roving-tabindex";
import { useHorizontalScroll } from "@/lib/a11y/use-horizontal-scroll";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, type KeyboardEvent } from "react";
import styles from "./Rail.module.css";

export interface RailItem {
  id: string;
  title: string;
  imageUrl: string;
  rating?: number;
  year?: number;
  href: string;
  mediaType?: "movie" | "series";
  showProgress?: boolean;
  progressPercent?: number;
  isFavorite?: boolean;
}

interface RailProps {
  title: string;
  items: RailItem[];
  className?: string;
  regionId?: string;
  regionOrder?: number;
  enableKeyboardNav?: boolean;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function Rail({
  title,
  items,
  className,
  regionId,
  regionOrder = 0,
  enableKeyboardNav = true,
}: RailProps) {
  const t = useTranslations("common.a11y");
  const anchorRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const { containerRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight } =
    useHorizontalScroll();
  const showNavigation = canScrollLeft || canScrollRight;

  const stableRegionId = useMemo(
    () => regionId ?? `rail-${slugify(title)}-${regionOrder}`,
    [regionId, regionOrder, title],
  );

  const { activeIndex, getItemTabIndex, onItemFocus, setActiveIndex } = useRovingTabindex(
    items.length,
    {
      initialIndex: 0,
    },
  );

  const focusItem = useCallback(
    (index: number) => {
      if (items.length === 0) {
        return;
      }

      const nextIndex = Math.max(0, Math.min(index, items.length - 1));
      const target = anchorRefs.current[nextIndex];
      if (!target) {
        return;
      }

      setActiveIndex(nextIndex);
      target.focus();
      target.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    },
    [items.length, setActiveIndex],
  );

  const { focusNextRegion, focusPreviousRegion } = useFocusRegion(stableRegionId, {
    order: regionOrder,
    itemCount: items.length,
    getLastFocusedIndex: () => activeIndex,
    focusAtIndex: focusItem,
  });

  const onItemKeyDown = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      if (!enableKeyboardNav || items.length === 0) {
        return;
      }

      if (isArrowRight(event.key)) {
        event.preventDefault();
        focusItem(activeIndex + 1);
        return;
      }

      if (isArrowLeft(event.key)) {
        event.preventDefault();
        focusItem(activeIndex - 1);
        return;
      }

      if (isArrowDown(event.key)) {
        event.preventDefault();
        focusNextRegion(activeIndex);
        return;
      }

      if (isArrowUp(event.key)) {
        event.preventDefault();
        focusPreviousRegion(activeIndex);
        return;
      }

      if (isActivationKey(event.key) && event.key === " ") {
        event.preventDefault();
        event.currentTarget.click();
      }
    },
    [activeIndex, enableKeyboardNav, focusItem, focusNextRegion, focusPreviousRegion, items.length],
  );

  return (
    <section
      className={clsx(styles.rail, className)}
      aria-label={title}
      data-region-id={stableRegionId}
    >
      <h2 className={styles.rail__title}>{title}</h2>
      <div className={styles.rail__scroller}>
        {showNavigation && canScrollLeft && (
          <button
            type="button"
            className={clsx(styles.rail__navButton, styles["rail__navButton--left"])}
            onClick={scrollLeft}
            aria-label={t("scrollLeft")}
          >
            <Icon icon={ChevronLeft} size="small" />
          </button>
        )}

        <div
          ref={containerRef}
          className={clsx(
            styles.rail__container,
            showNavigation && styles["rail__container--withNav"],
          )}
          data-testid={`${stableRegionId}-scroll-container`}
        >
          {items.map((item, index) => (
            <AssetCard
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl}
              rating={item.rating}
              year={item.year}
              href={item.href}
              mediaType={item.mediaType}
              showProgress={item.showProgress}
              progressPercent={item.progressPercent}
              isFavorite={item.isFavorite}
              linkRef={(element) => {
                anchorRefs.current[index] = element;
              }}
              linkTabIndex={enableKeyboardNav ? getItemTabIndex(index) : 0}
              onLinkFocus={() => onItemFocus(index)}
              onLinkMouseEnter={() => setActiveIndex(index)}
              onLinkKeyDown={onItemKeyDown}
            />
          ))}
        </div>

        {showNavigation && canScrollRight && (
          <button
            type="button"
            className={clsx(styles.rail__navButton, styles["rail__navButton--right"])}
            onClick={scrollRight}
            aria-label={t("scrollRight")}
          >
            <Icon icon={ChevronRight} size="small" />
          </button>
        )}
      </div>
    </section>
  );
}
