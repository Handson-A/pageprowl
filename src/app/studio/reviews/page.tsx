import React from "react";
import { redirect } from "next/navigation";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { ReviewsClient } from "./ReviewsClient";
import { createClient } from "@/lib/supabase/server";
import { getUserStudios } from "@/lib/data/studios";
import { getStudioReviewRequests, type ReviewRequestWithDetails } from "@/lib/data/workflows";
import styles from "@/app/studio/page.module.css";

export default async function StudioReviewsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/studio/reviews");
  }

  // Fetch user profile
  let userName = "Creator";
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  if (profile?.display_name) {
    userName = profile.display_name;
  }

  // Fetch user studios
  const userStudios = await getUserStudios(user.id);

  let allRequests: ReviewRequestWithDetails[] = [];
  if (userStudios.length > 0) {
    const requestLists = await Promise.all(
      userStudios.map((s) => getStudioReviewRequests(s.id))
    );
    allRequests = requestLists.flat();
  }

  // Fetch comments
  let comments: any[] = [];
  const { data } = await supabase
    .from("review_comments")
    .select(`
      id,
      content,
      status,
      created_at,
      profiles:user_id (display_name),
      episode_revisions:revision_id (
        id,
        revision_number,
        episodes:episode_id (
          id,
          title,
          series:series_id (id, title)
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(30);

  if (data) {
    comments = data;
  }

  return (
    <div className={styles.layout}>
      <CreatorSidebar userName={userName} userRole="Creator" />
      <ReviewsClient
        initialRequests={allRequests}
        initialComments={comments}
        currentUserId={user.id}
      />
    </div>
  );
}
