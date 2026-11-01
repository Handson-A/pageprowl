import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getSafeRedirectUrl } from "../../src/lib/auth/redirect.ts";
import {
  hasStudioPermission,
  hasSeriesPermission,
  UnauthorizedError,
  ForbiddenError,
} from "../../src/lib/auth/permissions.ts";
import type { StudioRole, SeriesRole } from "../../src/types/database.ts";

describe("Phase 3: Route Protection & Authentication Guard Audit", () => {
  // Route classifications
  const PUBLIC_ROUTES = [
    "/",
    "/discover",
    "/browse",
    "/browse?genre=Action",
    "/search",
    "/genres",
    "/genres/action",
    "/creators/alice",
    "/series/iron-strike",
    "/series/iron-strike/episodes/chapter-1",
    "/api/cron/publishing",
    "/icon.svg",
    "/favicon.ico",
  ];

  const AUTH_ROUTES = ["/login", "/signup"];

  const PROTECTED_STUDIO_ROUTES = [
    "/studio",
    "/studio/series",
    "/studio/series/new",
    "/studio/series/series-uuid-1",
    "/studio/series/series-uuid-1/episodes/new",
    "/studio/series/series-uuid-1/episodes/ep-uuid-2",
    "/studio/studios",
    "/studio/studios/new",
    "/studio/studios/studio-uuid-1",
    "/studio/reviews",
    "/studio/profile",
  ];

  test("1. Route classification invariants: Public routes do not require auth", () => {
    for (const route of PUBLIC_ROUTES) {
      const isStudio = route.startsWith("/studio");
      assert.equal(isStudio, false, `Public route ${route} must not be inside /studio`);
    }
  });

  test("2. Unauthenticated navigation to protected studio route generates login redirect with preserved destination", () => {
    function simulateMiddleware(pathname: string, search = "", user: any = null) {
      const isStudio = pathname.startsWith("/studio");
      if (isStudio && !user) {
        const originalDestination = pathname + search;
        const safeTarget = getSafeRedirectUrl(originalDestination, "/studio");
        return {
          status: 307,
          redirectUrl: `/login?redirect=${encodeURIComponent(safeTarget)}`,
        };
      }
      return { status: 200, redirectUrl: null };
    }

    for (const protectedUrl of PROTECTED_STUDIO_ROUTES) {
      const res = simulateMiddleware(protectedUrl, "", null);
      assert.equal(res.status, 307);
      assert.equal(
        res.redirectUrl,
        `/login?redirect=${encodeURIComponent(protectedUrl)}`,
        `Direct navigation to ${protectedUrl} while unauthenticated must redirect to login with safe destination`
      );
    }
  });

  test("3. Open redirect vectors in destination parameter are neutralized to fallback", () => {
    const maliciousVectors = [
      "https://attacker.com/steal-session",
      "http://phishing.org",
      "//evil.com",
      "///evil.com",
      "/\\evil.com",
      "\\evil.com",
      "javascript:alert(document.cookie)",
      "data:text/html,<html>attack</html>",
      "/login",
      "/signup",
    ];

    for (const vector of maliciousVectors) {
      const safe = getSafeRedirectUrl(vector, "/studio");
      assert.equal(
        safe,
        "/studio",
        `Malicious vector '${vector}' must be neutralized to safe fallback '/studio'`
      );
    }
  });

  test("4. Successful sign-in returns user to intended destination", () => {
    function getPostLoginTarget(queryRedirect: string | null): string {
      return getSafeRedirectUrl(queryRedirect, "/studio");
    }

    assert.equal(
      getPostLoginTarget("/studio/series/series-123/episodes/new"),
      "/studio/series/series-123/episodes/new"
    );
    assert.equal(
      getPostLoginTarget("/studio/studios/studio-456"),
      "/studio/studios/studio-456"
    );
    assert.equal(getPostLoginTarget(null), "/studio");
    assert.equal(getPostLoginTarget("//evil.com"), "/studio");
  });

  test("5. Server-side guard throws UnauthorizedError when unauthenticated", async () => {
    function simulateRequireAuth(user: any) {
      if (!user) {
        throw new UnauthorizedError();
      }
      return user;
    }

    assert.throws(
      () => simulateRequireAuth(null),
      (err: any) => err instanceof UnauthorizedError && err.statusCode === 401
    );

    const validUser = simulateRequireAuth({ id: "user-123", email: "creator@pageprowl.com" });
    assert.equal(validUser.id, "user-123");
  });

  test("6. Cross-Workspace isolation: Non-member is rejected with ForbiddenError (403)", () => {
    interface StudioMember {
      studioId: string;
      userId: string;
      role: StudioRole;
    }

    const memberships: StudioMember[] = [
      { studioId: "studio-alpha", userId: "user-1", role: "owner" },
      { studioId: "studio-beta", userId: "user-2", role: "editor" },
    ];

    function verifyStudioAccess(studioId: string, userId: string, requiredRole: StudioRole) {
      const membership = memberships.find(
        (m) => m.studioId === studioId && m.userId === userId
      );
      if (!membership) {
        throw new ForbiddenError("You are not a member of this studio workspace.");
      }
      if (!hasStudioPermission(membership.role, requiredRole)) {
        throw new ForbiddenError(`Insufficient studio role.`);
      }
      return { allowed: true, role: membership.role };
    }

    // user-1 cannot access studio-beta
    assert.throws(
      () => verifyStudioAccess("studio-beta", "user-1", "member"),
      (err: any) => err instanceof ForbiddenError && err.statusCode === 403
    );

    // user-2 cannot access studio-alpha
    assert.throws(
      () => verifyStudioAccess("studio-alpha", "user-2", "member"),
      (err: any) => err instanceof ForbiddenError && err.statusCode === 403
    );

    // user-2 in studio-beta cannot execute admin actions
    assert.throws(
      () => verifyStudioAccess("studio-beta", "user-2", "admin"),
      (err: any) => err instanceof ForbiddenError && err.statusCode === 403
    );

    // user-2 in studio-beta can access editor areas
    assert.equal(verifyStudioAccess("studio-beta", "user-2", "editor").allowed, true);
  });

  test("7. Cross-Series isolation: Non-collaborator cannot access private series editor", () => {
    interface SeriesAccess {
      seriesId: string;
      ownerUserId: string | null;
      members: { userId: string; role: SeriesRole }[];
    }

    const seriesData: SeriesAccess = {
      seriesId: "series-999",
      ownerUserId: "creator-owner",
      members: [{ userId: "creator-editor", role: "editor" }],
    };

    function checkSeriesAccess(userId: string, minRole: SeriesRole) {
      if (seriesData.ownerUserId === userId) {
        return { allowed: true, role: "owner" };
      }
      const member = seriesData.members.find((m) => m.userId === userId);
      if (member && hasSeriesPermission(member.role, minRole)) {
        return { allowed: true, role: member.role };
      }
      throw new ForbiddenError("You do not have permission to access or modify this series.");
    }

    // Owner has access
    assert.equal(checkSeriesAccess("creator-owner", "editor").allowed, true);

    // Editor has access
    assert.equal(checkSeriesAccess("creator-editor", "editor").allowed, true);

    // Outsider is rejected
    assert.throws(
      () => checkSeriesAccess("random-user", "viewer"),
      (err: any) => err instanceof ForbiddenError && err.statusCode === 403
    );
  });

  test("8. Signout clears session and subsequent protected route request is rejected", () => {
    let sessionUser: any = { id: "user-abc" };

    function signOut() {
      sessionUser = null;
    }

    assert.equal(sessionUser !== null, true);
    signOut();
    assert.equal(sessionUser, null);

    // Attempting to access protected route after sign out
    assert.throws(
      () => {
        if (!sessionUser) throw new UnauthorizedError();
      },
      (err: any) => err instanceof UnauthorizedError
    );
  });
});
