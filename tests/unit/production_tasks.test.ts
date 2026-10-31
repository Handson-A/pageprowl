import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  validateTaskInput,
  canAddSubtask,
  VALID_TASK_STATUSES,
  VALID_TASK_PRIORITIES,
} from "../../src/lib/data/tasks-pure.ts";
import type { TaskStatus, TaskPriority } from "../../src/types/database.ts";

describe("Phase 5.1: Task Management Invariants & Validation", () => {
  test("Valid task input passes validation", () => {
    const res = validateTaskInput({
      title: "Inking background art for Episode 3",
      description: "Ensure perspective grid matches architectural layout.",
      status: "todo",
      priority: "high",
      dueDate: "2026-11-15T00:00:00.000Z",
    });
    assert.equal(res.valid, true);
  });

  test("Missing or empty title is rejected", () => {
    const emptyRes = validateTaskInput({ title: "" });
    assert.equal(emptyRes.valid, false);
    assert.match(emptyRes.error!, /title/i);

    const whitespaceRes = validateTaskInput({ title: "   " });
    assert.equal(whitespaceRes.valid, false);
    assert.match(whitespaceRes.error!, /title/i);
  });

  test("Title exceeding 150 characters is rejected", () => {
    const res = validateTaskInput({
      title: "A".repeat(151),
    });
    assert.equal(res.valid, false);
    assert.match(res.error!, /title.*150/i);
  });

  test("Description exceeding 5000 characters is rejected", () => {
    const res = validateTaskInput({
      title: "Valid Title",
      description: "D".repeat(5001),
    });
    assert.equal(res.valid, false);
    assert.match(res.error!, /5000/i);
  });

  test("Canonical statuses are accepted and invalid statuses are rejected", () => {
    const canonical: TaskStatus[] = ["backlog", "todo", "in_progress", "in_review", "done"];
    assert.deepEqual(VALID_TASK_STATUSES, canonical);

    canonical.forEach((st) => {
      const res = validateTaskInput({ title: "Task", status: st });
      assert.equal(res.valid, true);
    });

    const invalid = validateTaskInput({ title: "Task", status: "arbitrary_custom_state" });
    assert.equal(invalid.valid, false);
    assert.match(invalid.error!, /invalid status/i);
  });

  test("Canonical priorities are accepted and invalid priorities are rejected", () => {
    const canonical: TaskPriority[] = ["low", "medium", "high", "urgent"];
    assert.deepEqual(VALID_TASK_PRIORITIES, canonical);

    canonical.forEach((p) => {
      const res = validateTaskInput({ title: "Task", priority: p });
      assert.equal(res.valid, true);
    });

    const invalid = validateTaskInput({ title: "Task", priority: "critical_p0" });
    assert.equal(invalid.valid, false);
    assert.match(invalid.error!, /invalid priority/i);
  });

  test("Invalid due date string is rejected", () => {
    const res = validateTaskInput({ title: "Task", dueDate: "not-a-valid-date-stamp" });
    assert.equal(res.valid, false);
    assert.match(res.error!, /due date/i);
  });
});

describe("Phase 5.1: 1-Level Subtask Nesting Restriction", () => {
  test("Top-level task (parent_task_id is null) can have subtasks", () => {
    const parentTask = { id: "task-1", parent_task_id: null };
    assert.equal(canAddSubtask(parentTask), true);
  });

  test("Subtask (parent_task_id is not null) CANNOT have nested subtasks", () => {
    const subtask = { id: "subtask-1", parent_task_id: "task-1" };
    assert.equal(canAddSubtask(subtask), false);
  });

  test("Attempting to attach a subtask to an existing subtask is rejected", () => {
    function createSubtaskAttempt(targetParent: { id: string; parent_task_id: string | null }) {
      if (!canAddSubtask(targetParent)) {
        throw new Error("Subtasks cannot have nested subtasks (maximum 1 level of nesting allowed).");
      }
      return { success: true };
    }

    // Top-level task succeeds
    assert.doesNotThrow(() => {
      createSubtaskAttempt({ id: "parent-top", parent_task_id: null });
    });

    // Subtask throws
    assert.throws(() => {
      createSubtaskAttempt({ id: "subtask-level-1", parent_task_id: "parent-top" });
    }, /Subtasks cannot have nested subtasks/);
  });
});

describe("Phase 5.1: Task Assignment & Workspace Isolation", () => {
  interface StudioMember {
    studioId: string;
    userId: string;
  }

  const studioMembers: StudioMember[] = [
    { studioId: "studio-alpha", userId: "user-alice" },
    { studioId: "studio-alpha", userId: "user-bob" },
    { studioId: "studio-beta", userId: "user-charlie" },
  ];

  function validateAssignment(studioId: string, assigneeId: string | null) {
    if (!assigneeId) return { valid: true };
    const isMember = studioMembers.some(
      (m) => m.studioId === studioId && m.userId === assigneeId
    );
    if (!isMember) {
      return { valid: false, error: "Assigned user is not a member of this studio workspace." };
    }
    return { valid: true };
  }

  test("Assigning task to verified studio member is allowed", () => {
    const res = validateAssignment("studio-alpha", "user-alice");
    assert.equal(res.valid, true);
  });

  test("Assigning task to user from another studio is rejected", () => {
    // Charlie is in Studio Beta, cannot be assigned task in Studio Alpha
    const res = validateAssignment("studio-alpha", "user-charlie");
    assert.equal(res.valid, false);
    assert.match(res.error!, /not a member of this studio/i);
  });

  test("Assigning task to non-existent user is rejected", () => {
    const res = validateAssignment("studio-alpha", "user-ghost");
    assert.equal(res.valid, false);
  });

  test("Unassigned task (null assignee) is valid", () => {
    const res = validateAssignment("studio-alpha", null);
    assert.equal(res.valid, true);
  });
});
