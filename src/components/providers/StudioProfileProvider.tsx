"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export interface StudioProfile {
  id: string;
  email?: string | null;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
}

interface StudioProfileContextType {
  profile: StudioProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const StudioProfileContext = createContext<StudioProfileContextType>({
  profile: null,
  isLoading: false,
  error: null,
  refreshProfile: async () => {},
});

export function useStudioProfile() {
  return useContext(StudioProfileContext);
}

export function StudioProfileProvider({
  initialProfile,
  children,
}: {
  initialProfile?: StudioProfile | null;
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<StudioProfile | null>(initialProfile || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProfile);
  const [error, setError] = useState<string | null>(null);

  // Keep a reference to current profile to avoid clobbering with stale fetches
  const profileRef = useRef<StudioProfile | null>(initialProfile || null);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const refreshProfile = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, role")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.warn("Could not refresh user profile:", fetchError.message);
        setError(fetchError.message);
        // Do NOT wipe out already loaded profile on transient network/fetch failure
        if (!profileRef.current) {
          const fallbackName = user.email ? user.email.split("@")[0] : "Creator";
          setProfile({
            id: user.id,
            email: user.email || null,
            username: fallbackName,
            displayName: fallbackName,
            avatarUrl: null,
            role: "Creator",
          });
        }
        return;
      }

      if (data) {
        const displayName =
          data.display_name?.trim() ||
          data.username?.trim() ||
          (user.email ? user.email.split("@")[0] : "Creator");

        const userRole =
          data.role === "admin"
            ? "Admin"
            : data.role === "moderator"
            ? "Moderator"
            : "Creator";

        const newProfile: StudioProfile = {
          id: user.id,
          email: user.email || null,
          username: data.username || (user.email ? user.email.split("@")[0] : ""),
          displayName,
          avatarUrl: data.avatar_url || null,
          role: userRole,
        };

        setProfile(newProfile);
        setError(null);
      } else if (!profileRef.current) {
        // Genuine missing profile record: handle gracefully without pretending everything is blank
        const fallbackName = user.email ? user.email.split("@")[0] : "Creator";
        setProfile({
          id: user.id,
          email: user.email || null,
          username: fallbackName,
          displayName: fallbackName,
          avatarUrl: null,
          role: "Creator",
        });
      }
    } catch (err: any) {
      console.warn("Error refreshing profile:", err?.message || err);
      setError(err?.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update when initialProfile changes from server navigation
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setIsLoading(false);
    }
  }, [initialProfile]);

  // Handle client authentication state changes
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        setProfile(null);
        setIsLoading(false);
      } else if (event === "USER_UPDATED" || session.user.id !== profileRef.current?.id) {
        refreshProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const contextValue = useMemo(
    () => ({ profile, isLoading, error, refreshProfile }),
    [profile, isLoading, error, refreshProfile]
  );

  return (
    <StudioProfileContext.Provider value={contextValue}>
      {children}
    </StudioProfileContext.Provider>
  );
}
