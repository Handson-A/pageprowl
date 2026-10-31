import type {
  EpisodeProductionStatus,
  SeriesRole,
  Database,
  ReviewRequestStatus,
  ReviewOutcome,
} from "../../types/database.ts";

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
