import type { TaskWithDetails } from "./tasks-pure.ts";

export interface TeamMemberWorkload {
  userId: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  activeCount: number;
  overdueCount: number;
  completedCount: number;
  tasks: TaskWithDetails[];
}

/**
 * Pure helper to compute team workload metrics from tasks and members list.
 */
export function computeTeamWorkload(
  members: { user_id: string; display_name: string; username: string; avatar_url: string | null; role: string }[],
  tasks: TaskWithDetails[]
): TeamMemberWorkload[] {
  const now = new Date().getTime();

  return members.map((m) => {
    const memberTasks = tasks.filter((t) => t.assignee_id === m.user_id);
    const activeTasks = memberTasks.filter((t) => t.status !== "done");
    const completedTasks = memberTasks.filter((t) => t.status === "done");
    const overdueTasks = activeTasks.filter(
      (t) => t.due_date && new Date(t.due_date).getTime() < now
    );

    return {
      userId: m.user_id,
      displayName: m.display_name,
      username: m.username,
      avatarUrl: m.avatar_url,
      role: m.role,
      activeCount: activeTasks.length,
      overdueCount: overdueTasks.length,
      completedCount: completedTasks.length,
      tasks: memberTasks,
    };
  });
}
