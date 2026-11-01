"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireSeriesRole, ForbiddenError } from "@/lib/auth/guards";
import { logger } from "@/lib/logger";
import {
  submitEpisodeForApproval,
  approveEpisode,
  rejectEpisode,
  publishEpisodeImmediately,
  scheduleEpisodePublication,
  editScheduledPublication,
  cancelScheduledPublication,
  unpublishEpisode,
  republishEpisode,
  getEpisodeReleaseEvents,
} from "@/lib/data/publishing";
import type { RevisionStatus } from "@/types/database";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ALLOWED_TRANSITIONS: Record<RevisionStatus, RevisionStatus[]> = {
  draft: ["in_production", "in_review"],
  in_production: ["in_review", "draft"],
  in_review: ["approved", "revisions_required", "ready_to_publish", "draft"],
  revisions_required: ["in_production", "draft", "in_review"],
  approved: ["published", "in_production", "draft"],
  ready_to_publish: ["published", "in_review", "draft"],
  published: ["unpublished"],
  unpublished: ["draft", "in_production", "in_review"],
  archived: ["draft"],
};

/**
 * Server Action: Create a new episode within an authorized series.
 */
export async function createEpisodeAction(seriesId: string, formData: FormData) {
  const user = await requireAuth();
  await requireSeriesRole(seriesId, "editor");
  const supabase = createClient();

  const episodeNumberStr = formData.get("episodeNumber")?.toString().trim();
  const title = formData.get("title")?.toString().trim();

  const episodeNumber = parseInt(episodeNumberStr || "1", 10);
  if (isNaN(episodeNumber) || episodeNumber < 1) {
    throw new Error("Episode number must be a positive integer.");
  }

  if (!title || title.length < 1 || title.length > 100) {
    throw new Error("Episode title is required and must be between 1 and 100 characters.");
  }

  // Generate unique slug scoped to this series
  const baseSlug = slugify(title) || `chapter-${episodeNumber}`;
  let slug = baseSlug;

  // Check unique constraints: (series_id, episode_number) and (series_id, slug)
  const { data: existingEp } = await supabase
    .from("episodes")
    .select("id, episode_number, slug")
    .eq("series_id", seriesId)
    .or(`episode_number.eq.${episodeNumber},slug.eq.${slug}`);

  if (existingEp && existingEp.length > 0) {
    const numConflict = existingEp.find((e) => e.episode_number === episodeNumber);
    if (numConflict) {
      throw new Error(`Episode #${episodeNumber} already exists in this series. Please choose another number.`);
    }
    const slugConflict = existingEp.find((e) => e.slug === slug);
    if (slugConflict) {
      slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }
  }

  // Insert episode
  const { data: episode, error: epError } = await supabase
    .from("episodes")
    .insert({
      series_id: seriesId,
      episode_number: episodeNumber,
      title,
      slug,
    })
    .select("id")
    .single();

  if (epError || !episode) {
    logger.error("Failed to create episode", epError);
    throw new Error(epError?.message || "Failed to create episode.");
  }

  // Automatically create Revision 1 (Draft)
  const { error: revError } = await supabase.from("episode_revisions").insert({
    episode_id: episode.id,
    revision_number: 1,
    status: "draft",
    created_by: user.id,
    notes: "Initial draft revision",
  });

  if (revError) {
    logger.error("Failed to initialize draft revision", revError);
    // Don't fail the entire episode creation if revision insert fails, but log it
  }

  logger.info("Created new episode", { seriesId, episodeId: episode.id, episodeNumber });

  revalidatePath(`/studio/series/${seriesId}`);
  redirect(`/studio/series/${seriesId}/episodes/${episode.id}`);
}

/**
 * Server Action: Update episode metadata (title, episode number, slug).
 */
