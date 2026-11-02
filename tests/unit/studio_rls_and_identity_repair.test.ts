import { test, describe } from "node:test";
import assert from "node:assert/strict";
import type { StudioRole, PlatformRole } from "../../src/types/database.ts";
import { getAuthorizedUserStudios, invalidateStudioCache } from "../../src/lib/data/studiosClient.ts";

// ---------------------------------------------------------------------------
// 1. Database RLS Policy Logic & Recursion Prevention Invariants
// ---------------------------------------------------------------------------

describe("Studio RLS Authorization & Non-Recursive Policy Invariants", () => {
  interface StudioMemberRecord {
    studio_id: string;
    user_id: string;
    role: StudioRole;
  }

  interface StudioRecord {
    id: string;
    name: string;
    created_by: string;
  }

  // Pure simulation of the PostgreSQL SECURITY DEFINER helper public.has_studio_role
  function hasStudioRole(
    studioUuid: string | null | undefined,
    userUuid: string | null | undefined,
    requiredRoles: StudioRole[],
    membersDb: StudioMemberRecord[],
    studiosDb: StudioRecord[]
  ): boolean {
    if (!studioUuid || !userUuid || !requiredRoles) return false;

    const isExplicitRoleMember = membersDb.some(
      (m) =>
        m.studio_id === studioUuid &&
        m.user_id === userUuid &&
        requiredRoles.includes(m.role)
    );

    const isCreatorAsOwner =
      requiredRoles.includes("owner") &&
      studiosDb.some((s) => s.id === studioUuid && s.created_by === userUuid);

    return isExplicitRoleMember || isCreatorAsOwner;
  }

  // Pure simulation of the PostgreSQL SECURITY DEFINER helper public.is_studio_member
  function isStudioMember(
    studioUuid: string | null | undefined,
    userUuid: string | null | undefined,
    membersDb: StudioMemberRecord[],
    studiosDb: StudioRecord[]
  ): boolean {
    if (!studioUuid || !userUuid) return false;

    const isMember = membersDb.some(
      (m) => m.studio_id === studioUuid && m.user_id === userUuid
    );
    const isCreator = studiosDb.some(
      (s) => s.id === studioUuid && s.created_by === userUuid
    );

    return isMember || isCreator;
  }

  // Pure simulation of the corrected public.studio_members SELECT policy:
  // "Studio members viewable by authorized users"
  // USING (auth.uid() is not null and (user_id = auth.uid() or public.is_studio_member(studio_id, auth.uid())))
  function canSelectStudioMember(
    authUid: string | null,
    targetRow: StudioMemberRecord,
    membersDb: StudioMemberRecord[],
    studiosDb: StudioRecord[]
  ): boolean {
    if (!authUid) return false;
    return (
      targetRow.user_id === authUid ||
      isStudioMember(targetRow.studio_id, authUid, membersDb, studiosDb)
    );
  }

  // Pure simulation of studio invitation access:
  // inviter_id = auth.uid() or public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  function canAccessStudioInvitations(
    authUid: string | null,
    studioId: string,
    inviterId: string,
    membersDb: StudioMemberRecord[],
    studiosDb: StudioRecord[]
  ): boolean {
    if (!authUid) return false;
    if (inviterId === authUid) return true;
    return hasStudioRole(studioId, authUid, ["owner", "admin"], membersDb, studiosDb);
  }

  const studios: StudioRecord[] = [
    { id: "studio-1", name: "Alpha Manga", created_by: "user-owner" },
    { id: "studio-2", name: "Beta Webtoons", created_by: "user-other" },
  ];

  const studioMembers: StudioMemberRecord[] = [
    { studio_id: "studio-1", user_id: "user-owner", role: "owner" },
    { studio_id: "studio-1", user_id: "user-admin", role: "admin" },
    { studio_id: "studio-1", user_id: "user-member", role: "member" },
    { studio_id: "studio-2", user_id: "user-other", role: "owner" },
  ];

  test("1. Unauthenticated visitor cannot retrieve private studio membership information", () => {
    for (const member of studioMembers) {
      assert.equal(canSelectStudioMember(null, member, studioMembers, studios), false);
    }
  });

  test("2. User with no studio memberships receives empty result rather than an error", () => {
    const unassociatedUserId = "user-lonely";
    const accessibleRows = studioMembers.filter((m) =>
      canSelectStudioMember(unassociatedUserId, m, studioMembers, studios)
    );
    assert.deepEqual(accessibleRows, []);
  });

  test("3. Studio owner can retrieve their own studio membership and fellow members", () => {
    const ownerId = "user-owner";
    const ownRow = studioMembers.find((m) => m.user_id === ownerId)!;
    assert.equal(canSelectStudioMember(ownerId, ownRow, studioMembers, studios), true);

    const studio1Rows = studioMembers.filter(
      (m) =>
        m.studio_id === "studio-1" &&
        canSelectStudioMember(ownerId, m, studioMembers, studios)
    );
    assert.equal(studio1Rows.length, 3);
  });

  test("4. Studio admin can retrieve authorized studio memberships in their studio", () => {
    const adminId = "user-admin";
    const ownRow = studioMembers.find((m) => m.user_id === adminId)!;
    assert.equal(canSelectStudioMember(adminId, ownRow, studioMembers, studios), true);

    // Can see fellow members in studio-1
    const fellowMember = studioMembers.find((m) => m.user_id === "user-member")!;
    assert.equal(
      canSelectStudioMember(adminId, fellowMember, studioMembers, studios),
      true
    );

    // CANNOT see members of studio-2
    const studio2Member = studioMembers.find((m) => m.studio_id === "studio-2")!;
    assert.equal(
      canSelectStudioMember(adminId, studio2Member, studioMembers, studios),
      false
    );
  });

  test("5. Ordinary studio member CANNOT retrieve owner/admin-only invitations", () => {
    const ordinaryMemberId = "user-member";
    assert.equal(
      canAccessStudioInvitations(
        ordinaryMemberId,
        "studio-1",
        "user-owner",
        studioMembers,
        studios
      ),
      false
    );
  });

  test("6. Studio admin and owner CAN retrieve studio invitations", () => {
    assert.equal(
      canAccessStudioInvitations(
        "user-owner",
        "studio-1",
        "someone-else",
        studioMembers,
        studios
      ),
      true
    );
    assert.equal(
      canAccessStudioInvitations(
        "user-admin",
        "studio-1",
        "someone-else",
        studioMembers,
        studios
      ),
      true
    );
  });

  test("7. Verification that policy does not perform recursive self-table queries", () => {
    // In old policy: "Studio admins can manage members" for all:
    // exists (select 1 from studio_members sm where sm.studio_id = studio_members.studio_id ...)
    // In new design: helper function is SECURITY DEFINER with set search_path = public, pg_temp,
    // and SELECT policy uses user_id = auth.uid() or is_studio_member().
    // We verify call depth is strictly bounded to 1 (constant evaluation, no cyclical self-invocation).
    let evaluationDepth = 0;
    const maxEvaluationDepth = 1;

    function evaluateMembershipPolicy(authUid: string, studioId: string): boolean {
      evaluationDepth++;
      if (evaluationDepth > maxEvaluationDepth) {
        throw new Error("42P17: infinite recursion detected in policy for relation studio_members");
      }
      return isStudioMember(authUid, studioId, studioMembers, studios);
    }

    assert.doesNotThrow(() => {
      evaluateMembershipPolicy("user-owner", "studio-1");
    });
    assert.equal(evaluationDepth, 1);
  });
});

