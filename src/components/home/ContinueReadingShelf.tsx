"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./ContinueReadingShelf.module.css";
import { getAllReadingProgress, clearSeriesReadingProgress, type ReadingProgressEntry } from "@/lib/reading-progress";
import { LuBookOpen, LuArrowRight, LuX, LuClock } from "react-icons/lu";

function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHr > 0) return `${diffHr}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return "Just now";
}

export function ContinueReadingShelf() {
  const [history, setHistory] = useState<ReadingProgressEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(getAllReadingProgress());
  }, []);

  const handleDismiss = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    clearSeriesReadingProgress(slug);
    setHistory((prev) => prev.filter((item) => item.seriesSlug !== slug));
  };

  if (!mounted || history.length === 0) {
    return null;
  }

  return (
    <section className={styles.shelfSection} aria-label="Jump back into reading">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <LuBookOpen size={20} className={styles.headerIcon} aria-hidden="true" />
            <h2 className={styles.title}>Continue Reading</h2>
          </div>
          <span className={styles.subtitle}>Locally saved reading progress</span>
        </div>

        <div className={styles.grid}>
          {history.slice(0, 3).map((item) => (
            <div key={item.seriesSlug} className={styles.cardWrapper}>
              <Link
                href={`/series/${item.seriesSlug}/episodes/${item.episodeSlug}`}
                className={styles.card}
              >
                <div className={styles.cardContent}>
                  <div className={styles.metaRow}>
                    <span className={styles.episodeTag}>
                      Episode {item.episodeNumber}
                    </span>
                    <span className={styles.timeTag}>
                      <LuClock size={12} aria-hidden="true" />
                      <span>{formatTimeAgo(item.lastReadAt)}</span>
                    </span>
                  </div>

                  <h3 className={styles.seriesTitle}>{item.seriesTitle}</h3>

                  {item.episodeTitle && (
                    <p className={styles.episodeTitle}>{item.episodeTitle}</p>
                  )}

                  <div className={styles.progressInfo}>
                    {item.format === "scroll" ? (
                      <span className={styles.pageLabel}>Vertical Scroll</span>
                    ) : item.totalPages ? (
                      <span className={styles.pageLabel}>
                        Page {item.pageNumber} of {item.totalPages}
                      </span>
                    ) : (
                      <span className={styles.pageLabel}>Page {item.pageNumber}</span>
                    )}
                  </div>
                </div>

                <div className={styles.cardAction}>
                  <span className={styles.resumeBtn}>
                    <span>Resume</span>
                    <LuArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>

              <button
                type="button"
                className={styles.dismissBtn}
                onClick={(e) => handleDismiss(e, item.seriesSlug)}
                title="Remove from continue reading"
                aria-label={`Remove ${item.seriesTitle} from reading history`}
              >
                <LuX size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
