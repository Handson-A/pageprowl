"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PaginatedReader.module.css";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  LuBookOpen,
  LuChevronLeft,
  LuChevronRight,
  LuArrowLeft,
  LuArrowRight,
  LuMaximize2,
  LuMinimize2,
} from "react-icons/lu";
import type { ReaderPage } from "./VerticalReader";

export interface PaginatedReaderProps {
  pages: ReaderPage[];
  seriesSlug: string;
  nextEpisodeSlug?: string | null;
  initialPage?: number;
  onPageChange?: (pageNumber: number) => void;
  isImmersive?: boolean;
  onToggleImmersive?: () => void;
}

export function PaginatedReader({
  pages,
  seriesSlug,
  nextEpisodeSlug,
  initialPage = 1,
  onPageChange,
  isImmersive = false,
  onToggleImmersive,
}: PaginatedReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(
    Math.max(0, Math.min(initialPage - 1, (pages?.length || 1) - 1))
  );

  const totalPages = pages?.length || 0;
  const currentPage = pages?.[currentPageIndex];

  const updatePage = useCallback(
    (newIndex: number) => {
      const clamped = Math.max(0, Math.min(newIndex, totalPages - 1));
      setCurrentPageIndex(clamped);
      if (onPageChange) {
        onPageChange(clamped + 1);
      }
    },
    [totalPages, onPageChange]
  );

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < totalPages - 1) {
      updatePage(currentPageIndex + 1);
    }
  }, [currentPageIndex, totalPages, updatePage]);

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      updatePage(currentPageIndex - 1);
    }
  }, [currentPageIndex, updatePage]);

  // Keyboard navigation (ArrowLeft / ArrowRight / Space / F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === "f" || e.key === "F") {
        if (onToggleImmersive) {
          e.preventDefault();
          onToggleImmersive();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPrevPage, onToggleImmersive]);

  if (!pages || pages.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <EmptyState
          icon={<LuBookOpen size={48} color="#9CA3AF" />}
          title="No Pages Available"
          description="This episode currently has no artwork pages published in this revision."
          action={
            <Link href={`/series/${seriesSlug}`} className={styles.primaryBtn}>
              <LuArrowLeft size={16} aria-hidden="true" />
              <span>Back to Series</span>
            </Link>
          }
        />
      </div>
    );
  }

  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === totalPages - 1;

  // Handle click on canvas: left 35% goes previous, right 65% goes next
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.35) {
      goToPrevPage();
    } else {
      goToNextPage();
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.viewport} role="region" aria-label="Comic Book Page View">
        <div
          className={styles.pageStage}
          onClick={handleCanvasClick}
          role="button"
          tabIndex={0}
          aria-label="Click right for next page, click left for previous page"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage.id}
              className={styles.imageFrame}
              initial={{ opacity: 0.85, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.85 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <img
                src={currentPage.imageUrl}
                alt={`Page ${currentPage.pageNumber} of ${totalPages}`}
                className={styles.artwork}
              />
            </motion.div>
          </AnimatePresence>

          {/* Invisible interactive zone helpers */}
          <div className={styles.tapZoneLeft} title="Previous page (or Left Arrow)" />
          <div className={styles.tapZoneRight} title="Next page (or Right Arrow / Space)" />
        </div>

        {/* Floating Dock Navigation Controls */}
        <nav
          className={`${styles.dockControls} ${isImmersive ? styles.dockImmersive : ""}`}
          aria-label="Page navigation controls"
        >
          <button
            type="button"
            className={styles.dockBtn}
            onClick={goToPrevPage}
            disabled={isFirstPage}
            aria-label="Previous Page"
            title="Previous Page (Left Arrow)"
          >
            <LuChevronLeft size={18} aria-hidden="true" />
            <span className={styles.dockBtnLabel}>Previous</span>
          </button>

          {/* Interactive page scrubber / dropdown */}
          <div className={styles.scrubberGroup}>
            <select
              aria-label="Jump to page"
              className={styles.pageSelect}
              value={currentPageIndex}
              onChange={(e) => updatePage(Number(e.target.value))}
            >
              {pages.map((p, idx) => (
                <option key={p.id} value={idx}>
                  Page {idx + 1} of {totalPages}
                </option>
              ))}
            </select>

            <span className={styles.pageCounter} aria-hidden="true">
              {currentPageIndex + 1} <span className={styles.mutedSlash}>/</span> {totalPages}
            </span>
          </div>

          {isLastPage && nextEpisodeSlug ? (
            <Link
              href={`/series/${seriesSlug}/episodes/${nextEpisodeSlug}`}
              className={`${styles.dockBtn} ${styles.dockBtnPrimary}`}
              title="Proceed to next chapter"
            >
              <span className={styles.dockBtnLabel}>Next Chapter</span>
              <LuArrowRight size={18} aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              className={`${styles.dockBtn} ${isLastPage ? styles.dockBtnDisabled : styles.dockBtnPrimary}`}
              onClick={goToNextPage}
              disabled={isLastPage}
              aria-label="Next Page"
              title="Next Page (Right Arrow / Space)"
            >
              <span className={styles.dockBtnLabel}>Next</span>
              <LuChevronRight size={18} aria-hidden="true" />
            </button>
          )}

          {onToggleImmersive && (
            <button
              type="button"
              className={styles.dockIconBtn}
              onClick={onToggleImmersive}
              title={isImmersive ? "Exit Fullscreen" : "Fullscreen (F)"}
              aria-label={isImmersive ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isImmersive ? <LuMinimize2 size={16} aria-hidden="true" /> : <LuMaximize2 size={16} aria-hidden="true" />}
            </button>
          )}
        </nav>
      </main>
    </div>
  );
}
