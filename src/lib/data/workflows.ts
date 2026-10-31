import { createClient } from "../supabase/server";
import { logger } from "../logger";
import { logActivity } from "./activity";
import { createNotification } from "./notifications";
import type {
  Database,
  EpisodeProductionStatus,
  ReviewRequestStatus,
  ReviewOutcome,
  SeriesRole,
} from "../../types/database";

export type { ReviewOutcome } from "@/types/database";
export type ReviewRequestRow = Database["public"]["Tables"]["review_requests"]["Row"];

export const CANONICAL_EPISODE_STAGES: EpisodeProductionStatus[] = [
  "draft",
  "in_production",
  "in_review",
  "revisions_required",
  "approved",
  "published",
];

export const EPISODE_STAGE_TRANSITIONS: Record<
  EpisodeProductionStatus,
  EpisodeProductionStatus[]
> = {
  draft: ["in_production"],
  in_production: ["in_review", "draft"],
  in_review: ["revisions_required", "approved"],
  revisions_required: ["in_production"],
  approved: ["published", "in_production"],
  published: ["in_production", "draft"],
};

export interface ReviewRequestWithDetails extends ReviewRequestRow {
  requester?: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  } | null;
  reviewer?: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  } | null;
  series?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  episode?: {
    id: string;
    title: string;
    episode_number: number;
    slug: string;
  } | null;
  revision?: {
    id: string;
    revision_number: number;
    status: string;
  } | null;
}

/**
 * Pure helper to test valid lifecycle transitions between episode production stages.
 */
export function canTransitionEpisodeStage(
  currentStage: EpisodeProductionStatus,
  targetStage: EpisodeProductionStatus
): boolean {
  return EPISODE_STAGE_TRANSITIONS[currentStage]?.includes(targetStage) ?? false;
}

/**
 * Pure helper to verify permissions for episode stage transitions.
 * - Moving to in_production: Contributor or Editor
 * - Submitting for review: Contributor or Editor
 * - Requesting revisions: Editor or designated Reviewer
 * - Approving: Editor or Owner
 * - Publishing: Editor or Owner
 */
export function hasStageTransitionPermission(
  targetStage: EpisodeProductionStatus,
  effectiveRole: SeriesRole
): boolean {
  if (targetStage === "in_production" || targetStage === "in_review") {
    return effectiveRole === "contributor" || effectiveRole === "editor" || effectiveRole === "owner";
  }
  if (targetStage === "revisions_required" || targetStage === "approved" || targetStage === "published") {
    return effectiveRole === "editor" || effectiveRole === "owner";
  }
  return false;
}

/**
 * Transition an episode's production lifecycle stage with audit logging and notifications.
 */
