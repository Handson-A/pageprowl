"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, requireStudioRole } from "@/lib/auth/guards";
import {
  createTask,
  updateTask,
  deleteTask,
  type TaskStatus,
  type TaskPriority,
} from "@/lib/data/tasks";

/**
 * Server Action: Create a new task within an authorized studio workspace.
 */
export async function createTaskAction(studioId: string, formData: FormData) {
  const user = await requireAuth();
  await requireStudioRole(studioId, "member");

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const status = (formData.get("status")?.toString() || "backlog") as TaskStatus;
  const priority = (formData.get("priority")?.toString() || "medium") as TaskPriority;
  const assigneeId = formData.get("assigneeId")?.toString().trim() || null;
  const dueDate = formData.get("dueDate")?.toString().trim() || null;
  const seriesId = formData.get("seriesId")?.toString().trim() || null;
  const episodeId = formData.get("episodeId")?.toString().trim() || null;
  const parentTaskId = formData.get("parentTaskId")?.toString().trim() || null;

  const rawCollaborators = formData.getAll("collaboratorIds");
  const collaboratorIds = rawCollaborators.map((c) => c.toString()).filter(Boolean);

  if (!title) {
    throw new Error("Task title is required.");
  }

  const task = await createTask({
    studioId,
    createdBy: user.id,
    title,
    description,
    status,
    priority,
    assigneeId,
    dueDate,
    seriesId,
    episodeId,
    parentTaskId,
    collaboratorIds,
  });

  revalidatePath("/studio");
  revalidatePath("/studio/tasks");
  revalidatePath(`/studio/studios/${studioId}`);

  return { success: true, task };
}

/**
 * Server Action: Update task details.
 */
export async function updateTaskAction(
  taskId: string,
  studioId: string,
  formData: FormData
) {
  const user = await requireAuth();
  await requireStudioRole(studioId, "member");

  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const status = formData.get("status")?.toString() as TaskStatus | undefined;
  const priority = formData.get("priority")?.toString() as TaskPriority | undefined;
  const assigneeId = formData.get("assigneeId")?.toString().trim() || null;
  const dueDate = formData.get("dueDate")?.toString().trim() || null;
  const seriesId = formData.get("seriesId")?.toString().trim() || null;
  const episodeId = formData.get("episodeId")?.toString().trim() || null;

  const task = await updateTask(
    taskId,
    studioId,
    {
      title,
      description,
      status,
      priority,
      assigneeId,
      dueDate,
      seriesId,
      episodeId,
    },
    user.id
  );

  revalidatePath("/studio");
  revalidatePath("/studio/tasks");
  revalidatePath(`/studio/studios/${studioId}`);

  return { success: true, task };
}

/**
 * Server Action: Quick status transition for tasks.
 */
export async function updateTaskStatusAction(
  taskId: string,
  studioId: string,
  status: TaskStatus
) {
  const user = await requireAuth();
  await requireStudioRole(studioId, "member");

  const task = await updateTask(taskId, studioId, { status }, user.id);

  revalidatePath("/studio");
  revalidatePath("/studio/tasks");
  revalidatePath(`/studio/studios/${studioId}`);

  return { success: true, status: task.status };
}

/**
 * Server Action: Delete a task.
 */
export async function deleteTaskAction(taskId: string, studioId: string) {
  const user = await requireAuth();
  await requireStudioRole(studioId, "member");

  await deleteTask(taskId, studioId, user.id);

  revalidatePath("/studio");
  revalidatePath("/studio/tasks");
  revalidatePath(`/studio/studios/${studioId}`);

  return { success: true };
}
