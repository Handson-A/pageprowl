import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { SeriesWithCreator } from "@/lib/data/series";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type CreatorProfileRow = Database["public"]["Tables"]["creator_profiles"]["Row"];

export interface FullUserProfile {
  profile: ProfileRow;
  creatorProfile: CreatorProfileRow | null;
}

export interface PublicCreatorContribution {
  roleCategory: string;
  customName: string | null;
  series: SeriesWithCreator;
}

export interface PublicCreatorProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  penName: string | null;
  websiteUrl: string | null;
  socialLinks: Record<string, string>;
  series: SeriesWithCreator[];
  contributions: PublicCreatorContribution[];
}

export interface CreatorSpotlight {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  penName?: string | null;
  publishedSeriesCount: number;
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

/**
 * Fetch public creator profile by username without leaking private emails or workspace data.
 */
export async function getPublicCreatorProfile(
  username: string
): Promise<PublicCreatorProfile | null> {
  const supabase = createClient();

  // Normalize username
  const cleanUsername = username.toLowerCase().trim();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio")
    .ilike("username", cleanUsername)
    .single();

  if (error || !profile) {
    return null;
  }

  // Fetch creator profile extensions (pen name, social links, website)
  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("pen_name, website_url, social_links")
    .eq("id", profile.id)
    .maybeSingle();

  // Fetch all published series owned by this creator
  const { data: seriesData } = await supabase
    .from("series")
    .select(`
      *,
      profiles:owner_user_id (display_name, username, avatar_url),
      studios:owner_studio_id (name, slug)
    `)
    .eq("owner_user_id", profile.id)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  const series: SeriesWithCreator[] = (seriesData || []).map((s: any) => ({
    ...s,
    creator_name: profile.display_name,
    creator_username: profile.username,
    creator_avatar_url: profile.avatar_url,
    studio_name: s.studios?.name,
    studio_slug: s.studios?.slug,
  }));

  // Fetch contributor credits on public series
  const { data: creditsData } = await supabase
    .from("contributor_credits")
    .select(`
      id,
      role_category,
      custom_name,
      series:series_id (
        *,
        profiles:owner_user_id (display_name, username, avatar_url),
        studios:owner_studio_id (name, slug)
      )
    `)
    .eq("user_id", profile.id);

  const contributions: PublicCreatorContribution[] = [];

  if (creditsData) {
    for (const credit of creditsData as any[]) {
      if (credit.series && credit.series.visibility === "public") {
        contributions.push({
          roleCategory: credit.role_category,
          customName: credit.custom_name,
          series: {
            ...credit.series,
            creator_name:
              credit.series.profiles?.display_name ||
              credit.series.studios?.name ||
              "Independent Creator",
            creator_username: credit.series.profiles?.username,
            creator_avatar_url: credit.series.profiles?.avatar_url,
            studio_name: credit.series.studios?.name,
            studio_slug: credit.series.studios?.slug,
          },
        });
      }
    }
  }

  let socialLinks: Record<string, string> = {};
  if (creatorProfile?.social_links && typeof creatorProfile.social_links === "object") {
    socialLinks = creatorProfile.social_links as Record<string, string>;
  }

  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    penName: creatorProfile?.pen_name || null,
    websiteUrl: creatorProfile?.website_url || null,
    socialLinks,
    series,
    contributions,
  };
}

/**
 * Fetch creators who have published public series to spotlight on discovery shelves.
 */
export async function getFeaturedCreators(limit = 6): Promise<CreatorSpotlight[]> {
  const supabase = createClient();

  const { data: seriesList, error } = await supabase
    .from("series")
    .select(`
      owner_user_id,
      profiles:owner_user_id (id, username, display_name, avatar_url, bio)
    `)
    .eq("visibility", "public")
    .not("owner_user_id", "is", null);

  if (error || !seriesList) {
    return [];
  }

  const creatorsMap = new Map<string, CreatorSpotlight>();

  for (const item of seriesList as any[]) {
    const prof = item.profiles;
    if (!prof || !prof.username) continue;

    if (!creatorsMap.has(prof.id)) {
      creatorsMap.set(prof.id, {
        id: prof.id,
        username: prof.username,
        displayName: prof.display_name,
        avatarUrl: prof.avatar_url,
        bio: prof.bio,
        publishedSeriesCount: 1,
      });
    } else {
      const existing = creatorsMap.get(prof.id)!;
      existing.publishedSeriesCount += 1;
    }
  }

  return Array.from(creatorsMap.values())
    .sort((a, b) => b.publishedSeriesCount - a.publishedSeriesCount)
    .slice(0, limit);
}
