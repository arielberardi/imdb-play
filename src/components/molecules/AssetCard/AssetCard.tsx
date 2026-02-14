import { Icon } from "@/components/atoms/Icon";
import { Tag } from "@/components/atoms/Tag";
import { clsx } from "clsx";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
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
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 640px) 44vw, (max-width: 1024px) 28vw, 200px"
            quality={75}
            className={styles.assetCard__image}
          />

          {/* Badges overlay */}
          <div className={styles.assetCard__badges}>
            {isFavorite && (
              <div className={styles.assetCard__favorite}>
                <Icon icon={Heart} size="small" ariaLabel="Favorite" />
              </div>
            )}
            {mediaType && (
              <Tag variant="default" size="small">
                {mediaType === "movie" ? "Movie" : "Series"}
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
                aria-label="Watch progress"
              />
            </div>
          )}
        </div>

        <div className={styles.assetCard__info}>
          <h3 className={styles.assetCard__title}>{title}</h3>
          <div className={styles.assetCard__meta}>
            {rating !== undefined && (
              <div className={styles.assetCard__rating}>
                <Icon icon={Star} size="small" ariaLabel="Rating" />
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
