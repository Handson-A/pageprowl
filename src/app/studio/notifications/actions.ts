"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/guards";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/data/notifications";

export async function markNotificationReadAction(notificationId: string) {
  const user = await requireAuth();
  const success = await markNotificationRead(notificationId, user.id);
  revalidatePath("/studio");
  revalidatePath("/studio/notifications");
  return { success };
}

export async function markAllNotificationsReadAction() {
  const user = await requireAuth();
  const success = await markAllNotificationsRead(user.id);
  revalidatePath("/studio");
  revalidatePath("/studio/notifications");
  return { success };
}
