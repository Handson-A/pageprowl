import React from "react";
import { redirect } from "next/navigation";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { createClient } from "@/lib/supabase/server";
import { NewStudioClient } from "./NewStudioClient";
import styles from "@/app/studio/page.module.css";

export default async function NewStudioPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=" + encodeURIComponent("/studio/studios/new"));
  }

  // Fetch user profile for sidebar
  let userName = "Creator";
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  if (profile?.display_name) {
    userName = profile.display_name;
  }

  return (
    <div className={styles.layout}>
      <CreatorSidebar userName={userName} userRole="Creator" />

      <main className={styles.main}>
        <NewStudioClient />
      </main>
    </div>
  );
}
