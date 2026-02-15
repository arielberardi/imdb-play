import { CastCard } from "@/components/molecules/CastCard";
import type { Person } from "@/features/catalog";
import { useTranslations } from "next-intl";
import styles from "./CastList.module.css";

interface CastListProps {
  cast: Person[];
}

export default function CastList({ cast }: CastListProps) {
  const t = useTranslations("assetDetails");

  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <section className={styles.castList}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("cast")}</h2>

        <div className={styles.rail}>
          {cast.map((person, index) => (
            <CastCard key={`${person.name}-${index}`} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}
