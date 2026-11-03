import React from "react";
import { redirect } from "next/navigation";
import { NotificationsClient } from "./NotificationsClient";
import { getCachedAuthUser } from "@/lib/supabase/server";
import { getUserNotifications } from "@/lib/data/notifications";

export default async function NotificationsPage() {
  const user = await getCachedAuthUser();

  if (!user) {
    redirect("/login?redirect=/studio/notifications");
  }

  const notifications = await getUserNotifications(user.id, { limit: 50 });

  return <NotificationsClient initialNotifications={notifications} />;
}