export async function transitionEpisodeStage(params: {
  seriesId: string;
  episodeId: string;
  studioId?: string | null;
  targetStage: EpisodeProductionStatus;
  actorId: string;
  role: SeriesRole;
}): Promise<EpisodeProductionStatus> {
  const supabase = createClient();

  if (!hasStageTransitionPermission(params.targetStage, params.role)) {
    throw new Error(
      `Permission denied: Your role (${params.role}) cannot transition an episode to '${params.targetStage}'.`
    );
  }

  // Fetch current episode status
  const { data: episode, error: epError } = await supabase
    .from("episodes")
    .select("id, title, episode_number, status, series_id")
    .eq("id", params.episodeId)
    .single();

  if (epError || !episode) {
    throw new Error("Episode not found.");
  }

  const currentStage = (episode.status || "draft") as EpisodeProductionStatus;

  if (!canTransitionEpisodeStage(currentStage, params.targetStage)) {
    throw new Error(
      `Invalid stage transition: Cannot move from '${currentStage}' to '${params.targetStage}'.`
    );
  }

  // Update episode status
  const { error: updateError } = await supabase
    .from("episodes")
    .update({
      status: params.targetStage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.episodeId);

  if (updateError) {
    throw new Error(updateError.message || "Failed to update episode stage.");
  }

  // Update latest revision status in sync
  const { data: latestRev } = await supabase
    .from("episode_revisions")
    .select("id")
    .eq("episode_id", params.episodeId)
    .order("revision_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestRev) {
    await supabase
      .from("episode_revisions")
      .update({
        status: params.targetStage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", latestRev.id);
  }

  // Determine studio_id if not passed
  let studioId = params.studioId;
  if (!studioId) {
    const { data: series } = await supabase
      .from("series")
      .select("owner_studio_id")
      .eq("id", params.seriesId)
      .single();
    studioId = series?.owner_studio_id || null;
  }

  await logActivity({
    studioId,
    actorId: params.actorId,
    action: "episode_stage_changed",
    entityType: "episode",
    entityId: params.episodeId,
    metadata: {
      episodeTitle: episode.title,
      previousStage: currentStage,
      newStage: params.targetStage,
    },
  });

  return params.targetStage;
}

/**
 * Create a new review request, supporting multiple rounds while preserving past records.
 */
export async function createReviewRequest(params: {
  studioId: string;
  seriesId: string;
  episodeId: string;
  revisionId?: string | null;
  taskId?: string | null;
  requesterId: string;
  reviewerId?: string | null;
  feedback?: string | null;
}): Promise<ReviewRequestWithDetails> {
  const supabase = createClient();

  // 1. Calculate next round number for this episode
  const { data: priorRequests } = await supabase
    .from("review_requests")
    .select("round")
    .eq("episode_id", params.episodeId)
    .order("round", { ascending: false })
    .limit(1);

  const nextRound = priorRequests && priorRequests.length > 0 ? priorRequests[0].round + 1 : 1;

  // 2. Resolve revision ID if not provided: snapshot latest revision
  let revisionId = params.revisionId;
  if (!revisionId) {
    const { data: rev } = await supabase
      .from("episode_revisions")
      .select("id")
      .eq("episode_id", params.episodeId)
      .order("revision_number", { ascending: false })
      .limit(1)
      .single();
    revisionId = rev?.id || null;
  }

  // 3. Insert review request
  const { data: reviewReq, error: insertError } = await supabase
    .from("review_requests")
    .insert({
      studio_id: params.studioId,
      series_id: params.seriesId,
      episode_id: params.episodeId,
      revision_id: revisionId,
      task_id: params.taskId || null,
      requester_id: params.requesterId,
      reviewer_id: params.reviewerId || null,
      round: nextRound,
      status: "pending",
      feedback: params.feedback?.trim() || null,
    })
    .select("*")
    .single();

  if (insertError || !reviewReq) {
    throw new Error(insertError?.message || "Failed to create review request.");
  }

  // 4. Update episode and revision status to 'in_review'
  await supabase
    .from("episodes")
    .update({ status: "in_review", updated_at: new Date().toISOString() })
    .eq("id", params.episodeId);

  if (revisionId) {
    await supabase
      .from("episode_revisions")
      .update({ status: "in_review", updated_at: new Date().toISOString() })
      .eq("id", revisionId);
  }

  // 5. Log activity
  const { data: ep } = await supabase
    .from("episodes")
    .select("title")
    .eq("id", params.episodeId)
    .single();

  await logActivity({
    studioId: params.studioId,
    actorId: params.requesterId,
    action: "review_requested",
    entityType: "review_request",
    entityId: reviewReq.id,
    metadata: {
      round: nextRound,
      episodeTitle: ep?.title || "Episode",
      reviewerId: params.reviewerId,
    },
  });

  // 6. Notify designated reviewer if specified
  if (params.reviewerId && params.reviewerId !== params.requesterId) {
    await createNotification({
      studioId: params.studioId,
      userId: params.reviewerId,
      title: "Review Requested",
      message: `You were asked to review Episode "${ep?.title || "Episode"}" (Round #${nextRound})`,
      type: "review",
      link: `/studio/reviews?requestId=${reviewReq.id}`,
    });
  }

  return (await getReviewRequestById(reviewReq.id))!;
}

/**
 * Submit review feedback and record final outcome (approve or request revisions).
 */
export async function submitReviewOutcome(params: {
  reviewRequestId: string;
  reviewerId: string;
  outcome: "approved" | "revisions_requested";
  feedback: string;
}): Promise<ReviewRequestWithDetails> {
  const supabase = createClient();

  const trimmedFeedback = params.feedback?.trim();
  if (!trimmedFeedback || trimmedFeedback.length < 2) {
    throw new Error("Review feedback is required.");
  }

  const { data: req, error: fetchError } = await supabase
    .from("review_requests")
    .select("*, episodes:episode_id (title, series_id)")
    .eq("id", params.reviewRequestId)
    .single();

  if (fetchError || !req) {
    throw new Error("Review request not found.");
  }

  const nowIso = new Date().toISOString();
  const nextStage: EpisodeProductionStatus =
    params.outcome === "approved" ? "approved" : "revisions_required";

  // 1. Update review request
  const { error: updateReqError } = await supabase
    .from("review_requests")
    .update({
      reviewer_id: params.reviewerId,
      status: params.outcome === "approved" ? "approved" : "revisions_requested",
      outcome: params.outcome,
      feedback: trimmedFeedback,
      completed_at: nowIso,
      updated_at: nowIso,
    })
    .eq("id", params.reviewRequestId);

  if (updateReqError) {
    throw new Error(updateReqError.message || "Failed to record review outcome.");
  }

  // 2. Update episode status to approved or revisions_required
  await supabase
    .from("episodes")
    .update({
      status: nextStage,
      updated_at: nowIso,
    })
    .eq("id", req.episode_id);

  // 3. Update revision status to approved or revisions_required
  if (req.revision_id) {
    await supabase
      .from("episode_revisions")
      .update({
        status: nextStage,
        updated_at: nowIso,
      })
      .eq("id", req.revision_id);
  }

  const epTitle = (req.episodes as any)?.title || "Episode";

  // 4. Log activity
  await logActivity({
    studioId: req.studio_id,
    actorId: params.reviewerId,
    action: params.outcome === "approved" ? "episode_approved" : "review_completed",
    entityType: "review_request",
    entityId: req.id,
    metadata: {
      episodeTitle: epTitle,
      outcome: params.outcome,
      round: req.round,
    },
  });

  // 5. Notify requester of outcome
  await createNotification({
    studioId: req.studio_id,
    userId: req.requester_id,
    title: params.outcome === "approved" ? "Episode Approved! 🎉" : "Revisions Requested",
    message:
      params.outcome === "approved"
        ? `Episode "${epTitle}" was approved in Round #${req.round}. It is ready for publication.`
        : `Revisions were requested on Episode "${epTitle}" (Round #${req.round}): "${trimmedFeedback.substring(0, 100)}"`,
    type: params.outcome === "approved" ? "approval" : "revision",
    link: `/studio/series/${req.series_id}/episodes/${req.episode_id}`,
  });

  return (await getReviewRequestById(req.id))!;
}

/**
 * Fetch a single review request by ID.
 */
export async function getReviewRequestById(
  requestId: string
): Promise<ReviewRequestWithDetails | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("review_requests")
    .select(`
      *,
      requester:requester_id (id, display_name, username, avatar_url),
      reviewer:reviewer_id (id, display_name, username, avatar_url),
      series:series_id (id, title, slug),
      episode:episode_id (id, title, episode_number, slug),
      revision:revision_id (id, revision_number, status)
    `)
    .eq("id", requestId)
    .single();

  if (error || !data) {
    return null;
  }

  const row = data as any;
  return {
    ...row,
    requester: row.requester || null,
    reviewer: row.reviewer || null,
    series: row.series || null,
    episode: row.episode || null,
    revision: row.revision || null,
  };
}

/**
 * Fetch review requests for a studio workspace.
 */
export async function getStudioReviewRequests(
  studioId: string,
  options: { status?: ReviewRequestStatus; limit?: number } = {}
): Promise<ReviewRequestWithDetails[]> {
  const supabase = createClient();

  let query = supabase
    .from("review_requests")
    .select(`
      *,
      requester:requester_id (id, display_name, username, avatar_url),
      reviewer:reviewer_id (id, display_name, username, avatar_url),
      series:series_id (id, title, slug),
      episode:episode_id (id, title, episode_number, slug),
      revision:revision_id (id, revision_number, status)
    `)
    .eq("studio_id", studioId)
    .order("created_at", { ascending: false });

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    ...row,
    requester: row.requester || null,
    reviewer: row.reviewer || null,
    series: row.series || null,
    episode: row.episode || null,
    revision: row.revision || null,
  }));
}

