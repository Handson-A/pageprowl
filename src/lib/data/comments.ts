import { createClient } from "../supabase/server";
import { logActivity } from "./activity";
import { createNotification } from "./notifications";
import type { Database, ReviewCommentStatus } from "../../types/database";

export type ReviewCommentRow = Database["public"]["Tables"]["review_comments"]["Row"];

export interface CommentWithAuthor extends ReviewCommentRow {
  author?: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  } | null;
  mentions?: {
    user_id: string;
    username: string;
    display_name: string;
  }[];
  replies?: CommentWithAuthor[];
}

/**
 * Pure helper to extract valid @mentions from text.
 * Matches patterns like @alex or @creator_99.
 */
export function extractMentionUsernames(text: string): string[] {
  if (!text) return [];
  const regex = /@([a-zA-Z0-9_-]+)/g;
  const matches = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      matches.add(match[1].toLowerCase());
    }
  }

  return Array.from(matches);
}

/**
 * Resolve mentioned usernames against actual workspace members.
 * Prevents unauthorized users from being notified or referenced.
 */
export async function resolveWorkspaceMentions(
  studioId: string,
  usernames: string[]
): Promise<{ id: string; username: string; display_name: string }[]> {
  if (usernames.length === 0) return [];
  const supabase = createClient();

  // Query profiles for the usernames
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .in("username", usernames);

  if (!profiles || profiles.length === 0) return [];

  // Verify that these profiles are actually members of the studio
  const userIds = profiles.map((p) => p.id);
  const { data: studioMembers } = await supabase
    .from("studio_members")
    .select("user_id")
    .eq("studio_id", studioId)
    .in("user_id", userIds);

  const validMemberIds = new Set((studioMembers || []).map((m) => m.user_id));

  // Also check studio owner
  const { data: studio } = await supabase
    .from("studios")
    .select("created_by")
    .eq("id", studioId)
    .single();

  if (studio?.created_by) {
    validMemberIds.add(studio.created_by);
  }

  return profiles.filter((p) => validMemberIds.has(p.id));
}

/**
 * Fetch comments for any supported resource, organized into parent threads with replies.
 */
export async function getResourceComments(params: {
  taskId?: string;
  episodeId?: string;
  reviewRequestId?: string;
  revisionId?: string;
}): Promise<CommentWithAuthor[]> {
  const supabase = createClient();

  let query = supabase
    .from("review_comments")
    .select(`
      *,
      author:user_id (id, display_name, username, avatar_url),
      comment_mentions (
        user_id,
        profiles:user_id (id, username, display_name)
      )
    `)
    .order("created_at", { ascending: true });

  if (params.taskId) {
    query = query.eq("task_id", params.taskId);
  } else if (params.episodeId) {
    query = query.eq("episode_id", params.episodeId);
  } else if (params.reviewRequestId) {
    query = query.eq("review_request_id", params.reviewRequestId);
  } else if (params.revisionId) {
    query = query.eq("revision_id", params.revisionId);
  } else {
    return [];
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  const allComments: CommentWithAuthor[] = (data as any[]).map((row) => ({
    ...row,
    author: row.author || null,
    mentions: (row.comment_mentions || []).map((m: any) => ({
      user_id: m.user_id,
      username: m.profiles?.username || "user",
      display_name: m.profiles?.display_name || "Team Member",
    })),
    replies: [],
  }));

  // Group threaded replies under their parent comments
  const parents: CommentWithAuthor[] = [];
  const commentMap = new Map<string, CommentWithAuthor>();

  allComments.forEach((c) => {
    commentMap.set(c.id, c);
  });

  allComments.forEach((c) => {
    if (c.parent_comment_id && commentMap.has(c.parent_comment_id)) {
      commentMap.get(c.parent_comment_id)!.replies!.push(c);
    } else {
      parents.push(c);
    }
  });

  return parents;
}

/**
 * Post a comment on a supported resource with mention resolution and notification dispatch.
 */
export async function postComment(params: {
  studioId?: string | null;
  userId: string;
  content: string;
  taskId?: string | null;
  episodeId?: string | null;
  reviewRequestId?: string | null;
  revisionId?: string | null;
  parentCommentId?: string | null;
}): Promise<CommentWithAuthor> {
  const supabase = createClient();

  const trimmed = params.content?.trim();
  if (!trimmed || trimmed.length < 1 || trimmed.length > 5000) {
    throw new Error("Comment must be between 1 and 5000 characters.");
  }

  // Insert comment
  const { data: comment, error: insertError } = await supabase
    .from("review_comments")
    .insert({
      studio_id: params.studioId || null,
      user_id: params.userId,
      content: trimmed,
      task_id: params.taskId || null,
      episode_id: params.episodeId || null,
      review_request_id: params.reviewRequestId || null,
      revision_id: params.revisionId || null,
      parent_comment_id: params.parentCommentId || null,
      status: "open",
    })
    .select(`
      *,
      author:user_id (id, display_name, username, avatar_url)
    `)
    .single();

  if (insertError || !comment) {
    throw new Error(insertError?.message || "Failed to post comment.");
  }

  // Parse and resolve mentions if studioId is known
  let mentionedProfiles: { id: string; username: string; display_name: string }[] = [];
  if (params.studioId) {
    const rawMentions = extractMentionUsernames(trimmed);
    if (rawMentions.length > 0) {
      mentionedProfiles = await resolveWorkspaceMentions(params.studioId, rawMentions);

      if (mentionedProfiles.length > 0) {
        const mentionInserts = mentionedProfiles.map((m) => ({
          comment_id: comment.id,
          user_id: m.id,
        }));

        await supabase.from("comment_mentions").insert(mentionInserts);

        // Notify mentioned users (excluding the comment author)
        const authorName = (comment as any).author?.display_name || "A collaborator";
        for (const m of mentionedProfiles) {
          if (m.id !== params.userId) {
            let link = "/studio";
            if (params.taskId) link = `/studio/tasks?taskId=${params.taskId}`;
            else if (params.episodeId) link = `/studio/reviews`;

            await createNotification({
              studioId: params.studioId,
              userId: m.id,
              title: `${authorName} mentioned you`,
              message: `"${trimmed.substring(0, 100)}"`,
              type: "mention",
              link,
            });
          }
        }
      }
    }
  }

  // Log activity
  const entityType = params.taskId
    ? "task"
    : params.episodeId
    ? "episode"
    : params.reviewRequestId
    ? "review_request"
    : "revision";

  const entityId =
    params.taskId ||
    params.episodeId ||
    params.reviewRequestId ||
    params.revisionId ||
    comment.id;

  await logActivity({
    studioId: params.studioId,
    actorId: params.userId,
    action: "comment_added",
    entityType,
    entityId,
    metadata: {
      commentId: comment.id,
      preview: trimmed.substring(0, 60),
    },
  });

  return {
    ...(comment as any),
    author: (comment as any).author || null,
    mentions: mentionedProfiles,
    replies: [],
  };
}

/**
 * Delete a comment.
 */
export async function deleteComment(
  commentId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("review_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);

  return !error;
}
