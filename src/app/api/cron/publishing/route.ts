import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Vercel Cron Endpoint for scheduled comic publications.
 * Invoked according to vercel.json cron schedule.
 */
export async function GET(request: Request) {
  // Validate authorization secret if configured
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // Query due publications
    const now = new Date().toISOString();
    const { data: duePublications, error: fetchError } = await supabase
      .from("scheduled_publications")
      .select("id, episode_id, revision_id")
      .eq("status", "scheduled")
      .lte("scheduled_for", now)
      .limit(10);

    if (fetchError) {
      console.error("Error fetching due publications:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch due publications" },
        { status: 500 }
      );
    }

    const processedIds: string[] = [];

    // Process each publication idempotently
    for (const pub of duePublications || []) {
      try {
        // Mark as processing
        await supabase
          .from("scheduled_publications")
          .update({ status: "processing" })
          .eq("id", pub.id);

        // Update episode published revision
        await supabase
          .from("episodes")
          .update({ published_revision_id: pub.revision_id })
          .eq("id", pub.episode_id);

        // Update revision status to published
        await supabase
          .from("episode_revisions")
          .update({ status: "published" })
          .eq("id", pub.revision_id);

        // Mark scheduled publication as completed
        await supabase
          .from("scheduled_publications")
          .update({
            status: "completed",
            executed_at: new Date().toISOString(),
          })
          .eq("id", pub.id);

        processedIds.push(pub.id);
      } catch (err: any) {
        console.error(`Failed to execute publication ${pub.id}:`, err);
        await supabase
          .from("scheduled_publications")
          .update({
            status: "failed",
            error_message: err?.message || "Execution failed",
          })
          .eq("id", pub.id);
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: processedIds.length,
      processedIds,
    });
  } catch (error: any) {
    console.error("Scheduled publishing worker error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