export async function updateEpisodeMetadataAction(
  seriesId: string,
  episodeId: string,
  formData: FormData
) {
  await requireSeriesRole(seriesId, "editor");
  const supabase = createClient();

  const episodeNumberStr = formData.get("episodeNumber")?.toString().trim();
  const title = formData.get("title")?.toString().trim();

  const episodeNumber = parseInt(episodeNumberStr || "1", 10);
  if (isNaN(episodeNumber) || episodeNumber < 1) {
    throw new Error("Episode number must be a positive integer.");
  }

  if (!title || title.length < 1 || title.length > 100) {
    throw new Error("Episode title is required and must be between 1 and 100 characters.");
  }

  const slug = slugify(title) || `chapter-${episodeNumber}`;

  // Check unique constraints against other episodes in the series
  const { data: existing } = await supabase
    .from("episodes")
    .select("id, episode_number, slug")
    .eq("series_id", seriesId)
    .neq("id", episodeId)
    .or(`episode_number.eq.${episodeNumber},slug.eq.${slug}`);

  if (existing && existing.length > 0) {
    const numConflict = existing.find((e) => e.episode_number === episodeNumber);
    if (numConflict) {
      throw new Error(`Episode #${episodeNumber} is already used by another chapter in this series.`);
    }
  }

  const { error } = await supabase
    .from("episodes")
    .update({
      title,
      episode_number: episodeNumber,
      slug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", episodeId)
    .eq("series_id", seriesId);

  if (error) {
    logger.error("Failed to update episode metadata", error);
    throw new Error(error.message || "Failed to update episode metadata.");
  }

  logger.info("Updated episode metadata", { seriesId, episodeId, episodeNumber });

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);

  return { success: true };
}

/**
 * Server Action: Persist ordered content pages for an episode revision.
 */
export async function saveRevisionPagesAction(
  seriesId: string,
  episodeId: string,
  revisionId: string,
  pages: { mediaAssetId: string; pageNumber: number }[]
) {
  await requireSeriesRole(seriesId, "editor");
  const supabase = createClient();

  // Verify episode belongs to series
  const { data: episode } = await supabase
    .from("episodes")
    .select("id")
    .eq("id", episodeId)
    .eq("series_id", seriesId)
    .single();

  if (!episode) {
    throw new Error("Episode does not belong to this series.");
  }

  // Delete existing pages for this revision
  const { error: deleteError } = await supabase
    .from("revision_pages")
    .delete()
    .eq("revision_id", revisionId);

  if (deleteError) {
    logger.error("Failed to clear previous revision pages", deleteError);
    throw new Error("Failed to clear existing revision pages.");
  }

  // Insert newly ordered pages
  if (pages.length > 0) {
    const pagesToInsert = pages.map((p, idx) => ({
      revision_id: revisionId,
      media_asset_id: p.mediaAssetId,
      page_number: idx + 1,
    }));

    const { error: insertError } = await supabase
      .from("revision_pages")
      .insert(pagesToInsert);

    if (insertError) {
      logger.error("Failed to insert reordered revision pages", insertError);
      throw new Error("Failed to save reordered revision pages.");
    }
  }

  // Update revision updated_at
  await supabase
    .from("episode_revisions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", revisionId);

  logger.info("Saved revision pages", { seriesId, episodeId, revisionId, pageCount: pages.length });

  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);
  return { success: true, count: pages.length };
}

/**
 * Server Action: Transition revision lifecycle state according to canonical rules.
 */
export async function transitionRevisionStatusAction(
  seriesId: string,
  episodeId: string,
  revisionId: string,
  targetStatus: RevisionStatus
) {
  // Check required permission
  if (targetStatus === "in_review") {
    await requireSeriesRole(seriesId, "contributor");
  } else {
    await requireSeriesRole(seriesId, "editor");
  }

  const supabase = createClient();

  // Load current revision status
  const { data: rev, error: revError } = await supabase
    .from("episode_revisions")
    .select("id, status, episode_id")
    .eq("id", revisionId)
    .eq("episode_id", episodeId)
    .single();

  if (revError || !rev) {
    throw new Error("Episode revision not found.");
  }

  const currentStatus = rev.status as RevisionStatus;
  const allowed = ALLOWED_TRANSITIONS[currentStatus];

  if (!allowed || !allowed.includes(targetStatus)) {
    throw new Error(
      `Invalid lifecycle transition from '${currentStatus}' to '${targetStatus}'.`
    );
  }

  // If transitioning to ready_to_publish, require at least 1 page
  if (targetStatus === "ready_to_publish") {
    const { count } = await supabase
      .from("revision_pages")
      .select("*", { count: "exact", head: true })
      .eq("revision_id", revisionId);

    if (!count || count < 1) {
      throw new Error("Cannot mark ready to publish: revision must have at least one uploaded page.");
    }
  }

  const { error: updateError } = await supabase
    .from("episode_revisions")
    .update({
      status: targetStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", revisionId);

  if (updateError) {
    logger.error("Failed to transition revision status", updateError);
    throw new Error(updateError.message || "Failed to transition revision status.");
  }

  logger.info("Transitioned revision status", { revisionId, from: currentStatus, to: targetStatus });

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);

  return { success: true, status: targetStatus };
}

/**
 * Server Action: Submit an episode for editorial approval.
 */
export async function submitForApprovalAction(
  seriesId: string,
  episodeId: string,
  revisionId: string,
  notes?: string
) {
  const user = await requireAuth();
  const { effectiveRole } = await requireSeriesRole(seriesId, "contributor");

  const result = await submitEpisodeForApproval({
    seriesId,
    episodeId,
    revisionId,
    actorId: user.id,
    userRole: effectiveRole,
    notes,
  });

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);
  return result;
}

