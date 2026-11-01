import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  SUPPORTED_GENRES,
  isValidGenre,
  genreToSlug,
  slugToGenre,
  GENRE_METADATA,
} from "../../src/lib/constants/genres.ts";

describe("Phase 6: Public Discovery & Search Invariants", () => {
  describe("1. Genre Slug Mapping & Normalization", () => {
    test("Converts all supported genres to valid lowercase URL slugs", () => {
      assert.equal(genreToSlug("Action"), "action");
      assert.equal(genreToSlug("Fantasy"), "fantasy");
      assert.equal(genreToSlug("Sci-Fi"), "sci-fi");
      assert.equal(genreToSlug("Romance"), "romance");
      assert.equal(genreToSlug("Horror"), "horror");
      assert.equal(genreToSlug("Comedy"), "comedy");
      assert.equal(genreToSlug("Drama"), "drama");
      assert.equal(genreToSlug("Slice of Life"), "slice-of-life");
      assert.equal(genreToSlug("Mystery"), "mystery");
      assert.equal(genreToSlug("Supernatural"), "supernatural");
    });

    test("Resolves valid slugs back to their canonical SupportedGenre", () => {
      assert.equal(slugToGenre("action"), "Action");
      assert.equal(slugToGenre("sci-fi"), "Sci-Fi");
      assert.equal(slugToGenre("slice-of-life"), "Slice of Life");
      assert.equal(slugToGenre("supernatural"), "Supernatural");
      assert.equal(slugToGenre("FANTASY"), "Fantasy"); // case-insensitive
    });

    test("Rejects invalid genre slugs with null for safe 404 handling", () => {
      assert.equal(slugToGenre("unknown-genre"), null);
      assert.equal(slugToGenre("superheroes"), null);
      assert.equal(slugToGenre(""), null);
      assert.equal(slugToGenre("   "), null);
    });

    test("Every supported genre has complete metadata defined", () => {
      for (const genre of SUPPORTED_GENRES) {
        const meta = GENRE_METADATA[genre];
        assert.ok(meta, `Missing metadata for genre: ${genre}`);
        assert.equal(meta.name, genre);
        assert.equal(meta.slug, genreToSlug(genre));
        assert.ok(meta.tagline.length > 0);
        assert.ok(meta.description.length > 0);
      }
    });
  });

  describe("2. Public Catalog Pagination & Offset Bounds", () => {
    function calculatePagination(page: number, limit: number, total: number) {
      const safePage = Math.max(1, page || 1);
      const safeLimit = Math.max(1, Math.min(limit || 12, 50));
      const from = (safePage - 1) * safeLimit;
      const to = from + safeLimit - 1;
      const totalPages = Math.ceil(total / safeLimit);
      return { from, to, totalPages, safePage, safeLimit };
    }

    test("Calculates correct range for page 1 with default limit 12", () => {
      const p = calculatePagination(1, 12, 25);
      assert.equal(p.from, 0);
      assert.equal(p.to, 11);
      assert.equal(p.totalPages, 3);
    });

    test("Calculates correct range for page 2", () => {
      const p = calculatePagination(2, 12, 25);
      assert.equal(p.from, 12);
      assert.equal(p.to, 23);
      assert.equal(p.totalPages, 3);
    });

    test("Clamps negative or 0 page number to page 1", () => {
      const p = calculatePagination(-5, 12, 10);
      assert.equal(p.safePage, 1);
      assert.equal(p.from, 0);
    });

    test("Clamps excessive limit to 50 items max", () => {
      const p = calculatePagination(1, 500, 100);
      assert.equal(p.safeLimit, 50);
    });
  });

  describe("3. Public Visibility & Unpublished Isolation", () => {
    interface MockSeries {
      id: string;
      title: string;
      synopsis: string;
      visibility: "public" | "private" | "unlisted";
      hasPublishedEpisodes: boolean;
    }

    const seriesDataset: MockSeries[] = [
      {
        id: "s-1",
        title: "Neon Horizon",
        synopsis: "A cyberpunk cyber-detective story in Neo-Tokyo",
        visibility: "public",
        hasPublishedEpisodes: true,
      },
      {
        id: "s-2",
        title: "Dragon Kin",
        synopsis: "Mythic high fantasy dragon rider chronicles",
        visibility: "public",
        hasPublishedEpisodes: true,
      },
      {
        id: "s-3",
        title: "Top Secret Manga",
        synopsis: "Unannounced creator studio project",
        visibility: "private",
        hasPublishedEpisodes: false,
      },
      {
        id: "s-4",
        title: "Unlisted Beta Test",
        synopsis: "Direct link test only",
        visibility: "unlisted",
        hasPublishedEpisodes: true,
      },
    ];

    function filterPublicSeries(items: MockSeries[], search?: string) {
      return items.filter((item) => {
        // Invariant: Only public series can ever be returned
        if (item.visibility !== "public") return false;
        if (search && search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchSynopsis = item.synopsis.toLowerCase().includes(q);
          return matchTitle || matchSynopsis;
        }
        return true;
      });
    }

    test("Public catalog query strictly excludes private and unlisted series", () => {
      const results = filterPublicSeries(seriesDataset);
      assert.equal(results.length, 2);
      assert.ok(results.every((r) => r.visibility === "public"));
      assert.equal(results.some((r) => r.id === "s-3"), false);
      assert.equal(results.some((r) => r.id === "s-4"), false);
    });

    test("Search query matches title and synopsis but preserves public visibility invariant", () => {
      const results = filterPublicSeries(seriesDataset, "cyberpunk");
      assert.equal(results.length, 1);
      assert.equal(results[0].title, "Neon Horizon");

      // Attempting to search for private series keyword still returns empty
      const privateSearch = filterPublicSeries(seriesDataset, "Top Secret");
      assert.equal(privateSearch.length, 0);
    });
  });
});
