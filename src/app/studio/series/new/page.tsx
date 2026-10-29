"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/studio/page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/client";

export default function NewSeriesPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [format, setFormat] = useState<"scroll" | "page">("scroll");
  const [genre, setGenre] = useState("Action");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
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
        throw new Error("You must be signed in to create a series.");
      }

      const { data, error: insertError } = await supabase
        .from("series")
        .insert({
          title,
          slug,
          synopsis,
          format,
          genre,
          visibility,
          owner_user_id: user.id,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      router.push(`/studio/series/${data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to create series.");
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
            <h1 className={styles.title}>Create New Series</h1>
            <p className={styles.subtitle}>
              Establish the foundation for your new comic title.
            </p>
          </div>
        </header>

        <div
          style={{
            maxWidth: "680px",
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
                marginBottom: "24px",
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
            <FormField label="Series Title" htmlFor="title" required>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Neon Horizon"
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  fontSize: "1rem",
                }}
              />
            </FormField>

            <FormField
              label="URL Slug"
              htmlFor="slug"
              required
              hint="Unique URL address on panelverse.com/series/[slug]"
            >
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="neon-horizon"
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                }}
              />
            </FormField>

            <FormField
              label="Comic Reading Format"
              htmlFor="format"
              required
              hint="Determines whether readers experience the comic via vertical scroll or page-by-page."
            >
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value as "scroll" | "page")}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <option value="scroll">Vertical Scroll (Webtoon style)</option>
                <option value="page">Page-by-Page (Traditional comic/manga)</option>
              </select>
            </FormField>

            <FormField label="Genre" htmlFor="genre" required>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <option value="Action">Action</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Romance">Romance</option>
                <option value="Horror">Horror</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Slice of Life">Slice of Life</option>
              </select>
            </FormField>

            <FormField label="Synopsis / Summary" htmlFor="synopsis" required>
              <textarea
                id="synopsis"
                rows={4}
                required
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Describe the setting, characters, and high-level premise..."
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  fontFamily: "inherit",
                }}
              />
            </FormField>

            <FormField label="Initial Visibility" htmlFor="visibility">
              <select
                id="visibility"
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as "private" | "public")
                }
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <option value="private">Private (Team only)</option>
                <option value="public">Public (Visible in catalog once published)</option>
              </select>
            </FormField>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Create Series
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