/**
 * Fetch review requests assigned to the current user.
 */
export async function getUserAssignedReviews(
  userId: string,
  options: { status?: ReviewRequestStatus } = {}
): Promise<ReviewRequestWithDetails[]> {
  const supabase = createClient();

  let query = supabase
    .from("review_requests")
    .select(`
      *,
      requester:requester_id (id, display_name, username, avatar_url),
      reviewer:reviewer_id (id, display_name, username, avatar_url),
      series:series_id (id, title, slug),
      episode:episode_id (id, title, episode_number, slug),
      revision:revision_id (id, revision_number, status)
    `)
    .eq("reviewer_id", userId)
    .order("created_at", { ascending: false });

  if (options.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    ...row,
    requester: row.requester || null,
    reviewer: row.reviewer || null,
    series: row.series || null,
    episode: row.episode || null,
    revision: row.revision || null,
  }));
}

/**
 * Fetch all review request rounds for an episode, preserving complete audit history.
 */
export async function getEpisodeReviewHistory(
  episodeId: string
): Promise<ReviewRequestWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("review_requests")
    .select(`
      *,
      requester:requester_id (id, display_name, username, avatar_url),
      reviewer:reviewer_id (id, display_name, username, avatar_url),
      revision:revision_id (id, revision_number, status)
    `)
    .eq("episode_id", episodeId)
    .order("round", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    ...row,
    requester: row.requester || null,
    reviewer: row.reviewer || null,
    revision: row.revision || null,
  }));
}
