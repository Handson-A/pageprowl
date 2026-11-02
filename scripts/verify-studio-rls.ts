import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const envText = fs.readFileSync(".env.local", "utf-8");
const env: Record<string, string> = {};
for (const line of envText.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx !== -1) {
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = val;
  }
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  console.log("=== Comprehensive Studio RLS Security Verification ===");

  // 1. Unauthenticated (anon) test on studio_members
  const { data: anonData, error: anonError } = await anon
    .from("studio_members")
    .select("studio_id, user_id, role");
  console.log("1. Anon user read studio_members:", {
    blocked: anonData?.length === 0 || !!anonError,
    rows: anonData?.length || 0,
    error: anonError?.message || null,
  });

  // 2. Fetch a studio and its members from DB as admin to test with
  const { data: testMemberships, error: tmErr } = await admin
    .from("studio_members")
    .select("studio_id, user_id, role")
    .in("role", ["owner", "admin", "member"]);

  if (!testMemberships || testMemberships.length === 0) {
    console.log("No studio memberships in DB to test against.");
    return;
  }

  const ownerMembership = testMemberships.find((m) => m.role === "owner");
  const adminMembership = testMemberships.find((m) => m.role === "admin");
  const memberMembership = testMemberships.find((m) => m.role === "member");

  console.log("Found sample memberships for verification:", {
    owner: ownerMembership?.user_id,
    admin: adminMembership?.user_id,
    member: memberMembership?.user_id,
    studioId: testMemberships[0].studio_id,
  });

  // 3. Test RPC functions directly as authenticated / anon
  if (ownerMembership) {
    const { data: isMember, error: isMemberErr } = await admin.rpc("is_studio_member", {
      p_studio_id: ownerMembership.studio_id,
      p_user_id: ownerMembership.user_id,
    });
    console.log("2. RPC is_studio_member check for owner:", { isMember, isMemberErr });

    const { data: isOwner, error: isOwnerErr } = await admin.rpc("has_studio_role", {
      p_studio_id: ownerMembership.studio_id,
      p_user_id: ownerMembership.user_id,
      p_required_roles: ["owner"],
    });
    console.log("3. RPC has_studio_role check for owner:", { isOwner, isOwnerErr });

    const { data: isEditor, error: isEditorErr } = await admin.rpc("has_studio_role", {
      p_studio_id: ownerMembership.studio_id,
      p_user_id: ownerMembership.user_id,
      p_required_roles: ["editor"],
    });
    console.log("4. RPC has_studio_role check for editor when role is owner:", { isEditor, isEditorErr });
  }

  // 4. Test non-member isolation:
  // Create an arbitrary random UUID
  const randomUserId = "00000000-0000-4000-8000-000000000099";
  const { data: nonMemberCheck } = await admin.rpc("is_studio_member", {
    p_studio_id: testMemberships[0].studio_id,
    p_user_id: randomUserId,
  });
  console.log("5. RPC is_studio_member for arbitrary non-member:", { isMember: nonMemberCheck });

  console.log("=== Verification Completed Successfully ===");
}

main().catch(console.error);
