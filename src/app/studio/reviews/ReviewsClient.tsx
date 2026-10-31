"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "@/app/studio/page.module.css";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { submitReviewOutcomeAction, postResourceCommentAction } from "./actions";
import {
  LuMessageSquare,
  LuArrowRight,
  LuCircleCheck,
  LuRotateCcw,
  LuX,
  LuSend,
  LuLayers,
  LuClock,
} from "react-icons/lu";
import type { ReviewRequestWithDetails } from "@/lib/data/workflows";

interface ReviewsClientProps {
  initialRequests: ReviewRequestWithDetails[];
  initialComments: any[];
  currentUserId: string;
}

export function ReviewsClient({
  initialRequests,
  initialComments,
  currentUserId,
}: ReviewsClientProps) {
  const [requests, setRequests] = useState<ReviewRequestWithDetails[]>(initialRequests);
  const [comments, setComments] = useState<any[]>(initialComments);
  const [activeTab, setActiveTab] = useState<"pending" | "history" | "comments">("pending");

  // Active review request modal
  const [activeRequest, setActiveRequest] = useState<ReviewRequestWithDetails | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // New comment
  const [newCommentText, setNewCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === "pending" || r.status === "in_review");
  const historicalRequests = requests.filter(
    (r) => r.status === "approved" || r.status === "revisions_requested" || r.status === "closed"
  );

  const handleReviewDecision = async (outcome: "approved" | "revisions_requested") => {
    if (!activeRequest) return;
    if (typeof window !== "undefined" && !navigator.onLine) {
      setActionError("You are currently offline. Please reconnect to submit review verdicts.");
      return;
    }
    if (!feedbackText.trim()) {
      setActionError("Please provide review feedback before recording the outcome.");
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      const res = await submitReviewOutcomeAction(activeRequest.id, outcome, feedbackText.trim());
      if (res.request) {
        setRequests(requests.map((r) => (r.id === activeRequest.id ? res.request : r)));
        setActiveRequest(null);
        setFeedbackText("");
      }
    } catch (err: any) {
      setActionError(err?.message || "Failed to submit review decision.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostGeneralComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (typeof window !== "undefined" && !navigator.onLine) {
      alert("You are currently offline. Please reconnect to post comments.");
      return;
    }

    setIsPostingComment(true);
    try {
      const formData = new FormData();
      formData.set("content", newCommentText.trim());

      const res = await postResourceCommentAction(formData);
      if (res.comment) {
        setComments([res.comment, ...comments]);
        setNewCommentText("");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to post comment.");
    } finally {
      setIsPostingComment(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Editorial Reviews &amp; Revisions</h1>
          <p className={styles.subtitle}>
            Conduct review rounds, communicate proofreading feedback, and grant publishing approval.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-2)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "pending" ? "2px solid var(--color-primary)" : "none",
            padding: "var(--space-2) var(--space-4)",
            fontWeight: activeTab === "pending" ? 700 : 500,
            color: activeTab === "pending" ? "var(--color-primary)" : "var(--color-text-muted)",
            cursor: "pointer",
          }}
        >
          Pending Reviews ({pendingRequests.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "history" ? "2px solid var(--color-primary)" : "none",
            padding: "var(--space-2) var(--space-4)",
            fontWeight: activeTab === "history" ? 700 : 500,
            color: activeTab === "history" ? "var(--color-primary)" : "var(--color-text-muted)",
            cursor: "pointer",
          }}
        >
          Review History ({historicalRequests.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("comments")}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "comments" ? "2px solid var(--color-primary)" : "none",
            padding: "var(--space-2) var(--space-4)",
            fontWeight: activeTab === "comments" ? 700 : 500,
            color: activeTab === "comments" ? "var(--color-primary)" : "var(--color-text-muted)",
            cursor: "pointer",
          }}
        >
          Editorial Comments ({comments.length})
        </button>
      </div>

      {/* Tab 1: Pending Reviews */}
      {activeTab === "pending" && (
        <section className={styles.section}>
          {pendingRequests.length > 0 ? (
            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Series &amp; Episode</th>
                  <th>Round</th>
                  <th>Version Snapshot</th>
                  <th>Requester</th>
                  <th>Assigned Reviewer</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.series?.title || "Series"}</strong>
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                        Ep #{req.episode?.episode_number}: {req.episode?.title}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>Round #{req.round}</span>
                    </td>
                    <td>
                      {req.revision ? `Rev #${req.revision.revision_number}` : "Latest Revision"}
                    </td>
                    <td>{req.requester?.display_name || "Creator"}</td>
                    <td>
                      {req.reviewer ? (
                        <strong>{req.reviewer.display_name}</strong>
                      ) : (
                        <span style={{ color: "var(--color-text-muted)" }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={req.status as any} />
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setActiveRequest(req);
                          setFeedbackText(req.feedback || "");
                        }}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon={<LuCircleCheck size={44} color="var(--color-text-muted)" />}
              title="No pending reviews"
              description="All editorial review requests have been answered."
            />
          )}
        </section>
      )}

      {/* Tab 2: Review History (Preserves prior rounds) */}
      {activeTab === "history" && (
        <section className={styles.section}>
          {historicalRequests.length > 0 ? (
            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Series &amp; Episode</th>
                  <th>Round</th>
                  <th>Outcome</th>
                  <th>Feedback Summary</th>
                  <th>Completed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {historicalRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.series?.title || "Series"}</strong>
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                        Ep #{req.episode?.episode_number}: {req.episode?.title}
                      </div>
                    </td>
                    <td>Round #{req.round}</td>
                    <td>
                      <StatusBadge
                        status={req.outcome === "approved" ? "approved" : "revisions_required"}
                        label={req.outcome === "approved" ? "APPROVED" : "REVISIONS REQUESTED"}
                      />
                    </td>
                    <td style={{ maxWidth: "280px" }}>
                      <span style={{ fontSize: "var(--font-size-xs)" }}>
                        {req.feedback || "No feedback notes attached."}
                      </span>
                    </td>
                    <td>
                      {req.completed_at ? new Date(req.completed_at).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      {req.series?.id && req.episode?.id && (
                        <Link href={`/studio/series/${req.series.id}/episodes/${req.episode.id}`}>
                          <Button variant="secondary" size="sm">
                            Open Episode
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-muted)" }}>
              No completed review rounds yet.
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Editorial Comments */}
      {activeTab === "comments" && (
        <section className={styles.section}>
          <div style={{ marginBottom: "var(--space-4)" }}>
            <form onSubmit={handlePostGeneralComment} style={{ display: "flex", gap: "var(--space-2)" }}>
              <input
                type="text"
                placeholder="Post a collaboration note or mention @creator..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{
                  flex: 1,
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  fontSize: "var(--font-size-sm)",
                }}
              />
              <Button type="submit" variant="primary" disabled={isPostingComment}>
                <LuSend size={14} style={{ marginRight: "4px" }} />
                <span>Post Note</span>
              </Button>
            </form>
          </div>

          {comments.length > 0 ? (
            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Series &amp; Episode</th>
                  <th>Comment</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.episode_revisions?.episodes?.series?.title || "Series"}</strong>
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                        {c.episode_revisions?.episodes?.title || "Episode"}
                      </div>
                    </td>
                    <td style={{ maxWidth: "340px" }}>{c.content}</td>
                    <td>{c.profiles?.display_name || "Creator"}</td>
                    <td>
                      <StatusBadge status={c.status === "resolved" ? "published" : "in_review"} label={c.status.toUpperCase()} />
                    </td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-muted)" }}>
              No comments posted yet.
            </div>
          )}
        </section>
      )}

      {/* Modal: Review Feedback and Outcome Action */}
      {activeRequest && (
        <div className={styles.modalOverlay} onClick={() => setActiveRequest(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: "var(--font-size-xs)", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase" }}>
                  Editorial Review (Round #{activeRequest.round})
                </span>
                <h2 className={styles.modalTitle} style={{ marginTop: "4px" }}>
                  {activeRequest.series?.title}: {activeRequest.episode?.title}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setActiveRequest(null)}
                aria-label="Close review dialog"
              >
                <LuX />
              </button>
            </div>

            {actionError && (
              <div style={{ color: "var(--color-danger)", fontSize: "var(--font-size-xs)" }}>
                {actionError}
              </div>
            )}

            <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text)" }}>
              <p>
                <strong>Requester:</strong> {activeRequest.requester?.display_name}
              </p>
              <p style={{ marginTop: "4px" }}>
                <strong>Version Snapshot:</strong>{" "}
                {activeRequest.revision ? `Revision #${activeRequest.revision.revision_number}` : "Latest Draft"}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <label htmlFor="reviewFeedback" style={{ fontSize: "var(--font-size-xs)", fontWeight: 700 }}>
                Review Feedback &amp; Proofreading Notes:
              </label>
              <textarea
                id="reviewFeedback"
                rows={5}
                placeholder="Detail changes needed or approval notes..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  fontSize: "var(--font-size-sm)",
                  fontFamily: "var(--font-family-body)",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-4)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)" }}>
              <Button
                variant="danger"
                disabled={isSubmitting}
                onClick={() => handleReviewDecision("revisions_requested")}
              >
                <LuRotateCcw size={16} style={{ marginRight: "4px" }} />
                <span>Request Revisions</span>
              </Button>

              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button variant="secondary" onClick={() => setActiveRequest(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={isSubmitting}
                  onClick={() => handleReviewDecision("approved")}
                >
                  <LuCircleCheck size={16} style={{ marginRight: "4px" }} />
                  <span>Approve Episode</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