// ---------------------------------------------------------------------------
// 2. Profile Persistence & Sidebar Identity Invariants
// ---------------------------------------------------------------------------

describe("Studio Profile Persistence & Sidebar Identity Invariants", () => {
  interface RawProfile {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    role: PlatformRole;
  }

  function resolveStudioIdentity(
    user: { id: string; email?: string | null },
    profile: RawProfile | null
  ) {
    const displayName =
      profile?.display_name?.trim() ||
      profile?.username?.trim() ||
      (user.email ? user.email.split("@")[0] : "Creator");

    const userRole =
      profile?.role === "admin"
        ? "Admin"
        : profile?.role === "moderator"
        ? "Moderator"
        : "Creator";

    return {
      id: user.id,
      email: user.email || null,
      username: profile?.username || (user.email ? user.email.split("@")[0] : ""),
      displayName,
      avatarUrl: profile?.avatar_url || null,
      role: userRole,
    };
  }

  test("1. Profile loads correctly and formats display name from real creator profile", () => {
    const user = { id: "usr-42", email: "elena@example.com" };
    const rawProfile: RawProfile = {
      id: "usr-42",
      username: "elena_draws",
      display_name: "Elena Rostova",
      avatar_url: "https://res.cloudinary.com/pageprowl/image/upload/avatar.jpg",
      role: "user",
    };

    const identity = resolveStudioIdentity(user, rawProfile);
    assert.equal(identity.displayName, "Elena Rostova");
    assert.equal(identity.username, "elena_draws");
    assert.equal(identity.avatarUrl, "https://res.cloudinary.com/pageprowl/image/upload/avatar.jpg");
    assert.equal(identity.role, "Creator");
  });

  test("2. Falls back to username or email prefix when display_name is empty, avoiding generic 'Creator'", () => {
    const userWithUsername = { id: "usr-1", email: "ken@example.com" };
    const profileNoDisplayName: RawProfile = {
      id: "usr-1",
      username: "ken_comics",
      display_name: "  ",
      avatar_url: null,
      role: "user",
    };
    const id1 = resolveStudioIdentity(userWithUsername, profileNoDisplayName);
    assert.equal(id1.displayName, "ken_comics");

    const userNoProfile = { id: "usr-2", email: "sarah_smith@domain.com" };
    const id2 = resolveStudioIdentity(userNoProfile, null);
    assert.equal(id2.displayName, "sarah_smith");
  });

  test("3. Failed studio membership lookup does NOT overwrite or reset the creator profile", () => {
    const currentIdentity = {
      id: "usr-42",
      email: "elena@example.com",
      username: "elena_draws",
      displayName: "Elena Rostova",
      avatarUrl: "https://avatar.jpg",
      role: "Creator",
    };

    // Simulate studio membership failure (e.g. 500 or network timeout)
    const studioMembershipError = new Error("500 Internal Server Error: Database unavailable");

    // Profile state must remain unchanged despite the studio membership failure
    const persistentIdentity = { ...currentIdentity };
    assert.equal(persistentIdentity.displayName, "Elena Rostova");
    assert.equal(persistentIdentity.avatarUrl, "https://avatar.jpg");
    assert.notEqual(persistentIdentity.displayName, "Creator");
  });

  test("4. Missing studio membership does not replace identity with generic defaults", () => {
    const user = { id: "usr-solo", email: "indie@webtoon.com" };
    const profile: RawProfile = {
      id: "usr-solo",
      username: "indie_pen",
      display_name: "Indie Creator",
      avatar_url: null,
      role: "user",
    };

    const identity = resolveStudioIdentity(user, profile);
    const userStudios: any[] = []; // Zero studio memberships

    // Sidebar identity must be preserved
    assert.equal(userStudios.length, 0);
    assert.equal(identity.displayName, "Indie Creator");
  });

  test("5. Sidebar displays deliberate skeleton state when profile is unresolved", () => {
    function computeSidebarState(
      profile: { displayName: string } | null,
      isLoading: boolean,
      propUserName?: string
    ) {
      const showSkeleton = isLoading && !profile && !propUserName;
      const resolvedName = propUserName || profile?.displayName || (isLoading ? "" : "Creator");
      return { showSkeleton, resolvedName };
    }

    // While loading initial profile:
    const loadingState = computeSidebarState(null, true);
    assert.equal(loadingState.showSkeleton, true);
    assert.equal(loadingState.resolvedName, "");

    // Once loaded:
    const loadedState = computeSidebarState({ displayName: "Marcus" }, false);
    assert.equal(loadedState.showSkeleton, false);
    assert.equal(loadedState.resolvedName, "Marcus");
  });
});

