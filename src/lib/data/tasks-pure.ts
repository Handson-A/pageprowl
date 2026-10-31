import type { TaskStatus, TaskPriority, Database } from "../../types/database.ts";
export type { TaskStatus, TaskPriority } from "../../types/database.ts";

export type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

export const VALID_TASK_STATUSES: TaskStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
];

export const VALID_TASK_PRIORITIES: TaskPriority[] = [
  "low",
  "medium",
  "high",
  "urgent",
];

export interface TaskCollaboratorProfile {
  user_id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
}

export interface TaskWithDetails extends TaskRow {
  assignee?: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  } | null;
  creator?: {
    id: string;
    display_name: string;
    username: string;
  } | null;
  collaborators?: TaskCollaboratorProfile[];
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
  subtask_count?: number;
  subtasks?: TaskWithDetails[];
}

export interface TaskFilterOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  seriesId?: string;
  episodeId?: string;
  search?: string;
  onlyParents?: boolean;
}

/**
 * Validate task field invariants.
 */
export function validateTaskInput(params: {
  title: string;
  description?: string | null;
  status?: string;
  priority?: string;
  dueDate?: string | null;
}) {
  const trimmedTitle = params.title?.trim();
  if (!trimmedTitle || trimmedTitle.length < 1 || trimmedTitle.length > 150) {
    return {
      valid: false,
      error: "Task title is required and must be between 1 and 150 characters.",
    };
  }

  if (params.description && params.description.length > 5000) {
    return {
      valid: false,
      error: "Task description cannot exceed 5000 characters.",
    };
  }

  if (params.status && !VALID_TASK_STATUSES.includes(params.status as TaskStatus)) {
    return {
      valid: false,
      error: `Invalid status '${params.status}'. Must be one of: ${VALID_TASK_STATUSES.join(", ")}.`,
    };
  }

  if (params.priority && !VALID_TASK_PRIORITIES.includes(params.priority as TaskPriority)) {
    return {
      valid: false,
      error: `Invalid priority '${params.priority}'. Must be one of: ${VALID_TASK_PRIORITIES.join(", ")}.`,
    };
  }

  if (params.dueDate) {
    const parsed = new Date(params.dueDate);
    if (isNaN(parsed.getTime())) {
      return { valid: false, error: "Invalid due date format." };
    }
  }

  return { valid: true };
}

/**
 * Pure check to enforce 1-level subtask nesting.
 * A task can have subtasks, but a subtask cannot itself have subtasks.
 */
export function canAddSubtask(parentTask: { parent_task_id?: string | null; parentTaskId?: string | null }): boolean {
  if ("parent_task_id" in parentTask) {
    return parentTask.parent_task_id === null || parentTask.parent_task_id === undefined;
  }
  return parentTask.parentTaskId === null || parentTask.parentTaskId === undefined;
}
