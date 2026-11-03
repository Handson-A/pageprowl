import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";
import { logger } from "../logger";
import { logActivity } from "./activity";
import { createNotification } from "./notifications";
import { notifySeriesFollowersOfNewEpisode } from "./reader";
import {
  canTransitionEpisodeStatus,
  hasPublishingPermission,
  validateScheduledReleaseTime,
  formatReleaseDisplayDate,
  type ScheduledReleaseItem,
  type ReleaseEventItem,
} from "./publishing-pure";
import type {
  EpisodeProductionStatus,
  SeriesRole,
  ReleaseEventType,
  Database,
} from "@/types/database";

export type ReleaseEventRow = Database["public"]["Tables"]["release_events"]["Row"];
export type ScheduledPublicationRow = Database["public"]["Tables"]["scheduled_publications"]["Row"];

/**
 * Record a durable release history event.
 */
export async function recordReleaseEvent(params: {
  seriesId: string;
  episodeId: string;
  revisionId?: string | null;
  eventType: ReleaseEventType;
  actorId?: string | null;
  scheduledFor?: string | null;
  metadata?: Record<string, any>;
}): Promise<ReleaseEventRow> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("release_events")
    .insert({
      series_id: params.seriesId,
      episode_id: params.episodeId,
      revision_id: params.revisionId || null,
      event_type: params.eventType,
      actor_id: params.actorId || null,
      scheduled_for: params.scheduledFor || null,
      metadata: params.metadata || {},
    })
    .select("*")
    .single();

  if (error || !data) {
    logger.error("Failed to record release event", { error, params });
    throw new Error(error?.message || "Failed to record release event.");
  }

  return data;
}

/**
 * Get full release history for an episode.
 */
export async function getEpisodeReleaseEvents(episodeId: string): Promise<ReleaseEventItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("release_events")
    .select(`
      *,
      profiles:actor_id (display_name, username)
    `)
    .eq("episode_id", episodeId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    seriesId: row.series_id,
    episodeId: row.episode_id,
    revisionId: row.revision_id,
    eventType: row.event_type as ReleaseEventType,
    actorId: row.actor_id,
    actorName: row.profiles?.display_name || row.profiles?.username || "System",
    scheduledFor: row.scheduled_for,
    metadata: row.metadata || {},
    createdAt: row.created_at,
  }));
}

/**
 * Get release events across a series.
 */
export async function getSeriesReleaseEvents(
  seriesId: string,
  limit = 20
): Promise<ReleaseEventItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("release_events")
    .select(`
      *,
      profiles:actor_id (display_name, username)
    `)
    .eq("series_id", seriesId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    seriesId: row.series_id,
    episodeId: row.episode_id,
    revisionId: row.revision_id,
    eventType: row.event_type as ReleaseEventType,
    actorId: row.actor_id,
    actorName: row.profiles?.display_name || row.profiles?.username || "System",
    scheduledFor: row.scheduled_for,
    metadata: row.metadata || {},
    createdAt: row.created_at,
  }));
}

/**
 * Submit an episode for editorial approval.
 */
export async function submitEpisodeForApproval(params: {
  seriesId: string;
  episodeId: string;
  revisionId: string;
  actorId: string;
  userRole: SeriesRole;
  notes?: string;
  studioId?: string | null;
}) {
  if (!hasPublishingPermission("submit_for_review", params.userRole)) {
    throw new Error(`Forbidden: Your role (${params.userRole}) cannot submit episodes for approval.`);
  }

  const supabase = createClient();

  // 1. Verify revision has pages
  const { count: pageCount } = await supabase
    .from("revision_pages")
    .select("*", { count: "exact", head: true })
    .eq("revision_id", params.revisionId);

  if (!pageCount || pageCount < 1) {
    throw new Error("Cannot submit for approval: episode must have at least one uploaded page.");
  }

  // 2. Fetch current episode
  const { data: episode } = await supabase
    .from("episodes")
    .select("id, title, status, episode_number")
    .eq("id", params.episodeId)
    .single();

  if (!episode) {
    throw new Error("Episode not found.");
  }

  const currentStatus = (episode.status || "draft") as EpisodeProductionStatus;
  const isResubmission = currentStatus === "revisions_required";

  // 3. Update episode status
  await supabase
    .from("episodes")
    .update({ status: "in_review", updated_at: new Date().toISOString() })
    .eq("id", params.episodeId);

  // 4. Update revision status
  await supabase
    .from("episode_revisions")
    .update({ status: "in_review", updated_at: new Date().toISOString() })
    .eq("id", params.revisionId);

  // 5. Record release event
  await recordReleaseEvent({
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    revisionId: params.revisionId,
    eventType: isResubmission ? "resubmitted" : "submitted_for_approval",
    actorId: params.actorId,
    metadata: {
      notes: params.notes,
      pageCount,
      episodeTitle: episode.title,
    },
  });

  return { success: true, status: "in_review" as const };
}

