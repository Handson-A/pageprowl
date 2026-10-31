import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getSafeRedirectUrl } from "../../src/lib/auth/redirect.ts";
import { SUPPORTED_GENRES, isValidGenre } from "../../src/lib/constants/genres.ts";

describe("Global UX States & Network Resilience Audit", () => {
  describe("1. Empty State vs Search No Results Distinction", () => {
    function resolveCatalogViewType(params: {
      itemsCount: number;
      searchQuery?: string;
      genre?: string;
      format?: string;
    }) {
      if (params.itemsCount > 0) {
        return "has_content";
      }

      const hasActiveSearch = !!(params.searchQuery && params.searchQuery.trim().length > 0);
      const hasActiveGenre = !!(params.genre && params.genre !== "All");
      const hasActiveFormat = !!params.format;

      if (hasActiveSearch || hasActiveGenre || hasActiveFormat) {
        return "search_no_results";
      }

      return "catalog_genuinely_empty";
    }

    test("Identifies genuinely empty catalog when no filters are set and count is 0", () => {
      const view = resolveCatalogViewType({
        itemsCount: 0,
        searchQuery: "",
        genre: "All",
        format: undefined,
      });
      assert.equal(view, "catalog_genuinely_empty");
    });

    test("Identifies search no results when search query is active", () => {
      const view = resolveCatalogViewType({
        itemsCount: 0,
        searchQuery: "cyberpunk detective",
        genre: "All",
      });
      assert.equal(view, "search_no_results");
    });

    test("Identifies search no results when specific genre filter is active", () => {
      const view = resolveCatalogViewType({
        itemsCount: 0,
        genre: "Horror",
      });
      assert.equal(view, "search_no_results");
    });

    test("Identifies search no results when format filter is active", () => {
      const view = resolveCatalogViewType({
        itemsCount: 0,
        genre: "All",
        format: "scroll",
      });
      assert.equal(view, "search_no_results");
    });

    test("Identifies has_content when catalog contains items", () => {
      const view = resolveCatalogViewType({
        itemsCount: 5,
        searchQuery: "hero",
      });
      assert.equal(view, "has_content");
    });
  });

  describe("2. Partial Batch Upload Failure & Recovery Invariant", () => {
    interface UploadBatchResult {
      uploadedPages: { pageNumber: number; url: string }[];
      failedFiles: string[];
      canRetryRemaining: boolean;
    }

    function processBatchUpload(
      files: { name: string; size: number; type: string }[],
      mockNetworkFailIndex?: number
    ): UploadBatchResult {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSizeBytes = 10 * 1024 * 1024;

      const uploaded: { pageNumber: number; url: string }[] = [];
      const failed: string[] = [];

      files.forEach((file, index) => {
        if (!validTypes.includes(file.type)) {
          failed.push(`${file.name} (unsupported format)`);
          return;
        }
        if (file.size > maxSizeBytes) {
          failed.push(`${file.name} (exceeds 10MB)`);
          return;
        }
        if (mockNetworkFailIndex !== undefined && index === mockNetworkFailIndex) {
          failed.push(`${file.name} (transient network failure)`);
          return;
        }

        uploaded.push({
          pageNumber: uploaded.length + 1,
          url: `https://res.cloudinary.com/panelverse/image/upload/${file.name}`,
        });
      });

      return {
        uploadedPages: uploaded,
        failedFiles: failed,
        canRetryRemaining: failed.length > 0,
      };
    }

    test("Preserves successful uploads when a single file in batch fails due to network error", () => {
      const files = [
        { name: "page_01.png", size: 1024 * 1024, type: "image/png" },
        { name: "page_02.png", size: 1024 * 1024, type: "image/png" },
        { name: "page_03.png", size: 1024 * 1024, type: "image/png" },
      ];

      // Simulate network drop on page_02 (index 1)
      const res = processBatchUpload(files, 1);

      assert.equal(res.uploadedPages.length, 2);
      assert.equal(res.failedFiles.length, 1);
      assert.match(res.failedFiles[0], /page_02\.png.*network/i);
      assert.equal(res.canRetryRemaining, true);
    });

    test("Rejects invalid file types and oversized files while accepting valid files", () => {
      const files = [
        { name: "valid_01.jpg", size: 2 * 1024 * 1024, type: "image/jpeg" },
        { name: "invalid.pdf", size: 1024 * 1024, type: "application/pdf" },
        { name: "huge.png", size: 15 * 1024 * 1024, type: "image/png" },
        { name: "valid_02.webp", size: 3 * 1024 * 1024, type: "image/webp" },
      ];

      const res = processBatchUpload(files);

      assert.equal(res.uploadedPages.length, 2);
      assert.equal(res.failedFiles.length, 2);
      assert.match(res.failedFiles[0], /invalid\.pdf.*format/i);
      assert.match(res.failedFiles[1], /huge\.png.*10MB/i);
    });
  });

  describe("3. Form Input Preservation on Validation & Network Error", () => {
    function simulateFormSubmission(
      initialForm: { title: string; synopsis: string; genre: string },
      isOffline: boolean
    ) {
      // Offline guard
      if (isOffline) {
        return {
          success: false,
          error: "You are currently offline. Please reconnect and retry.",
          preservedForm: { ...initialForm },
        };
      }

      // Title validation
      if (!initialForm.title.trim()) {
        return {
          success: false,
          error: "Title is required.",
          preservedForm: { ...initialForm },
        };
      }

      // Synopsis validation
      if (initialForm.synopsis.length < 10) {
        return {
          success: false,
          error: "Synopsis must be at least 10 characters.",
          preservedForm: { ...initialForm },
        };
      }

      return {
        success: true,
        error: null,
        preservedForm: { ...initialForm },
      };
    }

    test("Preserves all entered form inputs when offline error is triggered", () => {
      const draft = {
        title: "Chronicles of the Void",
        synopsis: "A sci-fi epic spanning three solar systems with intricate politics.",
        genre: "Sci-Fi",
      };

      const res = simulateFormSubmission(draft, true);

      assert.equal(res.success, false);
      assert.match(res.error!, /offline/i);
      assert.deepEqual(res.preservedForm, draft);
    });

    test("Preserves valid fields when one field fails validation", () => {
      const invalidDraft = {
        title: "Short Tale",
        synopsis: "Too short", // < 10 chars
        genre: "Fantasy",
      };

      const res = simulateFormSubmission(invalidDraft, false);

      assert.equal(res.success, false);
      assert.match(res.error!, /synopsis/i);
      // Valid title and genre are retained
      assert.equal(res.preservedForm.title, "Short Tale");
      assert.equal(res.preservedForm.genre, "Fantasy");
    });
  });

  describe("4. Session Expiry & Safe Return Navigation", () => {
    test("Preserves deep studio series destination on login redirect", () => {
      const deepPath = "/studio/series/series-uuid-1234/episodes/ep-uuid-5678";
      const safe = getSafeRedirectUrl(deepPath, "/studio");
      assert.equal(safe, deepPath);
    });

    test("Preserves query parameters on return destination", () => {
      const pathWithQuery = "/browse?genre=Action&format=scroll";
      const safe = getSafeRedirectUrl(pathWithQuery, "/browse");
      assert.equal(safe, pathWithQuery);
    });

    test("Neutralizes open redirect attacks attempting to hijack login return path", () => {
      const attack = "https://malicious-external-site.com/steal-session";
      const safe = getSafeRedirectUrl(attack, "/studio");
      assert.equal(safe, "/studio");
    });

    test("Neutralizes self-referential redirect loops back to login", () => {
      const loop = "/login?redirect=/studio";
      const safe = getSafeRedirectUrl(loop, "/studio");
      assert.equal(safe, "/studio");
    });
  });

  describe("5. Slow Network Latency Indicator Threshold", () => {
    function getLatencyMessage(elapsedMs: number): string | null {
      const SLOW_THRESHOLD_MS = 8000;
      if (elapsedMs >= SLOW_THRESHOLD_MS) {
        return "This operation is taking longer than expected due to network latency. Please wait...";
      }
      return null;
    }

    test("No warning triggered for fast requests (<8s)", () => {
      assert.equal(getLatencyMessage(1200), null);
      assert.equal(getLatencyMessage(7900), null);
    });

    test("Displays honest latency notice when request exceeds 8s", () => {
      const msg = getLatencyMessage(8500);
      assert.notEqual(msg, null);
      assert.match(msg!, /latency/i);
    });
  });
});
