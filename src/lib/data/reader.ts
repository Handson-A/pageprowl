import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";
import { logger } from "../logger";
import type { Database } from "@/types/database";

export type ReadingProgressRow = Database["public"]["Tables"]["reading_progress"]["Row"];
export type NotificationPreferencesRow = Database["public"]["Tables"]["notification_preferences"]["Row"];

export interface ReaderLibraryItem {
  seriesId: string;
  seriesSlug: string;
  seriesTitle: string;
  seriesCoverUrl: string | null;
  seriesFormat: string;
  genre: string;
  creatorName: string;
  addedAt: string;
  latestEpisode?: {
    episodeNumber: number;
    title: string;
    slug: string;
  } | null;
  readingProgress?: {
    episodeNumber: number;
    episodeTitle: string;
    pageNumber: number;
    completed: boolean;
    lastReadAt: string;
  } | null;
}

export interface ReadingHistoryItem {
  id: string;
  seriesId: string;
  seriesSlug: string;
  seriesTitle: string;
  seriesCoverUrl: string | null;
  seriesFormat: string;
  episodeId: string;
  episodeSlug: string;
  episodeTitle: string;
  episodeNumber: number;
  pageNumber: number;
  scrollOffsetPercent: number;
  completed: boolean;
  lastReadAt: string;
  isPublished: boolean;
}

// ============================================================================
// 1. Reader Library
// ============================================================================

/**
 * Add a series to the reader's personal library.
 */
export async function addToLibrary(userId: string, seriesId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_libraries")
    .upsert(
      {
        user_id: userId,
        series_id: seriesId,
        created_at: new Date().toISOString(),
      },
      { onConflict: "user_id, series_id" }
    );

  if (error) {
    logger.error("Failed to add series to library", { error, userId, seriesId });
    throw new Error(error.message || "Failed to add series to library.");
  }

  return true;
}

/**
 * Remove a series from the reader's personal library.
 */
export async function removeFromLibrary(userId: string, seriesId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_libraries")
    .delete()
    .eq("user_id", userId)
    .eq("series_id", seriesId);

  if (error) {
    logger.error("Failed to remove series from library", { error, userId, seriesId });
    throw new Error(error.message || "Failed to remove series from library.");
  }

  return true;
}

/**
 * Check if a series is in the reader's personal library.
 */
export async function isSeriesInLibrary(userId: string, seriesId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_libraries")
    .select("series_id")
    .eq("user_id", userId)
    .eq("series_id", seriesId)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return true;
}

/**
 * Fetch the reader's saved series library with series metadata and latest progress.
 */
