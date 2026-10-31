import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./page.module.css";

export default function BrowseLoading() {
  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        <div className={styles.header}>
          <Skeleton width="260px" height="38px" style={{ marginBottom: "var(--space-2)" }} />
          <Skeleton width="480px" height="18px" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className={styles.filterBar}>
          <Skeleton height="42px" style={{ borderRadius: "var(--radius-md)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <Skeleton width="100px" height="14px" />
            <Skeleton height="36px" style={{ borderRadius: "var(--radius-full)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <Skeleton width="80px" height="14px" />
            <Skeleton width="320px" height="32px" style={{ borderRadius: "var(--radius-full)" }} />
          </div>
        </div>

        {/* Comics Grid Skeleton */}
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="card" height="340px" />
          ))}
        </div>
      </main>
    </div>
  );
}
