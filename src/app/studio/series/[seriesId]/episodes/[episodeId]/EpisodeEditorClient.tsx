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
  republishEpisodeAction,
  submitForApprovalAction,
  approveEpisodeAction,
  rejectEpisodeAction,
  scheduleEpisodeAction,
  editScheduledReleaseAction,
  cancelScheduledReleaseAction,
  deleteEpisodeAction,
  postReviewCommentAction,
  getEpisodeReleaseHistoryAction,
} from "../actions";
import {
  formatReleaseDisplayDate,
  formatReleaseEventDescription,
  type ReleaseEventItem,
} from "@/lib/data/publishing-pure";
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
  LuCalendar,
  LuClock,
  LuHistory,
  LuX,
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
  initialEpisodeStatus?: string;
  initialPages: PageItem[];
  initialComments: ReviewComment[];
  initialScheduledPublication?: {
    id: string;
    scheduled_for: string;
    status: string;
  } | null;
  initialReleaseEvents?: ReleaseEventItem[];
  latestReviewRequest?: {
    id: string;
    status: string;
    feedback: string | null;
    round: number;
    profiles?: { display_name: string } | null;
  } | null;
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
  initialEpisodeStatus,
  initialPages,
  initialComments,
  initialScheduledPublication,
  initialReleaseEvents,
  latestReviewRequest,
  isPublished,
  userRole,
}: EpisodeEditorClientProps) {
  const [activeTab, setActiveTab] = useState<
    "production" | "details" | "review" | "preview" | "publishing"
  >("production");

  const [revisionId] = useState(initialRevisionId);
  const [status, setStatus] = useState<RevisionStatus>(initialStatus);
  const [episodeStatus, setEpisodeStatus] = useState<string>(
    initialEpisodeStatus || initialStatus || "draft"
  );
  const [scheduledPub, setScheduledPub] = useState(initialScheduledPublication || null);
  const [releaseEvents, setReleaseEvents] = useState<ReleaseEventItem[]>(initialReleaseEvents || []);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [showSubmitNotes, setShowSubmitNotes] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [unpublishReason, setUnpublishReason] = useState("");
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
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

    if (typeof window !== "undefined" && !navigator.onLine) {
      setMessage({
        type: "error",
        text: "You are currently offline. Please check your internet connection before uploading artwork.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setMessage(null);
    setUploadStatus("Validating selected files...");

    // Setup slow network warning timeout
    const slowWarningTimer = setTimeout(() => {
      setUploadStatus((prev) =>
        prev ? `${prev} (taking longer than expected due to network latency...)` : null
      );
    }, 8000);

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
      clearTimeout(slowWarningTimer);
      setIsUploading(false);
      setUploadStatus(null);
      return;
    }

    const uploadedItems: PageItem[] = [];
    const failedFiles: string[] = [];
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
        formData.append("tags", "pageprowl,episode_page");

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
        failedFiles.push(`${file.name} (${err.message || "Network error"})`);
      }
    }

    clearTimeout(slowWarningTimer);

    if (uploadedItems.length > 0) {
      const mergedPages = [...pages, ...uploadedItems];
      mergedPages.forEach((p, idx) => {
        p.pageNumber = idx + 1;
      });
      setPages(mergedPages);
      setHasUnsavedChanges(true);
    }

    if (failedFiles.length > 0) {
      setMessage({
        type: "error",
        text: `Uploaded ${uploadedItems.length} of ${filesToUpload.length} pages. Failed: ${failedFiles.join("; ")}. You can retry uploading the failed pages without re-uploading completed pages.`,
      });
    } else if (uploadedItems.length > 0) {
      setMessage({
        type: "success",
        text: `Successfully uploaded all ${uploadedItems.length} pages. Click 'Save Order' to persist the reading sequence.`,
      });
    }

    setIsUploading(false);
    setUploadStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Save draft pages order to database
  const handleSaveOrder = async () => {
    if (!canEdit) return;
    if (typeof window !== "undefined" && !navigator.onLine) {
      setMessage({
        type: "error",
        text: "You are currently offline. Please reconnect to save page order.",
      });
      return;
    }

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
    if (typeof window !== "undefined" && !navigator.onLine) {
      setMessage({
        type: "error",
        text: "You are currently offline. Please reconnect to update episode details.",
      });
      return;
    }

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

  const refreshReleaseEvents = async () => {
    try {
      const history = await getEpisodeReleaseHistoryAction(episodeId);
      setReleaseEvents(history);
    } catch {
      // Non-fatal
    }
  };

  // Submit for editorial approval
  const handleSubmitApproval = async () => {
    setIsTransitioning(true);
    setMessage(null);
    try {
      await submitForApprovalAction(seriesId, episodeId, revisionId, submissionNotes);
      setEpisodeStatus("in_review");
      setStatus("in_review");
      setShowSubmitNotes(false);
      setMessage({ type: "success", text: "Episode submitted for editorial approval." });
      await refreshReleaseEvents();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to submit episode." });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Approve episode
  const handleApprove = async () => {
    if (!canEdit) return;
    setIsTransitioning(true);
    setMessage(null);
    try {
      await approveEpisodeAction(seriesId, episodeId, revisionId, "Approved by editor");
      setEpisodeStatus("approved");
      setStatus("approved");
      setMessage({ type: "success", text: "Episode approved! It can now be published or scheduled." });
      await refreshReleaseEvents();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to approve episode." });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Reject / Request revisions
  const handleReject = async () => {
    if (!canEdit) return;
    if (!rejectFeedback.trim()) {
      setMessage({ type: "error", text: "Feedback explaining requested changes is required." });
      return;
    }
    setIsTransitioning(true);
    setMessage(null);
    try {
      await rejectEpisodeAction(seriesId, episodeId, revisionId, rejectFeedback);
      setEpisodeStatus("revisions_required");
      setStatus("revisions_required");
      setShowRejectBox(false);
      setMessage({ type: "success", text: "Revisions requested. Creator notified with feedback." });
      await refreshReleaseEvents();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to request revisions." });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Publish revision immediately
  const handlePublish = async () => {
    if (!canEdit) return;
    setIsTransitioning(true);
    setMessage(null);

    try {
      await publishRevisionAction(seriesId, episodeId, revisionId);
      setEpisodeStatus("published");
      setStatus("published");
      setPublished(true);
      setScheduledPub(null);
      setMessage({
        type: "success",
        text: "Episode successfully published! It is now live on the public reader.",
      });
      await refreshReleaseEvents();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to publish episode.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Schedule release
  const handleScheduleRelease = async () => {
    if (!canEdit) return;
    if (!scheduleDateTime) {
      setMessage({ type: "error", text: "Please pick a future release date and time." });
      return;
    }
    setIsTransitioning(true);
    setMessage(null);

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await scheduleEpisodeAction(
        seriesId,
        episodeId,
        revisionId,
        scheduleDateTime,
        timeZone
      );
      setEpisodeStatus("scheduled");
      setStatus("scheduled" as any);
      setScheduledPub(res.scheduledPublication as any);
      setShowSchedulePicker(false);
      setMessage({
        type: "success",
        text: `Episode scheduled for automated release on ${res.formattedDate}.`,
      });
      await refreshReleaseEvents();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to schedule release.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Cancel scheduled release
  const handleCancelSchedule = async () => {
    if (!canEdit || !scheduledPub) return;
    if (!confirm("Are you sure you want to cancel this scheduled release? The episode will revert to approved status.")) {
      return;
    }
    setIsTransitioning(true);
    setMessage(null);

    try {
      await cancelScheduledReleaseAction(scheduledPub.id, seriesId, episodeId);
      setEpisodeStatus("approved");
      setStatus("approved");
      setScheduledPub(null);
      setMessage({
        type: "success",
        text: "Scheduled release cancelled. Episode reverted to approved.",
      });
      await refreshReleaseEvents();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to cancel scheduled release.",
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
      await unpublishEpisodeAction(seriesId, episodeId, unpublishReason);
      setEpisodeStatus("unpublished");
      setStatus("unpublished");
      setPublished(false);
      setShowUnpublishModal(false);
      setMessage({
        type: "success",
        text: "Episode unpublished. It has been safely removed from public reader access.",
      });
      await refreshReleaseEvents();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to unpublish episode.",
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Republish episode
  const handleRepublish = async () => {
    if (!canEdit) return;
    setIsTransitioning(true);
    setMessage(null);

    try {
      await republishEpisodeAction(seriesId, episodeId, revisionId);
      setEpisodeStatus("published");
      setStatus("published");
      setPublished(true);
      setMessage({
        type: "success",
        text: "Episode republished! Restored on public reader.",
      });
      await refreshReleaseEvents();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to republish episode.",
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

      {/* Tab 5: Release, Approval & Scheduling Lifecycle */}
      {activeTab === "publishing" && (
        <div className={styles.card}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
              Publishing, Scheduling &amp; Release Lifecycle
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
              Editorial approval workflow, automated release scheduling, and durable release history.
            </p>
          </div>

          <div className={styles.publishBox}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600 }}>Current Lifecycle State:</span>
              <StatusBadge status={(episodeStatus as any) || status} />
              {published && (
                <span
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "var(--color-success)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  LIVE ON PUBLIC READER
                </span>
              )}
            </div>

            {pages.length === 0 && episodeStatus !== "published" && (
              <div style={{ fontSize: "0.875rem", color: "var(--color-warning)" }}>
                At least one comic page must be uploaded and saved before this episode can be submitted, scheduled, or published.
              </div>
            )}

            {/* Stage-Specific Workflow & Actions */}
            {(episodeStatus === "draft" || episodeStatus === "in_production") && (
              <div className={styles.statusCallout}>
                <p style={{ fontSize: "0.875rem" }}>
                  This episode is in production draft. Once artwork pages are finalized, submit it for editorial review.
                </p>

                {showSubmitNotes ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                    <textarea
                      placeholder="Optional submission notes or instructions for reviewers..."
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      rows={2}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text-main)",
                        fontSize: "0.875rem",
                      }}
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button
                        variant="primary"
                        onClick={handleSubmitApproval}
                        isLoading={isTransitioning}
                        disabled={pages.length === 0}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <LuSend size={14} />
                          <span>Submit for Editorial Approval</span>
                        </span>
                      </Button>
                      <Button variant="ghost" onClick={() => setShowSubmitNotes(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                    <Button
                      variant="primary"
                      onClick={() => setShowSubmitNotes(true)}
                      disabled={pages.length === 0}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <LuSend size={14} />
                        <span>Submit for Approval</span>
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {episodeStatus === "in_review" && (
              <div className={`${styles.statusCallout} ${styles.statusCalloutScheduled}`}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  Under Editorial Review (Round #{latestReviewRequest?.round || 1})
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  Reviewers inspect artwork sequence and quality. Editors can approve for publication or request corrections.
                </p>

                {canEdit ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                    {showRejectBox ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <textarea
                          placeholder="Provide specific feedback on required corrections..."
                          value={rejectFeedback}
                          onChange={(e) => setRejectFeedback(e.target.value)}
                          rows={3}
                          required
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--color-border)",
                            backgroundColor: "var(--color-surface)",
                            color: "var(--color-text-main)",
                            fontSize: "0.875rem",
                          }}
                        />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button
                            variant="danger"
                            onClick={handleReject}
                            isLoading={isTransitioning}
                          >
                            Confirm Revisions Request
                          </Button>
                          <Button variant="ghost" onClick={() => setShowRejectBox(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <Button
                          variant="primary"
                          onClick={handleApprove}
                          isLoading={isTransitioning}
                          disabled={pages.length === 0}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <LuCheck size={16} />
                            <span>Approve Episode for Publication</span>
                          </span>
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => setShowRejectBox(true)}
                          disabled={isTransitioning}
                        >
                          Request Changes / Revisions
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                    Editorial review is in progress by series editors.
                  </p>
                )}
              </div>
            )}

            {episodeStatus === "revisions_required" && (
              <div className={`${styles.statusCallout} ${styles.statusCalloutRevisions}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-danger)" }}>
                  <LuCircleAlert size={18} />
                  <strong>Changes Requested by Reviewer</strong>
                </div>
                {latestReviewRequest?.feedback && (
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      fontSize: "0.875rem",
                      marginTop: "4px",
                    }}
                  >
                    &ldquo;{latestReviewRequest.feedback}&rdquo;
                  </div>
                )}
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                  Update artwork pages in the Production tab to address the feedback, then resubmit for approval.
                </p>
                <div style={{ marginTop: "8px" }}>
                  <Button
                    variant="primary"
                    onClick={handleSubmitApproval}
                    isLoading={isTransitioning}
                    disabled={pages.length === 0}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <LuSend size={14} />
                      <span>Resubmit Revised Episode for Approval</span>
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {episodeStatus === "approved" && (
              <div className={`${styles.statusCallout} ${styles.statusCalloutApproved}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-success)" }}>
                  <LuCheck size={18} />
                  <strong>Editorial Approval Granted 🎉</strong>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  This episode has been formally approved. You can publish it immediately or schedule it for automated release.
                </p>

                {showSchedulePicker ? (
                  <div className={styles.scheduleCard} style={{ marginTop: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <LuCalendar size={16} color="var(--color-primary)" />
                      <strong>Schedule Automated Release</strong>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                      Select a future release date and time. Stored in UTC and automatically released by our scheduled publishing engine.
                    </p>
                    <input
                      type="datetime-local"
                      value={scheduleDateTime}
                      onChange={(e) => setScheduleDateTime(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text-main)",
                        fontSize: "0.875rem",
                        maxWidth: "280px",
                      }}
                    />
                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                      <Button
                        variant="primary"
                        onClick={handleScheduleRelease}
                        isLoading={isTransitioning}
                        disabled={!scheduleDateTime}
                      >
                        Confirm Schedule
                      </Button>
                      <Button variant="ghost" onClick={() => setShowSchedulePicker(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
                    <Button
                      variant="primary"
                      onClick={handlePublish}
                      isLoading={isTransitioning}
                      disabled={pages.length === 0}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <LuUpload size={16} />
                        <span>Publish Immediately</span>
                      </span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowSchedulePicker(true)}
                      disabled={isTransitioning || pages.length === 0}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <LuCalendar size={16} />
                        <span>Schedule Automated Release</span>
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {episodeStatus === "scheduled" && (
              <div className={`${styles.statusCallout} ${styles.statusCalloutScheduled}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-primary)" }}>
                  <LuClock size={18} />
                  <strong>Scheduled for Automated Publication</strong>
                </div>
                {scheduledPub && (
                  <p style={{ fontSize: "0.875rem" }}>
                    Release Time: <strong>{formatReleaseDisplayDate(scheduledPub.scheduled_for)}</strong>
                  </p>
                )}
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  The scheduled processor will automatically release this chapter to public readers and notify followers when the release time arrives.
                </p>

                {showSchedulePicker ? (
                  <div className={styles.scheduleCard} style={{ marginTop: "8px" }}>
                    <input
                      type="datetime-local"
                      value={scheduleDateTime}
                      onChange={(e) => setScheduleDateTime(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text-main)",
                        fontSize: "0.875rem",
                        maxWidth: "280px",
                      }}
                    />
                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                      <Button
                        variant="primary"
                        onClick={handleScheduleRelease}
                        isLoading={isTransitioning}
                        disabled={!scheduleDateTime}
                      >
                        Save New Release Time
                      </Button>
                      <Button variant="ghost" onClick={() => setShowSchedulePicker(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowSchedulePicker(true)}
                      disabled={isTransitioning}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleCancelSchedule}
                      isLoading={isTransitioning}
                    >
                      Cancel Scheduled Release
                    </Button>
                  </div>
                )}
              </div>
            )}

            {episodeStatus === "published" && (
              <div className={`${styles.statusCallout} ${styles.statusCalloutPublished}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-success)" }}>
                  <LuCheck size={18} />
                  <strong>Live on Public Reader</strong>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  This chapter is publicly accessible on the reader and appears in discovery lists.
                </p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: "8px" }}>
                  <Link
                    href={`/series/${seriesSlug}/episodes/${episodeSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="sm">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <LuExternalLink size={14} />
                        <span>View Live Chapter</span>
                      </span>
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleUnpublish}
                    isLoading={isTransitioning}
                  >
                    Unpublish from Public View
                  </Button>
                </div>
              </div>
            )}

            {episodeStatus === "unpublished" && (
              <div className={styles.statusCallout}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-warning)" }}>
                  <LuCircleAlert size={18} />
                  <strong>Episode is Unpublished</strong>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                  This chapter is currently hidden from public discovery and direct URLs return a safe 404. All comments and reader progress remain preserved.
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <Button
                    variant="primary"
                    onClick={handleRepublish}
                    isLoading={isTransitioning}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <LuUpload size={16} />
                      <span>Republish Episode to Public Reader</span>
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Durable Release History Timeline */}
          <div style={{ marginTop: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <LuHistory size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                Durable Release &amp; Lifecycle History
              </h3>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              Immutable audit trail of submissions, review decisions, schedules, and publication actions.
            </p>

            {releaseEvents && releaseEvents.length > 0 ? (
              <div className={styles.timeline}>
                {releaseEvents.map((evt) => (
                  <div key={evt.id} className={styles.timelineItem}>
                    <div className={styles.timelineMarker} />
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <span>{evt.eventType.replace(/_/g, " ").toUpperCase()}</span>
                        <span className={styles.timelineDate}>
                          {new Date(evt.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ margin: "2px 0", color: "var(--color-text)" }}>
                        {formatReleaseEventDescription(evt.eventType, evt.metadata)}
                      </p>
                      <span style={{ color: "var(--color-text-muted)", fontSize: "11px" }}>
                        Action by: <strong>{evt.actorName || "System"}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "8px" }}>
                No publishing lifecycle events recorded yet.
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
