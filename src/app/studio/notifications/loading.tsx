import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/app/studio/page.module.css";

export default function NotificationsLoading() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Skeleton width="240px" height="36px" />
          <Skeleton width="400px" height="16px" />
        </div>
      </header>

      <section className={styles.section} style={{ marginTop: "var(--space-6)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width="100%" height="70px" style={{ borderRadius: "var(--radius-md)" }} />
          ))}
        </div>
      </section>
    </main>
  );
}
