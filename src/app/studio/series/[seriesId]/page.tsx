import React from "react";
import { notFound, redirect } from "next/navigation";
import styles from "@/app/studio/page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { createClient } from "@/lib/supabase/server";
import { requireSeriesRole } from "@/lib/auth/guards";
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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

  const { data: episodes } = await supabase
    .from("episodes")
    .select(`
      id,
      episode_number,
      title,
      slug,
      published_revision_id,
      episode_revisions (
        id,
        revision_number,
        status,
        updated_at
      )
    `)
    .eq("series_id", series.id)
    .order("episode_number", { ascending: true });

  const formattedEpisodes = (episodes || []).map((ep: any) => {
    const sortedRevs = (ep.episode_revisions || []).sort(
      (a: any, b: any) => b.revision_number - a.revision_number
    );
    const latestRev = sortedRevs[0];
    return {
      id: ep.id,
      episode_number: ep.episode_number,
      title: ep.title,
      slug: ep.slug,
      published_revision_id: ep.published_revision_id,
      latestRevisionStatus: latestRev ? latestRev.status : "draft",
    };
  });

  return (
    <div className={styles.layout}>
      <CreatorSidebar />
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
    </div>
  );
}
