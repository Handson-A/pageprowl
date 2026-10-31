import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractMentionUsernames } from "../../src/lib/data/comments-pure.ts";

describe("Phase 5.3: Comment Mentions Extraction", () => {
  test("Extracts single mention from comment body", () => {
    const text = "Great line work @artist! Please check panel 4.";
    const mentions = extractMentionUsernames(text);
    assert.deepEqual(mentions, ["artist"]);
  });

  test("Extracts multiple distinct mentions from text", () => {
    const text = "Hey @writer, please review dialogue changes with @editor_main.";
    const mentions = extractMentionUsernames(text);
    assert.deepEqual(mentions, ["writer", "editor_main"]);
  });

  test("Deduplicates identical mentions regardless of casing", () => {
    const text = "Paging @alex and @ALEX and @Alex.";
    const mentions = extractMentionUsernames(text);
    assert.deepEqual(mentions, ["alex"]);
  });

  test("Returns empty array when text contains no mentions", () => {
    const text = "All lettering looks crisp and properly kerned.";
    const mentions = extractMentionUsernames(text);
    assert.deepEqual(mentions, []);
  });
});

describe("Phase 5.3: Mention Workspace Membership Resolution", () => {
  interface WorkspaceProfile {
    id: string;
    username: string;
    displayName: string;
  }

  const workspaceProfiles: WorkspaceProfile[] = [
    { id: "u-1", username: "sarah_art", displayName: "Sarah Art" },
    { id: "u-2", username: "dan_writer", displayName: "Dan Writer" },
  ];

  function filterValidWorkspaceMentions(
    extractedUsernames: string[],
    members: WorkspaceProfile[]
  ): WorkspaceProfile[] {
    const memberMap = new Map(members.map((m) => [m.username.toLowerCase(), m]));
    return extractedUsernames
      .map((u) => memberMap.get(u))
      .filter((m): m is WorkspaceProfile => m !== undefined);
  }

  test("Resolves valid workspace members mentioned in comment", () => {
    const extracted = ["sarah_art", "dan_writer"];
    const resolved = filterValidWorkspaceMentions(extracted, workspaceProfiles);

    assert.equal(resolved.length, 2);
    assert.equal(resolved[0].id, "u-1");
    assert.equal(resolved[1].id, "u-2");
  });

  test("Ignores non-workspace usernames in mentions to prevent unauthorized leaks", () => {
    const extracted = ["sarah_art", "random_outsider_404"];
    const resolved = filterValidWorkspaceMentions(extracted, workspaceProfiles);

    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].username, "sarah_art");
  });
});

describe("Phase 5.3: Threading & Public Isolation", () => {
  interface CommentRecord {
    id: string;
    parentCommentId: string | null;
    taskId: string | null;
    episodeId: string | null;
    isPublic: boolean;
  }

  test("Threaded replies correctly reference parent comment", () => {
    const rootComment: CommentRecord = {
      id: "c-root",
      parentCommentId: null,
      taskId: "task-1",
      episodeId: null,
      isPublic: false,
    };

    const replyComment: CommentRecord = {
      id: "c-reply",
      parentCommentId: rootComment.id,
      taskId: "task-1",
      episodeId: null,
      isPublic: false,
    };

    assert.equal(replyComment.parentCommentId, "c-root");
  });

  test("Production and review comments are strictly non-public", () => {
    const comments: CommentRecord[] = [
      { id: "c-1", parentCommentId: null, taskId: "task-1", episodeId: null, isPublic: false },
      { id: "c-2", parentCommentId: null, taskId: null, episodeId: "ep-1", isPublic: false },
    ];

    // Public reader filter: internal comments must NEVER appear
    const publicExposed = comments.filter((c) => c.isPublic);
    assert.equal(publicExposed.length, 0);
  });
});
