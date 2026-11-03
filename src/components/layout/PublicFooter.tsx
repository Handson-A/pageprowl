import React from "react";
import Link from "next/link";
import { PageProwlLogo } from "@/components/brand/PageProwlLogo";
import styles from "./PublicFooter.module.css";

export function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" aria-label="PageProwl Home" className={styles.logoLink}>
              <PageProwlLogo variant="full" size="sm" />
            </Link>
            <p className={styles.tagline}>
              A collaborative comic publishing platform connecting readers, independent creators, and creative studios.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.column}>
              <span className={styles.columnTitle}>Explore</span>
              <Link href="/discover" className={styles.link}>
                Discover
              </Link>
              <Link href="/browse" className={styles.link}>
                All Comics
              </Link>
              <Link href="/genres" className={styles.link}>
                Genres
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
          <span className={styles.copyright}>&copy; {new Date().getFullYear()} PageProwl. All rights reserved.</span>
          <span className={styles.credit}>Made for comic creators &amp; readers worldwide.</span>
        </div>
      </div>
    </footer>
  );
}
