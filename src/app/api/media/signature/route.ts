import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateUploadSignature } from "@/lib/cloudinary/server";
import { requireSeriesRole } from "@/lib/auth/guards";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Enforce server-side authentication
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { seriesId, type, episodeId } = body;

    let folder = `panelverse/creators/${user.id}`;

    // If uploading for a series or episode, strictly verify creator permission
    if (seriesId) {
      await requireSeriesRole(seriesId, "editor");

      if (type === "cover") {
        folder = `panelverse/series/${seriesId}/cover`;
      } else if (episodeId) {
        folder = `panelverse/series/${seriesId}/episodes/${episodeId}`;
      } else {
        folder = `panelverse/series/${seriesId}/uploads`;
      }
    }

    const signatureData = generateUploadSignature(folder);

    return NextResponse.json(signatureData);
  } catch (error: any) {
    console.error("Signature generation error:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { error: error?.message || "Failed to generate upload signature" },
      { status }
    );
  }
}
