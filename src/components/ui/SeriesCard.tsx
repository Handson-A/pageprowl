import React from "react";
import Link from "next/link";
import styles from "./SeriesCard.module.css";
import type { SeriesWithCreator } from "@/lib/data/series";

export interface SeriesCardProps {
  series: SeriesWithCreator;
}

export function SeriesCard({ series }: SeriesCardProps) {
  return (
    <Link href={`/series/${series.slug}`} className={styles.card}>
      <div className={styles.coverWrapper}>
        {series.cover_url ? (
          <img
            src={series.cover_url}
            alt={series.title}
            className={styles.coverImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.coverFallback} aria-hidden="true">
            🎨
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.badges}>
          <span className={styles.badge}>{series.genre}</span>
          <span className={`${styles.badge} ${styles.formatBadge}`}>
            {series.format === "scroll" ? "Vertical Scroll" : "Page by Page"}
          </span>
        </div>

        <h3 className={styles.title}>{series.title}</h3>
        <p className={styles.creator}>By {series.creator_name || "Creator"}</p>
        <p className={styles.synopsis}>{series.synopsis}</p>
      </div>
    </Link>
  );
}
