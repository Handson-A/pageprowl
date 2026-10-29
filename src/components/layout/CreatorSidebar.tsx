"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./CreatorSidebar.module.css";

export function CreatorSidebar() {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    if (path === "/studio" && pathname === "/studio") return true;
    if (path !== "/studio" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={styles.sidebar} aria-label="Creator Studio Navigation">
      <Link href="/studio" className={styles.brand}>
        <span className={styles.brandDot} aria-hidden="true" />
        <span>Panelverse</span>
        <span className={styles.studioBadge}>Studio</span>
      </Link>

      <nav className={styles.nav}>
        <span className={styles.navSectionTitle}>Workspace</span>
        <Link
          href="/studio"
          className={`${styles.navItem} ${
            isLinkActive("/studio") ? styles.active : ""
          }`}
        >
          <span>📊</span>
          <span>Dashboard</span>
        </Link>
        <Link
          href="/studio/series"
          className={`${styles.navItem} ${
            isLinkActive("/studio/series") ? styles.active : ""
          }`}
        >
          <span>📚</span>
          <span>My Series</span>
        </Link>
        <Link
          href="/studio/studios"
          className={`${styles.navItem} ${
            isLinkActive("/studio/studios") ? styles.active : ""
          }`}
        >
          <span>🏢</span>
          <span>Studio Teams</span>
        </Link>

        <span className={styles.navSectionTitle}>Collaboration</span>
        <Link
          href="/studio/reviews"
          className={`${styles.navItem} ${
            isLinkActive("/studio/reviews") ? styles.active : ""
          }`}
        >
          <span>💬</span>
          <span>Reviews &amp; Tasks</span>
        </Link>

        <span className={styles.navSectionTitle}>Platform</span>
        <Link href="/" className={styles.navItem}>
          <span>🌐</span>
          <span>Public Reader</span>
        </Link>
      </nav>

      <div className={styles.footer}>
        <Link href="/login?action=signout" className={styles.navItem}>
          <span>🚪</span>
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
