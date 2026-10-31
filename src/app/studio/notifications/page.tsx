import React from "react";
import { redirect } from "next/navigation";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { NotificationsClient } from "./NotificationsClient";
import { createClient } from "@/lib/supabase/server";
import { getUserNotifications } from "@/lib/data/notifications";
import styles from "@/app/studio/page.module.css";

export default async function NotificationsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/studio/notifications");
  }

  let userName = "Creator";
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  if (profile?.display_name) {
    userName = profile.display_name;
  }

  const notifications = await getUserNotifications(user.id, { limit: 50 });

  return (
    <div className={styles.layout}>
      <CreatorSidebar userName={userName} userRole="Creator" />
      <NotificationsClient initialNotifications={notifications} />
    </div>
  );
}
