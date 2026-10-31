"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import pageStyles from "@/app/studio/page.module.css";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  createTaskAction,
  updateTaskStatusAction,
  deleteTaskAction,
} from "./actions";
import { postResourceCommentAction } from "@/app/studio/reviews/actions";
import {
  LuPlus,
  LuKanban,
  LuList,
  LuSearch,
  LuX,
  LuClock,
  LuCheck,
  LuMessageSquare,
  LuSend,
  LuTrash2,
  LuCornerDownRight,
} from "react-icons/lu";
import type { TaskWithDetails, TaskStatus, TaskPriority } from "@/lib/data/tasks";

interface TasksWorkspaceClientProps {
  initialTasks: TaskWithDetails[];
  studios: { id: string; name: string }[];
  currentStudioId: string;
  studioMembers: { user_id: string; display_name: string; username: string }[];
  seriesList: { id: string; title: string }[];
  currentUserId: string;
}

const KANBAN_COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "in_review", label: "In Review" },
  { key: "done", label: "Done" },
];

export function TasksWorkspaceClient({
  initialTasks,
  studios,
  currentStudioId,
  studioMembers,
  seriesList,
  currentUserId,
}: TasksWorkspaceClientProps) {
  const [tasks, setTasks] = useState<TaskWithDetails[]>(initialTasks);
  const [view, setView] = useState<"board" | "list">("board");
  const [selectedStudioId, setSelectedStudioId] = useState(currentStudioId);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskWithDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // New task form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [parentTaskId, setParentTaskId] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);

  // Subtask creation state inside active task modal
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // Task comment state inside active task modal
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [taskComments, setTaskComments] = useState<any[]>([]);

  // Filter tasks in memory
  const filteredTasks = tasks.filter((task) => {
    if (selectedStudioId && task.studio_id !== selectedStudioId) return false;
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    if (assigneeFilter !== "all") {
      if (assigneeFilter === "unassigned" && task.assignee_id !== null) return false;
      if (assigneeFilter !== "unassigned" && task.assignee_id !== assigneeFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  // Eligible parent tasks: tasks that are NOT already subtasks (1-level nesting rule)
  const eligibleParentTasks = tasks.filter((t) => t.parent_task_id === null);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (typeof window !== "undefined" && !navigator.onLine) {
      setFormError("You are currently offline. Please reconnect to create tasks.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("description", description);
      formData.set("status", status);
      formData.set("priority", priority);
      if (assigneeId) formData.set("assigneeId", assigneeId);
      if (dueDate) formData.set("dueDate", dueDate);
      if (seriesId) formData.set("seriesId", seriesId);
      if (parentTaskId) formData.set("parentTaskId", parentTaskId);
      collaborators.forEach((c) => formData.append("collaboratorIds", c));

      const res = await createTaskAction(selectedStudioId, formData);
      if (res.task) {
        setTasks([res.task, ...tasks]);
      }
      setIsNewTaskOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err?.message || "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId: string, targetStatus: TaskStatus) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      alert("You are currently offline. Please reconnect to update task status.");
      return;
    }
    try {
      await updateTaskStatusAction(taskId, selectedStudioId, targetStatus);
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
      );
      if (activeTask && activeTask.id === taskId) {
        setActiveTask({ ...activeTask, status: targetStatus });
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update status.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      alert("You are currently offline. Please reconnect to delete tasks.");
      return;
    }
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTaskAction(taskId, selectedStudioId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      if (activeTask?.id === taskId) {
        setActiveTask(null);
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete task.");
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !newSubtaskTitle.trim()) return;
    if (typeof window !== "undefined" && !navigator.onLine) {
      alert("You are currently offline. Please reconnect to add subtasks.");
      return;
    }

    setIsAddingSubtask(true);
    try {
      const formData = new FormData();
      formData.set("title", newSubtaskTitle.trim());
      formData.set("parentTaskId", activeTask.id);
      formData.set("status", "todo");
      formData.set("priority", activeTask.priority);
      if (activeTask.series_id) formData.set("seriesId", activeTask.series_id);

      const res = await createTaskAction(activeTask.studio_id, formData);
      if (res.task) {
        setTasks([...tasks, res.task]);
        setActiveTask({
          ...activeTask,
          subtasks: [...(activeTask.subtasks || []), res.task],
          subtask_count: (activeTask.subtask_count || 0) + 1,
        });
        setNewSubtaskTitle("");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to add subtask.");
    } finally {
      setIsAddingSubtask(false);
    }
  };

  const handlePostTaskComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !newComment.trim()) return;
    if (typeof window !== "undefined" && !navigator.onLine) {
      alert("You are currently offline. Please reconnect to post comments.");
      return;
    }

    setIsPostingComment(true);
    try {
      const formData = new FormData();
      formData.set("content", newComment.trim());
      formData.set("taskId", activeTask.id);
      formData.set("studioId", activeTask.studio_id);

      const res = await postResourceCommentAction(formData);
      if (res.comment) {
        setTaskComments([...taskComments, res.comment]);
        setNewComment("");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to post comment.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("medium");
    setAssigneeId("");
    setDueDate("");
    setSeriesId("");
    setParentTaskId("");
    setCollaborators([]);
    setFormError(null);
  };

  return (
    <main className={styles.tasksMain}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Production Tasks &amp; Board</h1>
          <p className={styles.subtitle}>
            Coordinate workload, assign team members, and track editorial progress across chapters.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsNewTaskOpen(true)}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <LuPlus size={16} aria-hidden="true" />
            <span>Create Task</span>
          </span>
        </Button>
      </header>

      {/* Control Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filtersGroup}>
          {studios.length > 1 && (
            <select
              className={styles.selectInput}
              value={selectedStudioId}
              onChange={(e) => setSelectedStudioId(e.target.value)}
              aria-label="Filter by Studio Workspace"
            >
              {studios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          <select
            className={styles.selectInput}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Task Status"
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>

          <select
            className={styles.selectInput}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by Priority"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            className={styles.selectInput}
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            aria-label="Filter by Assignee"
          >
            <option value="all">All Assignees</option>
            <option value={currentUserId}>Assigned to Me</option>
            <option value="unassigned">Unassigned</option>
            {studioMembers.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.display_name}
              </option>
            ))}
          </select>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search tasks..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* View Switcher: Kanban Board vs List Table */}
        <div className={styles.viewToggle}>
          <button
            type="button"
            className={`${styles.viewBtn} ${view === "board" ? styles.viewBtnActive : ""}`}
            onClick={() => setView("board")}
          >
            <LuKanban size={14} aria-hidden="true" />
            <span>Board</span>
          </button>
          <button
            type="button"
            className={`${styles.viewBtn} ${view === "list" ? styles.viewBtnActive : ""}`}
            onClick={() => setView("list")}
          >
            <LuList size={14} aria-hidden="true" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Main Task Display Area */}
      {view === "board" ? (
        <section className={styles.kanbanBoard}>
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <span className={styles.columnTitle}>
                    {col.label}
                    <span className={styles.countPill}>{colTasks.length}</span>
                  </span>
                </div>

                <div className={styles.cardsContainer}>
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className={styles.taskCard}
                      onClick={() => setActiveTask(t)}
                    >
                      <div className={styles.badgeRow}>
                        <span
                          className={`${pageStyles.priorityBadge} ${
                            t.priority === "urgent"
                              ? pageStyles.priorityUrgent
                              : t.priority === "high"
                              ? pageStyles.priorityHigh
                              : t.priority === "medium"
                              ? pageStyles.priorityMedium
                              : pageStyles.priorityLow
                          }`}
                        >
                          {t.priority}
                        </span>
                        {t.series && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "var(--color-text-muted)",
                              textTransform: "uppercase",
                              fontWeight: 600,
                            }}
                          >
                            {t.series.title}
                          </span>
                        )}
                      </div>

                      <h3 className={styles.taskCardTitle}>{t.title}</h3>

                      <div className={styles.taskCardMeta}>
                        <span>
                          {t.assignee ? t.assignee.display_name : "Unassigned"}
                        </span>
                        {t.due_date && (
                          <span>Due {new Date(t.due_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div
                      style={{
                        padding: "var(--space-6)",
                        textAlign: "center",
                        color: "var(--color-text-muted)",
                        fontSize: "var(--font-size-xs)",
                      }}
                    >
                      No tasks in {col.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        /* List View */
        <div className={styles.tasksTableWrapper}>
          <table className={styles.tasksTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Series</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => (
                  <tr key={t.id} onClick={() => setActiveTask(t)} style={{ cursor: "pointer" }}>
                    <td>
                      <strong>{t.title}</strong>
                      {t.parent_task_id && (
                        <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                          ↳ Subtask
                        </div>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={t.status as any} />
                    </td>
                    <td>
                      <span
                        className={`${pageStyles.priorityBadge} ${
                          t.priority === "urgent"
                            ? pageStyles.priorityUrgent
                            : t.priority === "high"
                            ? pageStyles.priorityHigh
                            : t.priority === "medium"
                            ? pageStyles.priorityMedium
                            : pageStyles.priorityLow
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td>{t.assignee?.display_name || "Unassigned"}</td>
                    <td>{t.series?.title || "—"}</td>
                    <td>
                      {t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTask(t);
                        }}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "var(--space-6)" }}>
                    No tasks match the active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create New Task */}
      {isNewTaskOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsNewTaskOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create Production Task</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsNewTaskOpen(false)}
                aria-label="Close dialog"
              >
                <LuX />
              </button>
            </div>

            {formError && (
              <div style={{ color: "var(--color-danger)", fontSize: "var(--font-size-xs)" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <FormField label="Task Title" required htmlFor="title">
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Inking line art for Chapter 4 pages 1-10"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Description" htmlFor="description">
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Task instructions or reference notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormField>

              <div className={styles.formGrid}>
                <FormField label="Initial Status" htmlFor="status">
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </FormField>

                <FormField label="Priority" htmlFor="priority">
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </FormField>
              </div>

              <div className={styles.formGrid}>
                <FormField label="Primary Assignee" htmlFor="assignee">
                  <select
                    id="assignee"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {studioMembers.map((m) => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.display_name} (@{m.username})
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Due Date" htmlFor="dueDate">
                  <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </FormField>
              </div>

              <div className={styles.formGrid}>
                <FormField label="Linked Series (Optional)" htmlFor="series">
                  <select
                    id="series"
                    value={seriesId}
                    onChange={(e) => setSeriesId(e.target.value)}
                  >
                    <option value="">General Studio Task</option>
                    {seriesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Parent Task (1-level subtask nesting)"
                  htmlFor="parentTask"
                >
                  <select
                    id="parentTask"
                    value={parentTaskId}
                    onChange={(e) => setParentTaskId(e.target.value)}
                  >
                    <option value="">Top-Level Task</option>
                    {eligibleParentTasks.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.title}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsNewTaskOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Drawer: Task Detail, Subtasks & Comments */}
      {activeTask && (
        <div className={styles.modalOverlay} onClick={() => setActiveTask(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span
                  className={`${pageStyles.priorityBadge} ${
                    activeTask.priority === "urgent"
                      ? pageStyles.priorityUrgent
                      : activeTask.priority === "high"
                      ? pageStyles.priorityHigh
                      : activeTask.priority === "medium"
                      ? pageStyles.priorityMedium
                      : pageStyles.priorityLow
                  }`}
                >
                  {activeTask.priority}
                </span>
                <h2 className={styles.modalTitle} style={{ marginTop: "var(--space-2)" }}>
                  {activeTask.title}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setActiveTask(null)}
                aria-label="Close task details"
              >
                <LuX />
              </button>
            </div>

            {activeTask.description && (
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text)", whiteSpace: "pre-line" }}>
                {activeTask.description}
              </p>
            )}

            {/* Quick Status Bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3) 0", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
              <span style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-bold)", color: "var(--color-text-muted)" }}>
                CURRENT STATUS:
              </span>
              <select
                value={activeTask.status}
                onChange={(e) => handleStatusChange(activeTask.id, e.target.value as TaskStatus)}
                className={styles.selectInput}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>

              {activeTask.assignee && (
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", marginLeft: "auto" }}>
                  Assigned to: <strong>{activeTask.assignee.display_name}</strong>
                </span>
              )}
            </div>

            {/* Subtasks Section (Enforced 1-level Nesting) */}
            {activeTask.parent_task_id === null && (
              <div style={{ marginTop: "var(--space-2)" }}>
                <h4 style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", marginBottom: "var(--space-2)" }}>
                  Subtasks ({activeTask.subtasks?.length || 0})
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                  {activeTask.subtasks && activeTask.subtasks.length > 0 ? (
                    activeTask.subtasks.map((st) => (
                      <div
                        key={st.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "var(--space-2) var(--space-3)",
                          backgroundColor: "var(--color-surface-muted)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "var(--font-size-xs)",
                        }}
                      >
                        <span style={{ textDecoration: st.status === "done" ? "line-through" : "none" }}>
                          {st.title}
                        </span>
                        <select
                          value={st.status}
                          onChange={(e) => handleStatusChange(st.id, e.target.value as TaskStatus)}
                          className={styles.selectInput}
                          style={{ padding: "2px 6px", fontSize: "11px" }}
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                      No subtasks added yet.
                    </span>
                  )}
                </div>

                {/* Add Subtask input */}
                <form onSubmit={handleAddSubtask} style={{ display: "flex", gap: "var(--space-2)" }}>
                  <input
                    type="text"
                    placeholder="Add a checklist subtask..."
                    className={styles.searchInput}
                    style={{ flex: 1 }}
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  />
                  <Button type="submit" variant="secondary" size="sm" disabled={isAddingSubtask}>
                    Add
                  </Button>
                </form>
              </div>
            )}

            {/* Task Comments & Mentions Section */}
            <div style={{ marginTop: "var(--space-4)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)" }}>
              <h4 style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-bold)", marginBottom: "var(--space-2)", display: "flex", alignItems: "center", gap: "6px" }}>
                <LuMessageSquare size={16} />
                <span>Discussion &amp; Mentions</span>
              </h4>

              <form onSubmit={handlePostTaskComment} style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                <input
                  type="text"
                  placeholder="Post comment or mention @teammate..."
                  className={styles.searchInput}
                  style={{ flex: 1 }}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button type="submit" variant="primary" size="sm" disabled={isPostingComment}>
                  <LuSend size={14} />
                </Button>
              </form>
            </div>

            {/* Delete Task Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-4)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-3)" }}>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteTask(activeTask.id)}
              >
                <LuTrash2 size={14} style={{ marginRight: "4px" }} />
                <span>Delete Task</span>
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setActiveTask(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
