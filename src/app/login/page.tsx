"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/client";
import { getSafeRedirectUrl } from "@/lib/auth/redirect";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || searchParams.get("next");
  const destination = getSafeRedirectUrl(rawRedirect, "/studio");
  const isSignOut = searchParams.get("action") === "signout";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(
    isSignOut ? "You have been successfully signed out." : null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignOut) {
      const supabase = createClient();
      supabase.auth.signOut().then(() => {
        router.refresh();
      });
    }
  }, [isSignOut, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push(destination);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const signupHref =
    destination !== "/studio"
      ? `/signup?redirect=${encodeURIComponent(destination)}`
      : "/signup";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>
          Access your creator studio and reading library
        </p>
      </div>

      {infoMessage && (
        <div
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1px solid var(--color-success)",
            color: "var(--color-success)",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "0.875rem",
            marginBottom: "var(--space-4)",
          }}
        >
          {infoMessage}
        </div>
      )}

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormField label="Email Address" htmlFor="email" required>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="creator@panelverse.com"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--color-border)",
            }}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" required>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--color-border)",
            }}
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          style={{ marginTop: "8px" }}
        >
          Sign In
        </Button>
      </form>

      <div className={styles.footer}>
        Don&apos;t have an account yet?{" "}
        <Link href={signupHref} className={styles.link}>
          Create one
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <PublicHeader />
      <main className={styles.main}>
        <Suspense
          fallback={
            <div className={styles.card}>
              <p style={{ color: "var(--color-text-muted)" }}>Loading Sign In...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}
