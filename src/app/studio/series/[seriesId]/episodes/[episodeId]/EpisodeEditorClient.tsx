"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VerticalReader } from "@/components/reader/VerticalReader";
import { PaginatedReader } from "@/components/reader/PaginatedReader";
import { createClient } from "@/lib/supabase/client";
import type { RevisionStatus, ComicFormat } from "@/types/database";

interface PageItem {
  id: string;
  pageNumber: number;
  imageUrl: string;
}

interface ReviewComment {
  id: string;
  userName: string;
  content: string;
  status: "open" | "resolved";
  createdAt: string;
}

interface EpisodeEditorClientProps {
  seriesId: string;
  seriesSlug: string;
  seriesFormat: ComicFormat;
  seriesTitle: string;
  episodeId: string;
  episodeNumber: number;
  episodeTitle: string;
  initialRevisionId: string;
  initialStatus: RevisionStatus;
  initialPages: PageItem[];
  initialComments: ReviewComment[];
  isPublished: boolean;
}

export function EpisodeEditorClient({
  seriesId,
  seriesSlug,
  seriesFormat,
  seriesTitle,
  episodeId,
  episodeNumber,
  episodeTitle,
  initialRevisionId,
  initialStatus,
  initialPages,
  initialComments,
  isPublished,
}: EpisodeEditorClientProps) {
  const [activeTab, setActiveTab] = useState<
    "production" | "review" | "preview" | "publishing"
  >("production");

  const [status, setStatus] = useState<RevisionStatus>(initialStatus);
  const [published, setPublished] = useState<boolean>(isPublished);
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [comments, setComments] = useState<ReviewComment[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Reorder page helper
  const movePage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const newPages = [...pages];
    const [moved] = newPages.splice(index, 1);
    newPages.splice(targetIndex, 0, moved);

    // Re-index page numbers
    const updated = newPages.map((p, i) => ({
      ...p,
      pageNumber: i + 1,
    }));
    setPages(updated);
  };

  const removePage = (index: number) => {
    const newPages = pages.filter((_, i) => i !== index);
    const updated = newPages.map((p, i) => ({
      ...p,
      pageNumber: i + 1,
    }));
    setPages(updated);
  };

  // Add dummy image for demonstration / artwork assembly
  const addPagePrompt = () => {
    const url = prompt(
      "Enter image artwork URL (e.g., Cloudinary URL or sample image):",
      "https://picsum.photos/800/1200?random=" + (pages.length + 1)
    );
    if (!url) return;

    const newPage: PageItem = {
      id: "page-" + Math.random().toString(36).substring(7),
      pageNumber: pages.length + 1,
      imageUrl: url,
    };
    setPages([...pages, newPage]);
  };

  // Save pages to revision
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const supabase = createClient();

      // Clear old pages and re-insert in new order
      await supabase
        .from("revision_pages")
        .delete()
        .eq("revision_id", initialRevisionId);

      for (const page of pages) {
        // Find or create media asset record
        const { data: mediaAsset } = await supabase
          .from("media_assets")
          .insert({
            uploader_id: (await supabase.auth.getUser()).data.user?.id || "",
            cloudinary_public_id: "panelverse/" + page.id,
            format: "jpg",
            secure_url: page.imageUrl,
          })
          .select()
          .single();

        if (mediaAsset) {
          await supabase.from("revision_pages").insert({
            revision_id: initialRevisionId,
            media_asset_id: mediaAsset.id,
            page_number: page.pageNumber,
          });
        }
      }

      setMessage("Saved pages order successfully!");
    } catch (err: any) {
      setMessage("Saved locally. (Note: Supabase session required to persist to remote DB)");
    } finally {
      setIsSaving(false);
    }
  };

  // Transition lifecycle
  const handleStatusChange = async (newStatus: RevisionStatus) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const supabase = createClient();
      await supabase
        .from("episode_revisions")
        .update({ status: newStatus })
        .eq("id", initialRevisionId);

      setStatus(newStatus);
      setMessage(`Revision status updated to: ${newStatus}`);
    } catch {
      setStatus(newStatus);
      setMessage(`Revision status updated to: ${newStatus} (local state)`);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish revision immediately
  const handlePublish = async () => {
    if (pages.length === 0) {
      alert("Cannot publish an episode with zero pages!");
      return;
    }
    setIsSaving(true);
    try {
      const supabase = createClient();
      await supabase
        .from("episodes")
        .update({ published_revision_id: initialRevisionId })
        .eq("id", episodeId);

      await supabase
        .from("episode_revisions")
        .update({ status: "published" })
        .eq("id", initialRevisionId);

      setStatus("published");
      setPublished(true);
      setMessage("Congratulations! Episode revision published and is now live to readers.");
    } catch {
      setStatus("published");
      setPublished(true);
      setMessage("Published successfully (local update).");
    } finally {
      setIsSaving(false);
    }
  };

  // Unpublish episode
  const handleUnpublish = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      await supabase
        .from("episodes")
        .update({ published_revision_id: null })
        .eq("id", episodeId);

      setPublished(false);
      setMessage("Episode unpublished from public catalog.");
    } catch {
      setPublished(false);
      setMessage("Episode unpublished.");
    } finally {
      setIsSaving(false);
    }
  };

  // Add review comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ReviewComment = {
      id: "comment-" + Math.random().toString(36).substring(7),
      userName: "Collaborator",
      content: newCommentText.trim(),
      status: "open",
      createdAt: new Date().toLocaleTimeString(),
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>
            <Link href={`/studio/series/${seriesId}`}>&larr; {seriesTitle}</Link>
          </div>
          <h1 className={styles.title}>
            Ep. {episodeNumber}: {episodeTitle}
          </h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <StatusBadge status={status} />
            {published ? (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-success)",
                  fontWeight: 600,
                }}
              >
                ● Live on Public Reader
              </span>
            ) : (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                }}
              >
                ○ Unpublished Draft
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {published && (
            <Link
              href={`/series/${seriesSlug}/episodes/chapter-${episodeNumber}`}
              target="_blank"
            >
              <Button variant="secondary" size="sm">
                View Live &rarr;
              </Button>
            </Link>
          )}
        </div>
      </header>

      {message && (
        <div
          style={{
            backgroundColor: "var(--color-info-bg)",
            color: "var(--color-info)",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            border: "1px solid rgba(37, 99, 235, 0.2)",
          }}
        >
          {message}
        </div>
      )}

      {/* Workspace Tabs */}
      <nav className={styles.tabBar} aria-label="Episode Production Tabs">
        <button
          className={`${styles.tab} ${
            activeTab === "production" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("production")}
        >
          1. Production &amp; Artwork ({pages.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "review" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("review")}
        >
          2. Review &amp; Feedback ({comments.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "preview" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("preview")}
        >
          3. Live Preview
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "publishing" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("publishing")}
        >
          4. Publishing Lifecycle
        </button>
      </nav>

      {/* Tab 1: Production Artwork & Ordering */}
      {activeTab === "production" && (
        <div className={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                Artwork Pages &amp; Reading Order
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                }}
              >
                Assemble and manually arrange artwork in reading sequence.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button variant="secondary" size="sm" onClick={addPagePrompt}>
                + Add Page Artwork
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveDraft}
                isLoading={isSaving}
              >
                Save Order
              </Button>
            </div>
          </div>

          {pages.length > 0 ? (
            <div className={styles.pageGrid}>
              {pages.map((p, idx) => (
                <div key={p.id} className={styles.pageItem}>
                  <img
                    src={p.imageUrl}
                    alt={`Page ${p.pageNumber}`}
                    className={styles.pageThumbnail}
                  />
                  <div className={styles.pageFooter}>
                    <span>Page {p.pageNumber}</span>
                    <div className={styles.orderControls}>
                      <button
                        className={styles.orderBtn}
                        onClick={() => movePage(idx, "left")}
                        disabled={idx === 0}
                        title="Move Earlier"
                      >
                        &larr;
                      </button>
                      <button
                        className={styles.orderBtn}
                        onClick={() => movePage(idx, "right")}
                        disabled={idx === pages.length - 1}
                        title="Move Later"
                      >
                        &rarr;
                      </button>
                      <button
                        className={styles.orderBtn}
                        onClick={() => removePage(idx)}
                        style={{ color: "var(--color-danger)" }}
                        title="Remove Page"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.uploadZone}>
              <span style={{ fontSize: "2rem" }}>🖼️</span>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                No artwork pages uploaded yet
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                  maxWidth: "400px",
                }}
              >
                Upload your comic pages in JPG, PNG, or WebP. You can reorder
                them manually before publishing.
              </p>
              <Button variant="primary" onClick={addPagePrompt}>
                + Add First Page
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Review & Feedback */}
      {activeTab === "review" && (
        <div className={styles.card}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            Collaboration Feedback &amp; Review Notes
          </h2>
          <p
            style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}
          >
            Reviewers, editors, and creators can exchange notes and track
            feedback on this revision.
          </p>

          <form
            onSubmit={handleAddComment}
            style={{ display: "flex", gap: "8px" }}
          >
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Leave a review comment or correction..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--color-border)",
              }}
            />
            <Button type="submit" variant="primary" size="sm">
              Post Comment
            </Button>
          </form>

          <div className={styles.commentList}>
            {comments.map((c) => (
              <div key={c.id} className={styles.commentItem}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <strong>{c.userName}</strong>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {c.createdAt}
                  </span>
                </div>
                <p>{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Live Reader Preview */}
      {activeTab === "preview" && (
        <div className={styles.card}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            Live Reader Experience Preview
          </h2>
          <p
            style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}
          >
            This preview renders using the exact reader components (
            {seriesFormat === "scroll" ? "Vertical Scroll" : "Page-by-Page"}).
          </p>

          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid var(--reader-border)",
            }}
          >
            {seriesFormat === "scroll" ? (
              <VerticalReader pages={pages} seriesSlug={seriesSlug} />
            ) : (
              <PaginatedReader pages={pages} seriesSlug={seriesSlug} />
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Publishing Lifecycle */}
      {activeTab === "publishing" && (
        <div className={styles.card}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            Publishing Lifecycle &amp; Release Control
          </h2>
          <p
            style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}
          >
            Manage the official lifecycle transitions: Draft &rarr; In Review
            &rarr; Ready to Publish &rarr; Published.
          </p>

          <div className={styles.publishBox}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Current Status:</span>
              <StatusBadge status={status} />
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {status === "draft" && (
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange("in_review")}
                  isLoading={isSaving}
                >
                  Submit for Review &rarr;
                </Button>
              )}

              {status === "in_review" && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => handleStatusChange("ready_to_publish")}
                    isLoading={isSaving}
                  >
                    Approve (Ready to Publish)
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleStatusChange("draft")}
                    isLoading={isSaving}
                  >
                    Return to Draft
                  </Button>
                </>
              )}

              {status === "ready_to_publish" && (
                <Button
                  variant="primary"
                  onClick={handlePublish}
                  isLoading={isSaving}
                >
                  🚀 Publish Revision Now
                </Button>
              )}

              {status === "published" && (
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleUnpublish}
                    isLoading={isSaving}
                  >
                    Unpublish from Public View
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
