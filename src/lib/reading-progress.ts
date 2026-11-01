/**
 * Local Reading Progress Retention Utilities
 * Stores reading progress in browser localStorage so anonymous and returning
 * readers can seamlessly resume their comic chapters across sessions.
 */

export interface ReadingProgressEntry {
  seriesSlug: string;
  seriesTitle: string;
  episodeSlug: string;
  episodeNumber: number;
  episodeTitle?: string;
  pageNumber: number;
  totalPages?: number;
  format?: string;
  coverUrl?: string | null;
  lastReadAt: number;
}

const STORAGE_PREFIX = "pageprowl_progress_";
const LEGACY_STORAGE_PREFIX = "panelverse_progress_";
const RECENT_SERIES_INDEX_KEY = "pageprowl_recent_series";
const LEGACY_RECENT_SERIES_INDEX_KEY = "panelverse_recent_series";
const MAX_RECENT_SERIES = 10;

function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "__pv_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save reading progress for a series episode and page.
 */
export function saveReadingProgress(
  entry: Omit<ReadingProgressEntry, "lastReadAt">
): void {
  if (!isStorageAvailable() || !entry.seriesSlug) return;

  try {
    const payload: ReadingProgressEntry = {
      ...entry,
      lastReadAt: Date.now(),
    };

    // Store individual series progress
    const itemKey = `${STORAGE_PREFIX}${entry.seriesSlug}`;
    window.localStorage.setItem(itemKey, JSON.stringify(payload));

    // Update recent index list
    const indexRaw =
      window.localStorage.getItem(RECENT_SERIES_INDEX_KEY) ||
      window.localStorage.getItem(LEGACY_RECENT_SERIES_INDEX_KEY);
    let seriesSlugs: string[] = [];
    if (indexRaw) {
      try {
        seriesSlugs = JSON.parse(indexRaw);
      } catch {
        seriesSlugs = [];
      }
    }

    // Move current series to top of recents
    seriesSlugs = [
      entry.seriesSlug,
      ...seriesSlugs.filter((s) => s !== entry.seriesSlug),
    ].slice(0, MAX_RECENT_SERIES);

    window.localStorage.setItem(
      RECENT_SERIES_INDEX_KEY,
      JSON.stringify(seriesSlugs)
    );
  } catch (err) {
    console.warn("Unable to save local reading progress:", err);
  }
}

/**
 * Get reading progress for a specific series.
 */
export function getSeriesReadingProgress(
  seriesSlug: string
): ReadingProgressEntry | null {
  if (!isStorageAvailable() || !seriesSlug) return null;

  try {
    const raw =
      window.localStorage.getItem(`${STORAGE_PREFIX}${seriesSlug}`) ||
      window.localStorage.getItem(`${LEGACY_STORAGE_PREFIX}${seriesSlug}`);
    if (!raw) return null;
    return JSON.parse(raw) as ReadingProgressEntry;
  } catch {
    return null;
  }
}

/**
 * Retrieve all recently read series with their progress, sorted by latest read.
 */
export function getAllReadingProgress(): ReadingProgressEntry[] {
  if (!isStorageAvailable()) return [];

  try {
    const indexRaw =
      window.localStorage.getItem(RECENT_SERIES_INDEX_KEY) ||
      window.localStorage.getItem(LEGACY_RECENT_SERIES_INDEX_KEY);
    if (!indexRaw) return [];

    const slugs: string[] = JSON.parse(indexRaw);
    const results: ReadingProgressEntry[] = [];

    for (const slug of slugs) {
      const entry = getSeriesReadingProgress(slug);
      if (entry) {
        results.push(entry);
      }
    }

    return results.sort((a, b) => b.lastReadAt - a.lastReadAt);
  } catch {
    return [];
  }
}

/**
 * Clear reading progress for a series.
 */
export function clearSeriesReadingProgress(seriesSlug: string): void {
  if (!isStorageAvailable() || !seriesSlug) return;

  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${seriesSlug}`);
    window.localStorage.removeItem(`${LEGACY_STORAGE_PREFIX}${seriesSlug}`);
    const indexRaw =
      window.localStorage.getItem(RECENT_SERIES_INDEX_KEY) ||
      window.localStorage.getItem(LEGACY_RECENT_SERIES_INDEX_KEY);
    if (indexRaw) {
      const slugs: string[] = JSON.parse(indexRaw);
      const filtered = slugs.filter((s) => s !== seriesSlug);
      window.localStorage.setItem(
        RECENT_SERIES_INDEX_KEY,
        JSON.stringify(filtered)
      );
    }
  } catch {
    // ignore
  }
}
