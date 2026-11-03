import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./page.module.css";

export default function PublishingLoading() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Skeleton width="280px" height="36px" />
          <Skeleton width="450px" height="16px" />
        </div>
      </div>

      <div className={styles.statsBar}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.statCard}>
            <Skeleton width="120px" height="14px" />
            <Skeleton width="60px" height="32px" style={{ marginTop: "var(--space-2)" }} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
        <Skeleton width="100%" height="80px" />
        <Skeleton width="100%" height="80px" />
        <Skeleton width="100%" height="80px" />
      </div>
    </main>
  );
}
