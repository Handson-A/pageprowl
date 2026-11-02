import path from "node:path";
import fs from "node:fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SEED_CREATORS } from "./fixtures/creators.ts";
import { SEED_STUDIOS } from "./fixtures/studios.ts";
import { ALL_SEED_SERIES } from "./fixtures/series/index.ts";
import { loadArtworkLedger } from "./ingestion/cloudinary-uploader.ts";
import type {
  CreatorManifest,
  SeedStateLedger,
  SeriesManifest,
  StudioManifest,
} from "./types.ts";

const SEED_STATE_PATH = path.resolve(process.cwd(), "scripts/seed/.seed-state.json");

let memoryState: SeedStateLedger | null = null;

export function resetSeedMemoryState() {
  memoryState = null;
}

export function loadSeedState(): SeedStateLedger {
  if (memoryState) {
    return memoryState;
  }
  if (fs.existsSync(SEED_STATE_PATH)) {
    try {
      const data = fs.readFileSync(SEED_STATE_PATH, "utf-8");
      memoryState = JSON.parse(data);
      return memoryState!;
    } catch {
      // Return fresh state on corrupt file
    }
  }
  memoryState = {
    version: "1.0.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creators: {},
    studios: {},
    series: {},
    episodes: {},
    mediaAssets: {},
  };
  return memoryState;
}

