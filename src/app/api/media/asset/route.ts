import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireSeriesRole } from "@/lib/auth/guards";

const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"];
const MAX_BYTE_SIZE = 10 * 1024 * 1024; // 10MB

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

    const body = await request.json().catch(() => ({}));
    const {
      cloudinaryPublicId,
      format,
      width,
      height,
      byteSize,
      secureUrl,
      seriesId,
    } = body;

    if (!cloudinaryPublicId || typeof cloudinaryPublicId !== "string") {
      return NextResponse.json(
        { error: "Cloudinary public identifier is required." },
        { status: 400 }
      );
    }

    if (!secureUrl || typeof secureUrl !== "string" || !secureUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "A valid secure HTTPS image URL is required." },
        { status: 400 }
      );
    }

    const cleanFormat = (format || "jpg").toLowerCase().replace(/^\./, "");
    if (!ALLOWED_IMAGE_FORMATS.includes(cleanFormat)) {
      return NextResponse.json(
        { error: `Unsupported image format '${cleanFormat}'. Allowed formats: ${ALLOWED_IMAGE_FORMATS.join(", ")}` },
        { status: 400 }
      );
    }

    if (byteSize && Number(byteSize) > MAX_BYTE_SIZE) {
      return NextResponse.json(
        { error: "Image file size exceeds maximum permitted limit of 10MB." },
        { status: 400 }
      );
    }

    // Verify series permission if specified
    if (seriesId) {
      await requireSeriesRole(seriesId, "editor");
    }

    // Insert or fetch existing media asset
    const { data: asset, error: insertError } = await supabase
      .from("media_assets")
      .insert({
        uploader_id: user.id,
        cloudinary_public_id: cloudinaryPublicId,
        resource_type: "image",
        format: cleanFormat,
        width: width ? Number(width) : null,
        height: height ? Number(height) : null,
        byte_size: byteSize ? Number(byteSize) : null,
        secure_url: secureUrl,
        is_restricted: false,
      })
      .select()
      .single();

    if (insertError) {
      // If already inserted (conflict on cloudinary_public_id), fetch existing
      if (insertError.code === "23505") {
        const { data: existing } = await supabase
          .from("media_assets")
          .select("*")
          .eq("cloudinary_public_id", cloudinaryPublicId)
          .single();

        if (existing) {
          return NextResponse.json({ asset: existing });
        }
      }

      console.error("Failed to record media asset:", insertError);
      return NextResponse.json(
        { error: insertError.message || "Failed to save media asset reference." },
        { status: 500 }
      );
    }

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error: any) {
    console.error("Media asset registration error:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { error: error?.message || "Failed to register media asset." },
      { status }
    );
  }
}
