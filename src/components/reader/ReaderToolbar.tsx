import React from "react";
import Link from "next/link";
import styles from "./ReaderToolbar.module.css";

export interface ReaderToolbarProps {
  seriesTitle: string;
  seriesSlug: string;
  episodeTitle: string;
  episodeNumber: number;
  currentPage?: number;
  totalPages?: number;
  prevEpisodeSlug?: string | null;
  nextEpisodeSlug?: string | null;
}

export function ReaderToolbar({
  seriesTitle,
  seriesSlug,
  episodeTitle,
  episodeNumber,
  currentPage,
  totalPages,
  prevEpisodeSlug,
  nextEpisodeSlug,
}: ReaderToolbarProps) {
  return (
    <header className={styles.toolbar}>
      <div className={styles.left}>
        <Link href={`/series/${seriesSlug}`} className={styles.backLink}>
          <span>&larr;</span>
          <span>Series</span>
        </Link>
        <div className={styles.titleGroup}>
          <span className={styles.seriesTitle}>{seriesTitle}</span>
          <span className={styles.episodeTitle}>
            Ep. {episodeNumber}: {episodeTitle}
          </span>
        </div>
      </div>

      <div className={styles.right}>
        {currentPage !== undefined && totalPages !== undefined && (
          <span className={styles.progressText}>
            Page {currentPage} of {totalPages}
          </span>
        )}

        {prevEpisodeSlug && (
          <Link href={`/series/${seriesSlug}/episodes/${prevEpisodeSlug}`}>
            <button className={styles.navButton} aria-label="Previous Episode">
              &larr; Prev
            </button>
          </Link>
        )}

        {nextEpisodeSlug && (
          <Link href={`/series/${seriesSlug}/episodes/${nextEpisodeSlug}`}>
            <button className={styles.navButton} aria-label="Next Episode">
              Next &rarr;
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
