import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import type { AuthUser } from "@/features/auth";
import { Film, Home, Search, Tv } from "lucide-react";
import Link from "next/link";
import styles from "./Navbar.module.css";

interface NavbarViewProps {
  user: AuthUser | null;
  onSignOut?: (formData: FormData) => void | Promise<void>;
}

export function NavbarView({ user, onSignOut }: NavbarViewProps) {
  return (
    <nav role="navigation" aria-label="Primary" className={styles.navbar}>
      <div className={styles.navbar__container}>
        <Link href="/" className={styles.navbar__logo}>
          <Icon icon={Film} size="large" ariaLabel="IMDB Play" />
          <span className={styles.navbar__logoText}>IMDB Play</span>
        </Link>

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

        <div className={styles.navbar__auth}>
          {user ? (
            <div className={styles.navbar__authSignedIn}>
              <span className={styles.navbar__authEmail}>{user.email}</span>
              {onSignOut ? (
                <form action={onSignOut}>
                  <Button variant="ghost" size="small" type="submit">
                    Sign Out
                  </Button>
                </form>
              ) : (
                <Button variant="ghost" size="small" type="button">
                  Sign Out
                </Button>
              )}
            </div>
          ) : (
            <Link href="/auth/sign-in">
              <Button variant="ghost" size="small" type="button">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
