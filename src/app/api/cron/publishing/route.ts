import { NextResponse } from "next/server";
import { processScheduledReleases } from "@/lib/data/publishing";

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
    const result = await processScheduledReleases();

    return NextResponse.json({
      success: true,
      processedCount: result.processedCount,
      processedIds: result.processedIds,
      errors: result.errors,
    });
  } catch (error: any) {
    console.error("Scheduled publishing worker error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
