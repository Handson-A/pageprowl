"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LuShieldAlert } from "react-icons/lu";
import styles from "./page.module.css";

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Studio workspace error:", error.message);
  }, [error]);

  return (
    <main
        className={styles.main}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "80vh",
        }}
      >
        <div style={{ marginBottom: "var(--space-3)" }} aria-hidden="true">
          <LuShieldAlert size={52} color="var(--color-primary)" />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "var(--font-size-2xl)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text)",
            marginBottom: "var(--space-2)",
          }}
        >
          Workspace Error
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            maxWidth: "460px",
            marginBottom: "var(--space-6)",
            lineHeight: 1.6,
          }}
        >
          {error.message.includes("permission") || error.message.includes("not a member")
            ? error.message
            : "An issue occurred while loading this workspace area. You may lack required permissions or the resource may be unavailable."}
        </p>

        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <Button variant="primary" onClick={() => reset()}>
            Retry
          </Button>
          <Link href="/studio">
            <Button variant="secondary">Back to Studio Dashboard</Button>
          </Link>
        </div>
      </main>
  );
}
