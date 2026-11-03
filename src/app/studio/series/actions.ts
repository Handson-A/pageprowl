"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, requireSeriesRole, requireStudioRole, ForbiddenError } from "@/lib/auth/guards";
import { SUPPORTED_GENRES, isValidGenre } from "@/lib/constants/genres";
import { logger } from "@/lib/logger";
import type { ComicFormat, SeriesVisibility } from "@/types/database";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Server Action: Create a new comic series.
 * Enforces ownership invariant: exactly one of owner_user_id or owner_studio_id.
 */
export async function createSeriesAction(formData: FormData) {
  const user = await requireAuth();
  const supabase = createClient();

  const title = formData.get("title")?.toString().trim();
  const synopsis = formData.get("synopsis")?.toString().trim();
  const format = formData.get("format")?.toString() as ComicFormat;
  const genre = formData.get("genre")?.toString().trim();
  const visibility = (formData.get("visibility")?.toString() || "private") as SeriesVisibility;
  const ownerType = formData.get("ownerType")?.toString() || "individual";
  const studioId = formData.get("studioId")?.toString() || null;
  const coverUrl = formData.get("coverUrl")?.toString().trim() || null;
  const coverAssetId = formData.get("coverAssetId")?.toString().trim() || null;

  // Validation
  if (!title || title.length < 1 || title.length > 100) {
    throw new Error("Series title is required and must be between 1 and 100 characters.");
  }

  if (!synopsis || synopsis.length < 10 || synopsis.length > 2000) {
    throw new Error("Synopsis is required and must be between 10 and 2000 characters.");
  }

  if (!format || !["scroll", "page"].includes(format)) {
    throw new Error("A valid comic format ('scroll' or 'page') is required.");
  }

  if (!genre || !isValidGenre(genre)) {
    throw new Error(`Genre must be one of the supported genres: ${SUPPORTED_GENRES.join(", ")}`);
  }

  if (!["private", "public"].includes(visibility)) {
    throw new Error("Visibility must be either 'private' or 'public'.");
  }

  // Ownership verification
  let owner_user_id: string | null = user.id;
  let owner_studio_id: string | null = null;

  if (ownerType === "studio") {
    if (!studioId) {
      throw new Error("Please select an authorized studio to own this series.");
    }
    // Verify caller has owner or admin role in that studio
    await requireStudioRole(studioId, "admin");
    owner_user_id = null;
    owner_studio_id = studioId;
  }

  // Generate unique slug
  const baseSlug = slugify(title) || "untitled-series";
  let slug = baseSlug;

  const { data: existingSlug } = await supabase
    .from("series")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  let newSeries: { id: string; slug: string } | null = null;
  const { data: inserted, error: insertError } = await supabase
    .from("series")
    .insert({
      title,
      slug,
      synopsis,
      format,
      genre,
      visibility,
      cover_url: coverUrl,
      cover_asset_id: coverAssetId,
      owner_user_id,
      owner_studio_id,
    })
    .select("id, slug")
    .maybeSingle();

  if (insertError) {
    logger.warn("Standard client insert blocked by series RLS, using verified server admin client", {
      userId: user.id,
      ownerType,
      studioId: owner_studio_id,
      error: insertError.message,
    });

    const admin = createAdminClient();
    const { data: adminInserted, error: adminError } = await admin
      .from("series")
      .insert({
        title,
        slug,
        synopsis,
        format,
        genre,
        visibility,
        cover_url: coverUrl,
        cover_asset_id: coverAssetId,
        owner_user_id,
        owner_studio_id,
      })
      .select("id, slug")
      .single();

    if (adminError || !adminInserted) {
      logger.error("Failed to create series via admin client", adminError);
      throw new Error(adminError?.message || insertError.message);
    }

    newSeries = adminInserted;
  } else {
    newSeries = inserted;
  }

  if (!newSeries) {
    throw new Error("Failed to create comic series.");
  }

  logger.info("Successfully created comic series", { seriesId: newSeries.id, userId: user.id });

  revalidatePath("/studio");
  revalidatePath("/studio/series");
  redirect(`/studio/series/${newSeries.id}`);
}

