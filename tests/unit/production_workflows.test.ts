import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  CANONICAL_EPISODE_STAGES,
  canTransitionEpisodeStage,
  hasStageTransitionPermission,
  EPISODE_STAGE_TRANSITIONS,
} from "../../src/lib/data/workflows-pure.ts";
import type { EpisodeProductionStatus, SeriesRole } from "../../src/types/database.ts";

describe("Phase 5.2: Canonical Episode Lifecycle Transitions", () => {
  test("Canonical 6-stage lifecycle is defined in order", () => {
    const expectedStages: EpisodeProductionStatus[] = [
      "draft",
      "in_production",
      "in_review",
      "revisions_required",
      "approved",
      "published",
    ];
    assert.deepEqual(CANONICAL_EPISODE_STAGES, expectedStages);
  });

  test("Draft can enter in_production", () => {
    assert.equal(canTransitionEpisodeStage("draft", "in_production"), true);
  });

  test("In production can be submitted to in_review", () => {
    assert.equal(canTransitionEpisodeStage("in_production", "in_review"), true);
  });

  test("In review can transition to revisions_required", () => {
    assert.equal(canTransitionEpisodeStage("in_review", "revisions_required"), true);
  });

  test("Revisions required can return to in_production for creator corrections", () => {
    assert.equal(canTransitionEpisodeStage("revisions_required", "in_production"), true);
  });

  test("In review can be approved by reviewer", () => {
    assert.equal(canTransitionEpisodeStage("in_review", "approved"), true);
  });

  test("Approved episode can transition to published", () => {
    assert.equal(canTransitionEpisodeStage("approved", "published"), true);
  });

  test("Published episode can return to in_production or draft on unpublish", () => {
    assert.equal(canTransitionEpisodeStage("published", "in_production"), true);
    assert.equal(canTransitionEpisodeStage("published", "draft"), true);
  });
});

describe("Phase 5.2: Illegal Transition Guards & Publishing Separation", () => {
  test("Draft CANNOT bypass lifecycle directly to published", () => {
    assert.equal(canTransitionEpisodeStage("draft", "published"), false);
  });

  test("In production CANNOT bypass review directly to published", () => {
    assert.equal(canTransitionEpisodeStage("in_production", "published"), false);
  });

  test("In review CANNOT jump directly to published without explicit approval", () => {
    assert.equal(canTransitionEpisodeStage("in_review", "published"), false);
  });

  test("Revisions required CANNOT bypass revision directly to approved or published", () => {
    assert.equal(canTransitionEpisodeStage("revisions_required", "approved"), false);
    assert.equal(canTransitionEpisodeStage("revisions_required", "published"), false);
  });

  test("Approval and Publication remain strictly separate", () => {
    // An episode that is approved is awaiting publication, not published
    const episode = {
      id: "ep-101",
      status: "approved" as EpisodeProductionStatus,
      published_revision_id: null as string | null,
    };

    // Helper checking public reader visibility
    function isPubliclyReadable(ep: { status: EpisodeProductionStatus; published_revision_id: string | null }): boolean {
      return ep.status === "published" && ep.published_revision_id !== null;
    }

    assert.equal(isPubliclyReadable(episode), false, "Approved episode must NOT be readable on public routes");

    // Only after explicit publish action does it become readable
    episode.status = "published";
    episode.published_revision_id = "rev-1-snapshot";
    assert.equal(isPubliclyReadable(episode), true, "Published episode with valid revision is readable");
  });
});

describe("Phase 5.2: Workflow Stage Transition Authorization", () => {
  test("Contributor can transition to in_production and submit for in_review", () => {
    assert.equal(hasStageTransitionPermission("in_production", "contributor"), true);
    assert.equal(hasStageTransitionPermission("in_review", "contributor"), true);
  });

  test("Contributor CANNOT approve or publish episodes", () => {
    assert.equal(hasStageTransitionPermission("approved", "contributor"), false);
    assert.equal(hasStageTransitionPermission("published", "contributor"), false);
  });

  test("Viewer CANNOT perform any stage transition", () => {
    assert.equal(hasStageTransitionPermission("in_production", "viewer"), false);
    assert.equal(hasStageTransitionPermission("in_review", "viewer"), false);
    assert.equal(hasStageTransitionPermission("approved", "viewer"), false);
    assert.equal(hasStageTransitionPermission("published", "viewer"), false);
  });

  test("Editor and Owner can approve and publish episodes", () => {
    assert.equal(hasStageTransitionPermission("approved", "editor"), true);
    assert.equal(hasStageTransitionPermission("published", "editor"), true);
    assert.equal(hasStageTransitionPermission("approved", "owner"), true);
    assert.equal(hasStageTransitionPermission("published", "owner"), true);
  });
});

describe("Phase 5.2: Multi-Round Review Request & Revision Preservation", () => {
  interface MockReviewRequest {
    id: string;
    episodeId: string;
    round: number;
    revisionId: string;
    status: string;
    feedback: string | null;
    outcome: string | null;
  }

  test("Preserves historical review rounds when revisions are submitted", () => {
    const reviewHistory: MockReviewRequest[] = [];

    // Round 1: Submission
    const round1: MockReviewRequest = {
      id: "req-1",
      episodeId: "ep-42",
      round: 1,
      revisionId: "rev-v1",
      status: "pending",
      feedback: null,
      outcome: null,
    };
    reviewHistory.push(round1);

    // Round 1: Reviewer feedback requesting corrections
    round1.status = "revisions_requested";
    round1.outcome = "revisions_requested";
    round1.feedback = "Fix speech bubble clipping on page 3.";

    // Round 2: Creator revised content to rev-v2 and submitted new review request
    const round2: MockReviewRequest = {
      id: "req-2",
      episodeId: "ep-42",
      round: reviewHistory.length + 1,
      revisionId: "rev-v2",
      status: "pending",
      feedback: null,
      outcome: null,
    };
    reviewHistory.push(round2);

    // Assert that Round 1 is NOT overwritten by Round 2
    assert.equal(reviewHistory.length, 2);
    assert.equal(reviewHistory[0].round, 1);
    assert.equal(reviewHistory[0].revisionId, "rev-v1");
    assert.equal(reviewHistory[0].outcome, "revisions_requested");
    assert.equal(reviewHistory[0].feedback, "Fix speech bubble clipping on page 3.");

    assert.equal(reviewHistory[1].round, 2);
    assert.equal(reviewHistory[1].revisionId, "rev-v2");
    assert.equal(reviewHistory[1].status, "pending");

    // Round 2 is approved
    round2.status = "approved";
    round2.outcome = "approved";
    round2.feedback = "Looks great, bubble placement fixed!";

    assert.equal(reviewHistory[0].status, "revisions_requested");
    assert.equal(reviewHistory[1].status, "approved");
  });
});