/**
 * Server Action: Approve an episode for publication.
 */
export async function approveEpisodeAction(
  seriesId: string,
  episodeId: string,
  revisionId?: string | null,
  feedback?: string
) {
  const user = await requireAuth();
  const { effectiveRole } = await requireSeriesRole(seriesId, "editor");

  const result = await approveEpisode({
    seriesId,
    episodeId,
    revisionId,
    reviewerId: user.id,
    userRole: effectiveRole,
    feedback,
  });

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);
  return result;
}

/**
 * Server Action: Reject an episode submission with required feedback.
 */
export async function rejectEpisodeAction(
  seriesId: string,
  episodeId: string,
  revisionId: string | null,
  feedback: string
) {
  const user = await requireAuth();
  const { effectiveRole } = await requireSeriesRole(seriesId, "editor");

  const result = await rejectEpisode({
    seriesId,
    episodeId,
    revisionId,
    reviewerId: user.id,
    userRole: effectiveRole,
    feedback,
  });

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);
  return result;
}

/**
 * Server Action: Publish an approved episode immediately.
 */
export async function publishRevisionAction(
  seriesId: string,
  episodeId: string,
  revisionId: string
) {
  const user = await requireAuth();
  const { effectiveRole } = await requireSeriesRole(seriesId, "editor");

  const result = await publishEpisodeImmediately({
    seriesId,
    episodeId,
    revisionId,
    actorId: user.id,
    userRole: effectiveRole,
  });

  const supabase = createClient();
  const { data: series } = await supabase
    .from("series")
    .select("slug")
    .eq("id", seriesId)
    .single();

  const { data: episode } = await supabase
    .from("episodes")
    .select("slug")
    .eq("id", episodeId)
    .single();

  if (series) {
    revalidatePath(`/series/${series.slug}`);
    if (episode) {
      revalidatePath(`/series/${series.slug}/episodes/${episode.slug}`);
    }
  }

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);

  return { success: true, published: true };
}

/**
 * Server Action: Schedule an approved episode for automated publication.
 */
export async function scheduleEpisodeAction(
  seriesId: string,
  episodeId: string,
  revisionId: string,
  scheduledFor: string,
  timeZone?: string
) {
  const user = await requireAuth();
  const { effectiveRole } = await requireSeriesRole(seriesId, "editor");

  const result = await scheduleEpisodePublication({
    seriesId,
    episodeId,
    revisionId,
    scheduledFor,
    actorId: user.id,
    userRole: effectiveRole,
    timeZone,
  });

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);
  return result;
}

/**
 * Server Action: Edit a scheduled release date.
 */
export async function editScheduledReleaseAction(
  scheduledPublicationId: string,
  seriesId: string,
  episodeId: string,
  newScheduledFor: string,
  timeZone?: string
) {
  const user = await requireAuth();
  const { effectiveRole } = await requireSeriesRole(seriesId, "editor");

  const result = await editScheduledPublication({
    scheduledPublicationId,
    seriesId,
    episodeId,
    newScheduledFor,
    actorId: user.id,
    userRole: effectiveRole,
    timeZone,
  });

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);
  return result;
}

/**
 * Server Action: Cancel a scheduled release.
 */
export async function cancelScheduledReleaseAction(
  scheduledPublicationId: string,
  seriesId: string,
  episodeId: string
) {
  const user = await requireAuth();
  const { effectiveRole } = await requireSeriesRole(seriesId, "editor");

  const result = await cancelScheduledPublication({
    scheduledPublicationId,
    seriesId,
    episodeId,
    actorId: user.id,
    userRole: effectiveRole,
  });

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);
  return result;
}

