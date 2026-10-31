"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/Button";
import { LuTriangleAlert, LuRotateCcw } from "react-icons/lu";
import styles from "./page.module.css";

export default function BrowseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Browse catalog query failed:", error.message);
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
            Unable to Load Catalog
          </h1>

          <p className={styles.subtitle} style={{ maxWidth: "460px", lineHeight: 1.6 }}>
            A temporary issue prevented us from loading the comic series list. Your internet connection may be interrupted or the server is momentarily unreachable.
          </p>

          <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
            <Button variant="primary" onClick={() => reset()}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <LuRotateCcw size={16} aria-hidden="true" />
                <span>Retry</span>
              </span>
            </Button>
            <Link href="/">
              <Button variant="secondary">Go to Homepage</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
