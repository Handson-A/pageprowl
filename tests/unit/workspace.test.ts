import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  hasStudioPermission,
  hasSeriesPermission,
  ForbiddenError,
} from "../../src/lib/auth/permissions.ts";
import type { StudioRole, SeriesRole } from "../../src/types/database.ts";

describe("Studio Role Hierarchy (hasStudioPermission)", () => {
  test("Owner role satisfies all studio role requirements", () => {
    assert.equal(hasStudioPermission("owner", "owner"), true);
    assert.equal(hasStudioPermission("owner", "admin"), true);
    assert.equal(hasStudioPermission("owner", "editor"), true);
    assert.equal(hasStudioPermission("owner", "member"), true);
  });

  test("Admin role satisfies admin, editor, and member, but NOT owner", () => {
    assert.equal(hasStudioPermission("admin", "owner"), false);
    assert.equal(hasStudioPermission("admin", "admin"), true);
    assert.equal(hasStudioPermission("admin", "editor"), true);
    assert.equal(hasStudioPermission("admin", "member"), true);
  });

  test("Editor role satisfies editor and member, but NOT admin or owner", () => {
    assert.equal(hasStudioPermission("editor", "owner"), false);
    assert.equal(hasStudioPermission("editor", "admin"), false);
    assert.equal(hasStudioPermission("editor", "editor"), true);
    assert.equal(hasStudioPermission("editor", "member"), true);
  });

  test("Member role only satisfies member requirements", () => {
    assert.equal(hasStudioPermission("member", "owner"), false);
    assert.equal(hasStudioPermission("member", "admin"), false);
    assert.equal(hasStudioPermission("member", "editor"), false);
    assert.equal(hasStudioPermission("member", "member"), true);
  });

  test("Null or undefined role satisfies nothing", () => {
    assert.equal(hasStudioPermission(null, "member"), false);
    assert.equal(hasStudioPermission(undefined, "member"), false);
  });
});

describe("Series Role Hierarchy (hasSeriesPermission)", () => {
  test("Series owner role satisfies all series requirements", () => {
    assert.equal(hasSeriesPermission("owner", "owner"), true);
    assert.equal(hasSeriesPermission("owner", "editor"), true);
    assert.equal(hasSeriesPermission("owner", "contributor"), true);
    assert.equal(hasSeriesPermission("owner", "viewer"), true);
  });

  test("Series editor role satisfies editor, contributor, and viewer", () => {
    assert.equal(hasSeriesPermission("editor", "owner"), false);
    assert.equal(hasSeriesPermission("editor", "editor"), true);
    assert.equal(hasSeriesPermission("editor", "contributor"), true);
    assert.equal(hasSeriesPermission("editor", "viewer"), true);
  });

  test("Series contributor satisfies contributor and viewer, but not editor", () => {
    assert.equal(hasSeriesPermission("contributor", "owner"), false);
    assert.equal(hasSeriesPermission("contributor", "editor"), false);
    assert.equal(hasSeriesPermission("contributor", "contributor"), true);
    assert.equal(hasSeriesPermission("contributor", "viewer"), true);
  });

  test("Series viewer only satisfies viewer role", () => {
    assert.equal(hasSeriesPermission("viewer", "owner"), false);
    assert.equal(hasSeriesPermission("viewer", "editor"), false);
    assert.equal(hasSeriesPermission("viewer", "contributor"), false);
    assert.equal(hasSeriesPermission("viewer", "viewer"), true);
  });
});

describe("Studio Member Management Security Invariants", () => {
  function validateRoleUpdate(
    callerRole: StudioRole,
    targetCurrentRole: StudioRole,
    newRole: StudioRole
  ) {
    if (!hasStudioPermission(callerRole, "admin")) {
      throw new ForbiddenError("Only admins and owners can modify member roles.");
    }

    if (targetCurrentRole === "owner" && callerRole !== "owner") {
      throw new ForbiddenError("Only studio owners can modify another owner's role.");
    }

    if (newRole === "owner" && callerRole !== "owner") {
      throw new ForbiddenError("Only existing owners can promote a member to owner.");
    }

    return true;
  }

  test("Studio owner can promote an editor to admin", () => {
    assert.equal(validateRoleUpdate("owner", "editor", "admin"), true);
  });

  test("Studio owner can promote an admin to owner", () => {
    assert.equal(validateRoleUpdate("owner", "admin", "owner"), true);
  });

  test("Studio admin CANNOT modify an owner's role", () => {
    assert.throws(
      () => validateRoleUpdate("admin", "owner", "editor"),
      (err: any) => err instanceof ForbiddenError && err.message.includes("Only studio owners")
    );
  });

  test("Studio admin CANNOT promote a member to owner", () => {
    assert.throws(
      () => validateRoleUpdate("admin", "member", "owner"),
      (err: any) => err instanceof ForbiddenError && err.message.includes("promote a member to owner")
    );
  });

  test("Regular studio member CANNOT modify any role", () => {
    assert.throws(
      () => validateRoleUpdate("member", "editor", "admin"),
      (err: any) => err instanceof ForbiddenError
    );
  });

  function validateMemberRemoval(
    callerRole: StudioRole,
    targetRole: StudioRole,
    totalOwnersCount: number
  ) {
    if (!hasStudioPermission(callerRole, "admin")) {
      throw new ForbiddenError("Only admins and owners can remove members.");
    }

    if (targetRole === "owner" && callerRole !== "owner") {
      throw new ForbiddenError("Only studio owners can remove an owner.");
    }

    if (targetRole === "owner" && totalOwnersCount <= 1) {
      throw new ForbiddenError("Cannot remove the sole owner of a studio.");
    }

    return true;
  }

  test("Sole studio owner cannot be removed", () => {
    assert.throws(
      () => validateMemberRemoval("owner", "owner", 1),
      (err: any) => err instanceof ForbiddenError && err.message.includes("sole owner")
    );
  });

  test("Co-owner can be removed if another owner exists", () => {
    assert.equal(validateMemberRemoval("owner", "owner", 2), true);
  });
});

describe("User Profile Privilege Escalation Guard", () => {
  function sanitizeProfilePayload(clientPayload: Record<string, any>) {
    // Platform role and user ID cannot be set by client updates
    const { role, id, ...allowedFields } = clientPayload;
    return allowedFields;
  }

  test("Client attempt to escalate platform role to admin is stripped", () => {
    const rawInput = {
      display_name: "Creative Hacker",
      bio: "Just an artist",
      role: "admin",
      id: "malicious-id-override",
    };

    const sanitized = sanitizeProfilePayload(rawInput);
    assert.equal("role" in sanitized, false);
    assert.equal("id" in sanitized, false);
    assert.equal(sanitized.display_name, "Creative Hacker");
  });
});

describe("Cross-Workspace Isolation", () => {
  interface StudioMembership {
    studioId: string;
    userId: string;
    role: StudioRole;
  }

  function verifyStudioAccess(
    memberships: StudioMembership[],
    userId: string,
    requestedStudioId: string
  ): boolean {
    return memberships.some(
      (m) => m.userId === userId && m.studioId === requestedStudioId
    );
  }

  test("Member of Studio A cannot access Studio B", () => {
    const userMemberships: StudioMembership[] = [
      { studioId: "studio-alpha", userId: "user-1", role: "owner" },
    ];

    assert.equal(verifyStudioAccess(userMemberships, "user-1", "studio-alpha"), true);
    assert.equal(verifyStudioAccess(userMemberships, "user-1", "studio-beta"), false);
  });
});
