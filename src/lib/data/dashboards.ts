import { createClient } from "../supabase/server";
import { getUserAssignedTasks, getStudioTasks, type TaskWithDetails } from "./tasks";
import { getUserAssignedReviews, getStudioReviewRequests, type ReviewRequestWithDetails } from "./workflows";
import { getUserRecentActivity, getStudioActivity, type ActivityEventWithActor } from "./activity";
import type { EpisodeProductionStatus, TaskStatus } from "../../types/database";

export interface PersonalDashboardData {
  myTasks: TaskWithDetails[];
  dueSoonTasks: TaskWithDetails[];
  needsAttention: {
    overdueTasks: TaskWithDetails[];
    pendingReviews: ReviewRequestWithDetails[];
    inReviewTasks: TaskWithDetails[];
  };
  myReviews: ReviewRequestWithDetails[];
  recentActivity: ActivityEventWithActor[];
}

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

export interface StudioDashboardData {
  studio: any;
  episodesByStage: Record<EpisodeProductionStatus, any[]>;
  taskProgress: {
    total: number;
    backlog: number;
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
    completionPercentage: number;
  };
  itemsAwaitingReview: ReviewRequestWithDetails[];
  overdueTasks: TaskWithDetails[];
  teamWorkload: TeamMemberWorkload[];
  recentActivity: ActivityEventWithActor[];
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

/**
 * Fetch all data for the personal creator dashboard.
 */
export async function getPersonalDashboardData(userId: string): Promise<PersonalDashboardData> {
  const [allAssignedTasks, assignedReviews, recentActivity] = await Promise.all([
    getUserAssignedTasks(userId, { limit: 50 }),
    getUserAssignedReviews(userId, { status: "pending" }),
    getUserRecentActivity(userId, 10),
  ]);

  const now = new Date().getTime();
  const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;

  // Filter tasks
  const activeTasks = allAssignedTasks.filter((t) => t.status !== "done");

  const dueSoonTasks = activeTasks.filter((t) => {
    if (!t.due_date) return false;
    const dueTime = new Date(t.due_date).getTime();
    return dueTime >= now && dueTime <= sevenDaysFromNow;
  });

  const overdueTasks = activeTasks.filter((t) => {
    if (!t.due_date) return false;
    return new Date(t.due_date).getTime() < now;
  });

  const inReviewTasks = allAssignedTasks.filter((t) => t.status === "in_review");

  return {
    myTasks: allAssignedTasks,
    dueSoonTasks,
    needsAttention: {
      overdueTasks,
      pendingReviews: assignedReviews,
      inReviewTasks,
    },
    myReviews: assignedReviews,
    recentActivity,
  };
}

/**
 * Fetch all workspace-level production data for a studio.
 */
export async function getStudioDashboardData(studioId: string): Promise<StudioDashboardData | null> {
  const supabase = createClient();

  // 1. Fetch Studio details
  const { data: studio } = await supabase
    .from("studios")
    .select("*")
    .eq("id", studioId)
    .single();

  if (!studio) return null;

  // 2. Fetch studio members
  const { data: membersData } = await supabase
    .from("studio_members")
    .select(`
      user_id,
      role,
      profiles:user_id (id, display_name, username, avatar_url)
    `)
    .eq("studio_id", studioId);

  const members = (membersData || []).map((m: any) => ({
    user_id: m.user_id,
    role: m.role,
    display_name: m.profiles?.display_name || "Team Member",
    username: m.profiles?.username || "user",
    avatar_url: m.profiles?.avatar_url || null,
  }));

  // 3. Fetch studio series and episodes
  const { data: seriesList } = await supabase
    .from("series")
    .select("id, title, slug")
    .eq("owner_studio_id", studioId);

  const seriesIds = (seriesList || []).map((s) => s.id);

  let episodes: any[] = [];
  if (seriesIds.length > 0) {
    const { data: epData } = await supabase
      .from("episodes")
      .select(`
        id,
        title,
        episode_number,
        slug,
        status,
        series_id,
        series:series_id (title, slug)
      `)
      .in("series_id", seriesIds)
      .order("updated_at", { ascending: false });

    if (epData) {
      episodes = epData;
    }
  }

  // 4. Group episodes by stage
  const episodesByStage: Record<EpisodeProductionStatus, any[]> = {
    draft: [],
    in_production: [],
    in_review: [],
    revisions_required: [],
    approved: [],
    published: [],
  };

  episodes.forEach((ep) => {
    const stage = (ep.status || "draft") as EpisodeProductionStatus;
    if (episodesByStage[stage]) {
      episodesByStage[stage].push(ep);
    } else {
      episodesByStage.draft.push(ep);
    }
  });

  // 5. Fetch studio tasks
  const tasks = await getStudioTasks(studioId);

  const taskProgress = {
    total: tasks.length,
    backlog: tasks.filter((t) => t.status === "backlog").length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    inReview: tasks.filter((t) => t.status === "in_review").length,
    done: tasks.filter((t) => t.status === "done").length,
    completionPercentage:
      tasks.length > 0
        ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100)
        : 0,
  };

  // 6. Overdue tasks
  const now = new Date().getTime();
  const overdueTasks = tasks.filter(
    (t) => t.status !== "done" && t.due_date && new Date(t.due_date).getTime() < now
  );

  // 7. Awaiting review
  const reviewRequests = await getStudioReviewRequests(studioId, { status: "pending" });

  // 8. Team workload
  const teamWorkload = computeTeamWorkload(members, tasks);

  // 9. Recent studio activity
  const recentActivity = await getStudioActivity(studioId, 15);

  return {
    studio,
    episodesByStage,
    taskProgress,
    itemsAwaitingReview: reviewRequests,
    overdueTasks,
    teamWorkload,
    recentActivity,
  };
}
