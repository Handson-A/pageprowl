"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PaginatedReader.module.css";
import { EmptyState } from "@/components/ui/EmptyState";
import { LuBookOpen, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { ReaderPage } from "./VerticalReader";

export interface PaginatedReaderProps {
  pages: ReaderPage[];
  seriesSlug: string;
  nextEpisodeSlug?: string | null;
  initialPage?: number;
}

export function PaginatedReader({
  pages,
  seriesSlug,
  nextEpisodeSlug,
  initialPage = 1,
}: PaginatedReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(
    Math.max(0, Math.min(initialPage - 1, pages.length - 1))
  );

  const totalPages = pages.length;
  const currentPage = pages[currentPageIndex];

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  }, [currentPageIndex, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  }, [currentPageIndex]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        goToNextPage();
      } else if (e.key === "ArrowLeft") {
        goToPrevPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  if (!pages || pages.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          icon={<LuBookOpen size={44} color="var(--reader-text-muted)" />}
          title="No pages available"
          description="This episode currently has no artwork pages published."
        />
      </div>
    );
  }

  const isLastPage = currentPageIndex === totalPages - 1;

  return (
    <div className={styles.container}>
      <main className={styles.viewer}>
        <div
          className={styles.imageWrapper}
          onClick={goToNextPage}
          role="button"
          tabIndex={0}
          aria-label="Next page"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPage.id}
              src={currentPage.imageUrl}
              alt={`Page ${currentPage.pageNumber}`}
              className={styles.pageImage}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.15 }}
            />
          </AnimatePresence>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.btn}
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            aria-label="Previous Page"
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <LuChevronLeft size={16} aria-hidden="true" />
            <span>Previous</span>
          </button>

          <span className={styles.pageIndicator}>
            Page {currentPageIndex + 1} of {totalPages}
          </span>

          {isLastPage && nextEpisodeSlug ? (
            <Link
              href={`/series/${seriesSlug}/episodes/${nextEpisodeSlug}`}
              className={styles.btn}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <span>Next Episode</span>
              <LuChevronRight size={16} aria-hidden="true" />
            </Link>
          ) : (
            <button
              className={styles.btn}
              onClick={goToNextPage}
              disabled={isLastPage}
              aria-label="Next Page"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <span>Next</span>
              <LuChevronRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
