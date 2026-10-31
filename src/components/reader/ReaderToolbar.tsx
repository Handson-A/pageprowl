import React from "react";
import Link from "next/link";
import styles from "./ReaderToolbar.module.css";
import { LuArrowLeft, LuChevronLeft, LuChevronRight } from "react-icons/lu";

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
          <LuArrowLeft size={16} aria-hidden="true" />
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
            <button
              className={styles.navButton}
              aria-label="Previous Episode"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <LuChevronLeft size={16} aria-hidden="true" />
              <span>Prev</span>
            </button>
          </Link>
        )}

        {nextEpisodeSlug && (
          <Link href={`/series/${seriesSlug}/episodes/${nextEpisodeSlug}`}>
            <button
              className={styles.navButton}
              aria-label="Next Episode"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <span>Next</span>
              <LuChevronRight size={16} aria-hidden="true" />
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