/**
 * Server Action: Unpublish an episode from the public reader.
 */
export async function unpublishEpisodeAction(
  seriesId: string,
  episodeId: string,
  reason?: string
) {
  const user = await requireAuth();
  const { effectiveRole } = await requireSeriesRole(seriesId, "editor");

  const result = await unpublishEpisode({
    seriesId,
    episodeId,
    actorId: user.id,
    userRole: effectiveRole,
    reason,
  });

  const supabase = createClient();
  const { data: series } = await supabase
    .from("series")
    .select("slug")
    .eq("id", seriesId)
    .single();

  const { data: episode } = await supabase
    .from("episodes")
    .select("slug")
    .eq("id", episodeId)
    .single();

  if (series) {
    revalidatePath(`/series/${series.slug}`);
    if (episode) {
      revalidatePath(`/series/${series.slug}/episodes/${episode.slug}`);
    }
  }

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);

  return { success: true, published: false };
}

/**
 * Server Action: Republish an eligible unpublished episode.
 */
export async function republishEpisodeAction(
  seriesId: string,
  episodeId: string,
  revisionId: string
) {
  const user = await requireAuth();
  const { effectiveRole } = await requireSeriesRole(seriesId, "editor");

  const result = await republishEpisode({
    seriesId,
    episodeId,
    revisionId,
    actorId: user.id,
    userRole: effectiveRole,
  });

  const supabase = createClient();
  const { data: series } = await supabase
    .from("series")
    .select("slug")
    .eq("id", seriesId)
    .single();

  const { data: episode } = await supabase
    .from("episodes")
    .select("slug")
    .eq("id", episodeId)
    .single();

  if (series) {
    revalidatePath(`/series/${series.slug}`);
    if (episode) {
      revalidatePath(`/series/${series.slug}/episodes/${episode.slug}`);
    }
  }

  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);

  return { success: true, published: true };
}

/**
 * Server Action: Fetch release history for an episode.
 */
export async function getEpisodeReleaseHistoryAction(episodeId: string) {
  await requireAuth();
  return getEpisodeReleaseEvents(episodeId);
}

/**
 * Server Action: Delete an episode.
 */
export async function deleteEpisodeAction(seriesId: string, episodeId: string) {
  await requireSeriesRole(seriesId, "editor");
  const supabase = createClient();

  // If currently live, require unpublishing first
  const { data: ep } = await supabase
    .from("episodes")
    .select("published_revision_id")
    .eq("id", episodeId)
    .single();

  if (ep?.published_revision_id) {
    throw new Error("Cannot delete a live published episode. Please unpublish it first.");
  }

  const { error } = await supabase
    .from("episodes")
    .delete()
    .eq("id", episodeId)
    .eq("series_id", seriesId);

  if (error) {
    logger.error("Failed to delete episode", error);
    throw new Error(error.message || "Failed to delete episode.");
  }

  logger.info("Deleted episode", { seriesId, episodeId });

  revalidatePath(`/studio/series/${seriesId}`);
  redirect(`/studio/series/${seriesId}`);
}

/**
 * Server Action: Post a collaboration review comment.
 */
export async function postReviewCommentAction(
  seriesId: string,
  revisionId: string,
  content: string
) {
  const user = await requireAuth();
  await requireSeriesRole(seriesId, "contributor");
  const supabase = createClient();

  const trimmed = content?.trim();
  if (!trimmed || trimmed.length < 1 || trimmed.length > 2000) {
    throw new Error("Comment must be between 1 and 2000 characters.");
  }

  const { data: comment, error } = await supabase
    .from("review_comments")
    .insert({
      revision_id: revisionId,
      user_id: user.id,
      content: trimmed,
      status: "open",
    })
    .select(`
      id,
      content,
      status,
      created_at,
      profiles:user_id (display_name)
    `)
    .single();

  if (error || !comment) {
    logger.error("Failed to post review comment", error);
    throw new Error("Failed to post review comment.");
  }

  return {
    success: true,
    comment: {
      id: comment.id,
      content: comment.content,
      status: comment.status,
      createdAt: new Date(comment.created_at).toLocaleTimeString(),
      userName: (comment as any).profiles?.display_name || "Creator",
    },
  };
}
