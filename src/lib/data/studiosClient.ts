import { createClient } from "../supabase/client.ts";

export interface StudioOption {
  id: string;
  name: string;
}

interface CacheEntry {
  data: StudioOption[];
  timestamp: number;
  isPersistentError?: boolean;
}

// In-memory cache for authorized studios by userId
const studioCache = new Map<string, CacheEntry>();
// In-flight request deduplication map
const inFlightRequests = new Map<string, Promise<StudioOption[]>>();

// Cache TTL: 60 seconds unless invalidated
const CACHE_TTL_MS = 60_000;

/**
 * Fetch studios where the user has 'owner' or 'admin' privileges.
 * Implements:
 * - In-flight promise deduplication (prevents duplicate simultaneous requests)
 * - Memory caching (prevents repeated fetches on re-renders)
 * - Safe error handling (avoids endless retries on persistent PostgreSQL/RLS errors)
 * - Offline detection (does not fire network requests when offline)
 */
export async function getAuthorizedUserStudios(userId: string): Promise<StudioOption[]> {
  if (!userId) return [];

  // Check cache validity
  const cached = studioCache.get(userId);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    if (cached.isPersistentError) {
      // Don't hammer the server on persistent errors; return empty list gracefully
      return [];
    }
    return cached.data;
  }

  // Deduplicate in-flight requests
  const existingPromise = inFlightRequests.get(userId);
  if (existingPromise) {
    return existingPromise;
  }

  const fetchPromise = (async () => {
    try {
      if (typeof window !== "undefined" && !navigator.onLine) {
        // Return cached or empty if offline
        return cached?.data || [];
      }

      const supabase = createClient();
      const { data: memberships, error } = await supabase
        .from("studio_members")
        .select(`
          studio_id,
          role,
          studios:studio_id (id, name)
        `)
        .eq("user_id", userId)
        .in("role", ["owner", "admin"]);

      if (error) {
        // Distinguish persistent DB/RLS errors (like 42P17 or 500) from transient network failures
        const isPersistent =
          error.code?.startsWith("42") ||
          error.code === "PGRST" ||
          (error as any).status === 500 ||
          (error as any).status === 403 ||
          (error as any).status === 401;

        if (isPersistent) {
          studioCache.set(userId, {
            data: [],
            timestamp: now,
            isPersistentError: true,
          });
        }
        console.warn("Could not retrieve authorized studios:", error.message || error);
        return [];
      }

      const studios = (memberships || [])
        .map((m: any) => m.studios)
        .filter(Boolean) as StudioOption[];

      // Cache successful result
      studioCache.set(userId, {
        data: studios,
        timestamp: now,
        isPersistentError: false,
      });

      return studios;
    } catch (err: any) {
      console.warn("Unexpected error fetching studios:", err?.message || err);
      return [];
    } finally {
      inFlightRequests.delete(userId);
    }
  })();

  inFlightRequests.set(userId, fetchPromise);
  return fetchPromise;
}

/**
 * Invalidate the studio cache (e.g. after creating or joining a studio).
 */
export function invalidateStudioCache(userId?: string) {
  if (userId) {
    studioCache.delete(userId);
    inFlightRequests.delete(userId);
  } else {
    studioCache.clear();
    inFlightRequests.clear();
  }
}