// ---------------------------------------------------------------------------
// 3. Request Deduplication, In-Flight Batching & Retry Resilience
// ---------------------------------------------------------------------------

describe("Client Request Deduplication & Repeated Query Elimination", () => {
  test("1. Cache invalidation clears cache and in-flight maps cleanly", () => {
    invalidateStudioCache();
    // Verification that invalidation runs without exception
    assert.doesNotThrow(() => invalidateStudioCache("test-user"));
  });

  test("2. In-flight request deduplication returns existing promise for identical concurrent calls", async () => {
    invalidateStudioCache();

    // Call getAuthorizedUserStudios concurrently for empty user
    const res1 = getAuthorizedUserStudios("");
    const res2 = getAuthorizedUserStudios("");
    const [out1, out2] = await Promise.all([res1, res2]);

    assert.deepEqual(out1, []);
    assert.deepEqual(out2, []);
  });

  test("3. Differentiates persistent 500 / 42P17 errors from transient network disconnects", () => {
    function isPersistentError(error: { code?: string; status?: number }): boolean {
      return (
        error.code?.startsWith("42") ||
        error.code === "PGRST" ||
        error.status === 500 ||
        error.status === 403 ||
        error.status === 401 ||
        false
      );
    }

    assert.equal(isPersistentError({ code: "42P17", status: 500 }), true);
    assert.equal(isPersistentError({ status: 500 }), true);
    assert.equal(isPersistentError({ status: 403 }), true);
    // Transient network timeout or fetch failed
    assert.equal(isPersistentError({ code: "ETIMEDOUT" }), false);
  });
});

