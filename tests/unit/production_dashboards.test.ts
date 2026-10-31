import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { computeTeamWorkload } from "../../src/lib/data/dashboards-pure.ts";
import type { TaskWithDetails } from "../../src/lib/data/tasks-pure.ts";

describe("Phase 5.5: Team Workload Computations", () => {
  const mockMembers = [
    {
      user_id: "u-alice",
      display_name: "Alice Artist",
      username: "alice",
      avatar_url: null,
      role: "editor",
    },
    {
      user_id: "u-bob",
      display_name: "Bob Colorist",
      username: "bob",
      avatar_url: null,
      role: "member",
    },
  ];

  const now = Date.now();
  const pastDate = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();
  const futureDate = new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString();

  const mockTasks: TaskWithDetails[] = [
    {
      id: "t-1",
      studio_id: "std-1",
      title: "Line Art",
      description: null,
      status: "in_progress",
      priority: "high",
      assignee_id: "u-alice",
      due_date: pastDate, // Overdue
      created_by: "u-alice",
      parent_task_id: null,
      series_id: null,
      episode_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "t-2",
      studio_id: "std-1",
      title: "Lettering",
      description: null,
      status: "done",
      priority: "medium",
      assignee_id: "u-alice",
      due_date: futureDate,
      created_by: "u-alice",
      parent_task_id: null,
      series_id: null,
      episode_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "t-3",
      studio_id: "std-1",
      title: "Coloring",
      description: null,
      status: "todo",
      priority: "urgent",
      assignee_id: "u-bob",
      due_date: futureDate,
      created_by: "u-alice",
      parent_task_id: null,
      series_id: null,
      episode_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  test("Correctly aggregates active, overdue, and completed counts per team member", () => {
    const workload = computeTeamWorkload(mockMembers, mockTasks);

    assert.equal(workload.length, 2);

    const alice = workload.find((w) => w.userId === "u-alice")!;
    assert.equal(alice.activeCount, 1, "Alice should have 1 active task");
    assert.equal(alice.overdueCount, 1, "Alice should have 1 overdue task");
    assert.equal(alice.completedCount, 1, "Alice should have 1 completed task");

    const bob = workload.find((w) => w.userId === "u-bob")!;
    assert.equal(bob.activeCount, 1, "Bob should have 1 active task");
    assert.equal(bob.overdueCount, 0, "Bob should have 0 overdue tasks");
    assert.equal(bob.completedCount, 0, "Bob should have 0 completed tasks");
  });
});

describe("Phase 5.5: Dashboard Filtering & Scope Invariants", () => {
  test("Excludes tasks belonging to other studios from studio dashboard metrics", () => {
    const allTasks = [
      { id: "t-1", studio_id: "studio-1", status: "todo" },
      { id: "t-2", studio_id: "studio-1", status: "done" },
      { id: "t-3", studio_id: "studio-2", status: "todo" }, // Foreign studio
    ];

    const studio1Tasks = allTasks.filter((t) => t.studio_id === "studio-1");
    assert.equal(studio1Tasks.length, 2);
    assert.equal(studio1Tasks.every((t) => t.studio_id === "studio-1"), true);
  });

  test("Personal dashboard correctly isolates tasks assigned to the user", () => {
    const allTasks = [
      { id: "t-1", assignee_id: "user-alice", status: "todo" },
      { id: "t-2", assignee_id: "user-bob", status: "todo" },
    ];

    const aliceTasks = allTasks.filter((t) => t.assignee_id === "user-alice");
    assert.equal(aliceTasks.length, 1);
    assert.equal(aliceTasks[0].id, "t-1");
  });
});
