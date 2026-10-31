import React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";
import { LuBookOpen } from "react-icons/lu";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <PublicHeader />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-12) var(--space-4)",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "var(--space-4)" }} aria-hidden="true">
          <LuBookOpen size={56} color="var(--color-primary)" />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "var(--font-size-3xl)",
            fontWeight: "var(--font-weight-bold)",
            color: "var(--color-text)",
            marginBottom: "var(--space-2)",
          }}
        >
          Page Not Found
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            maxWidth: "480px",
            marginBottom: "var(--space-6)",
            lineHeight: 1.6,
          }}
        >
          The comic chapter, studio workspace, or resource you are looking for does not exist or has been moved.
        </p>

        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <Link href="/">
            <Button variant="primary">Return Home</Button>
          </Link>
          <Link href="/browse">
            <Button variant="secondary">Browse Comics</Button>
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
