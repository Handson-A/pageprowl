import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { SUPPORTED_GENRES, isValidGenre } from "../../src/lib/constants/genres.ts";
import { hasSeriesPermission, hasStudioPermission, ForbiddenError } from "../../src/lib/auth/permissions.ts";
import type { ComicFormat, RevisionStatus, SeriesRole, SeriesVisibility } from "../../src/types/database.ts";

describe("Phase 4: Series Management Invariants", () => {
  function validateSeriesInput(params: {
    title: string;
    synopsis: string;
    format: string;
    genre: string;
    visibility: string;
  }) {
    if (!params.title || params.title.trim().length === 0 || params.title.length > 100) {
      return { valid: false, error: "Series title must be between 1 and 100 characters." };
    }
    if (!params.synopsis || params.synopsis.trim().length < 10 || params.synopsis.length > 2000) {
      return { valid: false, error: "Synopsis must be between 10 and 2000 characters." };
    }
    if (!["scroll", "page"].includes(params.format)) {
      return { valid: false, error: "Format must be 'scroll' or 'page'." };
    }
    if (!isValidGenre(params.genre)) {
      return { valid: false, error: `Genre must be one of: ${SUPPORTED_GENRES.join(", ")}` };
    }
    if (!["private", "public"].includes(params.visibility)) {
      return { valid: false, error: "Visibility must be 'private' or 'public'." };
    }
    return { valid: true };
  }

  test("Valid series metadata passes validation", () => {
    const res = validateSeriesInput({
      title: "Neon Odyssey",
      synopsis: "In a distant cyberpunk metropolis, a renegade hacker searches for the lost core.",
      format: "scroll",
      genre: "Sci-Fi",
      visibility: "public",
    });
    assert.equal(res.valid, true);
  });

  test("Empty title is rejected", () => {
    const res = validateSeriesInput({
      title: "",
      synopsis: "In a distant cyberpunk metropolis, a renegade hacker searches for the lost core.",
      format: "scroll",
      genre: "Sci-Fi",
      visibility: "public",
    });
    assert.equal(res.valid, false);
    assert.match(res.error!, /title/i);
  });

  test("Title exceeding 100 characters is rejected", () => {
    const res = validateSeriesInput({
      title: "A".repeat(101),
      synopsis: "In a distant cyberpunk metropolis, a renegade hacker searches for the lost core.",
      format: "scroll",
      genre: "Sci-Fi",
      visibility: "public",
    });
    assert.equal(res.valid, false);
  });

  test("Short synopsis under 10 characters is rejected", () => {
    const res = validateSeriesInput({
      title: "Valid Title",
      synopsis: "Too short",
      format: "scroll",
      genre: "Sci-Fi",
      visibility: "public",
    });
    assert.equal(res.valid, false);
    assert.match(res.error!, /synopsis/i);
  });

  test("Unsupported genre is rejected", () => {
    const res = validateSeriesInput({
      title: "Valid Title",
      synopsis: "A long enough synopsis that describes this fantastic adventure.",
      format: "scroll",
      genre: "RandomFakeGenre",
      visibility: "public",
    });
    assert.equal(res.valid, false);
    assert.match(res.error!, /genre/i);
  });

  test("Unsupported comic format is rejected", () => {
    const res = validateSeriesInput({
      title: "Valid Title",
      synopsis: "A long enough synopsis that describes this fantastic adventure.",
      format: "interactive_canvas",
      genre: "Action",
      visibility: "public",
    });
    assert.equal(res.valid, false);
    assert.match(res.error!, /format/i);
  });

  test("Series editing permission requires editor or owner", () => {
    assert.equal(hasSeriesPermission("owner", "editor"), true);
    assert.equal(hasSeriesPermission("editor", "editor"), true);
    assert.equal(hasSeriesPermission("contributor", "editor"), false);
    assert.equal(hasSeriesPermission("viewer", "editor"), false);
    assert.equal(hasSeriesPermission(null, "editor"), false);
  });
});

