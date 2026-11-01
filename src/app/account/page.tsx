import React from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/data/profiles";
import { getNotificationPreferences } from "@/lib/data/reader";
import { AccountProfileManager } from "@/components/profile/AccountProfileManager";

export const metadata: Metadata = {
  title: "Account & Profile Settings | PageProwl",
  description:
    "Manage your personal reader and creator profile, avatar, credentials, and notification settings on PageProwl.",
};

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent("/account")}`);
  }

  const userProfile = await getUserProfile(user.id);
  const profile = userProfile?.profile;
  const creatorProfile = userProfile?.creatorProfile;
  const preferences = await getNotificationPreferences(user.id);

  return (
    <div className={styles.container}>
      <PublicHeader />
      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Account & Profile Settings</h1>
          <p className={styles.subtitle}>
            Manage your personal profile, avatar, credentials, and reader preferences.
          </p>
        </div>

        <AccountProfileManager
          user={{
            id: user.id,
            email: user.email,
            createdAt: user.created_at,
          }}
          profile={{
            id: profile?.id || user.id,
            username: profile?.username || user.email?.split("@")[0] || "user",
            displayName: profile?.display_name || user.email?.split("@")[0] || "Reader",
            avatarUrl: profile?.avatar_url || null,
            bio: profile?.bio || null,
            role: profile?.role || "user",
            createdAt: profile?.created_at || user.created_at,
          }}
          creatorProfile={{
            penName: creatorProfile?.pen_name || null,
            websiteUrl: creatorProfile?.website_url || null,
          }}
          preferences={{
            emailNotifications: preferences.notifications_enabled,
            inAppNotifications: preferences.notifications_enabled,
            notifyNewEpisodes: preferences.notify_new_episodes,
          }}
        />
      </main>
      <PublicFooter />
      <BottomNav />
    </div>
  );
}
