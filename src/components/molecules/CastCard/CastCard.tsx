import { PersonImage } from "@/components/atoms/PersonImage";
import { Person } from "@/lib/imdb";
import styles from "./CastCard.module.css";

interface CastCardProps {
  person: Person;
}

export function CastCard({ person }: CastCardProps) {
  return (
    <div className={styles.castCard}>
      <PersonImage profilePath={person.profilePath} name={person.name} size={150} />

      <div className={styles.info}>
        <p className={styles.name}>{person.name}</p>
        {person.character && <p className={styles.character}>&quot;{person.character}&quot;</p>}
      </div>
    </div>
  );
}
