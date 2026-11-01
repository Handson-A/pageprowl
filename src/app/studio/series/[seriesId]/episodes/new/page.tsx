"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./NewEpisode.module.css";
import pageStyles from "@/app/studio/page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/client";
import { createEpisodeAction } from "../actions";
import {
  LuArrowLeft,
  LuSparkles,
  LuLayers,
  LuCheck,
  LuCircleHelp,
  LuFileText,
  LuCloudUpload,
  LuEye,
} from "react-icons/lu";

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
  const [seriesTitle, setSeriesTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadEpisodeData() {
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

      // Fetch series metadata for context
      const { data: series } = await supabase
        .from("series")
        .select("title")
        .eq("id", params.seriesId)
        .single();

      if (series?.title) {
        setSeriesTitle(series.title);
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
    loadEpisodeData();
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
    <div className={pageStyles.layout}>
      <CreatorSidebar />

      <main className={pageStyles.main}>
        {/* Header */}
        <header className={styles.pageHeader}>
          <Link
            href={`/studio/series/${params.seriesId}`}
            className={styles.backLink}
          >
            <LuArrowLeft size={16} aria-hidden="true" />
            <span>Back to Series Workspace</span>
          </Link>
          <h1 className={styles.pageTitle}>New Episode</h1>
          <p className={styles.pageSubtitle}>
            Create a new chapter container for {seriesTitle ? `"${seriesTitle}"` : "your series"} to
            upload comic pages, arrange panel order, and prepare revisions for editorial review.
          </p>
        </header>

        {/* Two-Column Grid */}
        <div className={styles.twoColLayout}>
          {/* Left Column: Form Card */}
          <div className={styles.formCard}>
            {error && (
              <div className={styles.errorBanner} role="alert">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.formBody}>
              <div className={styles.twoInputGrid}>
                <FormField
                  label="Chapter #"
                  htmlFor="episodeNumber"
                  required
                  hint="Order index"
                >
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
                    className={styles.inputField}
                  />
                </FormField>

                <FormField
                  label="Episode / Chapter Title"
                  htmlFor="title"
                  required
                >
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. The Awakening Part 1"
                    value={title}
                    onChange={handleTitleChange}
                    className={styles.inputField}
                    autoFocus
                  />
                </FormField>
              </div>

              <FormField
                label="URL Slug"
                htmlFor="slug"
                description="Unique identifier used in reader web addresses."
              >
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  readOnly
                  value={slug}
                  className={`${styles.inputField} ${styles.inputFieldReadonly}`}
                />
              </FormField>

              <div
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--pv-radius-md)",
                  padding: "var(--space-4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <LuSparkles size={16} color="var(--color-primary)" />
                  <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "600", color: "var(--color-text)" }}>
                    Initial Revision Status: Draft
                  </span>
                </div>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
                  Creating this episode will generate initial Revision 1 in <strong>Draft</strong> status.
                  You can upload high-res page slices immediately in the editor.
                </p>
              </div>

              <div className={styles.btnRow}>
                <Link href={`/studio/series/${params.seriesId}`}>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuCheck size={16} aria-hidden="true" />
                    <span>Create Episode &amp; Open Workspace</span>
                  </span>
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Episode Preview & Workflow Tips */}
          <aside className={styles.sidebarCol} aria-label="Episode Preview and Workflow Tips">
            {/* Live Episode Preview */}
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <span className={styles.previewTag}>
                  <LuSparkles size={14} aria-hidden="true" />
                  <span>Episode Preview</span>
                </span>
                <span className={styles.previewBadge}>Active</span>
              </div>

              <div className={styles.previewBody}>
                <div className={styles.previewEpisodeHeader}>
                  <span className={styles.episodeBadge}>Ch. {episodeNumber}</span>
                  <h3 className={styles.previewTitle}>
                    {title.trim() || "Episode Title"}
                  </h3>
                </div>

                <div className={styles.previewSlugBox}>
                  <span>/episodes/{slug || `chapter-${episodeNumber}`}</span>
                </div>

                <div className={styles.previewWorkflowSteps}>
                  <div className={styles.workflowStepItem}>
                    <LuFileText size={14} color="var(--color-primary)" />
                    <span>Revision 1 initialized as Draft</span>
                  </div>
                  <div className={styles.workflowStepItem}>
                    <LuCloudUpload size={14} color="var(--color-primary)" />
                    <span>Direct batch page uploads ready</span>
                  </div>
                  <div className={styles.workflowStepItem}>
                    <LuEye size={14} color="var(--color-primary)" />
                    <span>Private until approved &amp; published</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className={styles.tipsCard}>
              <div className={styles.tipsHeader}>
                <LuCircleHelp size={18} color="var(--color-primary)" />
                <span>Production Workflow</span>
              </div>

              <ul className={styles.tipsList}>
                <li className={styles.tipItem}>
                  <span className={styles.tipBullet}>•</span>
                  <div>
                    <strong>1. Page Uploads:</strong> In the next screen, you can batch drag-and-drop all artwork files with automatic numeric ordering.
                  </div>
                </li>
                <li className={styles.tipItem}>
                  <span className={styles.tipBullet}>•</span>
                  <div>
                    <strong>2. Editorial Review:</strong> Once pages are sequenced, submit the draft for review so your editor or team lead can verify quality.
                  </div>
                </li>
                <li className={styles.tipItem}>
                  <span className={styles.tipBullet}>•</span>
                  <div>
                    <strong>3. Safe Publishing:</strong> Published revisions are permanently immutable to ensure readers experience a consistent release.
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
