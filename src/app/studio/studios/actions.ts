"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  requireAuth,
  requireStudioRole,
  ForbiddenError,
} from "@/lib/auth/guards";
import { logger } from "@/lib/logger";
import type { StudioRole } from "@/types/database";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Server Action: Create a new Studio workspace.
 * Automatically assigns creator as 'owner' in studio_members.
 */
export async function createStudioAction(formData: FormData) {
  const user = await requireAuth();
  const supabase = createClient();

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;

  if (!name || name.length < 2) {
    throw new Error("Studio name must be at least 2 characters.");
  }

  const baseSlug = slugify(name);
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

  // Insert studio
  const { data: studio, error: studioError } = await supabase
    .from("studios")
    .insert({
      name,
      slug,
      description,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (studioError || !studio) {
    logger.error("Failed to create studio workspace", studioError);
    throw new Error(studioError?.message || "Failed to create studio workspace.");
  }

  // Assign creator as owner in studio_members
  const { error: memberError } = await supabase.from("studio_members").insert({
    studio_id: studio.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    logger.error("Failed to establish studio owner membership", memberError);
    throw new Error("Failed to initialize studio owner membership.");
  }

  logger.info("Created studio workspace", { studioId: studio.id, userId: user.id });

  revalidatePath("/studio");
  revalidatePath("/studio/studios");
  redirect(`/studio/studios/${studio.id}`);
}

/**
 * Server Action: Invite a team member to a studio workspace.
 * Enforces server-side guard: Caller must be admin or owner.
 */
export async function inviteStudioMemberAction(studioId: string, formData: FormData) {
  const { userId } = await requireStudioRole(studioId, "admin");
  const supabase = createClient();

  const email = formData.get("email")?.toString().trim().toLowerCase();
  const role = (formData.get("role")?.toString() || "member") as StudioRole;

  if (!email || !email.includes("@")) {
    throw new Error("A valid email address is required.");
  }

  if (!["admin", "editor", "member"].includes(role)) {
    throw new Error("Invalid studio role selected.");
  }

  const token = `${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("studio_invitations").insert({
    studio_id: studioId,
    inviter_id: userId,
    invited_email: email,
    role,
    token,
    status: "pending",
    expires_at: expiresAt,
  });

  if (error) {
    logger.error("Failed to create studio invitation", error, { studioId, email });
    throw new Error(error.message || "Failed to issue invitation.");
  }

  logger.info("Issued studio invitation", { studioId, email, role, inviterId: userId });

  revalidatePath(`/studio/studios/${studioId}`);
}

/**
 * Server Action: Update a studio member's role.
 * Enforces server-side guard: Caller must be admin or owner.
 * Admins cannot alter an owner's role or promote someone to owner.
 */
export async function updateStudioMemberRoleAction(
  studioId: string,
  targetUserId: string,
  newRole: StudioRole
) {
  const caller = await requireStudioRole(studioId, "admin");
  const supabase = createClient();

  // Fetch target member's current role
  const { data: targetMember } = await supabase
    .from("studio_members")
    .select("role")
    .eq("studio_id", studioId)
    .eq("user_id", targetUserId)
    .single();

  if (!targetMember) {
    throw new Error("Target member not found in this studio.");
  }

  // Non-owner admin cannot modify an owner
  if (targetMember.role === "owner" && caller.role !== "owner") {
    throw new ForbiddenError("Only studio owners can modify another owner's role.");
  }

  // Only owner can promote someone to owner
  if (newRole === "owner" && caller.role !== "owner") {
    throw new ForbiddenError("Only existing owners can promote a member to owner.");
  }

  const { error } = await supabase
    .from("studio_members")
    .update({ role: newRole })
    .eq("studio_id", studioId)
    .eq("user_id", targetUserId);

  if (error) {
    logger.error("Failed to update studio member role", error);
    throw new Error(error.message || "Failed to update member role.");
  }

  logger.info("Updated studio member role", {
    studioId,
    targetUserId,
    newRole,
    updatedBy: caller.userId,
  });

  revalidatePath(`/studio/studios/${studioId}`);
}

/**
 * Server Action: Remove a member from a studio workspace.
 * Enforces server-side guard: Caller must be admin or owner (or self-removal).
 */
export async function removeStudioMemberAction(studioId: string, targetUserId: string) {
  const caller = await requireStudioRole(studioId, "admin");
  const supabase = createClient();

  const { data: targetMember } = await supabase
    .from("studio_members")
    .select("role")
    .eq("studio_id", studioId)
    .eq("user_id", targetUserId)
    .single();

  if (!targetMember) {
    throw new Error("Target member does not exist in this studio.");
  }

  if (targetMember.role === "owner" && caller.role !== "owner") {
    throw new ForbiddenError("Only studio owners can remove an owner.");
  }

  // Check if target is the sole owner
  if (targetMember.role === "owner") {
    const { count } = await supabase
      .from("studio_members")
      .select("*", { count: "exact", head: true })
      .eq("studio_id", studioId)
      .eq("role", "owner");

    if (count && count <= 1) {
      throw new ForbiddenError("Cannot remove the sole owner of a studio.");
    }
  }

  const { error } = await supabase
    .from("studio_members")
    .delete()
    .eq("studio_id", studioId)
    .eq("user_id", targetUserId);

  if (error) {
    logger.error("Failed to remove studio member", error);
    throw new Error(error.message || "Failed to remove member.");
  }

  logger.info("Removed studio member", {
    studioId,
    targetUserId,
    removedBy: caller.userId,
  });

  revalidatePath(`/studio/studios/${studioId}`);
}
