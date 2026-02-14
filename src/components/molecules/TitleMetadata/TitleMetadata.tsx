import { RatingBadge } from "@/components/atoms/RatingBadge";
import { Tag } from "@/components/atoms/Tag";
import { TitleDetails } from "@/lib/imdb";
import styles from "./TitleMetadata.module.css";

interface TitleMetadataProps {
  details: TitleDetails;
}

export function TitleMetadata({ details }: TitleMetadataProps) {
  const year = details.releaseDate ? new Date(details.releaseDate).getFullYear() : null;

  return (
    <div className={styles.titleMetadata}>
      <h1 className={styles.title}>{details.title}</h1>

      <div className={styles.metaInfo}>
        {details.voteAverage > 0 && <RatingBadge rating={details.voteAverage} />}
        {year && <span className={styles.year}>{year}</span>}
      </div>

      {details.genres && details.genres.length > 0 && (
        <div className={styles.genres}>
          {details.genres.map((genre) => (
            <Tag key={genre.id} label={genre.name} />
          ))}
        </div>
      )}

      {details.overview && <p className={styles.overview}>{details.overview}</p>}
    </div>
  );
}
