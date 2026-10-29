"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./PaginatedReader.module.css";
import { EmptyState } from "@/components/ui/EmptyState";
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
          icon="📖"
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
          <img
            src={currentPage.imageUrl}
            alt={`Page ${currentPage.pageNumber}`}
            className={styles.pageImage}
          />
        </div>

        <div className={styles.controls}>
          <button
            className={styles.btn}
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            aria-label="Previous Page"
          >
            &larr; Previous
          </button>

          <span className={styles.pageIndicator}>
            Page {currentPageIndex + 1} of {totalPages}
          </span>

          {isLastPage && nextEpisodeSlug ? (
            <Link
              href={`/series/${seriesSlug}/episodes/${nextEpisodeSlug}`}
              className={styles.btn}
            >
              Next Episode &rarr;
            </Link>
          ) : (
            <button
              className={styles.btn}
              onClick={goToNextPage}
              disabled={isLastPage}
              aria-label="Next Page"
            >
              Next &rarr;
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
