import React from "react";
import Link from "next/link";
import styles from "./ReaderToolbar.module.css";
import {
  LuArrowLeft,
  LuChevronLeft,
  LuChevronRight,
  LuLayers,
  LuBookOpen,
  LuMaximize2,
  LuMinimize2,
  LuKeyboard,
} from "react-icons/lu";

export interface ReaderToolbarProps {
  seriesTitle: string;
  seriesSlug: string;
  episodeTitle: string;
  episodeNumber: number;
  readingMode?: "scroll" | "paged";
  onModeChange?: (mode: "scroll" | "paged") => void;
  currentPage?: number;
  totalPages?: number;
  prevEpisodeSlug?: string | null;
  nextEpisodeSlug?: string | null;
  isImmersive?: boolean;
  onToggleImmersive?: () => void;
  onToggleKeyboardHelp?: () => void;
}

export function ReaderToolbar({
  seriesTitle,
  seriesSlug,
  episodeTitle,
  episodeNumber,
  readingMode = "scroll",
  onModeChange,
  currentPage,
  totalPages,
  prevEpisodeSlug,
  nextEpisodeSlug,
  isImmersive = false,
  onToggleImmersive,
  onToggleKeyboardHelp,
}: ReaderToolbarProps) {
  return (
    <header className={styles.toolbar} role="banner" aria-label="Comic Reader Navigation">
      <div className={styles.left}>
        <Link
          href={`/series/${seriesSlug}`}
          className={styles.backLink}
          title={`Return to ${seriesTitle}`}
          aria-label="Back to series details"
        >
          <LuArrowLeft size={18} aria-hidden="true" />
          <span className={styles.backLabel}>Series</span>
        </Link>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.titleGroup}>
          <span className={styles.seriesTitle}>{seriesTitle}</span>
          <div className={styles.episodeRow}>
            <span className={styles.episodeBadge}>Ch. {episodeNumber}</span>
            <h1 className={styles.episodeTitle}>{episodeTitle}</h1>
          </div>
        </div>
      </div>

      <div className={styles.center}>
        {/* Reading Mode Segmented Switcher */}
        {onModeChange && (
          <div className={styles.modeSwitcher} role="group" aria-label="Reading Mode">
            <button
              type="button"
              className={`${styles.modeBtn} ${readingMode === "scroll" ? styles.modeActive : ""}`}
              onClick={() => onModeChange("scroll")}
              aria-pressed={readingMode === "scroll"}
              title="Continuous Vertical Scroll (Webtoon)"
            >
              <LuLayers size={14} aria-hidden="true" />
              <span>Scroll</span>
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${readingMode === "paged" ? styles.modeActive : ""}`}
              onClick={() => onModeChange("paged")}
              aria-pressed={readingMode === "paged"}
              title="Paginated Page-by-Page (Comic Book)"
            >
              <LuBookOpen size={14} aria-hidden="true" />
              <span>Paged</span>
            </button>
          </div>
        )}

        {/* Page progress badge for paginated mode */}
        {readingMode === "paged" && currentPage !== undefined && totalPages !== undefined && (
          <span className={styles.pageBadge} aria-live="polite">
            {currentPage} / {totalPages}
          </span>
        )}
      </div>

      <div className={styles.right}>
        {/* Keyboard Shortcuts Trigger */}
        {onToggleKeyboardHelp && (
          <button
            type="button"
            className={styles.iconActionBtn}
            onClick={onToggleKeyboardHelp}
            title="Keyboard shortcuts"
            aria-label="Show keyboard shortcuts"
          >
            <LuKeyboard size={16} aria-hidden="true" />
          </button>
        )}

        {/* Fullscreen / Immersive Toggle */}
        {onToggleImmersive && (
          <button
            type="button"
            className={styles.iconActionBtn}
            onClick={onToggleImmersive}
            title={isImmersive ? "Exit fullscreen mode" : "Enter fullscreen mode"}
            aria-label={isImmersive ? "Exit fullscreen mode" : "Enter fullscreen mode"}
          >
            {isImmersive ? <LuMinimize2 size={16} aria-hidden="true" /> : <LuMaximize2 size={16} aria-hidden="true" />}
          </button>
        )}

        <div className={styles.divider} aria-hidden="true" />

        {/* Episode Transitions */}
        <div className={styles.episodeNavGroup}>
          {prevEpisodeSlug ? (
            <Link
              href={`/series/${seriesSlug}/episodes/${prevEpisodeSlug}`}
              className={styles.navButton}
              title="Previous episode"
              aria-label="Previous episode"
            >
              <LuChevronLeft size={16} aria-hidden="true" />
              <span className={styles.navBtnText}>Prev</span>
            </Link>
          ) : (
            <button className={styles.navButton} disabled aria-label="No previous episode">
              <LuChevronLeft size={16} aria-hidden="true" />
              <span className={styles.navBtnText}>Prev</span>
            </button>
          )}

          {nextEpisodeSlug ? (
            <Link
              href={`/series/${seriesSlug}/episodes/${nextEpisodeSlug}`}
              className={`${styles.navButton} ${styles.navButtonPrimary}`}
              title="Next episode"
              aria-label="Next episode"
            >
              <span className={styles.navBtnText}>Next</span>
              <LuChevronRight size={16} aria-hidden="true" />
            </Link>
          ) : (
            <button className={styles.navButton} disabled aria-label="No next episode">
              <span className={styles.navBtnText}>Next</span>
              <LuChevronRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
