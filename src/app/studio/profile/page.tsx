import React from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/data/profiles";
import { getNotificationPreferences } from "@/lib/data/reader";
import { AccountProfileManager } from "@/components/profile/AccountProfileManager";
import styles from "@/app/studio/page.module.css";

export const metadata: Metadata = {
  title: "Creator Profile Settings | PageProwl",
  description: "Manage your creator credentials, pen name, avatar, and account settings.",
};

export default async function ProfileSettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/studio/profile");
  }

  const userProfile = await getUserProfile(user.id);
  const profile = userProfile?.profile;
  const creatorProfile = userProfile?.creatorProfile;
  const preferences = await getNotificationPreferences(user.id);

  return (
    <div className={styles.layout}>
      <CreatorSidebar
        userName={profile?.display_name}
        userRole={profile?.role}
        avatarUrl={profile?.avatar_url}
      />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Creator Profile Settings</h1>
            <p className={styles.subtitle}>
              Manage your public author credentials, pen name, and platform identity.
            </p>
          </div>
        </header>

        <AccountProfileManager
          user={{
            id: user.id,
            email: user.email,
            createdAt: user.created_at,
          }}
          profile={{
            id: profile?.id || user.id,
            username: profile?.username || user.email?.split("@")[0] || "user",
            displayName: profile?.display_name || user.email?.split("@")[0] || "Creator",
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
    </div>
  );
}
