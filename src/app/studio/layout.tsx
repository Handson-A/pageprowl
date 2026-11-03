import React from "react";
import { redirect } from "next/navigation";
import { getCachedAuthUser, getCachedUserProfile } from "@/lib/supabase/server";
import { StudioProfileProvider, type StudioProfile } from "@/components/providers/StudioProfileProvider";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import styles from "./page.module.css";

/**
 * Server Component Layout: Creator Studio Root Layout.
 * Enforces server-side authentication defense-in-depth across all /studio routes,
 * renders the persistent CreatorSidebar once (preventing layout shifts and unmounts on tab switches),
 * and hydrates the StudioProfileProvider with authenticated creator identity.
 */
export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCachedAuthUser();

  if (!user) {
    redirect("/login?redirect=/studio");
  }

  // Hydrate creator identity on server
  const profile = await getCachedUserProfile(user.id);

  const displayName =
    profile?.display_name?.trim() ||
    profile?.username?.trim() ||
    (user.email ? user.email.split("@")[0] : "Creator");

  const userRole =
    profile?.role === "admin"
      ? "Admin"
      : profile?.role === "moderator"
      ? "Moderator"
      : "Creator";

  const initialProfile: StudioProfile = {
    id: user.id,
    email: user.email || null,
    username: profile?.username || (user.email ? user.email.split("@")[0] : ""),
    displayName,
    avatarUrl: profile?.avatar_url || null,
    role: userRole,
  };

  return (
    <StudioProfileProvider initialProfile={initialProfile}>
      <div className={styles.layout}>
        <CreatorSidebar
          userName={displayName}
          userRole={userRole}
          avatarUrl={profile?.avatar_url || null}
        />
        {children}
      </div>
    </StudioProfileProvider>
  );
}
