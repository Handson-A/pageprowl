import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type CreatorProfileRow = Database["public"]["Tables"]["creator_profiles"]["Row"];

export interface FullUserProfile {
  profile: ProfileRow;
  creatorProfile: CreatorProfileRow | null;
}

/**
 * Fetch full profile and creator profile for a specific user ID.
 */
export async function getUserProfile(userId: string): Promise<FullUserProfile | null> {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return null;
  }

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return {
    profile: profile as ProfileRow,
    creatorProfile: creatorProfile as CreatorProfileRow | null,
  };
}
