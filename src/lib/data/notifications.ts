import { createClient } from "../supabase/server";
import { logger } from "../logger";
import type { Database, NotificationType } from "../../types/database";
export {
  dispatchEmailNotification,
  type EmailDeliveryResult,
} from "./notifications-pure";

export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

/**
 * Create a persistent in-app notification with deduplication guard.
 */
export async function createNotification(params: {
  studioId?: string | null;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string | null;
}): Promise<NotificationRow | null> {
  try {
    const supabase = createClient();

    // Deduplication check: prevent identical unread notification for the same user within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", params.userId)
      .eq("title", params.title)
      .eq("message", params.message)
      .eq("read", false)
      .gte("created_at", fiveMinutesAgo)
      .maybeSingle();

    if (existing) {
      logger.info("Suppressed duplicate notification", { userId: params.userId, title: params.title });
      return null;
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        studio_id: params.studioId || null,
        user_id: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
        link: params.link || null,
        read: false,
      })
      .select("*")
      .single();

    if (error || !data) {
      logger.error("Failed to insert notification", error);
      return null;
    }

    return data;
  } catch (err) {
    logger.error("Exception creating notification", err);
    return null;
  }
}

/**
 * Fetch notifications for a user.
 */
export async function getUserNotifications(
  userId: string,
  options: { unreadOnly?: boolean; limit?: number } = {}
): Promise<NotificationRow[]> {
  const supabase = createClient();

  let query = supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (options.unreadOnly) {
    query = query.eq("read", false);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data;
}

/**
 * Get count of unread notifications for a user.
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error || count === null) {
    return 0;
  }

  return count;
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(
  notificationId: string,
  userId: string
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
export async function markAllNotificationsRead(userId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  return !error;
}
