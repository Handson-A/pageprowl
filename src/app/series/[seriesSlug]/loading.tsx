import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./page.module.css";

export default function SeriesLoading() {
  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        <div className={styles.seriesHeader}>
          <div className={styles.coverWrapper}>
            <Skeleton width="100%" height="100%" style={{ position: "absolute", inset: 0 }} />
          </div>

          <div className={styles.seriesMeta}>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Skeleton width="80px" height="22px" />
              <Skeleton width="110px" height="22px" />
            </div>

            <Skeleton width="340px" height="40px" />
            <Skeleton width="200px" height="18px" />
            <Skeleton width="100%" height="16px" />
            <Skeleton width="85%" height="16px" />

            <div style={{ marginTop: "var(--space-4)" }}>
              <Skeleton width="160px" height="44px" />
            </div>
          </div>
        </div>

        <div className={styles.episodesSection}>
          <Skeleton width="200px" height="28px" style={{ marginBottom: "var(--space-4)" }} />
          <div className={styles.episodesList}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.episodeCard}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <Skeleton width="220px" height="20px" />
                  <Skeleton width="120px" height="12px" />
                </div>
                <Skeleton width="80px" height="32px" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
