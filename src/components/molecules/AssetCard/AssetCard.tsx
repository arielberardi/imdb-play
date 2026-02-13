import { Icon } from "@/components/atoms/Icon";
import { Tag } from "@/components/atoms/Tag";
import { clsx } from "clsx";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  className,
}: AssetCardProps) {
  return (
    <article className={clsx(styles.assetCard, className)}>
      <Link href={href} className={styles.assetCard__link}>
        <div className={styles.assetCard__imageWrapper}>
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 200px"
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
