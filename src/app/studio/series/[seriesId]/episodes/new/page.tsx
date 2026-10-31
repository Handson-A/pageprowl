"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/app/studio/page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/client";
import { createEpisodeAction } from "../actions";
import { LuArrowLeft } from "react-icons/lu";

interface NewEpisodePageProps {
  params: {
    seriesId: string;
  };
}

export default function NewEpisodePage({ params }: NewEpisodePageProps) {
  const router = useRouter();
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function suggestNextNumber() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(
          `/login?redirect=${encodeURIComponent(
            `/studio/series/${params.seriesId}/episodes/new`
          )}`
        );
        return;
      }

      const { data } = await supabase
        .from("episodes")
        .select("episode_number")
        .eq("series_id", params.seriesId)
        .order("episode_number", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const nextNum = data[0].episode_number + 1;
        setEpisodeNumber(nextNum);
        setSlug(`chapter-${nextNum}`);
      } else {
        setEpisodeNumber(1);
        setSlug("chapter-1");
      }
    }
    suggestNextNumber();
  }, [params.seriesId, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generated || `chapter-${episodeNumber}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !navigator.onLine) {
      setError("You are currently offline. Please reconnect before creating an episode.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createEpisodeAction(params.seriesId, formData);
    } catch (err: any) {
      setError(err?.message || "Failed to create episode.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Link
                href={`/studio/series/${params.seriesId}`}
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "0.875rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <LuArrowLeft size={14} aria-hidden="true" />
                <span>Back to Series Workspace</span>
              </Link>
            </div>
            <h1 className={styles.title}>New Episode</h1>
            <p className={styles.subtitle}>
              Create a new chapter or episode container to upload comic pages and prepare revisions.
            </p>
          </div>
        </header>

        <div
          style={{
            maxWidth: "600px",
            backgroundColor: "var(--color-surface)",
            padding: "var(--space-8)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
          }}
        >
          {error && (
            <div
              style={{
                backgroundColor: "var(--color-danger-bg)",
                color: "var(--color-danger)",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <FormField label="Episode Number" htmlFor="episodeNumber" required hint="Scoped to this series">
              <input
                id="episodeNumber"
                name="episodeNumber"
                type="number"
                min={1}
                required
                value={episodeNumber}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setEpisodeNumber(val);
                  if (!title) setSlug(`chapter-${val}`);
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-main)",
                }}
              />
            </FormField>

            <FormField label="Episode Title" htmlFor="title" required>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={100}
                placeholder="e.g. The Awakening Part 1"
                value={title}
                onChange={handleTitleChange}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-main)",
                }}
              />
            </FormField>

            <FormField label="URL Slug" htmlFor="slug" hint="Used in reader web address">
              <input
                id="slug"
                name="slug"
                type="text"
                readOnly
                value={slug}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface-hover)",
                  color: "var(--color-text-muted)",
                  fontFamily: "monospace",
                }}
              />
            </FormField>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <Link href={`/studio/series/${params.seriesId}`}>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Create Episode &amp; Open Workspace
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
