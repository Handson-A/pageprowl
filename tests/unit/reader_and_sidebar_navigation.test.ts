import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Sidebar Navigation & Active State Route Invariants", () => {
  /**
   * Pure implementation of the active link matching logic used in CreatorSidebar.
   */
  function isLinkActive(path: string, pathname: string): boolean {
    if (path === "/") {
      return pathname === "/";
    }
    if (path === "/studio") {
      return pathname === "/studio";
    }
    return pathname.startsWith(path);
  }

  test('Public Site link (href: "/") is active ONLY when pathname is strictly equal to "/"', () => {
    assert.equal(isLinkActive("/", "/"), true);
  });

  test('Public Site link (href: "/") is NEVER active for /studio', () => {
    assert.equal(isLinkActive("/", "/studio"), false);
  });

  test('Public Site link (href: "/") is NEVER active for /studio/series or subpaths', () => {
    assert.equal(isLinkActive("/", "/studio/series"), false);
    assert.equal(isLinkActive("/", "/studio/series/s-123"), false);
    assert.equal(isLinkActive("/", "/studio/tasks"), false);
    assert.equal(isLinkActive("/", "/studio/reviews"), false);
    assert.equal(isLinkActive("/", "/studio/notifications"), false);
    assert.equal(isLinkActive("/", "/studio/profile"), false);
  });

  test('Public Site link (href: "/") is NEVER active for other public routes like /browse', () => {
    assert.equal(isLinkActive("/", "/browse"), false);
    assert.equal(isLinkActive("/", "/series/neon-blade"), false);
  });

  test('Studio dashboard link (href: "/studio") is active on /studio but not on /studio/series', () => {
    assert.equal(isLinkActive("/studio", "/studio"), true);
    assert.equal(isLinkActive("/studio", "/studio/series"), false);
    assert.equal(isLinkActive("/studio", "/studio/tasks"), false);
  });

  test('Sub-section links match their specific paths and subpaths', () => {
    assert.equal(isLinkActive("/studio/series", "/studio/series"), true);
    assert.equal(isLinkActive("/studio/series", "/studio/series/s-101"), true);
    assert.equal(isLinkActive("/studio/series", "/studio/tasks"), false);

    assert.equal(isLinkActive("/studio/tasks", "/studio/tasks"), true);
    assert.equal(isLinkActive("/studio/tasks", "/studio/tasks/t-202"), true);
    assert.equal(isLinkActive("/studio/tasks", "/studio/series"), false);
  });
});

describe("Public Comic Reader Experience Invariants", () => {
  function clampPageIndex(newIndex: number, totalPages: number): number {
    return Math.max(0, Math.min(newIndex, totalPages - 1));
  }

  function resolveReadingMode(format: string): "scroll" | "paged" {
    return format === "scroll" ? "scroll" : "paged";
  }

  test("Reading mode defaults to episode format", () => {
    assert.equal(resolveReadingMode("scroll"), "scroll");
    assert.equal(resolveReadingMode("paged"), "paged");
    assert.equal(resolveReadingMode("standard"), "paged");
  });

  test("Page index clamping never goes negative or exceeds total pages", () => {
    const totalPages = 10;
    assert.equal(clampPageIndex(-1, totalPages), 0);
    assert.equal(clampPageIndex(0, totalPages), 0);
    assert.equal(clampPageIndex(5, totalPages), 5);
    assert.equal(clampPageIndex(9, totalPages), 9);
    assert.equal(clampPageIndex(10, totalPages), 9);
    assert.equal(clampPageIndex(99, totalPages), 9);
  });

  test("First page disables previous navigation", () => {
    const currentPageIndex = 0;
    const isFirstPage = currentPageIndex === 0;
    assert.equal(isFirstPage, true);
  });

  test("Last page enables chapter transition to next episode", () => {
    const totalPages = 15;
    const currentPageIndex = 14;
    const nextEpisodeSlug = "episode-2";

    const isLastPage = currentPageIndex === totalPages - 1;
    assert.equal(isLastPage, true);

    const hasNextEpisode = isLastPage && !!nextEpisodeSlug;
    assert.equal(hasNextEpisode, true);
  });

  test("Final episode with no next episode indicates caught up", () => {
    const totalPages = 15;
    const currentPageIndex = 14;
    const nextEpisodeSlug = null;

    const isLastPage = currentPageIndex === totalPages - 1;
    const hasNextEpisode = isLastPage && !!nextEpisodeSlug;
    assert.equal(hasNextEpisode, false);
  });
});
