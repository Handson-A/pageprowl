import { createClient } from "@/lib/supabase/server";
import type { Database, ComicFormat, SeriesVisibility } from "@/types/database";

export type SeriesRow = Database["public"]["Tables"]["series"]["Row"];
export type EpisodeRow = Database["public"]["Tables"]["episodes"]["Row"];

export {
  SUPPORTED_GENRES,
  isValidGenre,
  genreToSlug,
  slugToGenre,
  GENRE_METADATA,
  type SupportedGenre,
} from "@/lib/constants/genres";

export interface SeriesContributorCredit {
  id: string;
  role_category: string;
  custom_name: string | null;
  user_id: string | null;
  display_name?: string;
  username?: string;
}

export interface SeriesWithCreator extends SeriesRow {
  creator_name?: string;
  creator_username?: string;
  creator_avatar_url?: string | null;
  creator_bio?: string | null;
  studio_name?: string;
  studio_slug?: string;
  episode_count?: number;
  credits?: SeriesContributorCredit[];
}

export interface CatalogParams {
  search?: string;
  genre?: string;
  format?: ComicFormat;
  sort?: "latest" | "updated" | "title_asc" | "title_desc";
  page?: number;
  limit?: number;
}

export interface CatalogResult {
  items: SeriesWithCreator[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetch published series for public browsing with optional search, filters, and limit.
 */
export async function getPublicSeriesList(params: {
  search?: string;
  genre?: string;
  format?: ComicFormat;
  sort?: "latest" | "updated" | "title_asc" | "title_desc";
  limit?: number;
}): Promise<SeriesWithCreator[]> {
  const supabase = createClient();

  let query = supabase
    .from("series")
    .select(`
      *,
      profiles:owner_user_id (display_name, username, avatar_url),
      studios:owner_studio_id (name, slug)
    `)
    .eq("visibility", "public");

  // Sorting
  switch (params.sort) {
    case "updated":
      query = query.order("updated_at", { ascending: false });
      break;
    case "title_asc":
      query = query.order("title", { ascending: true });
      break;
    case "title_desc":
      query = query.order("title", { ascending: false });
      break;
    case "latest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  if (params.genre && params.genre !== "All") {
    query = query.eq("genre", params.genre);
  }

  if (params.format) {
    query = query.eq("format", params.format);
  }

  if (params.search && params.search.trim()) {
    const term = params.search.trim();
    query = query.or(`title.ilike.%${term}%,synopsis.ilike.%${term}%`);
  }

  if (params.limit && params.limit > 0) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((item: any) => ({
    ...item,
    creator_name: item.profiles?.display_name || item.studios?.name || "Independent Creator",
    creator_username: item.profiles?.username,
    creator_avatar_url: item.profiles?.avatar_url,
    studio_name: item.studios?.name,
    studio_slug: item.studios?.slug,
  }));
}

/**
 * Fetch paginated catalog of published series with total counts.
 */
export async function getPublicSeriesCatalog(
  params: CatalogParams = {}
): Promise<CatalogResult> {
  const supabase = createClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(params.limit || 12, 50));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("series")
    .select(
      `
      *,
      profiles:owner_user_id (display_name, username, avatar_url),
      studios:owner_studio_id (name, slug)
    `,
      { count: "exact" }
    )
    .eq("visibility", "public");

  if (params.genre && params.genre !== "All") {
    query = query.eq("genre", params.genre);
  }

  if (params.format) {
    query = query.eq("format", params.format);
  }

  if (params.search && params.search.trim()) {
    const term = params.search.trim();
    query = query.or(`title.ilike.%${term}%,synopsis.ilike.%${term}%`);
  }

  // Sort strategy
  switch (params.sort) {
    case "updated":
      query = query.order("updated_at", { ascending: false });
      break;
    case "title_asc":
      query = query.order("title", { ascending: true });
      break;
    case "title_desc":
      query = query.order("title", { ascending: false });
      break;
    case "latest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error || !data) {
    return {
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  const items = (data as any[]).map((item: any) => ({
    ...item,
    creator_name: item.profiles?.display_name || item.studios?.name || "Independent Creator",
    creator_username: item.profiles?.username,
    creator_avatar_url: item.profiles?.avatar_url,
    studio_name: item.studios?.name,
    studio_slug: item.studios?.slug,
  }));

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetch featured published series for the homepage.
 */
export async function getFeaturedSeries(limit = 4): Promise<SeriesWithCreator[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("series")
    .select(`
      *,
      profiles:owner_user_id (display_name, username, avatar_url),
      studios:owner_studio_id (name, slug)
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((item: any) => ({
    ...item,
    creator_name: item.profiles?.display_name || item.studios?.name || "Independent Creator",
    creator_username: item.profiles?.username,
    creator_avatar_url: item.profiles?.avatar_url,
    studio_name: item.studios?.name,
    studio_slug: item.studios?.slug,
  }));
}

/**
 * Fetch recently updated series.
 */
export async function getRecentlyUpdatedSeries(limit = 6): Promise<SeriesWithCreator[]> {
  return getPublicSeriesList({
    sort: "updated",
    limit,
  });
}

/**
 * Fetch newly published series.
 */
export async function getNewlyPublishedSeries(limit = 6): Promise<SeriesWithCreator[]> {
  return getPublicSeriesList({
    sort: "latest",
    limit,
  });
}

/**
 * Fetch counts of published series for each supported genre.
 */
export async function getGenreCounts(): Promise<Record<string, number>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("series")
    .select("genre")
    .eq("visibility", "public");

  const counts: Record<string, number> = {};
  if (error || !data) return counts;

  for (const item of data as { genre: string }[]) {
    if (item.genre) {
      counts[item.genre] = (counts[item.genre] || 0) + 1;
    }
  }

  return counts;
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
      profiles:owner_user_id (id, display_name, username, avatar_url, bio),
      studios:owner_studio_id (id, name, slug, logo_url)
    `)
    .eq("slug", slug)
    .eq("visibility", "public")
    .single();

  if (error || !data) {
    return null;
  }

  const rawData = data as any;

  // Fetch contributor credits if any
  const { data: creditsData } = await supabase
    .from("contributor_credits")
    .select(`
      id,
      role_category,
      custom_name,
      user_id,
      profiles:user_id (display_name, username)
    `)
    .eq("series_id", rawData.id);

  const credits: SeriesContributorCredit[] = (creditsData || []).map((c: any) => ({
    id: c.id,
    role_category: c.role_category,
    custom_name: c.custom_name,
    user_id: c.user_id,
    display_name: c.profiles?.display_name || c.custom_name || "Contributor",
    username: c.profiles?.username,
  }));

  return {
    ...rawData,
    creator_name: rawData.profiles?.display_name || rawData.studios?.name || "Independent Creator",
    creator_username: rawData.profiles?.username,
    creator_avatar_url: rawData.profiles?.avatar_url,
    creator_bio: rawData.profiles?.bio,
    studio_name: rawData.studios?.name,
    studio_slug: rawData.studios?.slug,
    credits,
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

  // Fetch published revision details (including text_content)
  const { data: revision } = await supabase
    .from("episode_revisions")
    .select("id, text_content")
    .eq("id", epData.published_revision_id)
    .maybeSingle();

  const textContent = (revision as any)?.text_content || null;

  // Fetch revision pages
  const { data: pages } = await supabase
    .from("revision_pages")
    .select(`
      id,
      page_number,
      media_assets:media_asset_id (secure_url)
    `)
    .eq("revision_id", epData.published_revision_id)
    .order("page_number", { ascending: true });

  const pageList = (pages || []).map((p: any) => ({
    id: p.id,
    pageNumber: p.page_number,
    imageUrl: p.media_assets?.secure_url || "/images/artwork-fallback.png",
  }));

  // Episode must have either text_content or pages to be readable
  if (pageList.length === 0 && !textContent) {
    return null;
  }

  // Fetch all published episodes for navigation and switcher
  const { data: allEpisodes } = await supabase
    .from("episodes")
    .select("slug, episode_number, title")
    .eq("series_id", series.id)
    .not("published_revision_id", "is", null)
    .order("episode_number", { ascending: true });

  let prevEpisodeSlug: string | null = null;
  let nextEpisodeSlug: string | null = null;
  const publishedEpisodeList: { slug: string; episode_number: number; title: string }[] = [];

  if (allEpisodes) {
    const epList = allEpisodes as any[];
    for (const item of epList) {
      publishedEpisodeList.push({
        slug: item.slug,
        episode_number: item.episode_number,
        title: item.title,
      });
    }

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
    textContent,
    pages: pageList,
    prevEpisodeSlug,
    nextEpisodeSlug,
    allEpisodes: publishedEpisodeList,
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
