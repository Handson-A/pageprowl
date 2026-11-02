"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./VerticalReader.module.css";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  LuImage,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuCircleCheck,
  LuBookOpen,
} from "react-icons/lu";

export interface ReaderPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
}

export interface VerticalReaderProps {
  pages: ReaderPage[];
  seriesSlug: string;
  seriesTitle?: string;
  episodeTitle?: string;
  episodeNumber?: number;
  nextEpisodeSlug?: string | null;
  onImageClick?: () => void;
}

export function VerticalReader({
  pages,
  seriesSlug,
  seriesTitle,
  episodeTitle,
  episodeNumber,
  nextEpisodeSlug,
  onImageClick,
}: VerticalReaderProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!pages || pages.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <EmptyState
          icon={<LuImage size={48} color="#9CA3AF" />}
          title="No Artwork Published"
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

  return (
    <div className={styles.verticalContainer}>
      <main className={styles.panelCanvas} role="region" aria-label="Episode Artwork Canvas">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={styles.imageSlot}
            onClick={onImageClick}
          >
            <img
              src={page.imageUrl}
              alt={`Page ${page.pageNumber}`}
              className={styles.comicSlice}
              loading={index < 3 ? "eager" : "lazy"}
              decoding={index < 3 ? "sync" : "async"}
              onError={(e) => {
                e.currentTarget.src = "/images/artwork-fallback.svg";
              }}
            />
          </div>
        ))}

        {/* Studio End-of-Episode Card */}
        <section className={styles.endOfEpisodeCard}>
          <div className={styles.completionBadge}>
            <LuCircleCheck size={16} aria-hidden="true" />
            <span>Episode Complete</span>
          </div>

          <div className={styles.endTitles}>
            {episodeNumber !== undefined && (
              <span className={styles.endEpLabel}>Chapter {episodeNumber}</span>
            )}
            {episodeTitle && <h2 className={styles.endEpTitle}>{episodeTitle}</h2>}
            {seriesTitle && <p className={styles.endSeriesLabel}>From {seriesTitle}</p>}
          </div>

          <div className={styles.actionButtonGroup}>
            {nextEpisodeSlug ? (
              <Link
                href={`/series/${seriesSlug}/episodes/${nextEpisodeSlug}`}
                className={styles.nextEpisodeBtn}
              >
                <span>Continue to Next Chapter</span>
                <LuArrowRight size={18} aria-hidden="true" />
              </Link>
            ) : (
              <div className={styles.caughtUpBanner}>
                <LuBookOpen size={20} aria-hidden="true" />
                <div>
                  <span className={styles.caughtUpTitle}>You are all caught up!</span>
                  <p className={styles.caughtUpSub}>
                    Check back soon for new chapter releases and production updates.
                  </p>
                </div>
              </div>
            )}

            <Link href={`/series/${seriesSlug}`} className={styles.secondaryBtn}>
              <LuArrowLeft size={16} aria-hidden="true" />
              <span>Series Overview</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={styles.scrollTopFab}
          title="Scroll back to top"
          aria-label="Scroll back to top"
        >
          <LuArrowUp size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
