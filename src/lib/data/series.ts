import { createClient } from "@/lib/supabase/server";
import type { Database, ComicFormat, SeriesVisibility } from "@/types/database";

export type SeriesRow = Database["public"]["Tables"]["series"]["Row"];
export type EpisodeRow = Database["public"]["Tables"]["episodes"]["Row"];

export { SUPPORTED_GENRES, isValidGenre, type SupportedGenre } from "@/lib/constants/genres";

export interface SeriesWithCreator extends SeriesRow {
  creator_name?: string;
  studio_name?: string;
  episode_count?: number;
}

/**
 * Fetch published series for public browsing with optional search and filters.
 */
export async function getPublicSeriesList(params: {
  search?: string;
  genre?: string;
  format?: ComicFormat;
}): Promise<SeriesWithCreator[]> {
  const supabase = createClient();

  let query = supabase
    .from("series")
    .select(`
      *,
      profiles:owner_user_id (display_name),
      studios:owner_studio_id (name)
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  if (params.genre && params.genre !== "All") {
    query = query.eq("genre", params.genre);
  }

  if (params.format) {
    query = query.eq("format", params.format);
  }

  if (params.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((item: any) => ({
    ...item,
    creator_name: item.profiles?.display_name || item.studios?.name || "Independent Creator",
    studio_name: item.studios?.name,
  }));
}

/**
 * Fetch featured published series for the homepage.
 */
export async function getFeaturedSeries(): Promise<SeriesWithCreator[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("series")
    .select(`
      *,
      profiles:owner_user_id (display_name),
      studios:owner_studio_id (name)
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((item: any) => ({
    ...item,
    creator_name: item.profiles?.display_name || item.studios?.name || "Independent Creator",
    studio_name: item.studios?.name,
  }));
}

/**
 * Fetch single public series by slug, ensuring private series are never leaked.
 */
export async function getPublicSeriesBySlug(slug: string): Promise<SeriesWithCreator | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("series")
    .select(`
      *,
      profiles:owner_user_id (display_name),
      studios:owner_studio_id (name)
    `)
    .eq("slug", slug)
    .eq("visibility", "public")
    .single();

  if (error || !data) {
    return null;
  }

  const rawData = data as any;
  return {
    ...rawData,
    creator_name: rawData.profiles?.display_name || rawData.studios?.name || "Independent Creator",
    studio_name: rawData.studios?.name,
  };
}

/**
 * Fetch only published episodes for a public series.
 */
export async function getPublishedEpisodes(seriesId: string): Promise<EpisodeRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("series_id", seriesId)
    .not("published_revision_id", "is", null)
    .order("episode_number", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as EpisodeRow[];
}

/**
 * Fetch public episode and its published revision pages for reading.
 */
export async function getPublicEpisodeContent(seriesSlug: string, episodeSlug: string) {
  const supabase = createClient();

  // First fetch series to confirm it is public
  const series = await getPublicSeriesBySlug(seriesSlug);
  if (!series) return null;

  // Fetch episode
  const { data: episode, error: epError } = await supabase
    .from("episodes")
    .select("*")
    .eq("series_id", series.id)
    .eq("slug", episodeSlug)
    .single();

  const epData = episode as any;
  if (epError || !epData || !epData.published_revision_id) {
    return null;
  }

  // Fetch revision pages
  const { data: pages, error: pageError } = await supabase
    .from("revision_pages")
    .select(`
      id,
      page_number,
      media_assets:media_asset_id (secure_url)
    `)
    .eq("revision_id", epData.published_revision_id)
    .order("page_number", { ascending: true });

  if (pageError || !pages) {
    return null;
  }

  // Fetch surrounding episodes for prev/next
  const { data: allEpisodes } = await supabase
    .from("episodes")
    .select("slug, episode_number")
    .eq("series_id", series.id)
    .not("published_revision_id", "is", null)
    .order("episode_number", { ascending: true });

  let prevEpisodeSlug: string | null = null;
  let nextEpisodeSlug: string | null = null;

  if (allEpisodes) {
    const epList = allEpisodes as any[];
    const currentIndex = epList.findIndex((e: any) => e.slug === epData.slug);
    if (currentIndex > 0) {
      prevEpisodeSlug = epList[currentIndex - 1].slug;
    }
    if (currentIndex < epList.length - 1) {
      nextEpisodeSlug = epList[currentIndex + 1].slug;
    }
  }

  return {
    series,
    episode: epData,
    pages: (pages as any[]).map((p: any) => ({
      id: p.id,
      pageNumber: p.page_number,
      imageUrl: p.media_assets?.secure_url || "/images/artwork-fallback.png",
    })),
    prevEpisodeSlug,
    nextEpisodeSlug,
  };
}

/**
 * Fetch all series accessible by a creator in the workspace:
 * 1. Series directly owned by user
 * 2. Series owned by studios where user is owner or admin
 * 3. Series where user is an authorized member
 */
export async function getCreatorSeries(userId: string): Promise<SeriesWithCreator[]> {
  const supabase = createClient();

  // Find studios where user is owner or admin
  const { data: userStudios } = await supabase
    .from("studio_members")
    .select("studio_id")
    .eq("user_id", userId)
    .in("role", ["owner", "admin"]);

  const studioIds = (userStudios || []).map((s) => s.studio_id);

  // Find series where user has an explicit series membership
  const { data: memberSeries } = await supabase
    .from("series_members")
    .select("series_id")
    .eq("user_id", userId);

  const memberSeriesIds = (memberSeries || []).map((m) => m.series_id);

  let query = supabase
    .from("series")
    .select(`
      *,
      studios:owner_studio_id (name),
      profiles:owner_user_id (display_name),
      episodes (count)
    `)
    .order("updated_at", { ascending: false });

  const conditions: string[] = [`owner_user_id.eq.${userId}`];
  if (studioIds.length > 0) {
    conditions.push(`owner_studio_id.in.(${studioIds.join(",")})`);
  }
  if (memberSeriesIds.length > 0) {
    conditions.push(`id.in.(${memberSeriesIds.join(",")})`);
  }

  query = query.or(conditions.join(","));

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((item: any) => ({
    ...item,
    creator_name: item.profiles?.display_name || item.studios?.name || "Independent Creator",
    studio_name: item.studios?.name,
    episode_count: item.episodes?.[0]?.count ?? 0,
  }));
}
