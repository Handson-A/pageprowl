"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FiAlertTriangle } from "react-icons/fi";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log safe error representation without exposing sensitive details to user
    console.error("Panelverse encountered an application error:", error.message);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-8)",
        textAlign: "center",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div style={{ marginBottom: "var(--space-4)" }} aria-hidden="true">
        <FiAlertTriangle size={56} color="var(--color-warning)" />
      </div>
      <h1
        style={{
          fontFamily: "var(--font-family-heading)",
          fontSize: "var(--font-size-3xl)",
          fontWeight: "var(--font-weight-bold)",
          marginBottom: "var(--space-2)",
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          color: "var(--color-text-muted)",
          maxWidth: "480px",
          marginBottom: "var(--space-6)",
          lineHeight: 1.6,
        }}
      >
        An unexpected error occurred while loading this view. You can attempt to retry the operation or return to the home screen.
      </p>

      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <Button variant="primary" onClick={() => reset()}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="secondary">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
