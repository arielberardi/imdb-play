import { Icon } from "@/components/atoms/Icon";
import { Tag } from "@/components/atoms/Tag";
import { clsx } from "clsx";
import { Heart, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { KeyboardEventHandler, Ref } from "react";
import styles from "./AssetCard.module.css";

interface AssetCardProps {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt?: string;
  rating?: number;
  year?: number;
  mediaType?: "movie" | "series";
  href: string;
  showProgress?: boolean;
  progressPercent?: number;
  isFavorite?: boolean;
  linkRef?: Ref<HTMLAnchorElement>;
  linkTabIndex?: 0 | -1;
  onLinkFocus?: () => void;
  onLinkMouseEnter?: () => void;
  onLinkKeyDown?: KeyboardEventHandler<HTMLAnchorElement>;
  className?: string;
}

export function AssetCard({
  id: _id, // eslint-disable-line @typescript-eslint/no-unused-vars
  title,
  imageUrl,
  imageAlt,
  rating,
  year,
  mediaType,
  href,
  showProgress = false,
  progressPercent = 0,
  isFavorite = false,
  linkRef,
  linkTabIndex,
  onLinkFocus,
  onLinkMouseEnter,
  onLinkKeyDown,
  className,
}: AssetCardProps) {
  const t = useTranslations("common");

  return (
    <article className={clsx(styles.assetCard, className)}>
      <Link
        href={href}
        className={styles.assetCard__link}
        ref={linkRef}
        tabIndex={linkTabIndex}
        onFocus={onLinkFocus}
        onMouseEnter={onLinkMouseEnter}
        onKeyDown={onLinkKeyDown}
      >
        <div className={styles.assetCard__imageWrapper}>
          <img src={imageUrl} alt={imageAlt || title} className={styles.assetCard__image} />

          {/* Badges overlay */}
          <div className={styles.assetCard__badges}>
            {isFavorite && (
              <div className={styles.assetCard__favorite}>
                <Icon icon={Heart} size="small" ariaLabel={t("a11y.favorite")} />
              </div>
            )}
            {mediaType && (
              <Tag variant="default" size="small">
                {mediaType === "movie" ? t("mediaType.movie") : t("mediaType.series")}
              </Tag>
            )}
          </div>

          {/* Progress bar */}
          {showProgress && (
            <div className={styles.assetCard__progress}>
              <div
                className={styles.assetCard__progressBar}
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t("a11y.watchProgress")}
              />
            </div>
          )}
        </div>

        <div className={styles.assetCard__info}>
          <h3 className={styles.assetCard__title}>{title}</h3>
          <div className={styles.assetCard__meta}>
            {rating !== undefined && (
              <div className={styles.assetCard__rating}>
                <Icon icon={Star} size="small" ariaLabel={t("a11y.rating")} />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            {year !== undefined && <span className={styles.assetCard__year}>{year}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