export async function getUserLibrary(userId: string): Promise<ReaderLibraryItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_libraries")
    .select(`
      series_id,
      created_at,
      series:series_id (
        id,
        title,
        slug,
        cover_url,
        format,
        genre,
        visibility,
        profiles:owner_user_id (display_name, username),
        studios:owner_studio_id (name)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const items: ReaderLibraryItem[] = [];

  for (const entry of data as any[]) {
    const s = entry.series;
    if (!s) continue;

    // Fetch latest episode for this series
    const { data: latestEp } = await supabase
      .from("episodes")
      .select("episode_number, title, slug")
      .eq("series_id", s.id)
      .not("published_revision_id", "is", null)
      .order("episode_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Fetch reader's latest progress in this series
    const { data: prog } = await supabase
      .from("reading_progress")
      .select(`
        page_number,
        completed,
        last_read_at,
        episodes:episode_id (title, episode_number)
      `)
      .eq("user_id", userId)
      .eq("series_id", s.id)
      .order("last_read_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    items.push({
      seriesId: s.id,
      seriesSlug: s.slug,
      seriesTitle: s.title,
      seriesCoverUrl: s.cover_url,
      seriesFormat: s.format,
      genre: s.genre,
      creatorName: s.profiles?.display_name || s.studios?.name || "Independent Creator",
      addedAt: entry.created_at,
      latestEpisode: latestEp
        ? {
            episodeNumber: (latestEp as any).episode_number,
            title: (latestEp as any).title,
            slug: (latestEp as any).slug,
          }
        : null,
      readingProgress: prog
        ? {
            episodeNumber: (prog.episodes as any)?.episode_number || 1,
            episodeTitle: (prog.episodes as any)?.title || "Episode",
            pageNumber: prog.page_number,
            completed: prog.completed,
            lastReadAt: prog.last_read_at,
          }
        : null,
    });
  }

  return items;
}

// ============================================================================
// 2. Series Follows
// ============================================================================

/**
 * Follow a series with configurable new episode notification preference.
 */
export async function followSeries(
  userId: string,
  seriesId: string,
  notifyNewEpisodes = true
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("series_follows")
    .upsert(
      {
        user_id: userId,
        series_id: seriesId,
        notify_new_episodes: notifyNewEpisodes,
        created_at: new Date().toISOString(),
      },
      { onConflict: "user_id, series_id" }
    );

  if (error) {
    logger.error("Failed to follow series", { error, userId, seriesId });
    throw new Error(error.message || "Failed to follow series.");
  }

  return true;
}

/**
 * Unfollow a series.
 */
export async function unfollowSeries(userId: string, seriesId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("series_follows")
    .delete()
    .eq("user_id", userId)
    .eq("series_id", seriesId);

  if (error) {
    logger.error("Failed to unfollow series", { error, userId, seriesId });
    throw new Error(error.message || "Failed to unfollow series.");
  }

  return true;
}

/**
 * Check if the user follows a series, including their notification setting.
 */
export async function isFollowingSeries(
  userId: string,
  seriesId: string
): Promise<{ following: boolean; notifyNewEpisodes: boolean }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("series_follows")
    .select("notify_new_episodes")
    .eq("user_id", userId)
    .eq("series_id", seriesId)
    .maybeSingle();

  if (error || !data) {
    return { following: false, notifyNewEpisodes: false };
  }

  return {
    following: true,
    notifyNewEpisodes: data.notify_new_episodes ?? true,
  };
}

/**
 * Update notification preference for a specific followed series.
 */
export async function updateFollowNotificationPreference(
  userId: string,
  seriesId: string,
  notifyNewEpisodes: boolean
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("series_follows")
    .update({ notify_new_episodes: notifyNewEpisodes })
    .eq("user_id", userId)
    .eq("series_id", seriesId);

  if (error) {
    logger.error("Failed to update follow notification preference", { error, userId, seriesId });
    throw new Error(error.message || "Failed to update notification preference.");
  }

  return true;
}

// ============================================================================
// 3. Reading History & Synchronization
// ============================================================================

/**
 * Synchronize reading progress from the client reader across devices.
 * Uses reliable timestamp comparison to prevent older delayed requests from overwriting newer progress.
 */
export async function syncReadingProgress(params: {
  userId: string;
  seriesId: string;
  episodeId: string;
  pageNumber: number;
  scrollOffsetPercent?: number;
  completed?: boolean;
  clientTimestamp?: number;
}): Promise<ReadingProgressRow> {
  const supabase = createClient();
  const now = new Date();
  const updateTimestamp = params.clientTimestamp
    ? new Date(params.clientTimestamp).toISOString()
    : now.toISOString();

  // 1. Conflict detection: Check existing progress
  const { data: existing } = await supabase
    .from("reading_progress")
    .select("id, updated_at, page_number, completed")
    .eq("user_id", params.userId)
    .eq("episode_id", params.episodeId)
    .maybeSingle();

  if (existing) {
    const existingDate = new Date(existing.updated_at).getTime();
    const incomingDate = params.clientTimestamp || now.getTime();

    // If incoming progress timestamp is older than existing by > 2 seconds, ignore stale write
    if (incomingDate < existingDate - 2000) {
      return existing as any;
    }
  }

  // 2. Upsert progress
  const { data, error } = await supabase
    .from("reading_progress")
    .upsert(
      {
        user_id: params.userId,
        series_id: params.seriesId,
        episode_id: params.episodeId,
        page_number: Math.max(1, params.pageNumber),
        scroll_offset_percent: Math.min(100, Math.max(0, params.scrollOffsetPercent || 0)),
        completed: params.completed ?? false,
        last_read_at: updateTimestamp,
        updated_at: updateTimestamp,
      },
      { onConflict: "user_id, episode_id" }
    )
    .select("*")
    .single();

  if (error || !data) {
    logger.error("Failed to sync reading progress", { error, params });
    throw new Error(error?.message || "Failed to sync reading progress.");
  }

  // Backwards compatibility: keep bookmarks table in sync
  try {
    await supabase.from("bookmarks").upsert(
      {
        user_id: params.userId,
        episode_id: params.episodeId,
        page_number: Math.max(1, params.pageNumber),
        updated_at: updateTimestamp,
      },
      { onConflict: "user_id, episode_id" }
    );
  } catch {
    // Non-fatal
  }

  return data;
}

/**
 * Fetch reading progress for an episode.
 */
export async function getEpisodeReadingProgress(
  userId: string,
  episodeId: string
): Promise<ReadingProgressRow | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reading_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("episode_id", episodeId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Fetch the latest reading progress in a series (for "Continue Reading" button).
 */
export async function getSeriesLatestProgress(
  userId: string,
  seriesId: string
): Promise<{
  episodeId: string;
  episodeSlug: string;
  episodeNumber: number;
  pageNumber: number;
  completed: boolean;
} | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reading_progress")
    .select(`
      episode_id,
      page_number,
      completed,
      episodes:episode_id (id, slug, episode_number, published_revision_id)
    `)
    .eq("user_id", userId)
    .eq("series_id", seriesId)
    .order("last_read_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data || !data.episodes) {
    return null;
  }

  const ep = data.episodes as any;
  // If the episode was unpublished, it won't have a published_revision_id
  return {
    episodeId: ep.id,
    episodeSlug: ep.slug,
    episodeNumber: ep.episode_number,
    pageNumber: data.page_number,
    completed: data.completed,
  };
}

/**
 * Fetch complete reading history for a reader.
 * Preserves reading history even if an episode is temporarily unpublished.
 */
export async function getUserReadingHistory(
  userId: string,
  limit = 30
): Promise<ReadingHistoryItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reading_progress")
    .select(`
      id,
      series_id,
      episode_id,
      page_number,
      scroll_offset_percent,
      completed,
      last_read_at,
      series:series_id (title, slug, cover_url, format),
      episodes:episode_id (title, slug, episode_number, published_revision_id)
    `)
    .eq("user_id", userId)
    .order("last_read_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    seriesId: row.series_id,
    seriesSlug: row.series?.slug || "",
    seriesTitle: row.series?.title || "Series",
    seriesCoverUrl: row.series?.cover_url || null,
    seriesFormat: row.series?.format || "page",
    episodeId: row.episode_id,
    episodeSlug: row.episodes?.slug || "",
    episodeTitle: row.episodes?.title || "Episode",
    episodeNumber: row.episodes?.episode_number || 1,
    pageNumber: row.page_number,
    scrollOffsetPercent: Number(row.scroll_offset_percent || 0),
    completed: Boolean(row.completed),
    lastReadAt: row.last_read_at,
    isPublished: Boolean(row.episodes?.published_revision_id),
  }));
}

// ============================================================================
// 4. Notification Preferences
// ============================================================================

/**
 * Fetch reader's notification preferences.
 */
export async function getNotificationPreferences(
  userId: string
): Promise<NotificationPreferencesRow> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return {
      user_id: userId,
      notifications_enabled: true,
      notify_new_episodes: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return data;
}

/**
 * Update reader's notification preferences.
 */
export async function updateNotificationPreferences(
  userId: string,
  updates: {
    notificationsEnabled?: boolean;
    notifyNewEpisodes?: boolean;
  }
): Promise<NotificationPreferencesRow> {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("notification_preferences")
    .upsert(
      {
        user_id: userId,
        notifications_enabled: updates.notificationsEnabled ?? true,
        notify_new_episodes: updates.notifyNewEpisodes ?? true,
        updated_at: now,
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single();

  if (error || !data) {
    logger.error("Failed to update notification preferences", { error, userId, updates });
    throw new Error(error?.message || "Failed to update notification preferences.");
  }

  return data;
}

// ============================================================================
// 5. In-App Notifications & Follower Dispatch
// ============================================================================

/**
 * Fetch notifications for an authenticated user with unread count.
 */
export async function getUserNotifications(
  userId: string,
  limit = 30
): Promise<{
  notifications: Database["public"]["Tables"]["notifications"]["Row"][];
  unreadCount: number;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return { notifications: [], unreadCount: 0 };
  }

  const unreadCount = data.filter((n) => !n.read).length;
  return { notifications: data, unreadCount };
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  return !error;
}

/**
 * Mark all notifications as read for a user.
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  return !error;
}

/**
 * Dispatches new episode notifications to followers.
 * Enforces:
 * 1. Follower has notify_new_episodes = true for this series
 * 2. Follower has global notifications_enabled = true
 * 3. Follower has notify_new_episodes = true in notification_preferences
 * 4. Deduplication: will not create duplicate notification if one already exists for this episode
 */
export async function notifySeriesFollowersOfNewEpisode(params: {
  seriesId: string;
  episodeId: string;
  episodeTitle: string;
  episodeNumber: number;
}): Promise<{ notifiedCount: number }> {
  const supabase = createAdminClient();

  // 1. Fetch series info
  const { data: series } = await supabase
    .from("series")
    .select("title, slug")
    .eq("id", params.seriesId)
    .single();

  if (!series) return { notifiedCount: 0 };

  // Fetch episode slug
  const { data: episode } = await supabase
    .from("episodes")
    .select("slug")
    .eq("id", params.episodeId)
    .single();

  const episodeLink = `/series/${series.slug}/episodes/${episode?.slug || ""}`;

  // 2. Fetch all followers who opted in for notifications on this series
  const { data: followers, error } = await supabase
    .from("series_follows")
    .select(`
      user_id,
      notify_new_episodes
    `)
    .eq("series_id", params.seriesId)
    .eq("notify_new_episodes", true);

  if (error || !followers || followers.length === 0) {
    return { notifiedCount: 0 };
  }

  const followerUserIds = followers.map((f) => f.user_id);

  // 3. Fetch global notification preferences for these followers
  const { data: prefsList } = await supabase
    .from("notification_preferences")
    .select("user_id, notifications_enabled, notify_new_episodes")
    .in("user_id", followerUserIds);

  const prefsMap = new Map<string, { notifications_enabled: boolean; notify_new_episodes: boolean }>();
  (prefsList || []).forEach((p) => {
    prefsMap.set(p.user_id, {
      notifications_enabled: p.notifications_enabled,
      notify_new_episodes: p.notify_new_episodes,
    });
  });

  // 4. Filter recipients based on preferences
  const eligibleUserIds = followerUserIds.filter((uid) => {
    const pref = prefsMap.get(uid);
    if (!pref) return true; // Default is enabled
    return pref.notifications_enabled && pref.notify_new_episodes;
  });

  if (eligibleUserIds.length === 0) {
    return { notifiedCount: 0 };
  }

  // 5. Query existing notifications for this link to prevent duplicates on retries
  const { data: existingNotifs } = await supabase
    .from("notifications")
    .select("user_id")
    .in("user_id", eligibleUserIds)
    .eq("link", episodeLink);

  const alreadyNotified = new Set((existingNotifs || []).map((n) => n.user_id));
  const usersToNotify = eligibleUserIds.filter((uid) => !alreadyNotified.has(uid));

  if (usersToNotify.length === 0) {
    return { notifiedCount: 0 };
  }

  // 6. Insert notifications in bulk
  const notificationsToInsert = usersToNotify.map((userId) => ({
    user_id: userId,
    title: `New Episode: ${series.title}`,
    message: `Chapter #${params.episodeNumber}: "${params.episodeTitle}" is now live!`,
    type: "publishing" as const,
    link: episodeLink,
    read: false,
    created_at: new Date().toISOString(),
  }));

  const { error: insertError } = await supabase
    .from("notifications")
    .insert(notificationsToInsert);

  if (insertError) {
    logger.error("Failed to insert bulk episode notifications", insertError);
    return { notifiedCount: 0 };
  }

  return { notifiedCount: usersToNotify.length };
}
