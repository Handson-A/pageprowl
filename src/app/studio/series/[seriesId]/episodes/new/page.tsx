"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/studio/page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/client";

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be signed in to create an episode.");
      }

      // Insert episode
      const { data: episode, error: epError } = await supabase
        .from("episodes")
        .insert({
          series_id: params.seriesId,
          episode_number: episodeNumber,
          title,
          slug,
        })
        .select()
        .single();

      if (epError) throw epError;

      // Automatically create Revision 1 (Draft)
      const { error: revError } = await supabase
        .from("episode_revisions")
        .insert({
          episode_id: episode.id,
          revision_number: 1,
          status: "draft",
          created_by: user.id,
          notes: "Initial draft",
        });

      if (revError) throw revError;

      router.push(`/studio/series/${params.seriesId}/episodes/${episode.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to create episode.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>New Episode</h1>
            <p className={styles.subtitle}>
              Create an episode container to begin uploading artwork pages.
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
            <FormField label="Episode Number" htmlFor="episodeNumber" required>
              <input
                id="episodeNumber"
                type="number"
                min={1}
                required
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                }}
              />
            </FormField>

            <FormField label="Episode Title" htmlFor="title" required>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="Chapter 1: The Spark"
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                }}
              />
            </FormField>

            <FormField
              label="URL Slug"
              htmlFor="slug"
              required
              hint="Identifies the episode in reader URLs"
            >
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="chapter-1"
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                }}
              />
            </FormField>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Create Episode &rarr;
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
