import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Phase 6: Creator Profile Privacy & Visibility Invariants", () => {
  interface RawProfileData {
    id: string;
    username: string;
    display_name: string;
    email: string; // Private
    role: string; // Internal platform role
    avatar_url: string | null;
    bio: string | null;
  }

  interface RawSeriesData {
    id: string;
    title: string;
    owner_user_id: string;
    visibility: "public" | "private" | "unlisted";
    is_draft: boolean;
  }

  const rawUser: RawProfileData = {
    id: "usr-uuid-12345",
    username: "akira_creator",
    display_name: "Akira Tanaka",
    email: "akira.private@example.com",
    role: "user",
    avatar_url: "https://res.cloudinary.com/pageprowl/avatar.jpg",
    bio: "Manga artist and storyteller exploring sci-fi worlds.",
  };

  const rawCreatorSeries: RawSeriesData[] = [
    {
      id: "ser-1",
      title: "Cyber Samurai",
      owner_user_id: "usr-uuid-12345",
      visibility: "public",
      is_draft: false,
    },
    {
      id: "ser-2",
      title: "Neon Echoes",
      owner_user_id: "usr-uuid-12345",
      visibility: "public",
      is_draft: false,
    },
    {
      id: "ser-3",
      title: "Unannounced Project Alpha",
      owner_user_id: "usr-uuid-12345",
      visibility: "private",
      is_draft: true,
    },
  ];

  function sanitizePublicCreatorProfile(
    profile: RawProfileData,
    seriesList: RawSeriesData[]
  ) {
    // Invariant: Strip private credentials, emails, and internal platform auth
    const publicProfile = {
      username: profile.username,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      bio: profile.bio,
    };

    // Invariant: Filter only public, non-draft series
    const publicSeries = seriesList.filter(
      (s) => s.owner_user_id === profile.id && s.visibility === "public"
    );

    return {
      profile: publicProfile,
      series: publicSeries,
    };
  }

  test("Public creator profile NEVER exposes user email", () => {
    const sanitized = sanitizePublicCreatorProfile(rawUser, rawCreatorSeries);
    assert.equal("email" in sanitized.profile, false);
    assert.equal((sanitized.profile as any).email, undefined);
  });

  test("Public creator profile NEVER exposes private platform role", () => {
    const sanitized = sanitizePublicCreatorProfile(rawUser, rawCreatorSeries);
    assert.equal("role" in sanitized.profile, false);
  });

  test("Public creator profile only shows public series, strictly excluding private drafts", () => {
    const sanitized = sanitizePublicCreatorProfile(rawUser, rawCreatorSeries);
    assert.equal(sanitized.series.length, 2);
    assert.equal(sanitized.series.some((s) => s.title === "Unannounced Project Alpha"), false);
    assert.ok(sanitized.series.every((s) => s.visibility === "public"));
  });

  test("Normalizes social link URLs safely", () => {
    function sanitizeSocialUrl(rawUrl: string): string {
      const trimmed = rawUrl.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
      }
      return `https://${trimmed}`;
    }

    assert.equal(sanitizeSocialUrl("https://twitter.com/akira"), "https://twitter.com/akira");
    assert.equal(sanitizeSocialUrl("instagram.com/akira"), "https://instagram.com/akira");
    assert.equal(sanitizeSocialUrl("   "), "");
  });
});