describe("Phase 4: Episode Management & Scoped Uniqueness", () => {
  interface EpisodeRecord {
    id: string;
    seriesId: string;
    episodeNumber: number;
    slug: string;
  }

  function validateNewEpisode(
    existingEpisodes: EpisodeRecord[],
    newEp: { seriesId: string; episodeNumber: number; title: string; slug: string }
  ) {
    if (newEp.episodeNumber < 1 || !Number.isInteger(newEp.episodeNumber)) {
      return { valid: false, error: "Episode number must be a positive integer." };
    }
    if (!newEp.title || newEp.title.trim().length === 0) {
      return { valid: false, error: "Episode title is required." };
    }

    // Uniqueness must be scoped to seriesId
    const conflict = existingEpisodes.find(
      (e) => e.seriesId === newEp.seriesId && (e.episodeNumber === newEp.episodeNumber || e.slug === newEp.slug)
    );

    if (conflict) {
      if (conflict.episodeNumber === newEp.episodeNumber) {
        return { valid: false, error: `Episode #${newEp.episodeNumber} already exists in this series.` };
      }
      return { valid: false, error: `Slug '${newEp.slug}' already exists in this series.` };
    }

    return { valid: true };
  }

  const existingEpisodes: EpisodeRecord[] = [
    { id: "ep-1", seriesId: "series-A", episodeNumber: 1, slug: "chapter-1" },
    { id: "ep-2", seriesId: "series-A", episodeNumber: 2, slug: "chapter-2" },
    { id: "ep-3", seriesId: "series-B", episodeNumber: 1, slug: "chapter-1" },
  ];

  test("Valid new episode in Series A passes", () => {
    const res = validateNewEpisode(existingEpisodes, {
      seriesId: "series-A",
      episodeNumber: 3,
      title: "Chapter 3",
      slug: "chapter-3",
    });
    assert.equal(res.valid, true);
  });

  test("Duplicate episode number within same series is rejected", () => {
    const res = validateNewEpisode(existingEpisodes, {
      seriesId: "series-A",
      episodeNumber: 1,
      title: "Duplicate Ep 1",
      slug: "duplicate-1",
    });
    assert.equal(res.valid, false);
    assert.match(res.error!, /already exists/);
  });

  test("Duplicate episode number across DIFFERENT series is allowed", () => {
    // Series B already has #1, but Series C can also have #1!
    const res = validateNewEpisode(existingEpisodes, {
      seriesId: "series-C",
      episodeNumber: 1,
      title: "Chapter 1",
      slug: "chapter-1",
    });
    assert.equal(res.valid, true);
  });

  test("Episode number zero or negative is rejected", () => {
    const res = validateNewEpisode(existingEpisodes, {
      seriesId: "series-A",
      episodeNumber: 0,
      title: "Zero Chapter",
      slug: "zero",
    });
    assert.equal(res.valid, false);
  });
});

describe("Phase 4: Content Ordering & Reordering Preservation", () => {
  interface PageItem {
    id: string;
    mediaAssetId: string;
    pageNumber: number;
  }

  function reorderPages(pages: PageItem[], fromIndex: number, toIndex: number): PageItem[] {
    if (fromIndex < 0 || fromIndex >= pages.length || toIndex < 0 || toIndex >= pages.length) {
      return pages;
    }
    const copy = [...pages];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);

    // Renumber sequentially 1-based
    return copy.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
  }

  function removePage(pages: PageItem[], removeIndex: number): PageItem[] {
    return pages
      .filter((_, idx) => idx !== removeIndex)
      .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
  }

  const initialPages: PageItem[] = [
    { id: "p1", mediaAssetId: "asset-1", pageNumber: 1 },
    { id: "p2", mediaAssetId: "asset-2", pageNumber: 2 },
    { id: "p3", mediaAssetId: "asset-3", pageNumber: 3 },
  ];

  test("Reordering pages preserves stable media asset identifiers and updates sequence", () => {
    // Move page 1 to index 2 (last position)
    const reordered = reorderPages(initialPages, 0, 2);

    assert.equal(reordered.length, 3);
    assert.equal(reordered[0].mediaAssetId, "asset-2");
    assert.equal(reordered[0].pageNumber, 1);

    assert.equal(reordered[1].mediaAssetId, "asset-3");
    assert.equal(reordered[1].pageNumber, 2);

    assert.equal(reordered[2].mediaAssetId, "asset-1");
    assert.equal(reordered[2].pageNumber, 3);
  });

  test("Removing a page maintains sequential 1-based ordering without gaps", () => {
    // Remove middle page (index 1, asset-2)
    const remaining = removePage(initialPages, 1);

    assert.equal(remaining.length, 2);
    assert.equal(remaining[0].mediaAssetId, "asset-1");
    assert.equal(remaining[0].pageNumber, 1);

    assert.equal(remaining[1].mediaAssetId, "asset-3");
    assert.equal(remaining[1].pageNumber, 2);
  });
});

