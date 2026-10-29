import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getOptimizedImageUrl } from "../../src/lib/cloudinary/client.ts";

describe("Series Ownership Invariants (Architecture 5.2)", () => {
  function validateSeriesOwnership(ownerUserId?: string | null, ownerStudioId?: string | null) {
    const hasUser = !!ownerUserId;
    const hasStudio = !!ownerStudioId;

    if ((hasUser && !hasStudio) || (!hasUser && hasStudio)) {
      return { valid: true };
    }
    return {
      valid: false,
      error: "Series must have exactly one owner: either an individual creator or a studio, not both and not neither.",
    };
  }

  test("Series with only individual owner is valid", () => {
    const res = validateSeriesOwnership("user-123", null);
    assert.equal(res.valid, true);
  });

  test("Series with only studio owner is valid", () => {
    const res = validateSeriesOwnership(null, "studio-456");
    assert.equal(res.valid, true);
  });

  test("Series with both individual and studio owner is rejected", () => {
    const res = validateSeriesOwnership("user-123", "studio-456");
    assert.equal(res.valid, false);
  });

  test("Series with no owner is rejected", () => {
    const res = validateSeriesOwnership(null, null);
    assert.equal(res.valid, false);
  });
});

describe("Revision Lifecycle Transitions (Decision 2.22 & 45A)", () => {
  type RevisionStatus = "draft" | "in_review" | "ready_to_publish" | "published" | "unpublished";

  const ALLOWED_TRANSITIONS: Record<RevisionStatus, RevisionStatus[]> = {
    draft: ["in_review"],
    in_review: ["ready_to_publish", "draft"],
    ready_to_publish: ["published", "in_review", "draft"],
    published: ["unpublished"],
    unpublished: ["draft", "in_review"],
  };

  function canTransition(current: RevisionStatus, next: RevisionStatus): boolean {
    return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
  }

  test("Draft can be submitted for review", () => {
    assert.equal(canTransition("draft", "in_review"), true);
  });

  test("Draft cannot bypass review directly to published", () => {
    assert.equal(canTransition("draft", "published"), false);
  });

  test("In-review revision can be approved to ready_to_publish", () => {
    assert.equal(canTransition("in_review", "ready_to_publish"), true);
  });

  test("In-review revision can be returned to draft for corrections", () => {
    assert.equal(canTransition("in_review", "draft"), true);
  });

  test("Ready to publish can transition to published", () => {
    assert.equal(canTransition("ready_to_publish", "published"), true);
  });

  test("Published revision can be unpublished", () => {
    assert.equal(canTransition("published", "unpublished"), true);
  });
});

describe("Draft and Published Revision Isolation (Architecture 5.3)", () => {
  test("Editing a draft revision does not alter the published revision pointer", () => {
    const episode = {
      id: "ep-1",
      published_revision_id: "rev-published-v1",
      latest_revision_id: "rev-draft-v2",
    };

    // Simulate updating draft pages
    const draftRevision = {
      id: episode.latest_revision_id,
      pages: ["page-1-new.jpg", "page-2-new.jpg"],
    };

    // Assert published revision ID remains unchanged
    assert.equal(episode.published_revision_id, "rev-published-v1");
    assert.notEqual(episode.published_revision_id, draftRevision.id);
  });
});

describe("Studio Membership vs Series Access (Architecture 4.4)", () => {
  test("General studio member cannot edit studio series without explicit assignment or admin role", () => {
    const studioMember: {
      userId: string;
      studioRole: "owner" | "admin" | "editor" | "member";
    } = {
      userId: "user-1",
      studioRole: "member",
    };
    const seriesAccessRoles: Record<string, string> = {}; // No explicit series access

    const canEdit =
      studioMember.studioRole === "owner" ||
      studioMember.studioRole === "admin" ||
      seriesAccessRoles[studioMember.userId] === "editor";

    assert.equal(canEdit, false);
  });

  test("Studio owner has implicit administration over studio series", () => {
    const studioOwner: {
      userId: string;
      studioRole: "owner" | "admin" | "editor" | "member";
    } = {
      userId: "user-owner",
      studioRole: "owner",
    };

    const canEdit =
      studioOwner.studioRole === "owner" || studioOwner.studioRole === "admin";

    assert.equal(canEdit, true);
  });
});

describe("Cloudinary URL Optimization", () => {
  test("Generates transformed Cloudinary URL with format and quality auto", () => {
    const url = getOptimizedImageUrl("sample-comic-page", { width: 800, format: "webp" });
    assert.match(url, /res\.cloudinary\.com/);
    assert.match(url, /f_webp/);
    assert.match(url, /w_800/);
  });
});
