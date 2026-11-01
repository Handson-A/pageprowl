import React from "react";
import Link from "next/link";
import styles from "./PublicHeader.module.css";
import { Button } from "@/components/ui/Button";
import { PageProwlLogo } from "@/components/brand/PageProwlLogo";
import { LuSearch } from "react-icons/lu";

export function PublicHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.brand} aria-label="PageProwl Home">
            <PageProwlLogo variant="full" theme="dark" size="sm" />
          </Link>

          <nav className={styles.nav} aria-label="Main Navigation">
            <Link href="/discover" className={styles.navLink}>
              Discover
            </Link>
            <Link href="/browse" className={styles.navLink}>
              Browse
            </Link>
            <Link href="/genres" className={styles.navLink}>
              Genres
            </Link>
            <Link href="/studio" className={styles.navLink}>
              Creators
            </Link>
          </nav>
        </div>

        <div className={styles.actions}>
          <Link
            href="/search"
            className={styles.searchButton}
            aria-label="Search comics"
          >
            <LuSearch size={18} aria-hidden="true" />
          </Link>

          <Link href="/login" className={styles.loginLink}>
            <Button variant="ghost" size="sm" className={styles.ghostLight}>
              Sign In
            </Button>
          </Link>

          <Link href="/studio">
            <Button variant="primary" size="sm">
              Creator Studio
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
