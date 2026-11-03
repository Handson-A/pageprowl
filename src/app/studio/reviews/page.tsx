import React from "react";
import { redirect } from "next/navigation";
import { ReviewsClient } from "./ReviewsClient";
import { createClient, getCachedAuthUser } from "@/lib/supabase/server";
import { getUserStudios } from "@/lib/data/studios";
import { getStudioReviewRequests, type ReviewRequestWithDetails } from "@/lib/data/workflows";

export default async function StudioReviewsPage() {
  const supabase = createClient();
  const user = await getCachedAuthUser();

  if (!user) {
    redirect("/login?redirect=/studio/reviews");
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
    <ReviewsClient
      initialRequests={allRequests}
      initialComments={comments}
      currentUserId={user.id}
    />
  );
}
