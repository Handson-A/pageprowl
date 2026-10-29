import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetType, targetId, reason, details } = body;

    if (!targetType || !targetId || !reason) {
      return NextResponse.json(
        { error: "Target type, target ID, and reason are required." },
        { status: 400 }
      );
    }

    const { data: report, error: insertError } = await supabase
      .from("reports")
      .insert({
        reporter_id: user.id,
        target_type: targetType,
        target_id: targetId,
        reason,
        details: details || null,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (error: any) {
    console.error("Report submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit report" },
      { status: 500 }
    );
  }
}
