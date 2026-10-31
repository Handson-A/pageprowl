"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/Button";
import { LuTriangleAlert, LuRotateCcw } from "react-icons/lu";
import styles from "./page.module.css";

export default function SeriesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public series loading error:", error.message);
  }, [error]);

  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "var(--space-16) var(--space-4)",
            gap: "var(--space-4)",
          }}
        >
          <div aria-hidden="true">
            <LuTriangleAlert size={52} color="var(--color-warning)" />
          </div>

          <h1 className={styles.title} style={{ fontSize: "2rem" }}>
            Unable to Load Series
          </h1>

          <p className={styles.synopsis} style={{ maxWidth: "460px", lineHeight: 1.6 }}>
            We encountered a problem loading this comic series. You can try reloading or browse other available titles.
          </p>

          <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
            <Button variant="primary" onClick={() => reset()}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <LuRotateCcw size={16} aria-hidden="true" />
                <span>Try Again</span>
              </span>
            </Button>
            <Link href="/browse">
              <Button variant="secondary">Browse All Comics</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