/**
 * Approve an episode submission.
 */
export async function approveEpisode(params: {
  seriesId: string;
  episodeId: string;
  revisionId?: string | null;
  reviewerId: string;
  userRole: SeriesRole;
  feedback?: string;
}) {
  if (!hasPublishingPermission("approve", params.userRole)) {
    throw new Error(`Forbidden: Your role (${params.userRole}) cannot approve episodes.`);
  }

  const supabase = createClient();

  // Fetch episode
  const { data: episode } = await supabase
    .from("episodes")
    .select("id, title, status, series_id")
    .eq("id", params.episodeId)
    .single();

  if (!episode) {
    throw new Error("Episode not found.");
  }

  const currentStatus = (episode.status || "draft") as EpisodeProductionStatus;
  if (!canTransitionEpisodeStatus(currentStatus, "approved")) {
    throw new Error(`Invalid transition: Cannot approve an episode currently in '${currentStatus}' status.`);
  }

  // Update episode status
  await supabase
    .from("episodes")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", params.episodeId);

  // Update revision status
  if (params.revisionId) {
    await supabase
      .from("episode_revisions")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", params.revisionId);
  }

  // Record release event
  await recordReleaseEvent({
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    revisionId: params.revisionId,
    eventType: "approved",
    actorId: params.reviewerId,
    metadata: {
      feedback: params.feedback || "Approved for publication",
    },
  });

  return { success: true, status: "approved" as const };
}

/**
 * Reject an episode submission with required feedback.
 */
export async function rejectEpisode(params: {
  seriesId: string;
  episodeId: string;
  revisionId?: string | null;
  reviewerId: string;
  userRole: SeriesRole;
  feedback: string;
}) {
  if (!hasPublishingPermission("reject", params.userRole)) {
    throw new Error(`Forbidden: Your role (${params.userRole}) cannot reject episodes.`);
  }

  if (!params.feedback || params.feedback.trim().length < 2) {
    throw new Error("Review feedback explaining requested changes is required.");
  }

  const supabase = createClient();

  // Fetch episode
  const { data: episode } = await supabase
    .from("episodes")
    .select("id, title, status")
    .eq("id", params.episodeId)
    .single();

  if (!episode) {
    throw new Error("Episode not found.");
  }

  const currentStatus = (episode.status || "draft") as EpisodeProductionStatus;
  if (!canTransitionEpisodeStatus(currentStatus, "revisions_required")) {
    throw new Error(`Invalid transition: Cannot reject an episode currently in '${currentStatus}' status.`);
  }

  // Update episode status
  await supabase
    .from("episodes")
    .update({ status: "revisions_required", updated_at: new Date().toISOString() })
    .eq("id", params.episodeId);

  // Update revision status
  if (params.revisionId) {
    await supabase
      .from("episode_revisions")
      .update({ status: "revisions_required", updated_at: new Date().toISOString() })
      .eq("id", params.revisionId);
  }

  // Record release event
  await recordReleaseEvent({
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    revisionId: params.revisionId,
    eventType: "rejected",
    actorId: params.reviewerId,
    metadata: {
      feedback: params.feedback.trim(),
    },
  });

  return { success: true, status: "revisions_required" as const };
}

/**
 * Publish an approved episode immediately.
 */
