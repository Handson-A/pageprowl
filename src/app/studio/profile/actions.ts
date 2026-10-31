"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/guards";
import { logger } from "@/lib/logger";

/**
 * Update authenticated user profile and creator profile.
 * Security: Identity is derived from session on the server.
 * Platform role field cannot be altered by normal user.
 */
export async function updateProfileFormAction(formData: FormData) {
  const user = await requireAuth();
  const supabase = createClient();

  const displayName = formData.get("display_name")?.toString().trim();
  const bio = formData.get("bio")?.toString().trim() || null;
  const avatarUrl = formData.get("avatar_url")?.toString().trim() || null;
  const penName = formData.get("pen_name")?.toString().trim();
  const websiteUrl = formData.get("website_url")?.toString().trim() || null;

  if (!displayName || displayName.length < 2) {
    throw new Error("Display name must be at least 2 characters.");
  }

  if (displayName.length > 50) {
    throw new Error("Display name cannot exceed 50 characters.");
  }

  if (bio && bio.length > 500) {
    throw new Error("Bio cannot exceed 500 characters.");
  }

  if (websiteUrl && !websiteUrl.startsWith("http://") && !websiteUrl.startsWith("https://")) {
    throw new Error("Website URL must start with http:// or https://");
  }

  // Update base profile (Notice: role is NOT included here, protecting against escalation)
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      bio,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    logger.error("Failed to update profile", profileError, { userId: user.id });
    throw new Error(profileError.message || "Failed to update profile.");
  }

  // If pen_name is provided, upsert creator_profiles
  if (penName && penName.length >= 2) {
    const { error: creatorError } = await supabase
      .from("creator_profiles")
      .upsert({
        id: user.id,
        pen_name: penName,
        website_url: websiteUrl,
        updated_at: new Date().toISOString(),
      });

    if (creatorError) {
      logger.error("Failed to update creator profile", creatorError, { userId: user.id });
      throw new Error(creatorError.message || "Failed to update creator profile.");
    }
  }

  logger.info("Successfully updated user profile", { userId: user.id });

  revalidatePath("/studio/profile");
  revalidatePath("/studio");
}
