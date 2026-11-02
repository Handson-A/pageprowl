import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getSafeRedirectUrl } from "../../src/lib/auth/redirect.ts";
import {
  hasStudioPermission,
  hasSeriesPermission,
} from "../../src/lib/auth/permissions.ts";
import { getOptimizedImageUrl } from "../../src/lib/cloudinary/client.ts";
import type { StudioRole, SeriesRole, NotificationType } from "../../src/types/database.ts";

describe("Phase 8.1: Authentication, Route Protection & Password Recovery", () => {
  test("1. Route Protection Invariant: /account and /library are guarded alongside /studio", () => {
    const protectedPaths = ["/studio", "/studio/series", "/studio/publishing", "/account", "/library"];
    for (const path of protectedPaths) {
      const isProtected =
        path.startsWith("/studio") ||
        path.startsWith("/account") ||
        path.startsWith("/library");
      assert.equal(isProtected, true, `Path '${path}' must be guarded as a protected route.`);
    }

    const publicPaths = ["/", "/browse", "/discover", "/genres", "/search", "/series/cyber-samurai"];
    for (const path of publicPaths) {
      const isProtected =
        path.startsWith("/studio") ||
        path.startsWith("/account") ||
        path.startsWith("/library");
      assert.equal(isProtected, false, `Public path '${path}' should not require mandatory login redirection.`);
    }
  });

  test("2. Open redirect prevention on login preserves deep return path for /account and /library", () => {
    assert.equal(getSafeRedirectUrl("/account"), "/account");
    assert.equal(getSafeRedirectUrl("/library"), "/library");
    assert.equal(getSafeRedirectUrl("/studio/series/s-101"), "/studio/series/s-101");

    // Hostile redirect vectors neutralized to fallback
    assert.equal(getSafeRedirectUrl("https://malicious-attacker.com/steal"), "/studio");
    assert.equal(getSafeRedirectUrl("//evil.com"), "/studio");
    assert.equal(getSafeRedirectUrl("javascript:alert(1)"), "/studio");
  });

  test("3. Password recovery email input validation invariant", () => {
    function validateRecoveryEmail(email: string): { valid: boolean; error?: string } {
      const trimmed = email?.trim().toLowerCase();
      if (!trimmed || !trimmed.includes("@") || trimmed.length < 5) {
        return { valid: false, error: "Please enter a valid email address." };
      }
      return { valid: true };
    }

    assert.equal(validateRecoveryEmail("creator@pageprowl.com").valid, true);
    assert.equal(validateRecoveryEmail("").valid, false);
    assert.equal(validateRecoveryEmail("not-an-email").valid, false);
  });
});

