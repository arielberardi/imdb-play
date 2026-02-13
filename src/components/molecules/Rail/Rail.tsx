import { AssetCard } from "@/components/molecules/AssetCard";
import { clsx } from "clsx";
import styles from "./Rail.module.css";

interface RailProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    imageUrl: string;
    rating?: number;
    year?: number;
    href: string;
  }>;
  className?: string;
}

export function Rail({ title, items, className }: RailProps) {
  return (
    <section className={clsx(styles.rail, className)} aria-label={title}>
      <h2 className={styles.rail__title}>{title}</h2>
      <div className={styles.rail__container}>
        {items.map((item) => (
          <AssetCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl}
            rating={item.rating}
            year={item.year}
            href={item.href}
          />
        ))}
      </div>
    </section>
  );
}
