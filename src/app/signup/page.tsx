"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../login/page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: displayName || username,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else if (data.session) {
        router.push("/studio");
        router.refresh();
      } else {
        setSuccess(
          "Account created! Please check your email to verify your address or sign in."
        );
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Join Panelverse</h1>
            <p className={styles.subtitle}>
              Create an account to publish comics and collaborate with studios
            </p>
          </div>

          {error && <div className={styles.errorBanner}>{error}</div>}
          {success && (
            <div
              style={{
                backgroundColor: "var(--color-success-bg)",
                border: "1px solid var(--color-success)",
                color: "var(--color-success)",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "0.875rem",
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <FormField label="Username" htmlFor="username" required hint="Unique creator handle">
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="pen_name"
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                }}
              />
            </FormField>

            <FormField label="Display Name" htmlFor="displayName" required>
              <input
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jane Doe"
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                }}
              />
            </FormField>

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

            <FormField label="Password" htmlFor="password" required hint="At least 6 characters">
              <input
                id="password"
                type="password"
                required
                minLength={6}
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
              Create Account
            </Button>
          </form>

          <div className={styles.footer}>
            Already have an account?{" "}
            <Link href="/login" className={styles.link}>
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
