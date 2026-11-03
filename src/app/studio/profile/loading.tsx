import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/app/studio/page.module.css";

export default function ProfileLoading() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Skeleton width="280px" height="36px" />
          <Skeleton width="450px" height="16px" />
        </div>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", marginTop: "var(--space-6)", maxWidth: "800px" }}>
        <Skeleton width="100%" height="220px" style={{ borderRadius: "var(--radius-lg)" }} />
        <Skeleton width="100%" height="300px" style={{ borderRadius: "var(--radius-lg)" }} />
      </div>
    </main>
  );
}
