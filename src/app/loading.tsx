import React from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./page.module.css";

export default function RootLoading() {
  return (
    <div className={styles.page}>
      <PublicHeader />
      <main className={styles.mainContent}>
        <div style={{ maxWidth: "var(--container-max-width)", margin: "0 auto", padding: "var(--space-12) var(--space-6)" }}>
          {/* Hero Section Skeleton */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)", marginBottom: "var(--space-16)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <Skeleton width="180px" height="24px" />
              <Skeleton width="90%" height="48px" />
              <Skeleton width="75%" height="48px" />
              <Skeleton width="100%" height="20px" />
              <Skeleton width="80%" height="20px" />
              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <Skeleton width="160px" height="44px" />
                <Skeleton width="140px" height="44px" />
              </div>
            </div>
            <div>
              <Skeleton height="360px" style={{ borderRadius: "var(--pv-radius-lg)" }} />
            </div>
          </div>

          {/* Featured Grid Skeleton */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton width="220px" height="32px" />
              <Skeleton width="80px" height="20px" />
            </div>
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="card" height="340px" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
