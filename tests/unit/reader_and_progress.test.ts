import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Phase 6: Comic Reader & Local Reading Progress Invariants", () => {
  describe("1. Chapter Navigation & Boundary Invariants", () => {
    interface EpisodeItem {
      slug: string;
      episode_number: number;
      title: string;
    }

    const episodes: EpisodeItem[] = [
      { slug: "chapter-1", episode_number: 1, title: "The Awakening" },
      { slug: "chapter-2", episode_number: 2, title: "Shadows in the Mist" },
      { slug: "chapter-3", episode_number: 3, title: "The Confrontation" },
    ];

    function resolveSurroundingEpisodes(
      all: EpisodeItem[],
      currentSlug: string
    ) {
      const idx = all.findIndex((e) => e.slug === currentSlug);
      if (idx === -1) {
        return { prev: null, next: null };
      }
      return {
        prev: idx > 0 ? all[idx - 1].slug : null,
        next: idx < all.length - 1 ? all[idx + 1].slug : null,
      };
    }

    test("First episode has no previous episode link", () => {
      const nav = resolveSurroundingEpisodes(episodes, "chapter-1");
      assert.equal(nav.prev, null);
      assert.equal(nav.next, "chapter-2");
    });

    test("Middle episode has both previous and next episode links", () => {
      const nav = resolveSurroundingEpisodes(episodes, "chapter-2");
      assert.equal(nav.prev, "chapter-1");
      assert.equal(nav.next, "chapter-3");
    });

    test("Final episode has no next episode link (all caught up)", () => {
      const nav = resolveSurroundingEpisodes(episodes, "chapter-3");
      assert.equal(nav.prev, "chapter-2");
      assert.equal(nav.next, null);
    });

    test("Unpublished or non-existent episode slug returns null for both", () => {
      const nav = resolveSurroundingEpisodes(episodes, "chapter-99");
      assert.equal(nav.prev, null);
      assert.equal(nav.next, null);
    });
  });

  describe("2. Reading Mode & Artwork Page Clamping", () => {
    function resolveReadingMode(format: string): "scroll" | "paged" {
      return format === "scroll" ? "scroll" : "paged";
    }

    function clampPage(requestedPage: number, totalPages: number): number {
      if (totalPages <= 0) return 1;
      return Math.max(1, Math.min(requestedPage, totalPages));
    }

    test("Resolves scroll format to scroll mode", () => {
      assert.equal(resolveReadingMode("scroll"), "scroll");
    });

    test("Resolves page or other format to paged mode", () => {
      assert.equal(resolveReadingMode("page"), "paged");
      assert.equal(resolveReadingMode("unknown"), "paged");
    });

    test("Clamps page numbers correctly within total page boundaries", () => {
      assert.equal(clampPage(0, 15), 1);
      assert.equal(clampPage(5, 15), 5);
      assert.equal(clampPage(15, 15), 15);
      assert.equal(clampPage(25, 15), 15);
      assert.equal(clampPage(-10, 15), 1);
    });
  });

  describe("3. Reading Progress Retention Logic", () => {
    interface ReadingProgress {
      seriesSlug: string;
      episodeSlug: string;
      episodeNumber: number;
      pageNumber: number;
      lastReadAt: number;
    }

    function updateRecentsList(
      currentRecents: string[],
      seriesSlug: string,
      maxItems = 10
    ): string[] {
      return [
        seriesSlug,
        ...currentRecents.filter((s) => s !== seriesSlug),
      ].slice(0, maxItems);
    }

    test("Updates recent series list with new entry at the top", () => {
      const recents = ["iron-blade", "solar-quest"];
      const updated = updateRecentsList(recents, "neon-city");
      assert.deepEqual(updated, ["neon-city", "iron-blade", "solar-quest"]);
    });

    test("Bumps existing series to the front without duplicating", () => {
      const recents = ["iron-blade", "solar-quest", "neon-city"];
      const updated = updateRecentsList(recents, "solar-quest");
      assert.deepEqual(updated, ["solar-quest", "iron-blade", "neon-city"]);
      assert.equal(updated.length, 3);
    });

    test("Limits recents list to max items threshold", () => {
      const initial = Array.from({ length: 10 }, (_, i) => `series-${i}`);
      const updated = updateRecentsList(initial, "series-new", 10);
      assert.equal(updated.length, 10);
      assert.equal(updated[0], "series-new");
      assert.equal(updated.includes("series-9"), false); // Last item evicted
    });
  });
});
