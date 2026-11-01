"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/guards";
import {
  addToLibrary,
  removeFromLibrary,
  isSeriesInLibrary,
  followSeries,
  unfollowSeries,
  isFollowingSeries,
  updateFollowNotificationPreference,
  syncReadingProgress,
  updateNotificationPreferences,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/data/reader";

/**
 * Toggle saving a series to reader's personal library.
 */
export async function toggleLibraryAction(seriesId: string) {
  const user = await requireAuth();

  const inLibrary = await isSeriesInLibrary(user.id, seriesId);
  if (inLibrary) {
    await removeFromLibrary(user.id, seriesId);
  } else {
    await addToLibrary(user.id, seriesId);
  }

  revalidatePath("/library");
  return { success: true, inLibrary: !inLibrary };
}

/**
 * Toggle following a series.
 */
export async function toggleFollowAction(seriesId: string, notifyNewEpisodes = true) {
  const user = await requireAuth();

  const { following } = await isFollowingSeries(user.id, seriesId);
  if (following) {
    await unfollowSeries(user.id, seriesId);
  } else {
    await followSeries(user.id, seriesId, notifyNewEpisodes);
  }

  revalidatePath("/library");
  return { success: true, following: !following, notifyNewEpisodes };
}

/**
 * Update notification preference for a specific followed series.
 */
export async function updateFollowNotificationAction(
  seriesId: string,
  notifyNewEpisodes: boolean
) {
  const user = await requireAuth();

  await updateFollowNotificationPreference(user.id, seriesId, notifyNewEpisodes);
  revalidatePath("/library");
  return { success: true, notifyNewEpisodes };
}

/**
 * Sync reading progress from reader shell to backend database.
 */
export async function syncReadingProgressAction(params: {
  seriesId: string;
  episodeId: string;
  pageNumber: number;
  scrollOffsetPercent?: number;
  completed?: boolean;
  clientTimestamp?: number;
}) {
  const user = await requireAuth();

  const progress = await syncReadingProgress({
    userId: user.id,
    seriesId: params.seriesId,
    episodeId: params.episodeId,
    pageNumber: params.pageNumber,
    scrollOffsetPercent: params.scrollOffsetPercent,
    completed: params.completed,
    clientTimestamp: params.clientTimestamp,
  });

  return { success: true, progress };
}

/**
 * Update reader's global notification preferences.
 */
export async function updateNotificationPreferencesAction(updates: {
  notificationsEnabled?: boolean;
  notifyNewEpisodes?: boolean;
}) {
  const user = await requireAuth();

  const prefs = await updateNotificationPreferences(user.id, updates);
  revalidatePath("/library");
  revalidatePath("/studio/notifications");
  return { success: true, preferences: prefs };
}

/**
 * Mark a notification as read.
 */
export async function markNotificationReadAction(notificationId: string) {
  const user = await requireAuth();

  const success = await markNotificationAsRead(user.id, notificationId);
  revalidatePath("/studio/notifications");
  return { success };
}

/**
 * Mark all user notifications as read.
 */
export async function markAllNotificationsReadAction() {
  const user = await requireAuth();

  const success = await markAllNotificationsAsRead(user.id);
  revalidatePath("/studio/notifications");
  return { success };
}
