import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "./page.module.css";

export default function TasksLoading() {
  return (
    <main className={styles.tasksMain}>
      <header className={styles.header}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <Skeleton width="280px" height="36px" />
          <Skeleton width="450px" height="16px" />
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="card" height="400px" />
        ))}
      </div>
    </main>
  );
}