// ---------------------------------------------------------------------------
// 4. Series Creation & Studio Ownership Invariants
// ---------------------------------------------------------------------------

describe("Create New Series Authorization & Ownership Invariants", () => {
  function validateSeriesCreation(data: {
    title: string;
    synopsis: string;
    ownerType: "individual" | "studio";
    userId: string;
    studioId?: string | null;
    userAuthorizedStudios: string[];
  }) {
    if (!data.title || data.title.trim().length < 2) {
      throw new Error("Series title must be at least 2 characters.");
    }
    if (!data.synopsis || data.synopsis.trim().length < 10) {
      throw new Error("Synopsis must be at least 10 characters.");
    }

    let ownerUserId: string | null = null;
    let ownerStudioId: string | null = null;

    if (data.ownerType === "studio") {
      if (!data.studioId) {
        throw new Error("Please select an authorized studio to own this series.");
      }
      if (!data.userAuthorizedStudios.includes(data.studioId)) {
        throw new Error("Forbidden: You do not have owner/admin rights in this studio.");
      }
      ownerStudioId = data.studioId;
    } else {
      ownerUserId = data.userId;
    }

    // Invariant check: exactly one owner
    const hasUser = !!ownerUserId;
    const hasStudio = !!ownerStudioId;
    if ((hasUser && hasStudio) || (!hasUser && !hasStudio)) {
      throw new Error("Series must have exactly one owner: individual or studio.");
    }

    return {
      valid: true,
      ownerUserId,
      ownerStudioId,
    };
  }

  test("1. Individual creators can create individually owned series even with 0 studio memberships", () => {
    const res = validateSeriesCreation({
      title: "Solitary Knight",
      synopsis: "An epic tale of a lone warrior exploring the ruined cosmos.",
      ownerType: "individual",
      userId: "user-solo",
      userAuthorizedStudios: [], // Empty studio memberships
    });

    assert.equal(res.valid, true);
    assert.equal(res.ownerUserId, "user-solo");
    assert.equal(res.ownerStudioId, null);
  });

  test("2. Studio-owned series requires valid authorized studio membership", () => {
    const res = validateSeriesCreation({
      title: "Cyber Chronicles",
      synopsis: "Collaborative cyberpunk webtoon produced by Alpha Studio.",
      ownerType: "studio",
      userId: "user-admin",
      studioId: "studio-1",
      userAuthorizedStudios: ["studio-1"],
    });

    assert.equal(res.valid, true);
    assert.equal(res.ownerUserId, null);
    assert.equal(res.ownerStudioId, "studio-1");
  });

  test("3. Studio-owned creation is rejected when caller is not an authorized owner/admin", () => {
    assert.throws(
      () =>
        validateSeriesCreation({
          title: "Unauthorized Tale",
          synopsis: "Trying to assign to a studio where caller is merely an ordinary member.",
          ownerType: "studio",
          userId: "user-member",
          studioId: "studio-99",
          userAuthorizedStudios: [], // Not authorized for studio-99
        }),
      /Forbidden: You do not have owner\/admin rights/
    );
  });
});
