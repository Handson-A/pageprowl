import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient, getCachedAuthUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSeriesRole } from "@/lib/auth/guards";
import { processDueReleasesOpportunistically } from "@/lib/data/publishing";
import { SeriesWorkspaceClient } from "./SeriesWorkspaceClient";

interface SeriesWorkspaceProps {
  params: {
    seriesId: string;
  };
}

export default async function SeriesWorkspacePage({
  params,
}: SeriesWorkspaceProps) {
  const supabase = createClient();
  const user = await getCachedAuthUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/studio/series/${params.seriesId}`)}`);
  }

  // Enforce server-side authorization: caller must have at least viewer role
  const { effectiveRole } = await requireSeriesRole(params.seriesId, "viewer");

  const { data: series } = await supabase
    .from("series")
    .select(`
      *,
      studios:owner_studio_id (name)
    `)
    .eq("id", params.seriesId)
    .single();

  if (!series) {
    notFound();
  }

  // Opportunistic auto-publishing: process any scheduled releases that are due
  await processDueReleasesOpportunistically();

  const { data: episodes, error: episodesError } = await supabase
    .from("episodes")
    .select(`
      id,
      episode_number,
      title,
      slug,
      status,
      published_revision_id,
      updated_at
    `)
    .eq("series_id", series.id)
    .order("episode_number", { ascending: true });

  let episodesList = episodes || [];

  // Fallback to verified admin client if RLS subquery recursion or policy filters out creator's episodes
  if (episodesError || episodesList.length === 0) {
    try {
      const admin = createAdminClient();
      const { data: adminEps } = await admin
        .from("episodes")
        .select(`
          id,
          episode_number,
          title,
          slug,
          status,
          published_revision_id,
          updated_at
        `)
        .eq("series_id", series.id)
        .order("episode_number", { ascending: true });
      if (adminEps && adminEps.length > 0) {
        episodesList = adminEps;
      }
    } catch (adminErr) {
      console.error("Admin episode fallback failed:", adminErr);
    }
  }

  // Fetch revisions separately by episode_id to avoid ambiguous PostgREST join collisions
  const episodeIds = episodesList.map((ep: any) => ep.id);
  const latestRevisionStatusMap: Record<string, string> = {};

  if (episodeIds.length > 0) {
    const { data: revisions, error: revError } = await supabase
      .from("episode_revisions")
      .select("episode_id, revision_number, status")
      .in("episode_id", episodeIds)
      .order("revision_number", { ascending: false });

    let revList = revisions || [];
    if (revError || revList.length === 0) {
      try {
        const admin = createAdminClient();
        const { data: adminRevs } = await admin
          .from("episode_revisions")
          .select("episode_id, revision_number, status")
          .in("episode_id", episodeIds)
          .order("revision_number", { ascending: false });
        if (adminRevs && adminRevs.length > 0) {
          revList = adminRevs;
        }
      } catch {
        // ignore
      }
    }

    for (const rev of revList) {
      if (!latestRevisionStatusMap[rev.episode_id]) {
        latestRevisionStatusMap[rev.episode_id] = rev.status;
      }
    }
  }

  const formattedEpisodes = episodesList.map((ep: any) => ({
    id: ep.id,
    episode_number: ep.episode_number,
    title: ep.title,
    slug: ep.slug,
    published_revision_id: ep.published_revision_id,
    latestRevisionStatus:
      latestRevisionStatusMap[ep.id] ||
      ep.status ||
      (ep.published_revision_id ? "published" : "draft"),
  }));

  return (
    <SeriesWorkspaceClient
      series={{
        id: series.id,
        title: series.title,
        slug: series.slug,
        synopsis: series.synopsis,
        format: series.format,
        genre: series.genre,
        visibility: series.visibility,
        cover_url: series.cover_url,
        owner_user_id: series.owner_user_id,
        owner_studio_id: series.owner_studio_id,
        studioName: (series as any).studios?.name,
      }}
      episodes={formattedEpisodes}
      userRole={effectiveRole}
    />
  );
}