export async function publishEpisodeImmediately(params: {
  seriesId: string;
  episodeId: string;
  revisionId: string;
  actorId: string;
  userRole: SeriesRole;
}) {
  if (!hasPublishingPermission("publish", params.userRole)) {
    throw new Error(`Forbidden: Your role (${params.userRole}) cannot publish episodes.`);
  }

  const supabase = createClient();

  // 1. Check episode status: MUST be approved or unpublished
  const { data: episode } = await supabase
    .from("episodes")
    .select("id, title, episode_number, slug, status, published_revision_id")
    .eq("id", params.episodeId)
    .single();

  if (!episode) {
    throw new Error("Episode not found.");
  }

  const currentStatus = (episode.status || "draft") as EpisodeProductionStatus;
  if (currentStatus !== "approved" && currentStatus !== "unpublished") {
    throw new Error(
      `Cannot publish: Episode is currently '${currentStatus}'. Only approved episodes can be published.`
    );
  }

  // 2. Verify revision has pages OR written story content
  const { count: pageCount } = await supabase
    .from("revision_pages")
    .select("*", { count: "exact", head: true })
    .eq("revision_id", params.revisionId);

  const { data: revDetails } = await supabase
    .from("episode_revisions")
    .select("text_content")
    .eq("id", params.revisionId)
    .maybeSingle();

  const hasPages = Boolean(pageCount && pageCount >= 1);
  const hasText = Boolean(revDetails?.text_content && revDetails.text_content.trim().length > 0);

  if (!hasPages && !hasText) {
    throw new Error("Cannot publish an episode without any comic pages or written story content.");
  }

  const isRepublish = currentStatus === "unpublished";

  // 3. Mark revision published
  await supabase
    .from("episode_revisions")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("id", params.revisionId);

  // 4. Update episode published_revision_id and status
  await supabase
    .from("episodes")
    .update({
      published_revision_id: params.revisionId,
      status: "published",
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.episodeId);

  // 5. Cancel any pending scheduled publication
  await supabase
    .from("scheduled_publications")
    .update({ status: "cancelled" })
    .eq("episode_id", params.episodeId)
    .eq("status", "scheduled");

  // 6. Record release event
  await recordReleaseEvent({
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    revisionId: params.revisionId,
    eventType: isRepublish ? "republished" : "published",
    actorId: params.actorId,
    metadata: {
      isAutomated: false,
      episodeNumber: episode.episode_number,
      episodeTitle: episode.title,
    },
  });

  // 7. Notify followers if not already notified
  try {
    await notifySeriesFollowersOfNewEpisode({
      seriesId: params.seriesId,
      episodeId: params.episodeId,
      episodeTitle: episode.title,
      episodeNumber: episode.episode_number,
    });
  } catch (notifyErr) {
    logger.error("Failed to notify followers on immediate publish", notifyErr);
  }

  return { success: true, status: "published" as const };
}

/**
 * Schedule an approved episode for future automated publication.
 */
export async function scheduleEpisodePublication(params: {
  seriesId: string;
  episodeId: string;
  revisionId: string;
  scheduledFor: string; // ISO string or local date-time
  actorId: string;
  userRole: SeriesRole;
  timeZone?: string;
}) {
  if (!hasPublishingPermission("schedule", params.userRole)) {
    throw new Error(`Forbidden: Your role (${params.userRole}) cannot schedule releases.`);
  }

  // 1. Validate schedule time
  const timeValidation = validateScheduledReleaseTime(params.scheduledFor);
  if (!timeValidation.valid || !timeValidation.utcIso) {
    throw new Error(timeValidation.error || "Invalid release time.");
  }

  const supabase = createClient();

  // 2. Verify episode status is approved
  const { data: episode } = await supabase
    .from("episodes")
    .select("id, title, episode_number, status")
    .eq("id", params.episodeId)
    .single();

  if (!episode) {
    throw new Error("Episode not found.");
  }

  const currentStatus = (episode.status || "draft") as EpisodeProductionStatus;
  if (currentStatus !== "approved") {
    throw new Error(
      `Cannot schedule: Episode is currently '${currentStatus}'. Episodes must be approved before scheduling.`
    );
  }

  // 3. Verify revision has pages
  const { count } = await supabase
    .from("revision_pages")
    .select("*", { count: "exact", head: true })
    .eq("revision_id", params.revisionId);

  if (!count || count < 1) {
    throw new Error("Cannot schedule an episode without any comic pages.");
  }

  // 4. Cancel any previous scheduled release
  await supabase
    .from("scheduled_publications")
    .update({ status: "cancelled" })
    .eq("episode_id", params.episodeId)
    .eq("status", "scheduled");

  // 5. Insert new scheduled publication row
  const { data: scheduledRow, error: schedError } = await supabase
    .from("scheduled_publications")
    .insert({
      series_id: params.seriesId,
      episode_id: params.episodeId,
      revision_id: params.revisionId,
      scheduled_for: timeValidation.utcIso,
      status: "scheduled",
      created_by: params.actorId,
    })
    .select("*")
    .single();

  if (schedError || !scheduledRow) {
    throw new Error(schedError?.message || "Failed to schedule release.");
  }

  // 6. Update episode status to 'scheduled'
  await supabase
    .from("episodes")
    .update({ status: "scheduled", updated_at: new Date().toISOString() })
    .eq("id", params.episodeId);

  // 7. Record release event
  const formattedDisplay = formatReleaseDisplayDate(timeValidation.utcIso, params.timeZone);
  await recordReleaseEvent({
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    revisionId: params.revisionId,
    eventType: "scheduled",
    actorId: params.actorId,
    scheduledFor: timeValidation.utcIso,
    metadata: {
      scheduledForFormatted: formattedDisplay,
      scheduledPublicationId: scheduledRow.id,
    },
  });

  return {
    success: true,
    scheduledPublication: scheduledRow,
    formattedDate: formattedDisplay,
  };
}

/**
 * Edit scheduled release date and time.
 */
export async function editScheduledPublication(params: {
  scheduledPublicationId: string;
  seriesId: string;
  episodeId: string;
  newScheduledFor: string;
  actorId: string;
  userRole: SeriesRole;
  timeZone?: string;
}) {
  if (!hasPublishingPermission("schedule", params.userRole)) {
    throw new Error(`Forbidden: Your role (${params.userRole}) cannot reschedule releases.`);
  }

  const timeValidation = validateScheduledReleaseTime(params.newScheduledFor);
  if (!timeValidation.valid || !timeValidation.utcIso) {
    throw new Error(timeValidation.error || "Invalid release time.");
  }

  const supabase = createClient();

  const { data: pub } = await supabase
    .from("scheduled_publications")
    .select("id, scheduled_for, status")
    .eq("id", params.scheduledPublicationId)
    .single();

  if (!pub || pub.status !== "scheduled") {
    throw new Error("Active scheduled publication not found.");
  }

  const prevDate = pub.scheduled_for;

  // Update scheduled publication
  await supabase
    .from("scheduled_publications")
    .update({ scheduled_for: timeValidation.utcIso })
    .eq("id", params.scheduledPublicationId);

  const formattedDisplay = formatReleaseDisplayDate(timeValidation.utcIso, params.timeZone);

  // Record release event
  await recordReleaseEvent({
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    eventType: "rescheduled",
    actorId: params.actorId,
    scheduledFor: timeValidation.utcIso,
    metadata: {
      previousDate: formatReleaseDisplayDate(prevDate, params.timeZone),
      scheduledForFormatted: formattedDisplay,
    },
  });

  return { success: true, newDate: formattedDisplay };
}

/**
 * Cancel a scheduled release, returning the episode to 'approved' state.
 */
export async function cancelScheduledPublication(params: {
  scheduledPublicationId: string;
  seriesId: string;
  episodeId: string;
  actorId: string;
  userRole: SeriesRole;
}) {
  if (!hasPublishingPermission("cancel_schedule", params.userRole)) {
    throw new Error(`Forbidden: Your role (${params.userRole}) cannot cancel scheduled releases.`);
  }

  const supabase = createClient();

  // 1. Mark schedule cancelled
  await supabase
    .from("scheduled_publications")
    .update({ status: "cancelled" })
    .eq("id", params.scheduledPublicationId);

  // 2. Revert episode status to 'approved'
  await supabase
    .from("episodes")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", params.episodeId);

  // 3. Record release event
  await recordReleaseEvent({
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    eventType: "schedule_cancelled",
    actorId: params.actorId,
    metadata: {
      scheduledPublicationId: params.scheduledPublicationId,
    },
  });

  return { success: true, status: "approved" as const };
}

/**
 * Unpublish an episode from public reader routes.
 */
export async function unpublishEpisode(params: {
  seriesId: string;
  episodeId: string;
  actorId: string;
  userRole: SeriesRole;
  reason?: string;
}) {
  if (!hasPublishingPermission("unpublish", params.userRole)) {
    throw new Error(`Forbidden: Your role (${params.userRole}) cannot unpublish episodes.`);
  }

  const supabase = createClient();

  const { data: ep } = await supabase
    .from("episodes")
    .select("id, published_revision_id, title")
    .eq("id", params.episodeId)
    .single();

  if (!ep || !ep.published_revision_id) {
    throw new Error("Episode is not currently published.");
  }

  const publishedRevId = ep.published_revision_id;

  // 1. Mark revision unpublished
  await supabase
    .from("episode_revisions")
    .update({ status: "unpublished", updated_at: new Date().toISOString() })
    .eq("id", publishedRevId);

  // 2. Clear episode published revision and set status to unpublished
  await supabase
    .from("episodes")
    .update({
      published_revision_id: null,
      status: "unpublished",
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.episodeId);

  // 3. Record release event
  await recordReleaseEvent({
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    revisionId: publishedRevId,
    eventType: "unpublished",
    actorId: params.actorId,
    metadata: {
      reason: params.reason || "Unpublished by creator/editor",
    },
  });

  return { success: true, status: "unpublished" as const };
}

/**
 * Republish an eligible unpublished episode.
 */
export async function republishEpisode(params: {
  seriesId: string;
  episodeId: string;
  revisionId: string;
  actorId: string;
  userRole: SeriesRole;
}) {
  if (!hasPublishingPermission("republish", params.userRole)) {
    throw new Error(`Forbidden: Your role (${params.userRole}) cannot republish episodes.`);
  }

  return publishEpisodeImmediately({
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    revisionId: params.revisionId,
    actorId: params.actorId,
    userRole: params.userRole,
  });
}

/**
 * Fetch calendar items (scheduled releases & recent publications) for Creator Studio.
 */
export async function getStudioPublishingCalendar(seriesIds: string[]): Promise<{
  scheduled: ScheduledReleaseItem[];
  published: {
    id: string;
    seriesId: string;
    seriesTitle: string;
    seriesSlug: string;
    title: string;
    episodeNumber: number;
    slug: string;
    publishedAt: string;
  }[];
}> {
  if (!seriesIds || seriesIds.length === 0) {
    return { scheduled: [], published: [] };
  }

  const supabase = createClient();

  // 1. Fetch scheduled releases
  const { data: schedData } = await supabase
    .from("scheduled_publications")
    .select(`
      id,
      series_id,
      episode_id,
      revision_id,
      scheduled_for,
      status,
      created_by,
      series:series_id (title, slug),
      episodes:episode_id (title, episode_number, slug),
      profiles:created_by (display_name, username)
    `)
    .in("series_id", seriesIds)
    .eq("status", "scheduled")
    .order("scheduled_for", { ascending: true });

  const scheduled: ScheduledReleaseItem[] = (schedData || []).map((row: any) => ({
    id: row.id,
    seriesId: row.series_id,
    seriesTitle: row.series?.title || "Series",
    seriesSlug: row.series?.slug || "",
    episodeId: row.episode_id,
    episodeTitle: row.episodes?.title || "Episode",
    episodeNumber: row.episodes?.episode_number || 1,
    episodeSlug: row.episodes?.slug || "",
    revisionId: row.revision_id,
    scheduledFor: row.scheduled_for,
    status: row.status,
    createdBy: row.created_by,
    creatorName: row.profiles?.display_name || row.profiles?.username || "Creator",
  }));

  // 2. Fetch recently published episodes
  const { data: pubData } = await supabase
    .from("episodes")
    .select(`
      id,
      series_id,
      title,
      episode_number,
      slug,
      updated_at,
      series:series_id (title, slug)
    `)
    .in("series_id", seriesIds)
    .not("published_revision_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(20);

  const published = (pubData || []).map((row: any) => ({
    id: row.id,
    seriesId: row.series_id,
    seriesTitle: row.series?.title || "Series",
    seriesSlug: row.series?.slug || "",
    title: row.title,
    episodeNumber: row.episode_number,
    slug: row.slug,
    publishedAt: row.updated_at,
  }));

  return { scheduled, published };
}

/**
 * Server-side Scheduled-Release Processor.
 * Finds due scheduled publications, verifies eligibility, publishes due episodes,
 * records durable release events, triggers reader notifications, and prevents duplicates.
 */
export async function processScheduledReleases(): Promise<{
  processedCount: number;
  processedIds: string[];
  errors: { id: string; error: string }[];
}> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // 1. Fetch due scheduled publications
  const { data: duePublications, error: fetchError } = await supabase
    .from("scheduled_publications")
    .select(`
      id,
      series_id,
      episode_id,
      revision_id,
      episodes:episode_id (id, title, episode_number, status, series_id)
    `)
    .eq("status", "scheduled")
    .lte("scheduled_for", now)
    .limit(25);

  if (fetchError || !duePublications) {
    logger.error("Failed to query due scheduled publications", fetchError);
    throw new Error("Failed to query due scheduled publications.");
  }

  const processedIds: string[] = [];
  const errors: { id: string; error: string }[] = [];

  for (const pub of duePublications) {
    try {
      // 2. Concurrency guard: mark processing
      const { error: lockError } = await supabase
        .from("scheduled_publications")
        .update({ status: "processing" })
        .eq("id", pub.id)
        .eq("status", "scheduled");

      if (lockError) {
        continue; // Handled by another concurrent worker
      }

      const ep = pub.episodes as any;
      if (!ep) {
        throw new Error("Episode associated with scheduled release does not exist.");
      }

      // 3. Verify episode approval has not been revoked
      if (ep.status !== "scheduled" && ep.status !== "approved") {
        throw new Error(
          `Publication revoked or ineligible: episode status is currently '${ep.status}'.`
        );
      }

      // 4. Verify revision has pages OR written story content
      const { count: pageCount } = await supabase
        .from("revision_pages")
        .select("*", { count: "exact", head: true })
        .eq("revision_id", pub.revision_id);

      const { data: revDetails } = await supabase
        .from("episode_revisions")
        .select("text_content")
        .eq("id", pub.revision_id)
        .maybeSingle();

      const hasPages = Boolean(pageCount && pageCount >= 1);
      const hasText = Boolean(revDetails?.text_content && revDetails.text_content.trim().length > 0);

      if (!hasPages && !hasText) {
        throw new Error("Revision has no comic pages or written story content uploaded.");
      }

      const executedTime = new Date().toISOString();

      // 5. Update revision status to published
      await supabase
        .from("episode_revisions")
        .update({ status: "published", updated_at: executedTime })
        .eq("id", pub.revision_id);

      // 6. Update episode published_revision_id and status to published
      await supabase
        .from("episodes")
        .update({
          published_revision_id: pub.revision_id,
          status: "published",
          updated_at: executedTime,
        })
        .eq("id", pub.episode_id);

      // 7. Mark scheduled publication completed
      await supabase
        .from("scheduled_publications")
        .update({
          status: "completed",
          executed_at: executedTime,
        })
        .eq("id", pub.id);

      // 8. Record release event
      await supabase.from("release_events").insert({
        series_id: ep.series_id,
        episode_id: ep.id,
        revision_id: pub.revision_id,
        event_type: "published",
        scheduled_for: null,
        metadata: {
          isAutomated: true,
          scheduledPublicationId: pub.id,
          episodeTitle: ep.title,
          episodeNumber: ep.episode_number,
        },
      });

      // 9. Dispatch reader notifications to series followers
      try {
        await notifySeriesFollowersOfNewEpisode({
          seriesId: ep.series_id,
          episodeId: ep.id,
          episodeTitle: ep.title,
          episodeNumber: ep.episode_number,
        });
      } catch (notifyError) {
        logger.error("Failed to notify followers during scheduled release", notifyError);
      }

      processedIds.push(pub.id);
    } catch (err: any) {
      logger.error(`Error processing scheduled publication ${pub.id}`, err);
      errors.push({ id: pub.id, error: err?.message || "Execution error" });

      await supabase
        .from("scheduled_publications")
        .update({
          status: "failed",
          error_message: err?.message || "Execution failed",
        })
        .eq("id", pub.id);
    }
  }

  return {
    processedCount: processedIds.length,
    processedIds,
    errors,
  };
}

/**
 * Opportunistically processes due scheduled releases without throwing to caller.
 * Used by server page routes to lazily ensure scheduled releases are published when due.
 */
export async function processDueReleasesOpportunistically(): Promise<number> {
  try {
    const result = await processScheduledReleases();
    return result.processedCount;
  } catch (err) {
    logger.error("Opportunistic release processing skipped/failed:", err);
    return 0;
  }
}

