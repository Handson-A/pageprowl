"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, requireSeriesRole, requireStudioRole } from "@/lib/auth/guards";
import {
  createReviewRequest,
  submitReviewOutcome,
  type ReviewOutcome,
} from "@/lib/data/workflows";
import { postComment, deleteComment } from "@/lib/data/comments";

/**
 * Server Action: Submit an episode for editorial review.
 */
export async function createReviewRequestAction(formData: FormData) {
  const user = await requireAuth();

  const studioId = formData.get("studioId")?.toString().trim();
  const seriesId = formData.get("seriesId")?.toString().trim();
  const episodeId = formData.get("episodeId")?.toString().trim();
  const reviewerId = formData.get("reviewerId")?.toString().trim() || null;
  const feedback = formData.get("feedback")?.toString().trim() || null;

  if (!studioId || !seriesId || !episodeId) {
    throw new Error("Studio, series, and episode IDs are required to request a review.");
  }

  await requireSeriesRole(seriesId, "contributor");

  const request = await createReviewRequest({
    studioId,
    seriesId,
    episodeId,
    requesterId: user.id,
    reviewerId,
    feedback,
  });

  revalidatePath("/studio");
  revalidatePath("/studio/reviews");
  revalidatePath(`/studio/series/${seriesId}/episodes/${episodeId}`);
  revalidatePath(`/studio/studios/${studioId}`);

  return { success: true, request };
}

/**
 * Server Action: Record review outcome (Approve or Request Revisions).
 */
export async function submitReviewOutcomeAction(
  reviewRequestId: string,
  outcome: "approved" | "revisions_requested",
  feedback: string
) {
  const user = await requireAuth();

  const updatedRequest = await submitReviewOutcome({
    reviewRequestId,
    reviewerId: user.id,
    outcome,
    feedback,
  });

  revalidatePath("/studio");
  revalidatePath("/studio/reviews");
  if (updatedRequest.series_id && updatedRequest.episode_id) {
    revalidatePath(`/studio/series/${updatedRequest.series_id}/episodes/${updatedRequest.episode_id}`);
  }
  if (updatedRequest.studio_id) {
    revalidatePath(`/studio/studios/${updatedRequest.studio_id}`);
  }

  return { success: true, request: updatedRequest };
}

/**
 * Server Action: Post a polymorphic comment on a task, episode, or review request.
 */
export async function postResourceCommentAction(formData: FormData) {
  const user = await requireAuth();

  const content = formData.get("content")?.toString().trim();
  const studioId = formData.get("studioId")?.toString().trim() || null;
  const taskId = formData.get("taskId")?.toString().trim() || null;
  const episodeId = formData.get("episodeId")?.toString().trim() || null;
  const reviewRequestId = formData.get("reviewRequestId")?.toString().trim() || null;
  const parentCommentId = formData.get("parentCommentId")?.toString().trim() || null;

  if (!content) {
    throw new Error("Comment content cannot be empty.");
  }

  const comment = await postComment({
    studioId,
    userId: user.id,
    content,
    taskId,
    episodeId,
    reviewRequestId,
    parentCommentId,
  });

  if (taskId) revalidatePath(`/studio/tasks`);
  if (episodeId) revalidatePath(`/studio/reviews`);

  return { success: true, comment };
}

/**
 * Server Action: Delete a comment.
 */
export async function deleteResourceCommentAction(commentId: string) {
  const user = await requireAuth();
  await deleteComment(commentId, user.id);
  return { success: true };
}
