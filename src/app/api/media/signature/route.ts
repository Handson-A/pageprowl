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

    let folder = `pageprowl/creators/${user.id}`;
    let tags = ["pageprowl"];

    // If uploading for a series or episode, strictly verify creator permission
    if (seriesId) {
      await requireSeriesRole(seriesId, "editor");

      if (type === "cover") {
        folder = `pageprowl/series/${seriesId}/cover`;
        tags = ["pageprowl", "cover"];
      } else if (episodeId || type === "episode_page") {
        folder = `pageprowl/series/${seriesId}/episodes/${episodeId}`;
        tags = ["pageprowl", "episode_page"];
      } else {
        folder = `pageprowl/series/${seriesId}/uploads`;
        tags = ["pageprowl", "series"];
      }
    } else if (type === "cover") {
      // Draft cover upload for new series creation before seriesId exists
      folder = `pageprowl/creators/${user.id}/covers`;
      tags = ["pageprowl", "cover"];
    } else if (type === "avatar") {
      folder = `pageprowl/users/${user.id}/avatar`;
      tags = ["pageprowl", "avatar"];
    }

    const signatureData = generateUploadSignature(folder, tags);

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