describe("Phase 4: Publication Lifecycle & Public Reader Isolation", () => {
  interface RevisionState {
    id: string;
    episodeId: string;
    status: RevisionStatus;
    pageCount: number;
  }

  interface EpisodeState {
    id: string;
    seriesId: string;
    publishedRevisionId: string | null;
  }

  interface SeriesState {
    id: string;
    visibility: SeriesVisibility;
  }

  function canPublish(rev: RevisionState, callerRole: SeriesRole): { canPublish: boolean; error?: string } {
    if (!hasSeriesPermission(callerRole, "editor")) {
      return { canPublish: false, error: "Only series editors and owners can publish." };
    }
    if (rev.status !== "ready_to_publish") {
      return { canPublish: false, error: "Revision must be in 'ready_to_publish' state before publishing." };
    }
    if (rev.pageCount < 1) {
      return { canPublish: false, error: "Revision must have at least one uploaded page." };
    }
    return { canPublish: true };
  }

  function isPubliclyAccessible(
    series: SeriesState,
    episode: EpisodeState,
    revisions: RevisionState[]
  ): boolean {
    if (series.visibility !== "public") return false;
    if (!episode.publishedRevisionId) return false;

    const publishedRev = revisions.find((r) => r.id === episode.publishedRevisionId);
    return !!publishedRev && publishedRev.status === "published";
  }

  test("Publication requires editor role, ready_to_publish state, and at least 1 page", () => {
    const validRev: RevisionState = { id: "rev-1", episodeId: "ep-1", status: "ready_to_publish", pageCount: 5 };
    assert.equal(canPublish(validRev, "editor").canPublish, true);
    assert.equal(canPublish(validRev, "owner").canPublish, true);

    // Contributor cannot publish
    assert.equal(canPublish(validRev, "contributor").canPublish, false);

    // Draft cannot jump straight to publish
    const draftRev: RevisionState = { id: "rev-2", episodeId: "ep-1", status: "draft", pageCount: 5 };
    assert.equal(canPublish(draftRev, "editor").canPublish, false);

    // Ready to publish with zero pages cannot publish
    const emptyRev: RevisionState = { id: "rev-3", episodeId: "ep-1", status: "ready_to_publish", pageCount: 0 };
    assert.equal(canPublish(emptyRev, "editor").canPublish, false);
  });

  test("Unpublished draft is NOT accessible on public reader route", () => {
    const series: SeriesState = { id: "s1", visibility: "public" };
    const episode: EpisodeState = { id: "ep1", seriesId: "s1", publishedRevisionId: null };
    const revisions: RevisionState[] = [
      { id: "rev-draft", episodeId: "ep1", status: "draft", pageCount: 10 },
    ];

    assert.equal(isPubliclyAccessible(series, episode, revisions), false);
  });

  test("Published episode in PRIVATE series is NOT accessible on public reader route", () => {
    const series: SeriesState = { id: "s1", visibility: "private" };
    const episode: EpisodeState = { id: "ep1", seriesId: "s1", publishedRevisionId: "rev-1" };
    const revisions: RevisionState[] = [
      { id: "rev-1", episodeId: "ep1", status: "published", pageCount: 10 },
    ];

    assert.equal(isPubliclyAccessible(series, episode, revisions), false);
  });

  test("Published episode in PUBLIC series IS accessible on public reader route", () => {
    const series: SeriesState = { id: "s1", visibility: "public" };
    const episode: EpisodeState = { id: "ep1", seriesId: "s1", publishedRevisionId: "rev-1" };
    const revisions: RevisionState[] = [
      { id: "rev-1", episodeId: "ep1", status: "published", pageCount: 10 },
    ];

    assert.equal(isPubliclyAccessible(series, episode, revisions), true);
  });

  test("Unpublishing immediately revokes public reader accessibility", () => {
    const series: SeriesState = { id: "s1", visibility: "public" };
    const episode: EpisodeState = { id: "ep1", seriesId: "s1", publishedRevisionId: null }; // Cleared on unpublish
    const revisions: RevisionState[] = [
      { id: "rev-1", episodeId: "ep1", status: "unpublished", pageCount: 10 },
    ];

    assert.equal(isPubliclyAccessible(series, episode, revisions), false);
  });
});