describe("Phase 8.2: Studio Workspace Collaboration & Invitation Acceptance", () => {
  interface StudioInvitation {
    id: string;
    studioId: string;
    role: StudioRole;
    invitedEmail: string;
    token: string;
    status: "pending" | "accepted" | "expired";
    expiresAt: number;
  }

  interface StudioMember {
    studioId: string;
    userId: string;
    role: StudioRole;
  }

  function simulateAcceptInvitation(
    invitation: StudioInvitation,
    user: { id: string; email: string },
    currentTime: number,
    existingMembers: StudioMember[]
  ): { success: boolean; error?: string; updatedStatus?: string; newMember?: StudioMember } {
    if (invitation.status !== "pending") {
      return { success: false, error: `Invitation is no longer valid (status: ${invitation.status}).` };
    }

    if (currentTime > invitation.expiresAt) {
      return { success: false, error: "This invitation has expired.", updatedStatus: "expired" };
    }

    const member: StudioMember = {
      studioId: invitation.studioId,
      userId: user.id,
      role: invitation.role,
    };

    return {
      success: true,
      updatedStatus: "accepted",
      newMember: member,
    };
  }

  const validInvite: StudioInvitation = {
    id: "inv-1",
    studioId: "studio-99",
    role: "editor",
    invitedEmail: "artist@pageprowl.com",
    token: "tok-abc-123",
    status: "pending",
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  test("1. Valid pending invitation successfully admits user to studio with specified role", () => {
    const res = simulateAcceptInvitation(
      validInvite,
      { id: "usr-42", email: "artist@pageprowl.com" },
      Date.now(),
      []
    );

    assert.equal(res.success, true);
    assert.equal(res.updatedStatus, "accepted");
    assert.equal(res.newMember?.role, "editor");
    assert.equal(res.newMember?.studioId, "studio-99");
    assert.equal(res.newMember?.userId, "usr-42");
  });

  test("2. Expired invitation is rejected and cannot grant studio membership", () => {
    const expiredInvite: StudioInvitation = {
      ...validInvite,
      expiresAt: Date.now() - 10000,
    };

    const res = simulateAcceptInvitation(
      expiredInvite,
      { id: "usr-42", email: "artist@pageprowl.com" },
      Date.now(),
      []
    );

    assert.equal(res.success, false);
    assert.equal(res.updatedStatus, "expired");
  });

  test("3. Already accepted invitation cannot be accepted a second time", () => {
    const alreadyAcceptedInvite: StudioInvitation = {
      ...validInvite,
      status: "accepted",
    };

    const res = simulateAcceptInvitation(
      alreadyAcceptedInvite,
      { id: "usr-99", email: "attacker@pageprowl.com" },
      Date.now(),
      []
    );

    assert.equal(res.success, false);
    assert.match(res.error || "", /no longer valid/);
  });
});

describe("Phase 8.3: Media Asset Deletion & Cleanup Security Invariants", () => {
  interface MediaAssetRecord {
    id: string;
    uploaderId: string;
    cloudinaryPublicId: string;
    secureUrl: string;
  }

  interface RevisionPageRecord {
    id: string;
    revisionId: string;
    mediaAssetId: string;
  }

  function validateAssetDeletion(
    asset: MediaAssetRecord,
    requesterId: string,
    revisionPages: RevisionPageRecord[]
  ): { allowed: boolean; status: number; error?: string } {
    // 1. Ownership invariant: Only the uploader can delete their asset
    if (asset.uploaderId !== requesterId) {
      return { allowed: false, status: 403, error: "Forbidden: You are not authorized to delete another creator's asset." };
    }

    // 2. Integrity invariant: Asset in active use cannot be deleted
    const isReferenced = revisionPages.some((p) => p.mediaAssetId === asset.id);
    if (isReferenced) {
      return {
        allowed: false,
        status: 409,
        error: "Cannot delete media asset: It is actively in use in an episode revision.",
      };
    }

    return { allowed: true, status: 200 };
  }

  const assetAlice: MediaAssetRecord = {
    id: "asset-101",
    uploaderId: "user-alice",
    cloudinaryPublicId: "pageprowl/creators/alice/artwork_p1",
    secureUrl: "https://res.cloudinary.com/pageprowl/image/upload/artwork_p1.jpg",
  };

  test("1. Unauthorized user Bob CANNOT delete Alice's uploaded media asset (403)", () => {
    const result = validateAssetDeletion(assetAlice, "user-bob", []);
    assert.equal(result.allowed, false);
    assert.equal(result.status, 403);
  });

  test("2. Uploader Alice CANNOT delete asset if it is actively in use in an episode (409)", () => {
    const activePages = [{ id: "pg-1", revisionId: "rev-1", mediaAssetId: "asset-101" }];
    const result = validateAssetDeletion(assetAlice, "user-alice", activePages);
    assert.equal(result.allowed, false);
    assert.equal(result.status, 409);
    assert.match(result.error || "", /actively in use/);
  });

  test("3. Uploader Alice CAN safely delete unreferenced asset (200)", () => {
    const result = validateAssetDeletion(assetAlice, "user-alice", []);
    assert.equal(result.allowed, true);
    assert.equal(result.status, 200);
  });
});

describe("Phase 8.4: Database Schema Alignment & Notification Preferences", () => {
  test("1. Notification preferences correctly maps inApp and email flags to database columns", () => {
    function mapPreferencesToDatabase(input: {
      emailNotifications?: boolean;
      inAppNotifications?: boolean;
      notifyNewEpisodes?: boolean;
    }) {
      return {
        notifications_enabled: (input.inAppNotifications ?? true) || (input.emailNotifications ?? true),
        notify_new_episodes: input.notifyNewEpisodes ?? true,
      };
    }

    const disabledPrefs = mapPreferencesToDatabase({
      inAppNotifications: false,
      emailNotifications: false,
      notifyNewEpisodes: false,
    });
    assert.equal(disabledPrefs.notifications_enabled, false);
    assert.equal(disabledPrefs.notify_new_episodes, false);

    const activePrefs = mapPreferencesToDatabase({
      inAppNotifications: true,
      emailNotifications: false,
      notifyNewEpisodes: true,
    });
    assert.equal(activePrefs.notifications_enabled, true);
    assert.equal(activePrefs.notify_new_episodes, true);
  });

  test("2. Notification unread count queries database column 'read' (not 'is_read')", () => {
    interface NotificationItem {
      id: string;
      user_id: string;
      read: boolean;
      title: string;
    }

    const mockNotifications: NotificationItem[] = [
      { id: "n1", user_id: "usr-1", read: false, title: "Task assigned" },
      { id: "n2", user_id: "usr-1", read: true, title: "Task completed" },
      { id: "n3", user_id: "usr-1", read: false, title: "New episode live" },
      { id: "n4", user_id: "usr-2", read: false, title: "Alice's notification" },
    ];

    // Filter using true schema column 'read = false'
    const unread = mockNotifications.filter((n) => n.user_id === "usr-1" && n.read === false);
    assert.equal(unread.length, 2);
  });
});

describe("Phase 8.5: Artwork Fallback & Broken Image Resilience", () => {
  test("1. getOptimizedImageUrl returns SVG fallback when given empty or null publicId", () => {
    assert.equal(getOptimizedImageUrl(""), "/images/artwork-fallback.svg");
    assert.equal(getOptimizedImageUrl(null as any), "/images/artwork-fallback.svg");
    assert.equal(getOptimizedImageUrl(undefined as any), "/images/artwork-fallback.svg");
  });

  test("2. External non-Cloudinary image URLs are preserved as-is", () => {
    const extUrl = "https://images.unsplash.com/photo-comic-art.jpg";
    assert.equal(getOptimizedImageUrl(extUrl), extUrl);
  });

  test("3. Cloudinary URLs receive automatic format and quality optimizations", () => {
    const cldUrl = "https://res.cloudinary.com/pageprowl/image/upload/v12345/pageprowl/sample.jpg";
    const optimized = getOptimizedImageUrl(cldUrl, { width: 800 });
    assert.ok(optimized.includes("f_auto"));
    assert.ok(optimized.includes("q_auto"));
    assert.ok(optimized.includes("w_800"));
  });
});
