import React from "react";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { TasksWorkspaceClient } from "./TasksWorkspaceClient";
import { getCachedAuthUser } from "@/lib/supabase/server";
import { getUserStudios, getStudioMembers, getStudioSeries } from "@/lib/data/studios";
import { getStudioTasks } from "@/lib/data/tasks";

interface TasksPageProps {
  searchParams?: {
    studioId?: string;
    taskId?: string;
  };
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const user = await getCachedAuthUser();

  if (!user) {
    redirect("/login?redirect=/studio/tasks");
  }

  // Fetch studios user belongs to
  const userStudios = await getUserStudios(user.id);

  if (userStudios.length === 0) {
    // If user has not created or joined a studio yet, prompt them to create one
    redirect("/studio/studios/new");
  }

  const currentStudioId =
    searchParams?.studioId && userStudios.some((s) => s.id === searchParams.studioId)
      ? searchParams.studioId
      : userStudios[0].id;

  const [initialTasks, studioMembers, studioSeries] = await Promise.all([
    getStudioTasks(currentStudioId),
    getStudioMembers(currentStudioId),
    getStudioSeries(currentStudioId),
  ]);

  return (
    <TasksWorkspaceClient
      initialTasks={initialTasks}
      studios={userStudios.map((s) => ({ id: s.id, name: s.name }))}
      currentStudioId={currentStudioId}
      studioMembers={studioMembers.map((m) => ({
        user_id: m.user_id,
        display_name: m.display_name,
        username: m.username,
      }))}
      seriesList={studioSeries.map((s) => ({ id: s.id, title: s.title }))}
      currentUserId={user.id}
    />
  );
}
