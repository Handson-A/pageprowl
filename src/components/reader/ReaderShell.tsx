"use client";

import React, { useState, useEffect } from "react";
import { ReaderToolbar } from "./ReaderToolbar";
import { VerticalReader, type ReaderPage } from "./VerticalReader";
import { PaginatedReader } from "./PaginatedReader";
import styles from "./ReaderShell.module.css";
import { LuX, LuKeyboard } from "react-icons/lu";

export interface ReaderShellProps {
  series: {
    id: string;
    title: string;
    slug: string;
    format: "scroll" | "paged" | string;
  };
  episode: {
    id: string;
    title: string;
    slug: string;
    episode_number: number;
  };
  pages: ReaderPage[];
  prevEpisodeSlug?: string | null;
  nextEpisodeSlug?: string | null;
}

export function ReaderShell({
  series,
  episode,
  pages,
  prevEpisodeSlug,
  nextEpisodeSlug,
}: ReaderShellProps) {
  const [readingMode, setReadingMode] = useState<"scroll" | "paged">(
    series.format === "scroll" ? "scroll" : "paged"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isImmersive, setIsImmersive] = useState<boolean>(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

  // Esc key to exit modal or immersive
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
        } else if (isImmersive) {
          setIsImmersive(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showKeyboardHelp, isImmersive]);

  return (
    <div
      className={`${styles.readerShell} ${isImmersive ? styles.immersiveShell : ""}`}
      style={{ backgroundColor: "var(--reader-bg, #0A0A0A)", minHeight: "100vh" }}
    >
      {/* Top Toolbar */}
      <div className={`${styles.toolbarWrapper} ${isImmersive ? styles.toolbarHidden : ""}`}>
        <ReaderToolbar
          seriesTitle={series.title}
          seriesSlug={series.slug}
          episodeTitle={episode.title}
          episodeNumber={episode.episode_number}
          readingMode={readingMode}
          onModeChange={setReadingMode}
          currentPage={currentPage}
          totalPages={pages.length}
          prevEpisodeSlug={prevEpisodeSlug}
          nextEpisodeSlug={nextEpisodeSlug}
          isImmersive={isImmersive}
          onToggleImmersive={() => setIsImmersive((prev) => !prev)}
          onToggleKeyboardHelp={() => setShowKeyboardHelp((prev) => !prev)}
        />
      </div>

      {/* Reader Body */}
      <div className={styles.readerCanvas}>
        {readingMode === "scroll" ? (
          <VerticalReader
            pages={pages}
            seriesSlug={series.slug}
            seriesTitle={series.title}
            episodeTitle={episode.title}
            episodeNumber={episode.episode_number}
            nextEpisodeSlug={nextEpisodeSlug}
            onImageClick={() => {
              if (isImmersive) setIsImmersive(false);
            }}
          />
        ) : (
          <PaginatedReader
            pages={pages}
            seriesSlug={series.slug}
            nextEpisodeSlug={nextEpisodeSlug}
            initialPage={currentPage}
            onPageChange={setCurrentPage}
            isImmersive={isImmersive}
            onToggleImmersive={() => setIsImmersive((prev) => !prev)}
          />
        )}
      </div>

      {/* Keyboard Shortcuts Dialog */}
      {showKeyboardHelp && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowKeyboardHelp(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="keyboard-shortcuts-title"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleRow}>
                <LuKeyboard size={20} color="var(--color-primary)" aria-hidden="true" />
                <h3 id="keyboard-shortcuts-title" className={styles.modalTitle}>
                  Reader Navigation
                </h3>
              </div>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setShowKeyboardHelp(false)}
                aria-label="Close shortcuts dialog"
              >
                <LuX size={18} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.shortcutsList}>
              <div className={styles.shortcutItem}>
                <span>Next page</span>
                <div className={styles.keyCombo}>
                  <kbd>→</kbd>
                  <span>or</span>
                  <kbd>Space</kbd>
                </div>
              </div>
              <div className={styles.shortcutItem}>
                <span>Previous page</span>
                <div className={styles.keyCombo}>
                  <kbd>←</kbd>
                </div>
              </div>
              <div className={styles.shortcutItem}>
                <span>Fullscreen mode</span>
                <div className={styles.keyCombo}>
                  <kbd>F</kbd>
                </div>
              </div>
              <div className={styles.shortcutItem}>
                <span>Exit fullscreen / Close</span>
                <div className={styles.keyCombo}>
                  <kbd>Esc</kbd>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.modalDismissBtn}
                onClick={() => setShowKeyboardHelp(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
