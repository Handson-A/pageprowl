import { createClient } from "../supabase/server";
import { logger } from "../logger";
import type { Database, Json } from "../../types/database";

export type AuditLogRow = Database["public"]["Tables"]["audit_logs"]["Row"];

export interface ActivityEventWithActor extends AuditLogRow {
  actor?: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  } | null;
}

/**
 * Log a structured production activity event.
 * Uses the existing audit_logs infrastructure scoped by studio_id.
 */
export async function logActivity(params: {
  studioId?: string | null;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("audit_logs").insert({
      studio_id: params.studioId || null,
      actor_id: params.actorId,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      metadata: (params.metadata || {}) as Json,
    });

    if (error) {
      logger.error("Failed to record audit activity log", error);
    }
  } catch (err) {
    logger.error("Exception recording audit activity log", err);
  }
}

/**
 * Fetch recent activity feed for a studio workspace.
 */
export async function getStudioActivity(
  studioId: string,
  limit: number = 20
): Promise<ActivityEventWithActor[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .select(`
      *,
      actor:actor_id (id, display_name, username, avatar_url)
    `)
    .eq("studio_id", studioId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    ...row,
    actor: row.actor || null,
  }));
}

/**
 * Fetch recent activity feed relevant to the current user.
 */
export async function getUserRecentActivity(
  userId: string,
  limit: number = 20
): Promise<ActivityEventWithActor[]> {
  const supabase = createClient();

  // Find user's studio memberships
  const { data: memberships } = await supabase
    .from("studio_members")
    .select("studio_id")
    .eq("user_id", userId);

  const studioIds = (memberships || []).map((m) => m.studio_id);

  let query = supabase
    .from("audit_logs")
    .select(`
      *,
      actor:actor_id (id, display_name, username, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (studioIds.length > 0) {
    query = query.or(`actor_id.eq.${userId},studio_id.in.(${studioIds.join(",")})`);
  } else {
    query = query.eq("actor_id", userId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    ...row,
    actor: row.actor || null,
  }));
}

/**
 * Format activity action into human-readable narrative.
 */
export function formatActivityDescription(event: ActivityEventWithActor): string {
  const actorName = event.actor?.display_name || "A team member";
  const meta = (event.metadata as Record<string, any>) || {};

  switch (event.action) {
    case "task_created":
      return `${actorName} created task "${meta.title || "Untitled"}"`;
    case "task_status_changed":
      return `${actorName} changed task "${meta.title || "Task"}" to ${meta.newStatus || "updated"}`;
    case "task_updated":
      return `${actorName} updated details for task "${meta.title || "Task"}"`;
    case "task_deleted":
      return `${actorName} deleted task "${meta.title || "Task"}"`;
    case "episode_stage_changed":
      return `${actorName} moved episode "${meta.episodeTitle || "Episode"}" to stage: ${meta.newStage || "in production"}`;
    case "review_requested":
      return `${actorName} requested a review (Round #${meta.round || 1}) for episode "${meta.episodeTitle || "Episode"}"`;
    case "review_completed":
      return `${actorName} completed review for episode "${meta.episodeTitle || "Episode"}" with outcome: ${meta.outcome}`;
    case "episode_approved":
      return `${actorName} approved episode "${meta.episodeTitle || "Episode"}"`;
    case "episode_published":
      return `${actorName} published episode "${meta.episodeTitle || "Episode"}"`;
    case "comment_added":
      return `${actorName} posted a comment on ${event.entity_type}`;
    case "member_invited":
      return `${actorName} invited ${meta.email || "a collaborator"} to the studio`;
    default:
      return `${actorName} performed ${event.action.replace(/_/g, " ")}`;
  }
}
