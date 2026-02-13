import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Film, Home, Search, Tv } from "lucide-react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export function Navbar() {
  return (
    <nav role="navigation" aria-label="Primary" className={styles.navbar}>
      <div className={styles.navbar__container}>
        {/* Logo */}
        <Link href="/" className={styles.navbar__logo}>
          <Icon icon={Film} size="large" ariaLabel="IMDB Play" />
          <span className={styles.navbar__logoText}>IMDB Play</span>
        </Link>

        {/* Navigation Links */}
        <ul className={styles.navbar__links}>
          <li>
            <Link href="/" className={styles.navbar__link}>
              <Icon icon={Home} size="small" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/films" className={styles.navbar__link}>
              <Icon icon={Film} size="small" />
              <span>Films</span>
            </Link>
          </li>
          <li>
            <Link href="/series" className={styles.navbar__link}>
              <Icon icon={Tv} size="small" />
              <span>Series</span>
            </Link>
          </li>
          <li>
            <Link href="/search" className={styles.navbar__link}>
              <Icon icon={Search} size="small" />
              <span>Search</span>
            </Link>
          </li>
        </ul>

        {/* Auth Section - Placeholder for Phase 3 */}
        <div className={styles.navbar__auth}>
          <Button variant="ghost" size="small">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}
