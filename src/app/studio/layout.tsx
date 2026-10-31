import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Component Layout: Creator Studio Root Layout.
 * Enforces server-side authentication defense-in-depth across all /studio routes.
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

  return <>{children}</>;
}
