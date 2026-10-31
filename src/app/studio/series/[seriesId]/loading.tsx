import React from "react";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/app/studio/page.module.css";
import wsStyles from "./SeriesWorkspace.module.css";

export default function SeriesWorkspaceLoading() {
  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        {/* Breadcrumb Skeleton */}
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginBottom: "var(--space-2)" }}>
          <Skeleton width="100px" height="16px" />
        </div>

        {/* Hero Banner Skeleton */}
        <div className={wsStyles.heroBanner} style={{ padding: "var(--space-8)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: "600px" }}>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Skeleton width="90px" height="22px" />
              <Skeleton width="70px" height="22px" />
              <Skeleton width="80px" height="22px" />
            </div>
            <Skeleton width="320px" height="38px" />
            <Skeleton width="100%" height="16px" />
            <Skeleton width="80%" height="16px" />
            <Skeleton width="200px" height="14px" />
          </div>
        </div>

        {/* Tab Navigation Skeleton */}
        <div className={wsStyles.tabNav}>
          <Skeleton width="120px" height="36px" />
          <Skeleton width="180px" height="36px" />
          <Skeleton width="110px" height="36px" />
          <Skeleton width="90px" height="36px" />
        </div>

        {/* Episodes List Skeleton */}
        <div className={wsStyles.episodeList} style={{ marginTop: "var(--space-4)" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={wsStyles.episodeCard}>
              <div className={wsStyles.episodeLeft}>
                <Skeleton width="90px" height="56px" style={{ borderRadius: "var(--radius-sm)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: 1 }}>
                  <Skeleton width="240px" height="20px" />
                  <Skeleton width="140px" height="14px" />
                </div>
              </div>
              <Skeleton width="100px" height="32px" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
