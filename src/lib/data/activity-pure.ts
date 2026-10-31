import type { Database } from "../../types/database.ts";

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
