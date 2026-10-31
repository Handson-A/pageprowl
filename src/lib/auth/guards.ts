import { createClient } from "@/lib/supabase/server";
import type { StudioRole, SeriesRole, UserRole } from "@/types/database";
import {
  hasStudioPermission,
  hasSeriesPermission,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "./permissions";

export * from "./permissions";

/**
 * Require an authenticated session on the server.
 * Returns the authenticated user session details or throws UnauthorizedError.
 */
export async function requireAuth() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new UnauthorizedError();
  }

  return user;
}

/**
 * Require a minimum role in a studio workspace on the server.
 * Rejects with ForbiddenError if user is not a member or lacks the role.
 */
export async function requireStudioRole(
  studioId: string,
  minimumRole: StudioRole
): Promise<{ userId: string; role: StudioRole }> {
  const user = await requireAuth();
  const supabase = createClient();

  const { data: member, error } = await supabase
    .from("studio_members")
    .select("role")
    .eq("studio_id", studioId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !member) {
    throw new ForbiddenError("You are not a member of this studio workspace.");
  }

  const role = member.role as StudioRole;
  if (!hasStudioPermission(role, minimumRole)) {
    throw new ForbiddenError(
      `Requires ${minimumRole} role or higher in this studio. Current role: ${role}.`
    );
  }

  return { userId: user.id, role };
}

/**
 * Require a minimum role in a comic series on the server.
 * Handles both direct user-owned series and studio-owned series.
 * In a studio-owned series, studio owners and admins inherit administration.
 */
export async function requireSeriesRole(
  seriesId: string,
  minimumRole: SeriesRole
): Promise<{ userId: string; effectiveRole: SeriesRole }> {
  const user = await requireAuth();
  const supabase = createClient();

  // Fetch series ownership details
  const { data: series, error: seriesError } = await supabase
    .from("series")
    .select("id, owner_user_id, owner_studio_id")
    .eq("id", seriesId)
    .single();

  if (seriesError || !series) {
    throw new NotFoundError("Series not found.");
  }

  // 1. Direct individual ownership
  if (series.owner_user_id === user.id) {
    return { userId: user.id, effectiveRole: "owner" };
  }

  // 2. Direct series membership
  const { data: directMember } = await supabase
    .from("series_members")
    .select("role")
    .eq("series_id", seriesId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (directMember) {
    const role = directMember.role as SeriesRole;
    if (hasSeriesPermission(role, minimumRole)) {
      return { userId: user.id, effectiveRole: role };
    }
  }

  // 3. Studio-owned series: Studio Owner and Admin inherit administration
  if (series.owner_studio_id) {
    const { data: studioMember } = await supabase
      .from("studio_members")
      .select("role")
      .eq("studio_id", series.owner_studio_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (studioMember) {
      const studioRole = studioMember.role as StudioRole;
      if (studioRole === "owner" || studioRole === "admin") {
        return { userId: user.id, effectiveRole: "owner" };
      }
    }
  }

  throw new ForbiddenError("You do not have permission to access or modify this series.");
}

/**
 * Require platform moderator or admin role.
 */
export async function requirePlatformStaff(
  minimumRole: "moderator" | "admin" = "moderator"
): Promise<{ userId: string; platformRole: UserRole }> {
  const user = await requireAuth();
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role || "user") as UserRole;

  if (minimumRole === "admin" && role !== "admin") {
    throw new ForbiddenError("Requires platform administrator role.");
  }

  if (minimumRole === "moderator" && role !== "moderator" && role !== "admin") {
    throw new ForbiddenError("Requires platform moderator or administrator role.");
  }

  return { userId: user.id, platformRole: role };
}
