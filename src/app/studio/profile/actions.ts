"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/guards";
import { logger } from "@/lib/logger";

/**
 * Update authenticated user avatar via Cloudinary secure delivery URL.
 */
export async function updateAvatarAction(
  secureUrl: string,
  _cloudinaryPublicId?: string
) {
  const user = await requireAuth();
  const supabase = createClient();

  if (!secureUrl || typeof secureUrl !== "string" || !secureUrl.startsWith("https://")) {
    throw new Error("A valid secure HTTPS image URL is required for the avatar.");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      avatar_url: secureUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    logger.error("Failed to update avatar", profileError, { userId: user.id });
    throw new Error(profileError.message || "Failed to update user avatar.");
  }

  logger.info("Successfully updated user avatar", { userId: user.id, secureUrl });

  revalidatePath("/studio/profile");
  revalidatePath("/studio");
  revalidatePath("/account");
  revalidatePath("/library");

  return { success: true, avatarUrl: secureUrl };
}

/**
 * Update user identity profile fields (display name, bio, pen name, website).
 */
export async function updateProfileIdentityAction(data: {
  displayName: string;
  bio?: string | null;
  penName?: string | null;
  websiteUrl?: string | null;
}) {
  const user = await requireAuth();
  const supabase = createClient();

  const displayName = data.displayName?.trim();
  const bio = data.bio?.trim() || null;
  const penName = data.penName?.trim() || null;
  const websiteUrl = data.websiteUrl?.trim() || null;

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
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    logger.error("Failed to update profile", profileError, { userId: user.id });
    throw new Error(profileError.message || "Failed to update profile.");
  }

  // If pen_name or website is provided, upsert creator_profiles
  if (penName || websiteUrl) {
    const { error: creatorError } = await supabase
      .from("creator_profiles")
      .upsert({
        id: user.id,
        pen_name: penName || displayName,
        website_url: websiteUrl,
        updated_at: new Date().toISOString(),
      });

    if (creatorError) {
      logger.error("Failed to update creator profile", creatorError, { userId: user.id });
      throw new Error(creatorError.message || "Failed to update creator profile.");
    }
  }

  logger.info("Successfully updated user profile identity", { userId: user.id });

  revalidatePath("/studio/profile");
  revalidatePath("/studio");
  revalidatePath("/account");

  return { success: true };
}

/**
 * Update authenticated user account and notification preferences.
 */
export async function updateAccountPreferencesAction(preferences: {
  emailNotifications?: boolean;
  inAppNotifications?: boolean;
  notifyNewEpisodes?: boolean;
}) {
  const user = await requireAuth();
  const supabase = createClient();

  const { error } = await supabase
    .from("notification_preferences")
    .upsert(
      {
        user_id: user.id,
        email_notifications: preferences.emailNotifications ?? true,
        in_app_notifications: preferences.inAppNotifications ?? true,
        notify_new_episodes: preferences.notifyNewEpisodes ?? true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    logger.error("Failed to update account preferences", error, { userId: user.id });
    throw new Error(error.message || "Failed to update preferences.");
  }

  logger.info("Successfully updated account preferences", { userId: user.id });

  revalidatePath("/studio/profile");
  revalidatePath("/account");
  revalidatePath("/library");

  return { success: true };
}

/**
 * Legacy form action for updating profile via standard form submission.
 */
export async function updateProfileFormAction(formData: FormData) {
  const displayName = formData.get("display_name")?.toString() || "";
  const bio = formData.get("bio")?.toString() || null;
  const avatarUrl = formData.get("avatar_url")?.toString() || null;
  const penName = formData.get("pen_name")?.toString() || null;
  const websiteUrl = formData.get("website_url")?.toString() || null;

  if (avatarUrl) {
    await updateAvatarAction(avatarUrl);
  }

  await updateProfileIdentityAction({
    displayName,
    bio,
    penName,
    websiteUrl,
  });
}
