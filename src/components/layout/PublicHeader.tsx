import React from "react";
import Link from "next/link";
import styles from "./PublicHeader.module.css";
import { Button } from "@/components/ui/Button";
import { PanelverseLogo } from "@/components/brand/PanelverseLogo";

export function PublicHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.brand} aria-label="Panelverse Home">
            <PanelverseLogo variant="full" size="sm" />
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
          </nav>
        </div>

        <div className={styles.actions}>
          <Link href="/studio">
            <Button variant="secondary" size="sm">
              Creator Studio
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
