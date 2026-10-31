import React from "react";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./page.module.css";

export default function StudioLoading() {
  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        {/* Welcome Banner Skeleton */}
        <div className={styles.welcomeBanner}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <Skeleton width="280px" height="32px" />
            <Skeleton width="380px" height="16px" />
          </div>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <Skeleton width="130px" height="36px" />
            <Skeleton width="120px" height="36px" />
          </div>
        </div>

        {/* 4 Stats Cards Skeleton */}
        <div className={styles.statsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.statCard}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton width="100px" height="14px" />
                <Skeleton width="16px" height="16px" variant="circle" />
              </div>
              <Skeleton width="60px" height="38px" style={{ margin: "var(--space-1) 0" }} />
              <Skeleton width="120px" height="12px" />
            </div>
          ))}
        </div>

        {/* Two-Column Grid Skeleton */}
        <div className={styles.twoColumnGrid}>
          <div className={styles.columnCard}>
            <Skeleton width="160px" height="20px" style={{ marginBottom: "var(--space-3)" }} />
            <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
              <Skeleton width="110px" height="140px" style={{ borderRadius: "var(--radius-md)" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <Skeleton width="80px" height="16px" />
                <Skeleton width="180px" height="24px" />
                <Skeleton width="140px" height="14px" />
                <Skeleton width="130px" height="32px" style={{ marginTop: "var(--space-2)" }} />
              </div>
            </div>
          </div>

          <div className={styles.columnCard}>
            <Skeleton width="160px" height="20px" style={{ marginBottom: "var(--space-3)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.activityItem}>
                  <Skeleton width="20px" height="20px" variant="circle" />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <Skeleton width="90%" height="14px" />
                    <Skeleton width="80px" height="10px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Series Catalog Skeleton */}
        <div className={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
            <Skeleton width="200px" height="24px" />
            <Skeleton width="100px" height="32px" />
          </div>
          <div className={styles.seriesGrid}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="card" height="320px" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
