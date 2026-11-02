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
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
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
    if (typeof window !== "undefined" && !navigator.onLine) {
      setError("You appear to be offline. Please connect to the internet to sign in.");
      return;
    }

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

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !recoveryEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/login?action=recovered`
          : undefined;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        recoveryEmail,
        { redirectTo: redirectUrl }
      );

      if (resetError) {
        setError(resetError.message);
      } else {
        setInfoMessage(
          `Password recovery email sent to ${recoveryEmail}. Please check your inbox for instructions.`
        );
        setIsRecoveryMode(false);
        setRecoveryEmail("");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send recovery instructions.");
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
        <h1 className={styles.title}>
          {isRecoveryMode ? "Reset Password" : "Sign In"}
        </h1>
        <p className={styles.subtitle}>
          {isRecoveryMode
            ? "Enter your account email to receive recovery instructions"
            : "Access your creator studio and reading library"}
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

      {isRecoveryMode ? (
        <form onSubmit={handlePasswordRecovery} className={styles.form}>
          <FormField label="Account Email" htmlFor="recoveryEmail" required>
            <input
              id="recoveryEmail"
              type="email"
              required
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="creator@pageprowl.com"
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
            Send Recovery Email
          </Button>

          <button
            type="button"
            onClick={() => {
              setIsRecoveryMode(false);
              setError(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              fontSize: "0.875rem",
              cursor: "pointer",
              marginTop: "4px",
              textAlign: "center",
            }}
          >
            &larr; Back to Sign In
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <FormField label="Email Address" htmlFor="email" required>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@pageprowl.com"
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

          <div style={{ textAlign: "right", marginTop: "-8px" }}>
            <button
              type="button"
              onClick={() => {
                setIsRecoveryMode(true);
                setRecoveryEmail(email);
                setError(null);
                setInfoMessage(null);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-primary)",
                fontSize: "0.75rem",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Forgot password?
            </button>
          </div>

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
      )}

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
