import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createClient() {
  const cookieStore = cookies();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // The `set` method was called from a Server Component.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // The `delete` method was called from a Server Component.
        }
      },
    },
  });
}

/**
 * Request-scoped cached getter for the authenticated user.
 * Deduplicates multiple supabase.auth.getUser() calls within the same Server Component render tree.
 */
export const getCachedAuthUser = cache(async (): Promise<User | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Request-scoped cached getter for user profile.
 * Deduplicates multiple profile queries within the same Server Component render tree.
 */
export const getCachedUserProfile = cache(async (userId: string) => {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, role")
    .eq("id", userId)
    .maybeSingle();
  return profile as {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    role: string | null;
  } | null;
});
