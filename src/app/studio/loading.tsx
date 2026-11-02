import React from "react";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./page.module.css";

export default function StudioLoading() {
  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <div className={styles.dashboardContainer}>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Skeleton width="100px" height="14px" />
                  <Skeleton width="30px" height="30px" style={{ borderRadius: "var(--pv-radius-sm)" }} />
                </div>
                <Skeleton width="60px" height="34px" style={{ margin: "var(--space-2) 0 var(--space-1)" }} />
                <Skeleton width="120px" height="12px" />
              </div>
            ))}
          </div>

          {/* Two-Column Grid Skeleton (4 cards matching the 2-column split sections) */}
          <div className={styles.twoColumnGrid}>
            {/* Card 1: Continue Working Skeleton */}
            <div className={styles.columnCard}>
              <div className={styles.cardHeader}>
                <Skeleton width="160px" height="20px" />
                <Skeleton width="80px" height="16px" />
              </div>
              <div className={styles.cardBody}>
                <div style={{ display: "flex", gap: "var(--space-5)", alignItems: "center", flex: 1, padding: "var(--space-2) 0" }}>
                  <Skeleton width="104px" height="136px" style={{ borderRadius: "var(--radius-md)", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                    <Skeleton width="80px" height="16px" />
                    <Skeleton width="180px" height="24px" />
                    <Skeleton width="140px" height="14px" />
                    <Skeleton width="130px" height="32px" style={{ marginTop: "var(--space-2)" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: My Tasks Skeleton */}
            <div className={styles.columnCard}>
              <div className={styles.cardHeader}>
                <Skeleton width="140px" height="20px" />
                <Skeleton width="80px" height="16px" />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardList}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} width="100%" height="52px" style={{ borderRadius: "var(--pv-radius-sm)" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: My Reviews Queue Skeleton */}
            <div className={styles.columnCard}>
              <div className={styles.cardHeader}>
                <Skeleton width="160px" height="20px" />
                <Skeleton width="60px" height="16px" />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardList}>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} width="100%" height="52px" style={{ borderRadius: "var(--pv-radius-sm)" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4: Recent Production Activity Skeleton */}
            <div className={styles.columnCard}>
              <div className={styles.cardHeader}>
                <Skeleton width="180px" height="20px" />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.activityList}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.activityItem}>
                      <Skeleton width="16px" height="16px" variant="circle" />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                        <Skeleton width="90%" height="14px" />
                        <Skeleton width="80px" height="10px" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Series Catalog Skeleton */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <Skeleton width="200px" height="24px" />
                <Skeleton width="280px" height="14px" />
              </div>
              <Skeleton width="120px" height="32px" />
            </div>
            <div className={`${styles.seriesGrid} ${styles.dashboardSeriesGrid}`}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="card" height="320px" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
