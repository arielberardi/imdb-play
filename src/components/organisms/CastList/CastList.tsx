import { CastCard } from "@/components/molecules/CastCard";
import { Person } from "@/lib/imdb";
import styles from "./CastList.module.css";

interface CastListProps {
  cast: Person[];
}

export default function CastList({ cast }: CastListProps) {
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <section className={styles.castList}>
      <div className={styles.container}>
        <h2 className={styles.title}>Cast</h2>

        <div className={styles.rail}>
          {cast.map((person, index) => (
            <CastCard key={`${person.name}-${index}`} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}