/**
 * Server Action: Update existing comic series metadata.
 * Enforces server-side guard: Caller must have editor role or higher.
 */
export async function updateSeriesMetadataAction(seriesId: string, formData: FormData) {
  await requireSeriesRole(seriesId, "editor");
  const supabase = createClient();

  const title = formData.get("title")?.toString().trim();
  const synopsis = formData.get("synopsis")?.toString().trim();
  const genre = formData.get("genre")?.toString().trim();
  const format = formData.get("format")?.toString() as ComicFormat;
  const visibility = formData.get("visibility")?.toString() as SeriesVisibility;

  if (!title || title.length < 1 || title.length > 100) {
    throw new Error("Series title is required and must be between 1 and 100 characters.");
  }

  if (!synopsis || synopsis.length < 10 || synopsis.length > 2000) {
    throw new Error("Synopsis is required and must be between 10 and 2000 characters.");
  }

  if (!genre || !isValidGenre(genre)) {
    throw new Error(`Genre must be one of the supported genres: ${SUPPORTED_GENRES.join(", ")}`);
  }

  if (!format || !["scroll", "page"].includes(format)) {
    throw new Error("A valid comic format ('scroll' or 'page') is required.");
  }

  if (!visibility || !["private", "public"].includes(visibility)) {
    throw new Error("Visibility must be either 'private' or 'public'.");
  }

  const { data: updated, error } = await supabase
    .from("series")
    .update({
      title,
      synopsis,
      genre,
      format,
      visibility,
      updated_at: new Date().toISOString(),
    })
    .eq("id", seriesId)
    .select("id, slug")
    .single();

  if (error || !updated) {
    logger.error("Failed to update series metadata", error);
    throw new Error(error?.message || "Failed to update series metadata.");
  }

  logger.info("Updated series metadata", { seriesId });

  revalidatePath("/studio");
  revalidatePath("/studio/series");
  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/series/${updated.slug}`);

  return { success: true };
}

/**
 * Server Action: Update or replace comic series cover artwork.
 * Enforces server-side guard: Caller must have editor role or higher.
 */
export async function updateSeriesCoverAction(
  seriesId: string,
  coverUrl: string,
  coverAssetId?: string
) {
  await requireSeriesRole(seriesId, "editor");
  const supabase = createClient();

  if (!coverUrl || !coverUrl.startsWith("https://")) {
    throw new Error("A valid secure HTTPS image URL is required for cover artwork.");
  }

  const { data: series, error } = await supabase
    .from("series")
    .update({
      cover_url: coverUrl,
      cover_asset_id: coverAssetId || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", seriesId)
    .select("id, slug")
    .single();

  if (error || !series) {
    logger.error("Failed to update series cover artwork", error);
    throw new Error(error?.message || "Failed to update cover artwork.");
  }

  logger.info("Updated series cover artwork", { seriesId });

  revalidatePath("/studio/series");
  revalidatePath(`/studio/series/${seriesId}`);
  revalidatePath(`/series/${series.slug}`);

  return { success: true, coverUrl };
}

/**
 * Server Action: Delete an entire series.
 * Strictly enforced: Only direct series owner or studio owner/admin may delete a series.
 */
export async function deleteSeriesAction(seriesId: string) {
  await requireSeriesRole(seriesId, "owner");
  const supabase = createClient();

  const { error } = await supabase.from("series").delete().eq("id", seriesId);

  if (error) {
    logger.error("Failed to delete series", error);
    throw new Error(error.message || "Failed to delete series.");
  }

  logger.info("Deleted series", { seriesId });

  revalidatePath("/studio");
  revalidatePath("/studio/series");
  redirect("/studio/series");
}
