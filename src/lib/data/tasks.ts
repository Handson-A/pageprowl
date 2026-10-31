import { createClient } from "../supabase/server";
import { logActivity } from "./activity";
import { createNotification } from "./notifications";

export * from "./tasks-pure";
export type { TaskStatus, TaskPriority } from "./tasks-pure";
import {
  validateTaskInput,
  canAddSubtask,
  type TaskWithDetails,
  type TaskFilterOptions,
  type TaskUpdate,
  type TaskStatus,
  type TaskPriority,
} from "./tasks-pure";

/**
 * Fetch tasks for a studio workspace with optional filtering and relation joins.
 */
export async function getStudioTasks(
  studioId: string,
  options: TaskFilterOptions = {}
): Promise<TaskWithDetails[]> {
  const supabase = createClient();

  let query = supabase
    .from("tasks")
    .select(`
      *,
      assignee:assignee_id (id, display_name, username, avatar_url),
      creator:created_by (id, display_name, username),
      series:series_id (id, title, slug),
      episode:episode_id (id, title, episode_number, slug),
      task_collaborators (
        user_id,
        profiles:user_id (id, display_name, username, avatar_url)
      )
    `)
    .eq("studio_id", studioId)
    .order("created_at", { ascending: false });

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.priority) {
    query = query.eq("priority", options.priority);
  }

  if (options.assigneeId) {
    query = query.eq("assignee_id", options.assigneeId);
  }

  if (options.seriesId) {
    query = query.eq("series_id", options.seriesId);
  }

  if (options.episodeId) {
    query = query.eq("episode_id", options.episodeId);
  }

  if (options.onlyParents) {
    query = query.is("parent_task_id", null);
  }

  if (options.search) {
    query = query.ilike("title", `%${options.search}%`);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    ...row,
    assignee: row.assignee || null,
    creator: row.creator || null,
    series: row.series || null,
    episode: row.episode || null,
    collaborators: (row.task_collaborators || []).map((tc: any) => ({
      user_id: tc.user_id,
      display_name: tc.profiles?.display_name || "Team Member",
      username: tc.profiles?.username || "user",
      avatar_url: tc.profiles?.avatar_url || null,
    })),
  }));
}

/**
 * Fetch a single task by ID with its details, collaborators, and subtasks.
 */
