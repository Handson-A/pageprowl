import { notFound, redirect } from "next/navigation";
import { EpisodeEditorClient } from "./EpisodeEditorClient";
import { createClient, getCachedAuthUser } from "@/lib/supabase/server";
import { requireSeriesRole } from "@/lib/auth/guards";
import { getEpisodeReleaseEvents, processDueReleasesOpportunistically } from "@/lib/data/publishing";

interface EpisodeWorkspaceProps {
  params: {
    seriesId: string;
    episodeId: string;
  };
}

export default async function EpisodeWorkspacePage({
  params,
}: EpisodeWorkspaceProps) {
  const supabase = createClient();
  const user = await getCachedAuthUser();

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(
        `/studio/series/${params.seriesId}/episodes/${params.episodeId}`
      )}`
    );
  }

  // Enforce server-side authorization: caller must be editor or owner
  const { effectiveRole } = await requireSeriesRole(params.seriesId, "editor");

  const { data: series } = await supabase
    .from("series")
    .select("id, title, slug, format")
    .eq("id", params.seriesId)
    .single();

  if (!series) {
    notFound();
  }

  let { data: episode } = await supabase
    .from("episodes")
    .select("*")
    .eq("id", params.episodeId)
    .eq("series_id", series.id)
    .single();

  if (!episode) {
    notFound();
  }

  // Fetch revisions
  const { data: revisions } = await supabase
    .from("episode_revisions")
    .select("*")
    .eq("episode_id", episode.id)
    .order("revision_number", { ascending: false });

  const currentRevision =
    revisions && revisions.length > 0
      ? revisions[0]
      : {
          id: "rev-default",
          revision_number: 1,
          status: "draft" as const,
        };

  // Fetch revision pages with media_asset_id
  const { data: pages } = await supabase
    .from("revision_pages")
    .select(`
      id,
      page_number,
      media_asset_id,
      media_assets:media_asset_id (secure_url)
    `)
    .eq("revision_id", currentRevision.id)
    .order("page_number", { ascending: true });

  const initialPages = (pages || []).map((p: any) => ({
    id: p.id,
    pageNumber: p.page_number,
    mediaAssetId: p.media_asset_id,
    imageUrl: p.media_assets?.secure_url || "/images/artwork-fallback.png",
  }));

  // Fetch review comments
  const { data: comments } = await supabase
    .from("review_comments")
    .select(`
      id,
      content,
      status,
      created_at,
      profiles:user_id (display_name)
    `)
    .eq("revision_id", currentRevision.id)
    .order("created_at", { ascending: false });

  const initialComments = (comments || []).map((c: any) => ({
    id: c.id,
    userName: c.profiles?.display_name || "Creator",
    content: c.content,
    status: c.status,
    createdAt: new Date(c.created_at).toLocaleTimeString(),
  }));

  const isPublished = episode.published_revision_id === currentRevision.id || episode.status === "published";

  // Fetch active schedule if scheduled
  let { data: schedData } = await supabase
    .from("scheduled_publications")
    .select("id, scheduled_for, status")
    .eq("episode_id", episode.id)
    .eq("status", "scheduled")
    .maybeSingle();

  // Opportunistic auto-publishing: if scheduled time has passed, process due releases immediately
  if (schedData && new Date(schedData.scheduled_for) <= new Date()) {
    const processed = await processDueReleasesOpportunistically();
    if (processed > 0) {
      // Re-fetch episode and schedule state after automated release
      const { data: updatedEp } = await supabase
        .from("episodes")
        .select("*")
        .eq("id", episode.id)
        .single();
      if (updatedEp) {
        episode = updatedEp;
      }
      const { data: updatedSched } = await supabase
        .from("scheduled_publications")
        .select("id, scheduled_for, status")
        .eq("episode_id", episode.id)
        .eq("status", "scheduled")
        .maybeSingle();
      schedData = updatedSched;
    }
  }

  // Fetch durable release events
  const initialReleaseEvents = await getEpisodeReleaseEvents(episode.id);

  // Fetch latest review request if any
  const { data: latestReview } = await supabase
    .from("review_requests")
    .select(`
      id,
      status,
      feedback,
      round,
      reviewer_id,
      completed_at,
      profiles:reviewer_id (display_name)
    `)
    .eq("episode_id", episode.id)
    .order("round", { ascending: false })
    .limit(1)
    .maybeSingle();

  const episodeStatus = (episode.status || currentRevision.status || "draft") as any;

  return (
    <EpisodeEditorClient
      seriesId={series.id}
      seriesSlug={series.slug}
      seriesFormat={series.format}
      seriesTitle={series.title}
      episodeId={episode.id}
      episodeNumber={episode.episode_number}
      episodeTitle={episode.title}
      episodeSlug={episode.slug}
      initialRevisionId={currentRevision.id}
      initialStatus={currentRevision.status}
      initialEpisodeStatus={episodeStatus}
      initialPages={initialPages}
      initialTextContent={(currentRevision as any).text_content || ""}
      initialComments={initialComments}
      initialScheduledPublication={schedData || null}
      initialReleaseEvents={initialReleaseEvents}
      latestReviewRequest={latestReview as any}
      isPublished={isPublished}
      userRole={effectiveRole}
    />
  );
}
