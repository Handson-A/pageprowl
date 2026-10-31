import { createClient } from "@/lib/supabase/server";
import type { Database, StudioRole } from "@/types/database";

export type StudioRow = Database["public"]["Tables"]["studios"]["Row"];
export type StudioMemberRow = Database["public"]["Tables"]["studio_members"]["Row"];
export type StudioInvitationRow = Database["public"]["Tables"]["studio_invitations"]["Row"];

export interface UserStudioMembership extends StudioRow {
  member_role: StudioRole;
  member_count?: number;
  series_count?: number;
}

export interface StudioMemberWithProfile extends StudioMemberRow {
  display_name: string;
  username: string;
  avatar_url: string | null;
}

/**
 * Fetch all studios where the given user is a member.
 */
export async function getUserStudios(userId: string): Promise<UserStudioMembership[]> {
  const supabase = createClient();

  const { data: memberships, error } = await supabase
    .from("studio_members")
    .select(`
      role,
      studios:studio_id (*)
    `)
    .eq("user_id", userId);

  if (error || !memberships) {
    return [];
  }

  return memberships
    .filter((m: any) => m.studios)
    .map((m: any) => ({
      ...m.studios,
      member_role: m.role as StudioRole,
    }));
}

/**
 * Fetch a single studio by ID.
 */
export async function getStudioById(studioId: string): Promise<StudioRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("studios")
    .select("*")
    .eq("id", studioId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as StudioRow;
}

/**
 * Fetch members of a studio with their profile details.
 */
export async function getStudioMembers(studioId: string): Promise<StudioMemberWithProfile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("studio_members")
    .select(`
      studio_id,
      user_id,
      role,
      created_at,
      profiles:user_id (
        display_name,
        username,
        avatar_url
      )
    `)
    .eq("studio_id", studioId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((item: any) => ({
    studio_id: item.studio_id,
    user_id: item.user_id,
    role: item.role as StudioRole,
    created_at: item.created_at,
    display_name: item.profiles?.display_name || "Unknown User",
    username: item.profiles?.username || "unknown",
    avatar_url: item.profiles?.avatar_url || null,
  }));
}

/**
 * Fetch pending invitations for a studio.
 */
export async function getStudioInvitations(studioId: string): Promise<StudioInvitationRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("studio_invitations")
    .select("*")
    .eq("studio_id", studioId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as StudioInvitationRow[];
}

/**
 * Fetch comic series owned by a studio.
 */
export async function getStudioSeries(studioId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("series")
    .select("*")
    .eq("owner_studio_id", studioId)
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}