export function saveSeedState(state: SeedStateLedger) {
  memoryState = state;
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(SEED_STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

export function getAdminClient(): SupabaseClient {
  const envLocalPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envLocalPath) && typeof (process as any).loadEnvFile === "function") {
    try {
      (process as any).loadEnvFile(envLocalPath);
    } catch {
      // ignore
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin configuration (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * 1. Seed or retrieve a single creator via official Supabase Auth Admin API.
 */
export async function seedCreator(
  creator: CreatorManifest,
  supabase: SupabaseClient,
  options: { dryRun?: boolean } = {}
): Promise<{ authUserId: string; profileId: string }> {
  const seedState = loadSeedState();
  if (seedState.creators[creator.username]) {
    return seedState.creators[creator.username];
  }

  const internalEmail = `creator.seed.${creator.username}@pageprowl.internal`;
  const artworkLedger = loadArtworkLedger();
  const avatarAsset = artworkLedger.assets[`avatar:${creator.username}`];
  const avatarUrl = avatarAsset?.secureUrl || null;

  if (options.dryRun) {
    console.log(`[DRY-RUN] Would create auth user and profile for ${creator.username} (${internalEmail})`);
    const mockId = `mock-user-${creator.username}`;
    seedState.creators[creator.username] = { authUserId: mockId, profileId: mockId };
    return { authUserId: mockId, profileId: mockId };
  }

  // 1. Check if auth user already exists in Supabase
  let authUserId: string | null = null;
  const { data: userList } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existingUser = userList?.users?.find((u) => u.email === internalEmail);

  if (existingUser) {
    authUserId = existingUser.id;
  } else {
    // 2. Create user with official Admin API (confirmed, so no verification email sent)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: internalEmail,
      email_confirm: true,
      user_metadata: {
        username: creator.username,
        display_name: creator.displayName,
        avatar_url: avatarUrl,
      },
    });

    if (createError || !newUser?.user) {
      throw new Error(`Failed to create seed user ${internalEmail}: ${createError?.message}`);
    }
    authUserId = newUser.user.id;
  }

  // 3. Ensure profile record exists
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: authUserId,
      username: creator.username,
      display_name: creator.displayName,
      avatar_url: avatarUrl,
      bio: creator.bio,
      role: "user",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (profileError) {
    throw new Error(`Failed to update profile for ${creator.username}: ${profileError.message}`);
  }

  // 4. Ensure creator_profile record exists
  const { error: creatorProfileError } = await supabase.from("creator_profiles").upsert(
    {
      id: authUserId,
      pen_name: creator.penName,
      website_url: creator.websiteUrl,
      social_links: creator.socialLinks,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (creatorProfileError) {
    throw new Error(
      `Failed to update creator profile for ${creator.username}: ${creatorProfileError.message}`
    );
  }

  const result = { authUserId, profileId: authUserId };
  seedState.creators[creator.username] = result;
  saveSeedState(seedState);

  return result;
}

/**
 * 2. Seed or retrieve a studio and its memberships.
 */
export async function seedStudio(
  studio: StudioManifest,
  supabase: SupabaseClient,
  options: { dryRun?: boolean } = {}
): Promise<{ studioId: string }> {
  const seedState = loadSeedState();
  if (seedState.studios[studio.slug]) {
    return seedState.studios[studio.slug];
  }

  const ownerMapping = seedState.creators[studio.createdByUsername];
  if (!ownerMapping) {
    throw new Error(`Creator '${studio.createdByUsername}' must be seeded before studio '${studio.slug}'`);
  }

  const artworkLedger = loadArtworkLedger();
  const logoAsset = artworkLedger.assets[`logo:${studio.slug}`];
  const logoUrl = logoAsset?.secureUrl || null;

  if (options.dryRun) {
    console.log(`[DRY-RUN] Would create studio ${studio.name} (${studio.slug})`);
    const mockId = `mock-studio-${studio.slug}`;
    seedState.studios[studio.slug] = { studioId: mockId };
    return { studioId: mockId };
  }

  // 1. Insert or fetch studio
  const { data: existingStudio } = await supabase
    .from("studios")
    .select("id")
    .eq("slug", studio.slug)
    .maybeSingle();

  let studioId = existingStudio?.id;

  if (!studioId) {
    const { data: newStudio, error: studioError } = await supabase
      .from("studios")
      .insert({
        slug: studio.slug,
        name: studio.name,
        description: studio.description,
        logo_url: logoUrl,
        created_by: ownerMapping.profileId,
      })
      .select("id")
      .single();

    if (studioError || !newStudio) {
      throw new Error(`Failed to create studio ${studio.slug}: ${studioError?.message}`);
    }
    studioId = newStudio.id;
  }

  // 2. Add members
  for (const member of studio.members) {
    const memberCreator = seedState.creators[member.creatorUsername];
    if (!memberCreator) continue;

    await supabase.from("studio_members").upsert(
      {
        studio_id: studioId,
        user_id: memberCreator.profileId,
        role: member.role,
      },
      { onConflict: "studio_id, user_id" }
    );
  }

  const result = { studioId };
  seedState.studios[studio.slug] = result;
  saveSeedState(seedState);

  return result;
}

/**
 * 3. Seed or register a Cloudinary media asset into public.media_assets table.
 */
export async function registerMediaAsset(
  params: {
    assetKey: string;
    uploaderId: string;
    cloudinaryPublicId: string;
    secureUrl: string;
    format: string;
    width: number | null;
    height: number | null;
    byteSize: number | null;
    seriesSlug?: string;
  },
  supabase: SupabaseClient,
  options: { dryRun?: boolean } = {}
): Promise<string> {
  const seedState = loadSeedState();
  if (seedState.mediaAssets[params.assetKey]) {
    return seedState.mediaAssets[params.assetKey].assetId;
  }

  if (options.dryRun) {
    const mockId = `mock-asset-${params.assetKey.replace(/[^a-zA-Z0-9]/g, "-")}`;
    return mockId;
  }

  const { data: existing } = await supabase
    .from("media_assets")
    .select("id")
    .eq("cloudinary_public_id", params.cloudinaryPublicId)
    .maybeSingle();

  if (existing?.id) {
    seedState.mediaAssets[params.assetKey] = {
      assetId: existing.id,
      cloudinaryPublicId: params.cloudinaryPublicId,
      secureUrl: params.secureUrl,
      width: params.width,
      height: params.height,
      format: params.format,
      seriesSlug: params.seriesSlug,
    };
    saveSeedState(seedState);
    return existing.id;
  }

  const { data: newAsset, error: insertError } = await supabase
    .from("media_assets")
    .insert({
      uploader_id: params.uploaderId,
      cloudinary_public_id: params.cloudinaryPublicId,
      resource_type: "image",
      format: params.format || "png",
      width: params.width,
      height: params.height,
      byte_size: params.byteSize,
      secure_url: params.secureUrl,
      is_restricted: false,
    })
    .select("id")
    .single();

  if (insertError || !newAsset) {
    throw new Error(`Failed to register media asset ${params.cloudinaryPublicId}: ${insertError?.message}`);
  }

  seedState.mediaAssets[params.assetKey] = {
    assetId: newAsset.id,
    cloudinaryPublicId: params.cloudinaryPublicId,
    secureUrl: params.secureUrl,
    width: params.width,
    height: params.height,
    format: params.format,
    seriesSlug: params.seriesSlug,
  };
  saveSeedState(seedState);

  return newAsset.id;
}

/**
 * Provision ONLY the specific creators and studios required by a single series.
 */
export async function seedPrerequisitesForSeries(
  series: SeriesManifest,
  supabase: SupabaseClient,
  options: { dryRun?: boolean } = {}
) {
  const seedState = loadSeedState();
  const creatorsToSeed = new Set<string>();
  const studiosToSeed = new Set<string>();

  if (series.ownerType === "individual") {
    creatorsToSeed.add(series.ownerRef);
  } else {
    studiosToSeed.add(series.ownerRef);
    const studioManifest = SEED_STUDIOS.find((s) => s.slug === series.ownerRef);
    if (studioManifest) {
      creatorsToSeed.add(studioManifest.createdByUsername);
      for (const m of studioManifest.members) {
        creatorsToSeed.add(m.creatorUsername);
      }
    }
  }

  for (const credit of series.credits) {
    if (credit.creatorUsername) {
      creatorsToSeed.add(credit.creatorUsername);
    }
  }

  // Seed required creators first
  for (const username of creatorsToSeed) {
    const creatorManifest = SEED_CREATORS.find((c) => c.username === username);
    if (creatorManifest && !seedState.creators[username]) {
      console.log(`[Dependency] Seeding creator: ${creatorManifest.displayName} (${creatorManifest.username})`);
      await seedCreator(creatorManifest, supabase, options);
    }
  }

  // Seed required studios
  for (const slug of studiosToSeed) {
    const studioManifest = SEED_STUDIOS.find((s) => s.slug === slug);
    if (studioManifest && !seedState.studios[slug]) {
      console.log(`[Dependency] Seeding studio: ${studioManifest.name} (${studioManifest.slug})`);
      await seedStudio(studioManifest, supabase, options);
    }
  }
}

/**
 * 4. Seed a single series, its episodes, revisions, and pages.
 */
export async function seedSingleSeries(
  series: SeriesManifest,
  supabase: SupabaseClient,
  options: { dryRun?: boolean } = {}
): Promise<{ seriesId: string; episodeCount: number; pageCount: number }> {
  // Ensure prerequisites for this specific series are present
  await seedPrerequisitesForSeries(series, supabase, options);

  const seedState = loadSeedState();
  const artworkLedger = loadArtworkLedger();

  // Determine owner
  let ownerUserId: string | null = null;
  let ownerStudioId: string | null = null;
  let primaryUploaderId: string;

  if (series.ownerType === "individual") {
    const owner = seedState.creators[series.ownerRef];
    if (!owner) throw new Error(`Owner creator '${series.ownerRef}' not found in seed state`);
    ownerUserId = owner.profileId;
    primaryUploaderId = owner.profileId;

    owner.referencedBySeries = owner.referencedBySeries || [];
    if (!owner.referencedBySeries.includes(series.slug)) {
      owner.referencedBySeries.push(series.slug);
    }
  } else {
    const studio = seedState.studios[series.ownerRef];
    if (!studio) throw new Error(`Owner studio '${series.ownerRef}' not found in seed state`);
    ownerStudioId = studio.studioId;

    studio.referencedBySeries = studio.referencedBySeries || [];
    if (!studio.referencedBySeries.includes(series.slug)) {
      studio.referencedBySeries.push(series.slug);
    }

    const studioManifest = SEED_STUDIOS.find((s) => s.slug === series.ownerRef);
    const creatorRef = studioManifest?.createdByUsername || "elena_vance";
    primaryUploaderId = seedState.creators[creatorRef]?.profileId;
  }

  // Track credits references
  for (const credit of series.credits) {
    if (credit.creatorUsername && seedState.creators[credit.creatorUsername]) {
      const c = seedState.creators[credit.creatorUsername];
      c.referencedBySeries = c.referencedBySeries || [];
      if (!c.referencedBySeries.includes(series.slug)) {
        c.referencedBySeries.push(series.slug);
      }
    }
  }

  // Cover image asset
  const coverAsset = artworkLedger.assets[`cover:${series.slug}`];
  let coverUrl = coverAsset?.secureUrl || "/images/artwork-fallback.svg";
  let coverAssetId: string | null = null;

  if (coverAsset && !options.dryRun) {
    coverAssetId = await registerMediaAsset(
      {
        assetKey: `cover:${series.slug}`,
        uploaderId: primaryUploaderId,
        cloudinaryPublicId: coverAsset.cloudinaryPublicId,
        secureUrl: coverAsset.secureUrl,
        format: coverAsset.format,
        width: coverAsset.width,
        height: coverAsset.height,
        byteSize: coverAsset.byteSize,
        seriesSlug: series.slug,
      },
      supabase,
      options
    );
  }

  if (options.dryRun) {
    console.log(`[DRY-RUN] Would seed series: ${series.title} (${series.slug}) [${series.genre}]`);
    for (const ep of series.episodes) {
      console.log(`  [DRY-RUN] Would create episode ${ep.episodeNumber}: ${ep.title} (${ep.pages?.length || 0} pages)`);
    }
    seedState.series[series.slug] = {
      seriesId: `mock-series-${series.slug}`,
      batchNumber: series.batchNumber,
      ownerType: series.ownerType,
      ownerRef: series.ownerRef,
      contributorUsernames: series.credits.map((c) => c.creatorUsername).filter(Boolean) as string[],
    };
    return {
      seriesId: `mock-series-${series.slug}`,
      episodeCount: series.episodes.length,
      pageCount: series.episodes.reduce((acc, ep) => acc + (ep.pages?.length || 0), 0),
    };
  }

  // 1. Insert or retrieve series
  const { data: existingSeries } = await supabase
    .from("series")
    .select("id")
    .eq("slug", series.slug)
    .maybeSingle();

  let seriesId = existingSeries?.id;

  if (!seriesId) {
    const { data: newSeries, error: seriesError } = await supabase
      .from("series")
      .insert({
        slug: series.slug,
        title: series.title,
        synopsis: series.synopsis,
        genre: series.genre,
        format: series.format,
        visibility: "public",
        cover_url: coverUrl,
        cover_asset_id: coverAssetId,
        owner_user_id: ownerUserId,
        owner_studio_id: ownerStudioId,
      })
      .select("id")
      .single();

    if (seriesError || !newSeries) {
      throw new Error(`Failed to create series ${series.slug}: ${seriesError?.message}`);
    }
    seriesId = newSeries.id;
  }

  // 2. Insert Contributor Credits
  for (const credit of series.credits) {
    let creditUserId: string | null = null;
    if (credit.creatorUsername) {
      creditUserId = seedState.creators[credit.creatorUsername]?.profileId || null;
    }

    await supabase.from("contributor_credits").insert({
      series_id: seriesId,
      user_id: creditUserId,
      custom_name: credit.customName || null,
      role_category: credit.roleCategory,
    });
  }

  // 3. Insert Episodes, Revisions, and Pages
  let totalPageCount = 0;

  for (const ep of series.episodes) {
    const { data: existingEp } = await supabase
      .from("episodes")
      .select("id, published_revision_id")
      .eq("series_id", seriesId)
      .eq("episode_number", ep.episodeNumber)
      .maybeSingle();

    let episodeId = existingEp?.id;

    if (!episodeId) {
      const { data: newEp, error: epError } = await supabase
        .from("episodes")
        .insert({
          series_id: seriesId,
          episode_number: ep.episodeNumber,
          title: ep.title,
          slug: ep.slug,
          status: "published",
        })
        .select("id")
        .single();

      if (epError || !newEp) {
        throw new Error(`Failed to create episode ${ep.slug}: ${epError?.message}`);
      }
      episodeId = newEp.id;
    }

    let revisionId = existingEp?.published_revision_id;

    if (!revisionId) {
      // Create Revision 1
      const { data: revision, error: revError } = await supabase
        .from("episode_revisions")
        .insert({
          episode_id: episodeId,
          revision_number: 1,
          status: "published",
          notes: "Initial seed revision",
          created_by: primaryUploaderId,
          text_content: ep.textContent || null,
        })
        .select("id")
        .single();

      if (revError || !revision) {
        throw new Error(`Failed to create revision for episode ${ep.slug}: ${revError?.message}`);
      }
      revisionId = revision.id;
    } else {
      // Update text_content on existing revision if provided
      if (ep.textContent) {
        await supabase
          .from("episode_revisions")
          .update({ text_content: ep.textContent })
          .eq("id", revisionId);
      }
    }

    // Clean existing pages for this revision to ensure idempotent updates
    await supabase.from("revision_pages").delete().eq("revision_id", revisionId);

    // Insert pages only if explicitly provided
    if (ep.pages && ep.pages.length > 0) {
      for (const page of ep.pages) {
        const pageAssetKey = `page:${series.slug}:${ep.episodeNumber}:${page.pageNumber}`;
        const pageAsset = artworkLedger.assets[pageAssetKey];

        let mediaAssetId: string;
        if (pageAsset) {
          mediaAssetId = await registerMediaAsset(
            {
              assetKey: pageAssetKey,
              uploaderId: primaryUploaderId,
              cloudinaryPublicId: pageAsset.cloudinaryPublicId,
              secureUrl: pageAsset.secureUrl,
              format: pageAsset.format,
              width: pageAsset.width,
              height: pageAsset.height,
              byteSize: pageAsset.byteSize,
              seriesSlug: series.slug,
            },
            supabase,
            options
          );
        } else {
          // Fallback placeholder media asset if not yet generated on Cloudinary
          mediaAssetId = await registerMediaAsset(
            {
              assetKey: `fallback:${series.slug}:${ep.episodeNumber}:${page.pageNumber}`,
              uploaderId: primaryUploaderId,
              cloudinaryPublicId: `pageprowl/fallback/${series.slug}/ep${ep.episodeNumber}_p${page.pageNumber}`,
              secureUrl: "/images/artwork-fallback.svg",
              format: "svg",
              width: 1200,
              height: 1600,
              byteSize: 1024,
              seriesSlug: series.slug,
            },
            supabase,
            options
          );
        }

        await supabase.from("revision_pages").insert({
          revision_id: revisionId,
          media_asset_id: mediaAssetId,
          page_number: page.pageNumber,
        });

        totalPageCount++;
      }
    }

    // Point episode published_revision_id to revision 1
    await supabase
      .from("episodes")
      .update({
        published_revision_id: revisionId,
        status: "published",
        updated_at: new Date().toISOString(),
      })
      .eq("id", episodeId);

    // Record release event if not already present
    const { data: existingEvent } = await supabase
      .from("release_events")
      .select("id")
      .eq("series_id", seriesId)
      .eq("episode_id", episodeId)
      .maybeSingle();

    if (!existingEvent) {
      await supabase.from("release_events").insert({
        series_id: seriesId,
        episode_id: episodeId,
        revision_id: revisionId,
        event_type: "published",
        actor_id: primaryUploaderId,
        metadata: {
          isSeed: true,
          episodeNumber: ep.episodeNumber,
          title: ep.title,
        },
      });
    }

    seedState.episodes[`${series.slug}:${ep.episodeNumber}`] = {
      episodeId,
      revisionId: revisionId,
    };
  }

  seedState.series[series.slug] = {
    seriesId,
    batchNumber: series.batchNumber,
  };
  saveSeedState(seedState);

  return {
    seriesId,
    episodeCount: series.episodes.length,
    pageCount: totalPageCount,
  };
}

/**
 * 5. Seed all 15 creators and 4 studios.
 */
export async function seedAllCreatorsAndStudios(
  supabase: SupabaseClient,
  options: { dryRun?: boolean } = {}
) {
  console.log(`Seeding ${SEED_CREATORS.length} creators...`);
  for (let i = 0; i < SEED_CREATORS.length; i++) {
    const creator = SEED_CREATORS[i];
    console.log(`[${i + 1}/${SEED_CREATORS.length}] Creator: ${creator.displayName} (${creator.username})`);
    await seedCreator(creator, supabase, options);
  }

  console.log(`Seeding ${SEED_STUDIOS.length} studios...`);
  for (let i = 0; i < SEED_STUDIOS.length; i++) {
    const studio = SEED_STUDIOS[i];
    console.log(`[${i + 1}/${SEED_STUDIOS.length}] Studio: ${studio.name} (${studio.slug})`);
    await seedStudio(studio, supabase, options);
  }
}

/**
 * 6. Seed a specific batch of 10 series.
 */
export async function seedBatch(
  batchNumber: number,
  supabase: SupabaseClient,
  options: { dryRun?: boolean } = {}
) {
  const targetSeries = ALL_SEED_SERIES.filter((s) => s.batchNumber === batchNumber);
  if (targetSeries.length === 0) {
    throw new Error(`Batch ${batchNumber} not found or empty.`);
  }

  console.log(`--- Seeding Batch ${batchNumber} (${targetSeries.length} series) ---`);

  // Ensure prerequisite creators and studios are seeded
  await seedAllCreatorsAndStudios(supabase, options);

  const results = [];
  for (let i = 0; i < targetSeries.length; i++) {
    const s = targetSeries[i];
    console.log(`[Batch ${batchNumber}][${i + 1}/${targetSeries.length}] Seeding series: ${s.title} (${s.slug})`);
    const result = await seedSingleSeries(s, supabase, options);
    results.push({ ...result, slug: s.slug, title: s.title });
  }

  return results;
}

/**
 * 7. Validate a single series in Supabase.
 */
export async function validateSeries(
  seriesSlug: string,
  supabase: SupabaseClient
): Promise<{
  valid: boolean;
  errors: string[];
  details: {
    seriesId: string;
    title: string;
    slug: string;
    owner: string;
    episodeCount: number;
    episodes: Array<{
      episodeNumber: number;
      title: string;
      status: string;
      hasRevision: boolean;
      pageCount: number;
    }>;
  } | null;
}> {
  const errors: string[] = [];

  const { data: series, error: seriesError } = await supabase
    .from("series")
    .select(`
      id,
      slug,
      title,
      genre,
      visibility,
      owner_user_id,
      owner_studio_id,
      cover_url
    `)
    .eq("slug", seriesSlug)
    .maybeSingle();

  if (seriesError || !series) {
    return {
      valid: false,
      errors: [`Series '${seriesSlug}' not found in database: ${seriesError?.message || "Not found"}`],
      details: null,
    };
  }

  if (series.visibility !== "public") {
    errors.push(`Series visibility is '${series.visibility}', expected 'public'`);
  }

  if (!series.owner_user_id && !series.owner_studio_id) {
    errors.push("Series has neither an owner_user_id nor an owner_studio_id");
  }

  // Fetch episodes
  const { data: episodes, error: epError } = await supabase
    .from("episodes")
    .select("id, episode_number, title, slug, status, published_revision_id")
    .eq("series_id", series.id)
    .order("episode_number", { ascending: true });

  if (epError) {
    errors.push(`Error fetching episodes: ${epError.message}`);
  }

  if (!episodes || episodes.length < 3) {
    errors.push(`Series has ${episodes?.length || 0} episodes, expected at least 3`);
  }

  const episodeDetails = [];

  for (const ep of episodes || []) {
    if (ep.status !== "published") {
      errors.push(`Episode ${ep.episode_number} (${ep.slug}) status is '${ep.status}', expected 'published'`);
    }

    if (!ep.published_revision_id) {
      errors.push(`Episode ${ep.episode_number} (${ep.slug}) published_revision_id is null`);
    }

    // Check revision pages or text content
    let pageCount = 0;
    let hasText = false;
    if (ep.published_revision_id) {
      const { data: rev } = await supabase
        .from("episode_revisions")
        .select("id, text_content")
        .eq("id", ep.published_revision_id)
        .maybeSingle();

      if (rev?.text_content && rev.text_content.trim().length >= 500) {
        hasText = true;
      }

      const { data: pages, error: pageError } = await supabase
        .from("revision_pages")
        .select("id, page_number, media_asset_id")
        .eq("revision_id", ep.published_revision_id)
        .order("page_number", { ascending: true });

      if (pageError) {
        errors.push(`Error fetching pages for episode ${ep.episode_number}: ${pageError.message}`);
      } else {
        pageCount = pages?.length || 0;
        if (!hasText && pageCount < 4) {
          errors.push(`Episode ${ep.episode_number} has neither text content nor at least 4 pages (pages: ${pageCount})`);
        }
      }
    }

    episodeDetails.push({
      episodeNumber: ep.episode_number,
      title: ep.title,
      status: ep.status,
      hasRevision: !!ep.published_revision_id,
      hasTextContent: hasText,
      pageCount,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    details: {
      seriesId: series.id,
      title: series.title,
      slug: series.slug,
      owner: series.owner_user_id ? `User: ${series.owner_user_id}` : `Studio: ${series.owner_studio_id}`,
      episodeCount: episodes?.length || 0,
      episodes: episodeDetails,
    },
  };
}

/**
 * 8. Deep Series Verification Report
 * Checks complete database integrity and artwork completeness,
 * validating distinctness of artwork across all pages.
 */
export async function verifySeriesIntegrity(
  seriesSlug: string,
  supabase: SupabaseClient
) {
  const issues: string[] = [];

  // 1. Fetch Series
  const { data: series, error: seriesError } = await supabase
    .from("series")
    .select(`
      id,
      slug,
      title,
      synopsis,
      genre,
      format,
      visibility,
      cover_url,
      cover_asset_id,
      owner_user_id,
      owner_studio_id
    `)
    .eq("slug", seriesSlug)
    .maybeSingle();

  if (seriesError || !series) {
    return {
      status: "FAILED",
      databaseIntegrityPassed: false,
      artworkCompletenessPassed: false,
      issues: [`Series '${seriesSlug}' not found: ${seriesError?.message || "Not found"}`],
      report: null,
    };
  }

  // 2. Validate Ownership
  let ownerName = "Unknown";
  let ownerType: "individual" | "studio" = "individual";
  if (series.owner_user_id && !series.owner_studio_id) {
    ownerType = "individual";
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", series.owner_user_id)
      .maybeSingle();
    ownerName = profile ? `${profile.display_name} (@${profile.username})` : series.owner_user_id;
  } else if (!series.owner_user_id && series.owner_studio_id) {
    ownerType = "studio";
    const { data: studio } = await supabase
      .from("studios")
      .select("name, slug")
      .eq("id", series.owner_studio_id)
      .maybeSingle();
    ownerName = studio ? `${studio.name} (${studio.slug})` : series.owner_studio_id;
  } else {
    issues.push("Invalid ownership: must have exactly one of owner_user_id or owner_studio_id");
  }

  // 3. Contributor Credits
  const { data: credits } = await supabase
    .from("contributor_credits")
    .select("role_category, user_id, custom_name")
    .eq("series_id", series.id);

  // 4. Cover Asset Check
  let coverPublicId: string | null = null;
  let coverIsFallback = !series.cover_url || series.cover_url.includes("fallback");
  if (series.cover_asset_id) {
    const { data: coverAsset } = await supabase
      .from("media_assets")
      .select("cloudinary_public_id, secure_url")
      .eq("id", series.cover_asset_id)
      .maybeSingle();
    if (coverAsset) {
      coverPublicId = coverAsset.cloudinary_public_id;
      if (coverAsset.cloudinary_public_id.includes("fallback")) {
        coverIsFallback = true;
      }
    }
  }
  if (coverIsFallback) {
    issues.push("Cover artwork is using a fallback placeholder SVG instead of uploaded Cloudinary artwork");
  }

  // 5. Episodes & Revisions & Pages
  const { data: episodes } = await supabase
    .from("episodes")
    .select("id, episode_number, title, slug, status, published_revision_id")
    .eq("series_id", series.id)
    .order("episode_number", { ascending: true });

  const episodeReports = [];
  const allPageUrls: string[] = [];
  const allPagePublicIds: string[] = [];
  const urlOccurrences: Record<string, number> = {};
  let totalPages = 0;
  let hasFallbackPages = false;

  for (const ep of episodes || []) {
    const pageReports = [];

    if (ep.status !== "published") {
      issues.push(`Episode ${ep.episode_number} status is '${ep.status}', expected 'published'`);
    }

    if (!ep.published_revision_id) {
      issues.push(`Episode ${ep.episode_number} has no published_revision_id`);
      continue;
    }

    const { data: rev } = await supabase
      .from("episode_revisions")
      .select("id, text_content")
      .eq("id", ep.published_revision_id)
      .maybeSingle();

    const textLength = rev?.text_content?.length || 0;
    const isTextStory = textLength >= 500;

    const { data: pages } = await supabase
      .from("revision_pages")
      .select(`
        page_number,
        media_asset_id,
        media_assets (
          id,
          cloudinary_public_id,
          secure_url,
          format,
          width,
          height,
          byte_size
        )
      `)
      .eq("revision_id", ep.published_revision_id)
      .order("page_number", { ascending: true });

    for (const page of pages || []) {
      const ma: any = page.media_assets;
      const secureUrl = ma?.secure_url || "";
      const publicId = ma?.cloudinary_public_id || "";
      const isFallback = !secureUrl || secureUrl.includes("fallback") || publicId.includes("fallback");

      if (isFallback) {
        hasFallbackPages = true;
      }

      allPageUrls.push(secureUrl);
      allPagePublicIds.push(publicId);
      urlOccurrences[secureUrl] = (urlOccurrences[secureUrl] || 0) + 1;
      totalPages++;

      pageReports.push({
        pageNumber: page.page_number,
        mediaAssetId: page.media_asset_id,
        cloudinaryPublicId: publicId,
        secureUrl,
        dimensions: ma ? `${ma.width}x${ma.height}` : "Unknown",
        byteSize: ma?.byte_size || 0,
        isFallback,
      });
    }

    episodeReports.push({
      episodeNumber: ep.episode_number,
      title: ep.title,
      slug: ep.slug,
      status: ep.status,
      publishedRevisionId: ep.published_revision_id,
      isTextStory,
      textLength,
      pageCount: pageReports.length,
      pages: pageReports,
    });
  }

  // 6. Release Events
  const { data: releaseEvents } = await supabase
    .from("release_events")
    .select("event_type, episode_id, revision_id, created_at")
    .eq("series_id", series.id);

  // 7. Check for Format and Completeness
  const allEpisodesText = episodeReports.length >= 3 && episodeReports.every((e) => e.isTextStory);
  const allEpisodesGraphic = episodeReports.length >= 3 && episodeReports.every((e) => e.pageCount >= 4);

  const duplicateUrls = Object.entries(urlOccurrences)
    .filter(([_, count]) => count > 1)
    .map(([url, count]) => `${url} (used ${count} times)`);

  if (!allEpisodesText && !allEpisodesGraphic) {
    const invalidEpisodes = episodeReports.filter((e) => !e.isTextStory && e.pageCount < 4);
    if (invalidEpisodes.length > 0) {
      issues.push(`Episodes lacking both text story (>= 500 chars) and comic pages (>= 4): ${invalidEpisodes.map((e) => e.episodeNumber).join(", ")}`);
    }
  }

  if (!allEpisodesText) {
    if (duplicateUrls.length > 0) {
      issues.push(`Duplicate artwork detected across pages: ${duplicateUrls.join(", ")}`);
    }

    if (hasFallbackPages) {
      issues.push("One or more pages are using fallback placeholder SVG instead of uploaded Cloudinary artwork");
    }

    if (totalPages < 12) {
      issues.push(`Series has ${totalPages} total pages across 3 episodes, expected exactly 12`);
    }
  }

  const distinctArtworkCount = new Set(allPageUrls).size;
  const dbPassed = issues.filter((i) => !i.includes("artwork") && !i.includes("fallback") && !i.includes("Duplicate")).length === 0;
  
  let artPassed = !coverIsFallback;
  if (!allEpisodesText) {
    artPassed = artPassed && !hasFallbackPages && duplicateUrls.length === 0 && distinctArtworkCount === 12;
  }

  return {
    status: dbPassed && artPassed ? "PASSED" : "FAILED",
    databaseIntegrityPassed: dbPassed,
    artworkCompletenessPassed: artPassed,
    issues,
    report: {
      series: {
        id: series.id,
        slug: series.slug,
        title: series.title,
        synopsis: series.synopsis,
        genre: series.genre,
        format: series.format,
        visibility: series.visibility,
        ownerType,
        ownerName,
        coverUrl: series.cover_url,
        coverPublicId,
        coverIsFallback,
      },
      credits: credits || [],
      episodeCount: episodeReports.length,
      episodes: episodeReports,
      releaseEventCount: releaseEvents?.length || 0,
      releaseEvents: releaseEvents || [],
      analysis: {
        totalEpisodes: episodeReports.length,
        totalPages,
        distinctArtworkCount,
        hasDuplicateArtwork: duplicateUrls.length > 0,
        duplicateUrls,
        hasFallbackPages,
        coverIsFallback,
      },
    },
  };
}

/**
 * 9. Safe, Dependency-Aware Rollback of Seed Data
 */
export async function rollbackSeed(
  supabase: SupabaseClient,
  options: {
    dryRun?: boolean;
    targetSeriesSlug?: string;
    batchNumber?: number;
    purgeCloudinary?: boolean;
    confirm?: boolean;
  } = {}
) {
  const seedState = loadSeedState();
  const seriesToRollback = options.targetSeriesSlug
    ? ALL_SEED_SERIES.filter((s) => s.slug === options.targetSeriesSlug)
    : options.batchNumber
    ? ALL_SEED_SERIES.filter((s) => s.batchNumber === options.batchNumber)
    : ALL_SEED_SERIES;

  const isFullRollback = !options.targetSeriesSlug && !options.batchNumber;

  if (isFullRollback && !options.dryRun && !options.confirm) {
    throw new Error(
      "Full seed rollback requires explicit --confirm flag to prevent accidental deletion."
    );
  }

  console.log(`\n=== Seed Rollback Plan (${options.dryRun ? "DRY-RUN SIMULATION" : "LIVE EXECUTION"}) ===`);
  console.log(`Scope: ${isFullRollback ? "FULL SEED ROLLBACK" : options.targetSeriesSlug ? `Single Series '${options.targetSeriesSlug}'` : `Batch ${options.batchNumber}`}`);
  console.log(`Target Series Count: ${seriesToRollback.length}`);

  for (const series of seriesToRollback) {
    console.log(`\n--- Inspecting Series: ${series.title} (${series.slug}) ---`);

    // 1. Find series in DB
    const { data: dbSeries } = await supabase
      .from("series")
      .select("id, title, cover_asset_id, owner_user_id, owner_studio_id")
      .eq("slug", series.slug)
      .maybeSingle();

    if (!dbSeries) {
      console.log(`  Series '${series.slug}' not present in database.`);
      delete seedState.series[series.slug];
      continue;
    }

    const seriesId = dbSeries.id;
    console.log(`  Series ID: ${seriesId}`);

    // 2. Find episodes
    const { data: dbEpisodes } = await supabase
      .from("episodes")
      .select("id, episode_number, title")
      .eq("series_id", seriesId);

    const episodeIds = (dbEpisodes || []).map((e) => e.id);
    console.log(`  Episodes found: ${episodeIds.length}`);
    for (const ep of dbEpisodes || []) {
      console.log(`    - Ep ${ep.episode_number}: ${ep.title} (${ep.id})`);
    }

    // 3. Find revisions & pages
    let revisionIds: string[] = [];
    let pageCount = 0;
    if (episodeIds.length > 0) {
      const { data: dbRevisions } = await supabase
        .from("episode_revisions")
        .select("id")
        .in("episode_id", episodeIds);
      revisionIds = (dbRevisions || []).map((r) => r.id);

      if (revisionIds.length > 0) {
        const { data: pages } = await supabase
          .from("revision_pages")
          .select("id")
          .in("revision_id", revisionIds);
        pageCount = pages?.length || 0;
      }
    }
    console.log(`  Revisions found: ${revisionIds.length}`);
    console.log(`  Revision pages found: ${pageCount}`);

    // 4. Find release events
    const { data: releaseEvents } = await supabase
      .from("release_events")
      .select("id")
      .eq("series_id", seriesId);
    console.log(`  Release events found: ${releaseEvents?.length || 0}`);

    // 5. Find contributor credits
    const { data: credits } = await supabase
      .from("contributor_credits")
      .select("id")
      .eq("series_id", seriesId);
    console.log(`  Contributor credits found: ${credits?.length || 0}`);

    // 6. Find series-specific media assets
    const seriesAssetKeys = Object.keys(seedState.mediaAssets).filter(
      (k) => k.startsWith(`cover:${series.slug}`) || k.startsWith(`page:${series.slug}:`)
    );
    console.log(`  Series media assets registered in ledger: ${seriesAssetKeys.length}`);

    if (options.dryRun) {
      console.log(`  [DRY-RUN] Would delete ${releaseEvents?.length || 0} release events`);
      console.log(`  [DRY-RUN] Would delete ${pageCount} revision pages`);
      console.log(`  [DRY-RUN] Would null published_revision_id on ${episodeIds.length} episodes`);
      console.log(`  [DRY-RUN] Would delete ${revisionIds.length} episode revisions`);
      console.log(`  [DRY-RUN] Would delete ${episodeIds.length} episodes`);
      console.log(`  [DRY-RUN] Would delete ${credits?.length || 0} contributor credits`);
      console.log(`  [DRY-RUN] Would delete series record (${seriesId})`);
      console.log(`  [DRY-RUN] Would delete ${seriesAssetKeys.length} series media_assets from database`);
      console.log(`  [DRY-RUN] Shared Identities (Creators & Studios): PRESERVED (0 deleted)`);
      continue;
    }

    // LIVE EXECUTION (Single/Batch Series)
    if (releaseEvents && releaseEvents.length > 0) {
      await supabase.from("release_events").delete().eq("series_id", seriesId);
    }

    if (revisionIds.length > 0) {
      await supabase.from("revision_pages").delete().in("revision_id", revisionIds);
    }

    if (episodeIds.length > 0) {
      await supabase.from("episodes").update({ published_revision_id: null }).in("id", episodeIds);
      await supabase.from("episode_revisions").delete().in("episode_id", episodeIds);
      await supabase.from("episodes").delete().eq("series_id", seriesId);
    }

    if (credits && credits.length > 0) {
      await supabase.from("contributor_credits").delete().eq("series_id", seriesId);
    }

    await supabase.from("series").update({ cover_asset_id: null }).eq("id", seriesId);
    await supabase.from("series").delete().eq("id", seriesId);

    // Delete series-specific media assets from database
    for (const key of seriesAssetKeys) {
      const asset = seedState.mediaAssets[key];
      if (asset?.assetId) {
        await supabase.from("media_assets").delete().eq("id", asset.assetId);
      }
      delete seedState.mediaAssets[key];
    }

    // Unlink series from creators & studios in ledger
    if (series.ownerType === "individual" && seedState.creators[series.ownerRef]) {
      const c = seedState.creators[series.ownerRef];
      c.referencedBySeries = (c.referencedBySeries || []).filter((s) => s !== series.slug);
    } else if (series.ownerType === "studio" && seedState.studios[series.ownerRef]) {
      const s = seedState.studios[series.ownerRef];
      s.referencedBySeries = (s.referencedBySeries || []).filter((slug) => slug !== series.slug);
    }

    delete seedState.series[series.slug];
    for (const ep of series.episodes) {
      delete seedState.episodes[`${series.slug}:${ep.episodeNumber}`];
    }
  }

  // ONLY FULL ROLLBACK DELETES CREATORS AND STUDIOS
  if (isFullRollback) {
    console.log("\n--- Full Rollback: Studios, Creators, and Shared Media Assets ---");
    const studioSlugs = Object.keys(seedState.studios);
    const creatorUsernames = Object.keys(seedState.creators);

    console.log(`Studios tracked in seed state: ${studioSlugs.length}`);
    console.log(`Creators tracked in seed state: ${creatorUsernames.length}`);

    if (options.dryRun) {
      console.log(`[DRY-RUN] Would delete ${studioSlugs.length} studio records and memberships`);
      console.log(`[DRY-RUN] Would delete ${creatorUsernames.length} creator profiles and auth users`);
      console.log(`[DRY-RUN] Pre-existing or non-seed user accounts: PRESERVED (Untouched)`);
    } else {
      // Delete studios
      for (const slug of studioSlugs) {
        const studioInfo = seedState.studios[slug];
        if (studioInfo?.studioId) {
          await supabase.from("studio_members").delete().eq("studio_id", studioInfo.studioId);
          await supabase.from("studios").delete().eq("id", studioInfo.studioId);
        }
        delete seedState.studios[slug];
      }

      // Delete creators (strictly by tracked authUserId)
      for (const username of creatorUsernames) {
        const creatorInfo = seedState.creators[username];
        if (creatorInfo?.profileId && creatorInfo?.authUserId) {
          await supabase.from("creator_profiles").delete().eq("id", creatorInfo.profileId);
          await supabase.from("profiles").delete().eq("id", creatorInfo.profileId);
          await supabase.auth.admin.deleteUser(creatorInfo.authUserId);
        }
        delete seedState.creators[username];
      }

      // Clear remaining media assets
      const remainingAssetKeys = Object.keys(seedState.mediaAssets);
      for (const key of remainingAssetKeys) {
        const asset = seedState.mediaAssets[key];
        if (asset?.assetId) {
          await supabase.from("media_assets").delete().eq("id", asset.assetId);
        }
      }
      seedState.mediaAssets = {};
    }
  }

  if (!options.dryRun) {
    saveSeedState(seedState);
  }

  console.log(`\nSeed rollback completed successfully.`);
}
