"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VerticalReader } from "@/components/reader/VerticalReader";
import { PaginatedReader } from "@/components/reader/PaginatedReader";
import {
  saveRevisionPagesAction,
  updateEpisodeMetadataAction,
  transitionRevisionStatusAction,
  publishRevisionAction,
  unpublishEpisodeAction,
  deleteEpisodeAction,
  postReviewCommentAction,
} from "../actions";
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
  LuCheck,
  LuCircleAlert,
  LuSend,
} from "react-icons/lu";
import type { RevisionStatus, ComicFormat, SeriesRole } from "@/types/database";

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
  episodeSlug: string;
  initialRevisionId: string;
  initialStatus: RevisionStatus;
  initialPages: PageItem[];
  initialComments: ReviewComment[];
  isPublished: boolean;
  userRole: SeriesRole;
}

export function EpisodeEditorClient({
  seriesId,
  seriesTitle,
  seriesSlug,
  seriesFormat,
  episodeId,
  episodeTitle,
  episodeNumber,
  episodeSlug,
  initialRevisionId,
  initialStatus,
  initialPages,
  initialComments,
  isPublished,
  userRole,
}: EpisodeEditorClientProps) {
  const [activeTab, setActiveTab] = useState<
    "production" | "details" | "review" | "preview" | "publishing"
  >("production");

  const [revisionId] = useState(initialRevisionId);
  const [status, setStatus] = useState<RevisionStatus>(initialStatus);
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [comments, setComments] = useState<ReviewComment[]>(initialComments);
  const [published, setPublished] = useState(isPublished);

  // Metadata form state
  const [currentTitle, setCurrentTitle] = useState(episodeTitle);
  const [currentNumber, setCurrentNumber] = useState(episodeNumber);
  const [currentSlug, setCurrentSlug] = useState(episodeSlug);
  const [isSavingMeta, setIsSavingMeta] = useState(false);

  // Feedback and progress
  const [newCommentText, setNewCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isSavingPages, setIsSavingPages] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Batch upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canEdit = userRole === "owner" || userRole === "editor";

  // Reorder page up/down
  const movePage = (index: number, direction: "left" | "right") => {
    if (!canEdit) return;
    const newPages = [...pages];
    const targetIndex = direction === "left" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newPages.length) return;

    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;

    // Renumber sequentially 1-based
    newPages.forEach((p, idx) => {
      p.pageNumber = idx + 1;
    });

    setPages(newPages);
    setHasUnsavedChanges(true);
    setMessage(null);
  };

  // Remove page from draft revision
  const removePage = (index: number) => {
    if (!canEdit) return;
    const newPages = pages.filter((_, idx) => idx !== index);
    newPages.forEach((p, idx) => {
      p.pageNumber = idx + 1;
    });
    setPages(newPages);
    setHasUnsavedChanges(true);
    setMessage(null);
  };

  // Batch Upload via Cloudinary signed API
  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !canEdit) return;

    setIsUploading(true);
    setMessage(null);
    setUploadStatus("Validating selected files...");

    // Natural alphabetical sort so page_01, page_02 are in order
    const fileList = Array.from(files).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true })
    );

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const invalidFiles = fileList.filter((f) => !validTypes.includes(f.type) || f.size > 10 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      setMessage({
        type: "error",
        text: `Some files were skipped (${invalidFiles.map((f) => f.name).join(", ")}): must be JPG, PNG, or WebP under 10MB.`,
      });
    }

    const filesToUpload = fileList.filter((f) => validTypes.includes(f.type) && f.size <= 10 * 1024 * 1024);
    if (filesToUpload.length === 0) {
      setIsUploading(false);
      setUploadStatus(null);
      return;
    }

    const uploadedItems: PageItem[] = [];
    let currentStartIndex = pages.length;

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setUploadStatus(`Uploading artwork page ${i + 1} of ${filesToUpload.length}: ${file.name}`);

      try {
        // 1. Fetch signed upload credentials from server
        const sigRes = await fetch("/api/media/signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seriesId, episodeId, type: "episode_page" }),
        });

        if (!sigRes.ok) {
          const errData = await sigRes.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to authorize upload.");
        }

        const sigData = await sigRes.json();

        // 2. Direct upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", sigData.timestamp.toString());
        formData.append("signature", sigData.signature);
        formData.append("folder", sigData.folder);
        formData.append("tags", "panelverse,episode_page");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error?.message || "Failed to upload to Cloudinary.");
        }

        const uploadData = await uploadRes.json();

        // 3. Register in database media_assets
        const assetRes = await fetch("/api/media/asset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cloudinaryPublicId: uploadData.public_id,
            format: uploadData.format,
            width: uploadData.width,
            height: uploadData.height,
            byteSize: uploadData.bytes,
            secureUrl: uploadData.secure_url,
            seriesId,
          }),
        });

        if (!assetRes.ok) {
          const assetErr = await assetRes.json().catch(() => ({}));
          throw new Error(assetErr.error || "Failed to record media asset reference.");
        }

        const { asset } = await assetRes.json();

        uploadedItems.push({
          id: asset.id,
          mediaAssetId: asset.id,
          pageNumber: ++currentStartIndex,
          imageUrl: uploadData.secure_url,
        });
      } catch (err: any) {
        console.error(`Failed to upload ${file.name}:`, err);
        setMessage({
          type: "error",
          text: `Failed to upload ${file.name}: ${err.message}. Successfully uploaded ${uploadedItems.length} pages.`,
        });
      }
    }

    if (uploadedItems.length > 0) {
      const mergedPages = [...pages, ...uploadedItems];
      mergedPages.forEach((p, idx) => {
        p.pageNumber = idx + 1;
      });
      setPages(mergedPages);
      setHasUnsavedChanges(true);
      setMessage({
        type: "success",
        text: `Successfully uploaded ${uploadedItems.length} pages. Remember to click 'Save Order' to persist.`,
      });
    }

    setIsUploading(false);
    setUploadStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Save draft pages order to database
  const handleSaveOrder = async () => {
    if (!canEdit) return;
    setIsSavingPages(true);
    setMessage(null);

    try {
      const validPages = pages
        .filter((p) => !!p.mediaAssetId)
        .map((p, idx) => ({
          mediaAssetId: p.mediaAssetId!,
          pageNumber: idx + 1,
        }));

      await saveRevisionPagesAction(seriesId, episodeId, revisionId, validPages);
      setHasUnsavedChanges(false);
      setMessage({
        type: "success",
        text: "Draft revision pages and reading sequence saved successfully.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to persist page order.",
      });
    } finally {
      setIsSavingPages(false);
    }
  };

  // Update episode title & number
  const handleMetadataSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canEdit) return;

    setIsSavingMeta(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.set("title", currentTitle);
      formData.set("episodeNumber", currentNumber.toString());

      await updateEpisodeMetadataAction(seriesId, episodeId, formData);
      setMessage({
        type: "success",
        text: "Episode details updated successfully.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to update episode metadata.",
      });
    } finally {
      setIsSavingMeta(false);
    }
  };

  // Lifecycle status transitions
  const handleStatusChange = async (targetStatus: RevisionStatus) => {
    setIsTransitioning(true);
    setMessage(null);

    try {
      await transitionRevisionStatusAction(seriesId, episodeId, revisionId, targetStatus);
      setStatus(targetStatus);
      setMessage({
        type: "success",
        text: `Revision transitioned to '${targetStatus.replace("_", " ")}'.`,
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || `Failed to transition status to ${targetStatus}.`,
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Publish revision
  const handlePublish = async () => {
    if (!canEdit) return;
    setIsTransitioning(true);
    setMessage(null);

    try {
      await publishRevisionAction(seriesId, episodeId, revisionId);
      setStatus("published");
      setPublished(true);
      setMessage({
        type: "success",
        text: "Episode successfully published! It is now live on the public reader.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to publish episode.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Unpublish episode
  const handleUnpublish = async () => {
    if (!canEdit) return;
    if (!confirm("Are you sure you want to unpublish this episode? Readers will no longer be able to access it.")) {
      return;
    }

    setIsTransitioning(true);
    setMessage(null);

    try {
      await unpublishEpisodeAction(seriesId, episodeId);
      setStatus("unpublished");
      setPublished(false);
      setMessage({
        type: "success",
        text: "Episode unpublished. It has been safely removed from public reader access.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to unpublish episode.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Delete draft episode
  const handleDeleteEpisode = async () => {
    if (!canEdit) return;
    if (!confirm(`Are you sure you want to delete episode #${currentNumber} "${currentTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteEpisodeAction(seriesId, episodeId);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to delete episode.",
      });
    }
  };

  // Add review comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsPostingComment(true);
    try {
      const res = await postReviewCommentAction(seriesId, revisionId, newCommentText.trim());
      if (res.comment) {
        setComments([res.comment as any, ...comments]);
      }
      setNewCommentText("");
    } catch (err: any) {
      alert(err.message || "Failed to post comment.");
    } finally {
      setIsPostingComment(false);
    }
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
            Ep. {currentNumber}: {currentTitle}
          </h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <StatusBadge status={status} />
            {published ? (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-success)",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <LuCheck size={14} />
                <span>Live on Public Reader</span>
              </span>
            ) : (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                }}
              >
                Unpublished Draft Revision
              </span>
            )}
            {hasUnsavedChanges && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-warning)",
                  backgroundColor: "rgba(242, 193, 78, 0.15)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontWeight: 600,
                }}
              >
                Unsaved Page Changes
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {published && (
            <Link
              href={`/series/${seriesSlug}/episodes/${currentSlug}`}
              target="_blank"
            >
              <Button variant="secondary" size="sm">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>View in Reader</span>
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
            backgroundColor:
              message.type === "success" ? "var(--color-success-bg)" : "var(--color-danger-bg)",
            color:
              message.type === "success" ? "var(--color-success)" : "var(--color-danger)",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            border: `1px solid ${
              message.type === "success" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"
            }`,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {message.type === "success" ? <LuCheck size={16} /> : <LuCircleAlert size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Workspace Tabs */}
      <nav className={styles.tabBar} aria-label="Episode Workspace Tabs">
        <button
          className={`${styles.tab} ${activeTab === "production" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("production")}
        >
          1. Production Artwork ({pages.length})
        </button>
        {canEdit && (
          <button
            className={`${styles.tab} ${activeTab === "details" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("details")}
          >
            2. Episode Details
          </button>
        )}
        <button
          className={`${styles.tab} ${activeTab === "review" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("review")}
        >
          3. Review Notes ({comments.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "preview" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          4. Live Preview
        </button>
        <button
          className={`${styles.tab} ${activeTab === "publishing" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("publishing")}
        >
          5. Release &amp; Lifecycle
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
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                Comic Pages &amp; Reading Sequence
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                Upload artwork in batch, organize pages into the reading sequence, and persist order.
              </p>
            </div>
            {canEdit && (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleBatchUpload}
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                />

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  isLoading={isUploading}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuUpload size={14} aria-hidden="true" />
                    <span>Upload Pages (Batch)</span>
                  </span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveOrder}
                  isLoading={isSavingPages}
                  disabled={!hasUnsavedChanges}
                >
                  Save Sequence
                </Button>
              </div>
            )}
          </div>

          {uploadStatus && (
            <div
              style={{
                backgroundColor: "var(--color-info-bg)",
                color: "var(--color-info)",
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "0.875rem",
              }}
            >
              {uploadStatus}
            </div>
          )}

          {pages.length > 0 ? (
            <>
              {canEdit && (
                <div
                  className={styles.uploadZone}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload artwork dropzone"
                  style={{ padding: "var(--space-6)" }}
                >
                  <div className={styles.uploadIconCircle} style={{ width: "42px", height: "42px" }}>
                    <LuUpload size={20} aria-hidden="true" />
                  </div>
                  <p className={styles.uploadTitle} style={{ fontSize: "var(--font-size-sm)" }}>
                    Drag and drop additional pages here or <span>click to browse</span>
                  </p>
                  <p className={styles.uploadSubtitle}>
                    Supports JPG, PNG, WebP (batch upload enabled)
                  </p>
                </div>
              )}

              <div className={styles.pageGrid}>
                {pages.map((p, idx) => (
                  <div key={p.id || idx} className={styles.pageItem}>
                    <img
                      src={p.imageUrl}
                      alt={`Page ${p.pageNumber}`}
                      className={styles.pageThumbnail}
                    />
                    <div className={styles.pageFooter}>
                      <span>Page {p.pageNumber}</span>
                      {canEdit && (
                        <div className={styles.orderControls}>
                          <button
                            className={styles.orderBtn}
                            onClick={() => movePage(idx, "left")}
                            disabled={idx === 0}
                            title="Move Earlier"
                            aria-label={`Move Page ${p.pageNumber} Earlier`}
                          >
                            <LuChevronLeft size={14} />
                          </button>
                          <button
                            className={styles.orderBtn}
                            onClick={() => movePage(idx, "right")}
                            disabled={idx === pages.length - 1}
                            title="Move Later"
                            aria-label={`Move Page ${p.pageNumber} Later`}
                          >
                            <LuChevronRight size={14} />
                          </button>
                          <button
                            className={styles.orderBtn}
                            onClick={() => removePage(idx)}
                            style={{ color: "var(--color-danger)" }}
                            title="Remove Page"
                            aria-label={`Remove Page ${p.pageNumber}`}
                          >
                            <LuTrash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div
              className={styles.uploadZone}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload artwork dropzone"
            >
              <div className={styles.uploadIconCircle}>
                <LuUpload size={28} aria-hidden="true" />
              </div>
              <h3 className={styles.uploadTitle}>
                Drag and drop images here or <span>click to browse</span>
              </h3>
              <p className={styles.uploadSubtitle}>
                Supports JPG, PNG, WebP (max 10MB each). Files will be optimized and organized into the reading sequence.
              </p>
              {canEdit && (
                <Button
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  isLoading={isUploading}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuUpload size={16} aria-hidden="true" />
                    <span>Select Pages to Upload</span>
                  </span>
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Episode Details Form */}
      {activeTab === "details" && canEdit && (
        <div className={styles.card} style={{ maxWidth: "600px" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
              Episode Metadata
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
              Update the chapter number, public title, and reader web address.
            </p>
          </div>

          <form onSubmit={handleMetadataSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <FormField label="Episode Number" htmlFor="ep-num" required hint="Numbered within this series">
              <input
                id="ep-num"
                type="number"
                min={1}
                required
                value={currentNumber}
                onChange={(e) => setCurrentNumber(parseInt(e.target.value) || 1)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-main)",
                }}
              />
            </FormField>

            <FormField label="Episode Title" htmlFor="ep-title" required>
              <input
                id="ep-title"
                type="text"
                required
                maxLength={100}
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-main)",
                }}
              />
            </FormField>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
              {!published && (
                <Button
                  type="button"
                  variant="ghost"
                  style={{ color: "var(--color-danger)" }}
                  onClick={handleDeleteEpisode}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <LuTrash2 size={14} />
                    <span>Delete Episode</span>
                  </span>
                </Button>
              )}
              <Button type="submit" variant="primary" isLoading={isSavingMeta}>
                Save Details
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Review & Collaboration Notes */}
      {activeTab === "review" && (
        <div className={styles.card}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
            Collaboration Feedback &amp; Review Notes
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Writers, artists, and editors exchange revision feedback before release.
          </p>

          <form onSubmit={handleAddComment} style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Leave a review comment or request a correction..."
              maxLength={2000}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-main)",
              }}
            />
            <Button type="submit" variant="primary" size="sm" isLoading={isPostingComment}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <LuSend size={14} />
                <span>Post Note</span>
              </span>
            </Button>
          </form>

          <div className={styles.commentList}>
            {comments.map((c) => (
              <div key={c.id} className={styles.commentItem}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong>{c.userName}</strong>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    {c.createdAt}
                  </span>
                </div>
                <p>{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Live Reader Preview */}
      {activeTab === "preview" && (
        <div className={styles.card}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
              Live Reader Experience Preview
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
              Pre-flight preview rendering draft artwork in {seriesFormat === "scroll" ? "Vertical Scroll" : "Page-by-Page"} mode without public exposure.
            </p>
          </div>

          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid var(--reader-border)",
              backgroundColor: "var(--reader-bg)",
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

      {/* Tab 5: Release & Lifecycle */}
      {activeTab === "publishing" && (
        <div className={styles.card}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
              Release &amp; Publication Lifecycle
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
              Controlled progression: Draft &rarr; In Review &rarr; Ready to Publish &rarr; Published.
            </p>
          </div>

          <div className={styles.publishBox}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Current Lifecycle State:</span>
              <StatusBadge status={status} />
            </div>

            {pages.length === 0 && status !== "published" && (
              <div style={{ fontSize: "0.875rem", color: "var(--color-warning)" }}>
                At least one comic page must be uploaded and saved before this episode can be published.
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
              {status === "draft" && (
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange("in_review")}
                  isLoading={isTransitioning}
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
                    isLoading={isTransitioning}
                    disabled={pages.length === 0}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <LuCheck size={16} />
                      <span>Approve (Ready to Publish)</span>
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleStatusChange("draft")}
                    isLoading={isTransitioning}
                  >
                    Return to Draft for Revisions
                  </Button>
                </>
              )}

              {status === "ready_to_publish" && (
                <>
                  <Button
                    variant="primary"
                    onClick={handlePublish}
                    isLoading={isTransitioning}
                    disabled={pages.length === 0}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <LuUpload size={16} aria-hidden="true" />
                      <span>Publish Revision to Reader Now</span>
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleStatusChange("draft")}
                    isLoading={isTransitioning}
                  >
                    Return to Draft
                  </Button>
                </>
              )}

              {status === "published" && (
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleUnpublish}
                    isLoading={isTransitioning}
                  >
                    Unpublish from Public View
                  </Button>
                  <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                    Unpublishing removes this chapter from public reader routes immediately.
                  </span>
                </div>
              )}

              {status === "unpublished" && (
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange("draft")}
                  isLoading={isTransitioning}
                >
                  Reopen as Draft Revision
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
