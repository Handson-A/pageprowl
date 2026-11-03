import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/app/studio/page.module.css";

export default function StudiosLoading() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Skeleton width="220px" height="36px" />
          <Skeleton width="450px" height="16px" />
        </div>
      </header>

      <section className={styles.section} style={{ marginTop: "var(--space-6)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-5)" }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="card" height="200px" />
          ))}
        </div>
      </section>
    </main>
  );
}
