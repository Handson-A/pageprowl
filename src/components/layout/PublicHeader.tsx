import React from "react";
import Link from "next/link";
import styles from "./PublicHeader.module.css";
import { Button } from "@/components/ui/Button";
import { PanelverseLogo } from "@/components/brand/PanelverseLogo";
import { LuSearch } from "react-icons/lu";

export function PublicHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.brand} aria-label="Panelverse Home">
            <PanelverseLogo variant="full" theme="dark" size="sm" />
          </Link>

          <nav className={styles.nav} aria-label="Main Navigation">
            <Link href="/browse" className={styles.navLink}>
              Browse
            </Link>
            <Link href="/browse?genre=Action" className={styles.navLink}>
              Action
            </Link>
            <Link href="/browse?genre=Sci-Fi" className={styles.navLink}>
              Sci-Fi
            </Link>
            <Link href="/browse?genre=Fantasy" className={styles.navLink}>
              Fantasy
            </Link>
            <Link href="/studio" className={styles.navLink}>
              Creators
            </Link>
          </nav>
        </div>

        <div className={styles.actions}>
          <Link
            href="/browse"
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
