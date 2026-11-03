import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/app/studio/page.module.css";

export default function SeriesListLoading() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Skeleton width="220px" height="36px" />
          <Skeleton width="400px" height="16px" />
        </div>
        <Skeleton width="160px" height="40px" />
      </header>

      <section className={styles.section} style={{ marginTop: "var(--space-6)" }}>
        <div className={styles.seriesGrid}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="card" height="340px" />
          ))}
        </div>
      </section>
    </main>
  );
}
