import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudioProfileProvider, type StudioProfile } from "@/components/providers/StudioProfileProvider";

/**
 * Server Component Layout: Creator Studio Root Layout.
 * Enforces server-side authentication defense-in-depth across all /studio routes
 * and hydrates the persistent StudioProfileProvider with authenticated creator identity.
 */
export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/studio");
  }

  // Hydrate creator identity on server to eliminate layout shift or identity resets during route transitions
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

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
      {children}
    </StudioProfileProvider>
  );
}
