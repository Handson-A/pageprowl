import React from "react";
import Link from "next/link";
import { PanelverseLogo } from "@/components/brand/PanelverseLogo";
import styles from "./PublicFooter.module.css";

export function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" aria-label="Panelverse Home">
              <PanelverseLogo variant="full" size="sm" />
            </Link>
            <p className={styles.tagline} style={{ marginTop: "var(--space-3)" }}>
              A collaborative comic publishing platform connecting readers, independent creators, and creative studios.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.column}>
              <span className={styles.columnTitle}>Explore</span>
              <Link href="/browse" className={styles.link}>
                All Comics
              </Link>
              <Link href="/browse?genre=Action" className={styles.link}>
                Action
              </Link>
              <Link href="/browse?genre=Sci-Fi" className={styles.link}>
                Sci-Fi
              </Link>
            </div>

            <div className={styles.column}>
              <span className={styles.columnTitle}>Creators</span>
              <Link href="/studio" className={styles.link}>
                Creator Studio
              </Link>
              <Link href="/login" className={styles.link}>
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>&copy; {new Date().getFullYear()} Panelverse. All rights reserved.</span>
          <span>Made for comic creators &amp; readers worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