export async function getTaskById(taskId: string): Promise<TaskWithDetails | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      assignee:assignee_id (id, display_name, username, avatar_url),
      creator:created_by (id, display_name, username),
      series:series_id (id, title, slug),
      episode:episode_id (id, title, episode_number, slug),
      task_collaborators (
        user_id,
        profiles:user_id (id, display_name, username, avatar_url)
      )
    `)
    .eq("id", taskId)
    .single();

  if (error || !data) {
    return null;
  }

  // Fetch subtasks if this is a parent task
  let subtasks: TaskWithDetails[] = [];
  if (data.parent_task_id === null) {
    const { data: subData } = await supabase
      .from("tasks")
      .select(`
        *,
        assignee:assignee_id (id, display_name, username, avatar_url)
      `)
      .eq("parent_task_id", taskId)
      .order("created_at", { ascending: true });

    if (subData) {
      subtasks = subData as any[];
    }
  }

  const row = data as any;
  return {
    ...row,
    assignee: row.assignee || null,
    creator: row.creator || null,
    series: row.series || null,
    episode: row.episode || null,
    collaborators: (row.task_collaborators || []).map((tc: any) => ({
      user_id: tc.user_id,
      display_name: tc.profiles?.display_name || "Team Member",
      username: tc.profiles?.username || "user",
      avatar_url: tc.profiles?.avatar_url || null,
    })),
    subtask_count: subtasks.length,
    subtasks,
  };
}

/**
 * Fetch tasks assigned to a specific user across all studios they are members of.
 */
export async function getUserAssignedTasks(
  userId: string,
  options: { status?: TaskStatus; limit?: number } = {}
): Promise<TaskWithDetails[]> {
  const supabase = createClient();

  let query = supabase
    .from("tasks")
    .select(`
      *,
      assignee:assignee_id (id, display_name, username, avatar_url),
      creator:created_by (id, display_name, username),
      series:series_id (id, title, slug),
      episode:episode_id (id, title, episode_number, slug)
    `)
    .eq("assignee_id", userId)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    ...row,
    assignee: row.assignee || null,
    creator: row.creator || null,
    series: row.series || null,
    episode: row.episode || null,
  }));
}

/**
 * Validate that a proposed user is a member of the given studio.
 */
export async function assertStudioMember(studioId: string, userId: string): Promise<boolean> {
  const supabase = createClient();

  const { data: member } = await supabase
    .from("studio_members")
    .select("role")
    .eq("studio_id", studioId)
    .eq("user_id", userId)
    .maybeSingle();

  if (member) return true;

  // Check if owner of the studio
  const { data: studio } = await supabase
    .from("studios")
    .select("created_by")
    .eq("id", studioId)
    .single();

  return studio?.created_by === userId;
}

/**
 * Create a new task with strict workspace validation, 1-level nesting enforcement,
 * and activity/notification dispatching.
 */
export async function createTask(params: {
  studioId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
  seriesId?: string | null;
  episodeId?: string | null;
  parentTaskId?: string | null;
  collaboratorIds?: string[];
}): Promise<TaskWithDetails> {
  const supabase = createClient();

  // 1. Invariant validation
  const validation = validateTaskInput({
    title: params.title,
    description: params.description,
    status: params.status,
    priority: params.priority,
    dueDate: params.dueDate,
  });
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 2. Validate creator is studio member
  const isCreatorMember = await assertStudioMember(params.studioId, params.createdBy);
  if (!isCreatorMember) {
    throw new Error("You must be a member of this studio workspace to create tasks.");
  }

  // 3. Validate assignee if provided
  if (params.assigneeId) {
    const isAssigneeMember = await assertStudioMember(params.studioId, params.assigneeId);
    if (!isAssigneeMember) {
      throw new Error("Assigned user is not a member of this studio workspace.");
    }
  }

  // 4. Validate 1-level subtask nesting restriction
  if (params.parentTaskId) {
    const { data: parent } = await supabase
      .from("tasks")
      .select("id, studio_id, parent_task_id")
      .eq("id", params.parentTaskId)
      .single();

    if (!parent) {
      throw new Error("Parent task not found.");
    }

    if (parent.studio_id !== params.studioId) {
      throw new Error("Parent task must belong to the same studio workspace.");
    }

    if (!canAddSubtask(parent)) {
      throw new Error("Subtasks cannot have nested subtasks (maximum 1 level of nesting allowed).");
    }
  }

  // 5. Insert task
  const { data: task, error: insertError } = await supabase
    .from("tasks")
    .insert({
      studio_id: params.studioId,
      created_by: params.createdBy,
      title: params.title.trim(),
      description: params.description?.trim() || null,
      status: params.status || "backlog",
      priority: params.priority || "medium",
      assignee_id: params.assigneeId || null,
      due_date: params.dueDate ? new Date(params.dueDate).toISOString() : null,
      series_id: params.seriesId || null,
      episode_id: params.episodeId || null,
      parent_task_id: params.parentTaskId || null,
    })
    .select("*")
    .single();

  if (insertError || !task) {
    throw new Error(insertError?.message || "Failed to create task.");
  }

  // 6. Insert collaborators if provided
  if (params.collaboratorIds && params.collaboratorIds.length > 0) {
    const validCollaboratorInserts = [];
    for (const cId of params.collaboratorIds) {
      const isMember = await assertStudioMember(params.studioId, cId);
      if (isMember) {
        validCollaboratorInserts.push({
          task_id: task.id,
          user_id: cId,
        });
      }
    }
    if (validCollaboratorInserts.length > 0) {
      await supabase.from("task_collaborators").insert(validCollaboratorInserts);
    }
  }

  // 7. Record activity log
  await logActivity({
    studioId: params.studioId,
    actorId: params.createdBy,
    action: "task_created",
    entityType: "task",
    entityId: task.id,
    metadata: {
      title: task.title,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assignee_id,
      parentTaskId: task.parent_task_id,
    },
  });

  // 8. Send notification to primary assignee if assigned to someone else
  if (task.assignee_id && task.assignee_id !== params.createdBy) {
    await createNotification({
      studioId: params.studioId,
      userId: task.assignee_id,
      title: "New Task Assigned",
      message: `You were assigned to task: "${task.title}"`,
      type: "task",
      link: `/studio/tasks?taskId=${task.id}`,
    });
  }

  return (await getTaskById(task.id))!;
}

/**
 * Update an existing task.
 */
export async function updateTask(
  taskId: string,
  studioId: string,
  updates: {
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string | null;
    dueDate?: string | null;
    seriesId?: string | null;
    episodeId?: string | null;
  },
  actorId: string
): Promise<TaskWithDetails> {
  const supabase = createClient();

  // Load existing task
  const existing = await getTaskById(taskId);
  if (!existing || existing.studio_id !== studioId) {
    throw new Error("Task not found in this studio workspace.");
  }

  // Validate changes
  if (updates.title || updates.status || updates.priority || updates.dueDate !== undefined) {
    const validation = validateTaskInput({
      title: updates.title ?? existing.title,
      description: updates.description !== undefined ? updates.description : existing.description,
      status: updates.status ?? existing.status,
      priority: updates.priority ?? existing.priority,
      dueDate: updates.dueDate !== undefined ? updates.dueDate : existing.due_date,
    });
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }

  // Validate assignee if changed
  if (updates.assigneeId && updates.assigneeId !== existing.assignee_id) {
    const isMember = await assertStudioMember(studioId, updates.assigneeId);
    if (!isMember) {
      throw new Error("Assigned user is not a member of this studio workspace.");
    }
  }

  const payload: TaskUpdate = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) payload.title = updates.title.trim();
  if (updates.description !== undefined) payload.description = updates.description?.trim() || null;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.assigneeId !== undefined) payload.assignee_id = updates.assigneeId;
  if (updates.dueDate !== undefined) {
    payload.due_date = updates.dueDate ? new Date(updates.dueDate).toISOString() : null;
  }
  if (updates.seriesId !== undefined) payload.series_id = updates.seriesId;
  if (updates.episodeId !== undefined) payload.episode_id = updates.episodeId;

  const { error: updateError } = await supabase
    .from("tasks")
    .update(payload)
    .eq("id", taskId)
    .eq("studio_id", studioId);

  if (updateError) {
    throw new Error(updateError.message || "Failed to update task.");
  }

  // Reassignment notification
  if (updates.assigneeId && updates.assigneeId !== existing.assignee_id && updates.assigneeId !== actorId) {
    await createNotification({
      studioId,
      userId: updates.assigneeId,
      title: "Task Assigned to You",
      message: `You were assigned to task: "${existing.title}"`,
      type: "task",
      link: `/studio/tasks?taskId=${taskId}`,
    });
  }

  // Log status change or detail change
  await logActivity({
    studioId,
    actorId,
    action: updates.status && updates.status !== existing.status ? "task_status_changed" : "task_updated",
    entityType: "task",
    entityId: taskId,
    metadata: {
      previousStatus: existing.status,
      newStatus: updates.status ?? existing.status,
      reassigned: updates.assigneeId !== existing.assignee_id,
      title: existing.title,
    },
  });

  return (await getTaskById(taskId))!;
}

/**
 * Delete a task.
 */
export async function deleteTask(
  taskId: string,
  studioId: string,
  actorId: string
): Promise<boolean> {
  const supabase = createClient();

  const existing = await getTaskById(taskId);
  if (!existing || existing.studio_id !== studioId) {
    throw new Error("Task not found.");
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("studio_id", studioId);

  if (error) {
    throw new Error(error.message || "Failed to delete task.");
  }

  await logActivity({
    studioId,
    actorId,
    action: "task_deleted",
    entityType: "task",
    entityId: taskId,
    metadata: {
      title: existing.title,
    },
  });

  return true;
}
