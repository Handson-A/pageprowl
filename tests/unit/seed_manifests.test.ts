import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { SEED_CREATORS } from "../../scripts/seed/fixtures/creators.ts";
import { SEED_STUDIOS } from "../../scripts/seed/fixtures/studios.ts";
import { ALL_SEED_SERIES } from "../../scripts/seed/fixtures/series/index.ts";
import { SUPPORTED_GENRES, isValidGenre } from "../../src/lib/constants/genres.ts";

describe("Seed Architecture Manifest Validation", () => {
  test("1. Creators count, uniqueness, and integrity", () => {
    assert.equal(SEED_CREATORS.length, 15, "Must define exactly 15 creators.");

    const usernames = new Set<string>();
    const ids = new Set<string>();

    for (const c of SEED_CREATORS) {
      assert.ok(c.id, "Creator must have id");
      assert.ok(!ids.has(c.id), `Duplicate creator id: ${c.id}`);
      ids.add(c.id);

      assert.ok(c.username, "Creator must have username");
      assert.ok(!usernames.has(c.username), `Duplicate username: ${c.username}`);
      usernames.add(c.username);

      assert.ok(c.displayName.length >= 2, "Display name must be at least 2 chars");
      assert.ok(c.penName.length >= 2, "Pen name must be at least 2 chars");
      assert.ok(c.bio.length >= 10, "Bio must be meaningful");
      assert.ok(c.avatarPrompt.length >= 15, "Avatar prompt must be descriptive");
    }
  });

  test("2. Studios count, membership, and ownership hierarchy", () => {
    assert.equal(SEED_STUDIOS.length, 4, "Must define exactly 4 studios.");

    const creatorUsernames = new Set(SEED_CREATORS.map((c) => c.username));
    const studioSlugs = new Set<string>();

    for (const s of SEED_STUDIOS) {
      assert.ok(!studioSlugs.has(s.slug), `Duplicate studio slug: ${s.slug}`);
      studioSlugs.add(s.slug);

      assert.ok(
        creatorUsernames.has(s.createdByUsername),
        `Studio created_by '${s.createdByUsername}' must reference a valid creator`
      );

      assert.ok(s.members.length >= 2, "Studio must have at least 2 members");

      const memberUsernames = new Set<string>();
      let hasOwner = false;

      for (const m of s.members) {
        assert.ok(
          creatorUsernames.has(m.creatorUsername),
          `Studio member '${m.creatorUsername}' must be a valid creator`
        );
        assert.ok(
          !memberUsernames.has(m.creatorUsername),
          `Duplicate member in studio '${s.slug}': ${m.creatorUsername}`
        );
        memberUsernames.add(m.creatorUsername);

        if (m.role === "owner") hasOwner = true;
      }

      assert.ok(hasOwner, `Studio '${s.slug}' must have at least one owner`);
    }
  });

  test("3. 50 Series Count, Exact Genre Distribution, and Ownership Distribution", () => {
    assert.equal(ALL_SEED_SERIES.length, 50, "Must define exactly 50 series.");

    const genreCounts: Record<string, number> = {};
    for (const g of SUPPORTED_GENRES) {
      genreCounts[g] = 0;
    }

    let individualOwnedCount = 0;
    let studioOwnedCount = 0;

    const creatorUsernames = new Set(SEED_CREATORS.map((c) => c.username));
    const studioSlugs = new Set(SEED_STUDIOS.map((s) => s.slug));
    const seriesSlugs = new Set<string>();
    const seriesIds = new Set<string>();

    let totalEpisodes = 0;
    let totalPages = 0;

    for (const series of ALL_SEED_SERIES) {
      assert.ok(!seriesIds.has(series.id), `Duplicate series ID: ${series.id}`);
      seriesIds.add(series.id);

      assert.ok(!seriesSlugs.has(series.slug), `Duplicate series slug: ${series.slug}`);
      seriesSlugs.add(series.slug);

      assert.ok(isValidGenre(series.genre), `Invalid genre: ${series.genre}`);
      genreCounts[series.genre] = (genreCounts[series.genre] || 0) + 1;

      assert.ok(
        ["scroll", "page"].includes(series.format),
        `Format must be 'scroll' or 'page', got '${series.format}'`
      );

      assert.ok(
        series.synopsis.length >= 10 && series.synopsis.length <= 2000,
        `Synopsis length must be 10-2000 chars for series: ${series.title}`
      );

      if (series.ownerType === "individual") {
        individualOwnedCount++;
        assert.ok(
          creatorUsernames.has(series.ownerRef),
          `Individual ownerRef '${series.ownerRef}' must reference a valid creator`
        );
      } else if (series.ownerType === "studio") {
        studioOwnedCount++;
        assert.ok(
          studioSlugs.has(series.ownerRef),
          `Studio ownerRef '${series.ownerRef}' must reference a valid studio`
        );
      } else {
        assert.fail(`Invalid ownerType: ${series.ownerType}`);
      }

      assert.ok(
        series.episodes.length >= 3,
        `Series '${series.title}' must have at least 3 episodes, has ${series.episodes.length}`
      );

      const episodeNumbers = new Set<number>();
      const episodeSlugs = new Set<string>();

      for (const ep of series.episodes) {
        assert.ok(!episodeNumbers.has(ep.episodeNumber), `Duplicate episode number in ${series.slug}: ${ep.episodeNumber}`);
        episodeNumbers.add(ep.episodeNumber);

        assert.ok(!episodeSlugs.has(ep.slug), `Duplicate episode slug in ${series.slug}: ${ep.slug}`);
        episodeSlugs.add(ep.slug);

        const hasTextContent = typeof ep.textContent === "string" && ep.textContent.trim().length >= 500;
        const hasPages = Array.isArray(ep.pages) && ep.pages.length >= 4;

        assert.ok(
          hasTextContent || hasPages,
          `Episode '${ep.title}' in series '${series.title}' must have either substantial text content (>= 500 chars) or at least 4 comic pages. Got pages: ${ep.pages?.length || 0}, text length: ${ep.textContent?.length || 0}`
        );

        if (hasPages && ep.pages) {
          const pageNumbers = new Set<number>();
          for (const p of ep.pages) {
            assert.ok(!pageNumbers.has(p.pageNumber), `Duplicate page number ${p.pageNumber} in ${ep.slug}`);
            pageNumbers.add(p.pageNumber);
            assert.ok(p.imagePrompt.length >= 10, "Page image prompt must be descriptive");
            totalPages++;
          }
        }

        totalEpisodes++;
      }
    }

    // Verify genre distribution: exactly 5 per genre
    for (const g of SUPPORTED_GENRES) {
      assert.equal(
        genreCounts[g],
        5,
        `Genre '${g}' must have exactly 5 series, got ${genreCounts[g]}`
      );
    }

    // Verify ownership distribution
    assert.equal(
      individualOwnedCount,
      35,
      `Must have exactly 35 individually-owned series, got ${individualOwnedCount}`
    );
    assert.equal(
      studioOwnedCount,
      15,
      `Must have exactly 15 studio-owned series, got ${studioOwnedCount}`
    );

    // Verify total volume targets
    assert.ok(
      totalEpisodes >= 150,
      `Total episodes must be at least 150, got ${totalEpisodes}`
    );
  });
});
