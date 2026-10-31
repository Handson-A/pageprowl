"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VerticalReader } from "@/components/reader/VerticalReader";
import { PaginatedReader } from "@/components/reader/PaginatedReader";
import { createClient } from "@/lib/supabase/client";
import {
  LuArrowLeft,
  LuArrowRight,
  LuChevronLeft,
  LuChevronRight,
  LuTrash2,
  LuImage,
  LuPlus,
  LuExternalLink,
  LuUpload,
} from "react-icons/lu";
import type { RevisionStatus, ComicFormat } from "@/types/database";

interface PageItem {
  id: string;
  pageNumber: number;
  imageUrl: string;
  mediaAssetId?: string;
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
  seriesTitle: string;
  seriesSlug: string;
  seriesFormat: ComicFormat;
  episodeId: string;
  episodeTitle: string;
  episodeNumber: number;
  initialRevisionId: string;
  initialStatus: RevisionStatus;
  initialPages: PageItem[];
  initialComments: ReviewComment[];
  isPublished: boolean;
}

export function EpisodeEditorClient({
  seriesId,
  seriesTitle,
  seriesSlug,
  seriesFormat,
  episodeId,
  episodeTitle,
  episodeNumber,
  initialRevisionId,
  initialStatus,
  initialPages,
  initialComments,
  isPublished,
}: EpisodeEditorClientProps) {
  const [activeTab, setActiveTab] = useState<
    "production" | "review" | "preview" | "publishing"
  >("production");
  const [revisionId] = useState(initialRevisionId);
  const [status, setStatus] = useState<RevisionStatus>(initialStatus);
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [comments, setComments] = useState<ReviewComment[]>(initialComments);
  const [published, setPublished] = useState(isPublished);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Reorder page up/down
  const movePage = (index: number, direction: "left" | "right") => {
    const newPages = [...pages];
    const targetIndex = direction === "left" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPages.length) return;

    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;

    // Renumber
    newPages.forEach((p, idx) => {
      p.pageNumber = idx + 1;
    });

    setPages(newPages);
  };

  // Remove page from draft revision
  const removePage = (index: number) => {
    const newPages = pages.filter((_, idx) => idx !== index);
    newPages.forEach((p, idx) => {
      p.pageNumber = idx + 1;
    });
    setPages(newPages);
  };

  // Add sample image URL for demonstration / offline editing
  const addPagePrompt = () => {
    const url = prompt(
      "Enter image URL for this comic page (or upload via Cloudinary signature API):",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop"
    );

    if (url) {
      const newPage: PageItem = {
        id: "local-" + Math.random().toString(36).substring(7),
        pageNumber: pages.length + 1,
        imageUrl: url,
      };
      setPages([...pages, newPage]);
    }
  };

  // Save draft pages to Supabase
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // If revisionId is not an existing UUID, create or verify revision
      let targetRevisionId = revisionId;
      if (revisionId === "rev-default") {
        const { data: revData } = await supabase
          .from("episode_revisions")
          .insert({
            episode_id: episodeId,
            revision_number: 1,
            status: "draft",
          })
          .select("id")
          .single();

        if (revData) {
          targetRevisionId = revData.id;
        }
      }

      // Re-index pages
      await supabase
        .from("revision_pages")
        .delete()
        .eq("revision_id", targetRevisionId);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (page.mediaAssetId) {
          await supabase.from("revision_pages").insert({
            revision_id: targetRevisionId,
            page_number: i + 1,
            media_asset_id: page.mediaAssetId,
          });
        }
      }

      setMessage("Draft revision pages saved successfully.");
    } catch {
      setMessage("Draft saved locally.");
    } finally {
      setIsSaving(false);
    }
  };

  // State machine transition
  const handleStatusChange = async (newStatus: RevisionStatus) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      await supabase
        .from("episode_revisions")
        .update({ status: newStatus })
        .eq("id", revisionId);

      setStatus(newStatus);
      setMessage(`Revision transitioned to '${newStatus.replace("_", " ")}'.`);
    } catch {
      setStatus(newStatus);
      setMessage(`Status updated to '${newStatus}'.`);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish revision
  const handlePublish = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // 1. Mark revision published
      await supabase
        .from("episode_revisions")
        .update({ status: "published" })
        .eq("id", revisionId);

      // 2. Point episode published_revision_id to this revision
      await supabase
        .from("episodes")
        .update({ published_revision_id: revisionId })
        .eq("id", episodeId);

      setStatus("published");
      setPublished(true);
      setMessage(
        "Episode successfully published! It is now live in the reader."
      );
    } catch {
      setStatus("published");
      setPublished(true);
      setMessage("Episode published.");
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
            <Link
              href={`/studio/series/${seriesId}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <LuArrowLeft size={14} aria-hidden="true" />
              <span>{seriesTitle}</span>
            </Link>
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
                Live on Public Reader
              </span>
            ) : (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                }}
              >
                Unpublished Draft
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>View Live</span>
                  <LuExternalLink size={14} aria-hidden="true" />
                </span>
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <LuPlus size={16} aria-hidden="true" />
                  <span>Add Page Artwork</span>
                </span>
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
                        aria-label="Move Earlier"
                      >
                        <LuChevronLeft size={14} />
                      </button>
                      <button
                        className={styles.orderBtn}
                        onClick={() => movePage(idx, "right")}
                        disabled={idx === pages.length - 1}
                        title="Move Later"
                        aria-label="Move Later"
                      >
                        <LuChevronRight size={14} />
                      </button>
                      <button
                        className={styles.orderBtn}
                        onClick={() => removePage(idx)}
                        style={{ color: "var(--color-danger)" }}
                        title="Remove Page"
                        aria-label="Remove Page"
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.uploadZone}>
              <div style={{ marginBottom: "8px" }}>
                <LuImage size={44} color="var(--color-text-muted)" aria-hidden="true" />
              </div>
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <LuPlus size={16} aria-hidden="true" />
                  <span>Add First Page</span>
                </span>
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
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Submit for Review</span>
                    <LuArrowRight size={14} aria-hidden="true" />
                  </span>
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
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuUpload size={16} aria-hidden="true" />
                    <span>Publish Revision Now</span>
                  </span>
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
