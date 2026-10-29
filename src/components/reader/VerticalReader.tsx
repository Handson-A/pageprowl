import React from "react";
import Link from "next/link";
import styles from "./VerticalReader.module.css";
import { EmptyState } from "@/components/ui/EmptyState";

export interface ReaderPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
}

export interface VerticalReaderProps {
  pages: ReaderPage[];
  seriesSlug: string;
  nextEpisodeSlug?: string | null;
}

export function VerticalReader({
  pages,
  seriesSlug,
  nextEpisodeSlug,
}: VerticalReaderProps) {
  if (!pages || pages.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          icon="🖼️"
          title="No pages available"
          description="This episode currently has no artwork pages published."
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.contentList}>
        {pages.map((page) => (
          <img
            key={page.id}
            src={page.imageUrl}
            alt={`Page ${page.pageNumber}`}
            className={styles.pageImage}
            loading={page.pageNumber <= 2 ? "eager" : "lazy"}
          />
        ))}

        <div className={styles.footerActions}>
          <Link href={`/series/${seriesSlug}`} className={styles.navLink}>
            &larr; Back to Series
          </Link>

          {nextEpisodeSlug ? (
            <Link
              href={`/series/${seriesSlug}/episodes/${nextEpisodeSlug}`}
              className={styles.navLink}
            >
              Next Episode &rarr;
            </Link>
          ) : (
            <span style={{ color: "var(--reader-text-muted)", fontSize: "0.875rem" }}>
              You have reached the latest episode.
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
