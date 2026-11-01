import type {
  EpisodeProductionStatus,
  SeriesRole,
  ReleaseEventType,
  ScheduledPublicationStatus,
} from "@/types/database";

export interface ScheduledReleaseItem {
  id: string;
  seriesId: string;
  seriesTitle: string;
  seriesSlug: string;
  episodeId: string;
  episodeTitle: string;
  episodeNumber: number;
  episodeSlug: string;
  revisionId: string;
  scheduledFor: string;
  status: ScheduledPublicationStatus;
  createdBy: string;
  creatorName?: string;
}

export interface ReleaseEventItem {
  id: string;
  seriesId: string;
  episodeId: string;
  revisionId: string | null;
  eventType: ReleaseEventType;
  actorId: string | null;
  actorName?: string;
  scheduledFor: string | null;
  metadata: Record<string, any>;
  createdAt: string;
}

/**
 * Allowed transitions for episode publication lifecycle.
 * Logically separates draft, editorial review, approval, scheduling, and publication.
 */
export const ALLOWED_EPISODE_TRANSITIONS: Record<
  EpisodeProductionStatus,
  EpisodeProductionStatus[]
> = {
  draft: ["in_production", "in_review"],
  in_production: ["in_review", "draft"],
  in_review: ["approved", "revisions_required", "draft"],
  revisions_required: ["in_production", "draft", "in_review"],
  approved: ["scheduled", "published", "in_production", "draft"],
  scheduled: ["published", "approved"], // 'approved' corresponds to schedule cancelled or rescheduled
  published: ["unpublished"],
  unpublished: ["published", "draft", "in_production", "in_review"],
};

/**
 * Check if a lifecycle transition between episode statuses is valid.
 */
export function canTransitionEpisodeStatus(
  current: EpisodeProductionStatus,
  next: EpisodeProductionStatus
): boolean {
  return ALLOWED_EPISODE_TRANSITIONS[current]?.includes(next) ?? false;
}

/**
 * Verify if role has permission to perform a target transition.
 * - Review submission (in_review): contributor, editor, owner
 * - Working draft / in_production: contributor, editor, owner
 * - Approval / Revisions required: editor, owner
 * - Scheduling / Publishing / Unpublishing / Republishing: editor, owner
 */
export function hasPublishingPermission(
  action: "submit_for_review" | "approve" | "reject" | "schedule" | "publish" | "unpublish" | "republish" | "cancel_schedule",
  role: SeriesRole
): boolean {
  if (action === "submit_for_review") {
    return role === "contributor" || role === "editor" || role === "owner";
  }
  return role === "editor" || role === "owner";
}

/**
 * Parse and validate a scheduled release date/time string.
 * Converts any local ISO date/time into UTC and validates that it is in the future.
 */
export function validateScheduledReleaseTime(
  dateString: string,
  minLeadMinutes = 1
): { valid: boolean; error?: string; utcIso?: string } {
  if (!dateString) {
    return { valid: false, error: "Release date and time is required." };
  }

  const scheduledDate = new Date(dateString);
  if (isNaN(scheduledDate.getTime())) {
    return { valid: false, error: "Invalid date format." };
  }

  const now = new Date();
  const minFutureTime = new Date(now.getTime() + minLeadMinutes * 60 * 1000);

  if (scheduledDate < minFutureTime) {
    return {
      valid: false,
      error: "Scheduled release time must be in the future.",
    };
  }

  return {
    valid: true,
    utcIso: scheduledDate.toISOString(),
  };
}

/**
 * Format UTC release date for human-readable calendar display with timezone indication.
 */
export function formatReleaseDisplayDate(
  utcIso: string,
  timeZone?: string
): string {
  try {
    const d = new Date(utcIso);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone: timeZone || undefined,
    }).format(d);
  } catch {
    return utcIso;
  }
}

/**
 * Event narrative descriptions for release history timeline.
 */
export function formatReleaseEventDescription(
  eventType: ReleaseEventType,
  metadata: Record<string, any> = {}
): string {
  switch (eventType) {
    case "submitted_for_approval":
      return `Submitted for editorial review (Round #${metadata.round || 1})${metadata.notes ? `: "${metadata.notes}"` : ""}`;
    case "approved":
      return `Approved for publication${metadata.feedback ? ` with feedback: "${metadata.feedback}"` : ""}`;
    case "rejected":
      return `Changes requested / revisions required${metadata.feedback ? `: "${metadata.feedback}"` : ""}`;
    case "resubmitted":
      return `Revised artwork and resubmitted for review (Round #${metadata.round || 2})`;
    case "scheduled":
      return `Scheduled for automatic publication on ${metadata.scheduledForFormatted || metadata.scheduledFor || "future date"}`;
    case "rescheduled":
      return `Release rescheduled from ${metadata.previousDate || "previous date"} to ${metadata.scheduledForFormatted || metadata.scheduledFor || "new date"}`;
    case "schedule_cancelled":
      return `Scheduled release was cancelled; episode reverted to approved status`;
    case "published":
      return metadata.isAutomated
        ? "Published automatically via scheduled release processor"
        : "Published immediately to public reader";
    case "unpublished":
      return `Unpublished from public reader${metadata.reason ? ` (Reason: ${metadata.reason})` : ""}`;
    case "republished":
      return "Restored to published status on public reader";
    default:
      return "Publishing event recorded";
  }
}
