import React from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { LibraryClient } from "./LibraryClient";
import { createClient } from "@/lib/supabase/server";
import {
  getUserLibrary,
  getUserReadingHistory,
  getNotificationPreferences,
} from "@/lib/data/reader";

export const metadata: Metadata = {
  title: "My Library & Reading History | PageProwl",
  description: "Access your personal comic library, reading history, and followed series on PageProwl.",
};

export default async function LibraryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/library")}`);
  }

  // 1. Fetch saved library
  const library = await getUserLibrary(user.id);

  // 2. Fetch reading history
  const history = await getUserReadingHistory(user.id);

  // 3. Fetch followed series
  const { data: followedRows } = await supabase
    .from("series_follows")
    .select(`
      series_id,
      notify_new_episodes,
      series:series_id (
        id,
        title,
        slug,
        cover_url,
        profiles:owner_user_id (display_name),
        studios:owner_studio_id (name)
      )
    `)
    .eq("user_id", user.id);

  const followed = (followedRows || []).map((row: any) => ({
    seriesId: row.series_id,
    seriesSlug: row.series?.slug || "",
    seriesTitle: row.series?.title || "Series",
    seriesCoverUrl: row.series?.cover_url || null,
    creatorName:
      row.series?.profiles?.display_name ||
      row.series?.studios?.name ||
      "Independent Creator",
    notifyNewEpisodes: row.notify_new_episodes ?? true,
  }));

  // 4. Fetch notification preferences
  const preferences = await getNotificationPreferences(user.id);

  return (
    <div className={styles.container}>
      <PublicHeader />
      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Library</h1>
          <p className={styles.subtitle}>
            Your personal comic collection, synchronized reading progress, and followed creators.
          </p>
        </div>

        <LibraryClient
          initialLibrary={library}
          initialHistory={history}
          initialFollowed={followed}
          initialPreferences={{
            notifications_enabled: preferences.notifications_enabled,
            notify_new_episodes: preferences.notify_new_episodes,
          }}
        />
      </main>
      <PublicFooter />
      <BottomNav />
    </div>
  );
}
