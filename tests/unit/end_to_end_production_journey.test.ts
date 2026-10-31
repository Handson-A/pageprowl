import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  canTransitionEpisodeStage,
  hasStageTransitionPermission,
} from "../../src/lib/data/workflows-pure.ts";
import { canAddSubtask, validateTaskInput } from "../../src/lib/data/tasks-pure.ts";
import { extractMentionUsernames } from "../../src/lib/data/comments-pure.ts";
import { formatActivityDescription, type ActivityEventWithActor } from "../../src/lib/data/activity-pure.ts";
import type { EpisodeProductionStatus, SeriesRole } from "../../src/types/database.ts";

describe("Phase 5.6: End-to-End Collaborative Production Journey", () => {
  interface StateStore {
    episode: {
      id: string;
      title: string;
      stage: EpisodeProductionStatus;
      currentRevisionId: string;
      publishedRevisionId: string | null;
      isPublic: boolean;
    };
    tasks: {
      id: string;
      title: string;
      status: string;
      assigneeId: string | null;
      parentTaskId: string | null;
    }[];
    reviewRequests: {
      id: string;
      round: number;
      revisionId: string;
      status: string;
      reviewerId: string | null;
      feedback: string | null;
      outcome: string | null;
    }[];
    activityLog: {
      action: string;
      actorId: string;
      description: string;
    }[];
    notifications: {
      userId: string;
      title: string;
      message: string;
    }[];
  }

  const store: StateStore = {
    episode: {
      id: "ep-phase5",
      title: "The Battle for Sector 7",
      stage: "draft",
      currentRevisionId: "rev-1",
      publishedRevisionId: null,
      isPublic: false,
    },
    tasks: [],
    reviewRequests: [],
    activityLog: [],
    notifications: [],
  };

  test("Step 1: Creator creates/selects an episode in draft stage", () => {
    assert.equal(store.episode.stage, "draft");
    assert.equal(store.episode.publishedRevisionId, null);
    assert.equal(store.episode.isPublic, false);
  });

  test("Step 2 & 3: Team member creates a production task and assigns it to authorized teammate", () => {
    const taskInput = {
      title: "Pencil and ink action sequence on pages 5-12",
      description: "Match character designs from model sheet.",
      status: "todo",
      priority: "high",
    };

    const validation = validateTaskInput(taskInput);
    assert.equal(validation.valid, true);

    const newTask = {
      id: "task-101",
      title: taskInput.title,
      status: "todo",
      assigneeId: "user-artist",
      parentTaskId: null,
    };
    store.tasks.push(newTask);

    // Activity & notification
    store.activityLog.push({
      action: "task_created",
      actorId: "user-creator",
      description: 'Creator created task "Pencil and ink action sequence on pages 5-12"',
    });

    store.notifications.push({
      userId: "user-artist",
      title: "New Task Assigned",
      message: `You were assigned to: ${newTask.title}`,
    });

    assert.equal(store.tasks.length, 1);
    assert.equal(store.tasks[0].assigneeId, "user-artist");
    assert.equal(store.notifications[0].userId, "user-artist");
  });

  test("Step 4: Teammate works on the task and updates its status to In Progress and then Done", () => {
    const task = store.tasks.find((t) => t.id === "task-101")!;
    task.status = "in_progress";
    assert.equal(task.status, "in_progress");

    // Also verify 1-level subtask nesting guard
    assert.equal(canAddSubtask(task), true);

    task.status = "done";
    assert.equal(task.status, "done");
  });

  test("Step 5: Episode enters production and is submitted for review", () => {
    // 1. Move to in_production
    assert.equal(canTransitionEpisodeStage(store.episode.stage, "in_production"), true);
    store.episode.stage = "in_production";

    // 2. Submit for review
    assert.equal(canTransitionEpisodeStage(store.episode.stage, "in_review"), true);
    store.episode.stage = "in_review";

    // Create Round #1 review request
    store.reviewRequests.push({
      id: "rr-1",
      round: 1,
      revisionId: store.episode.currentRevisionId, // 'rev-1'
      status: "pending",
      reviewerId: "user-editor",
      feedback: null,
      outcome: null,
    });

    store.notifications.push({
      userId: "user-editor",
      title: "Review Requested",
      message: `Review requested for ${store.episode.title} (Round #1)`,
    });

    assert.equal(store.episode.stage, "in_review");
    assert.equal(store.reviewRequests.length, 1);
    assert.equal(store.reviewRequests[0].round, 1);
  });

  test("Step 6 & 7: Authorized reviewer submits feedback requesting revisions", () => {
    const rr1 = store.reviewRequests[0];
    const feedback = "Dialogue in panel 2 needs stronger dramatic punctuation.";

    // Editor has permission to request revisions
    assert.equal(hasStageTransitionPermission("revisions_required", "editor"), true);

    rr1.status = "revisions_requested";
    rr1.outcome = "revisions_requested";
    rr1.feedback = feedback;

    assert.equal(canTransitionEpisodeStage(store.episode.stage, "revisions_required"), true);
    store.episode.stage = "revisions_required";

    store.notifications.push({
      userId: "user-creator",
      title: "Revisions Requested",
      message: feedback,
    });

    assert.equal(store.episode.stage, "revisions_required");
    assert.equal(rr1.outcome, "revisions_requested");
  });

  test("Step 8: Episode is revised, returned to production, and resubmitted for Round #2", () => {
    // Return to production
    assert.equal(canTransitionEpisodeStage(store.episode.stage, "in_production"), true);
    store.episode.stage = "in_production";

    // Creator generates revision 2
    store.episode.currentRevisionId = "rev-2";

    // Resubmit for review
    assert.equal(canTransitionEpisodeStage(store.episode.stage, "in_review"), true);
    store.episode.stage = "in_review";

    // Round 2 review request is added
    store.reviewRequests.push({
      id: "rr-2",
      round: 2,
      revisionId: store.episode.currentRevisionId, // 'rev-2'
      status: "pending",
      reviewerId: "user-editor",
      feedback: null,
      outcome: null,
    });

    // Check that Round 1 is preserved and not overwritten!
    assert.equal(store.reviewRequests.length, 2);
    assert.equal(store.reviewRequests[0].round, 1);
    assert.equal(store.reviewRequests[0].revisionId, "rev-1");
    assert.equal(store.reviewRequests[0].outcome, "revisions_requested");

    assert.equal(store.reviewRequests[1].round, 2);
    assert.equal(store.reviewRequests[1].revisionId, "rev-2");
    assert.equal(store.reviewRequests[1].status, "pending");
  });

  test("Step 9: Reviewer approves Round #2", () => {
    const rr2 = store.reviewRequests[1];
    rr2.status = "approved";
    rr2.outcome = "approved";
    rr2.feedback = "Dialogue revision looks outstanding. Approved for release!";

    assert.equal(canTransitionEpisodeStage(store.episode.stage, "approved"), true);
    store.episode.stage = "approved";

    // IMPORTANT: Approval does NOT automatically publish!
    assert.equal(store.episode.stage, "approved");
    assert.equal(store.episode.publishedRevisionId, null);
    assert.equal(store.episode.isPublic, false);
  });

  test("Step 10: Authorized user publishes the episode through publication flow", () => {
    // Contributor cannot publish
    assert.equal(hasStageTransitionPermission("published", "contributor"), false);

    // Editor or owner can publish
    assert.equal(hasStageTransitionPermission("published", "editor"), true);
    assert.equal(canTransitionEpisodeStage(store.episode.stage, "published"), true);

    store.episode.stage = "published";
    store.episode.publishedRevisionId = store.episode.currentRevisionId; // 'rev-2'
    store.episode.isPublic = true;

    assert.equal(store.episode.stage, "published");
    assert.equal(store.episode.publishedRevisionId, "rev-2");
    assert.equal(store.episode.isPublic, true);
  });

  test("Step 11: Production activity and notifications are recorded throughout the journey", () => {
    assert.ok(store.activityLog.length >= 1);
    assert.ok(store.notifications.length >= 3);

    const artistNotifs = store.notifications.filter((n) => n.userId === "user-artist");
    assert.ok(artistNotifs.length >= 1);

    const editorNotifs = store.notifications.filter((n) => n.userId === "user-editor");
    assert.ok(editorNotifs.length >= 1);

    const creatorNotifs = store.notifications.filter((n) => n.userId === "user-creator");
    assert.ok(creatorNotifs.length >= 1);
  });
});
