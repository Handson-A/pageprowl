import { notFound, redirect } from "next/navigation";
import styles from "./page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { EpisodeEditorClient } from "./EpisodeEditorClient";
import { createClient } from "@/lib/supabase/server";
import { requireSeriesRole } from "@/lib/auth/guards";

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Enforce server-side authorization: caller must be editor or owner
  await requireSeriesRole(params.seriesId, "editor");

  const { data: series } = await supabase
    .from("series")
    .select("id, title, slug, format")
    .eq("id", params.seriesId)
    .single();

  if (!series) {
    notFound();
  }

  const { data: episode } = await supabase
    .from("episodes")
    .select("*")
    .eq("id", params.episodeId)
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

  // Fetch revision pages
  const { data: pages } = await supabase
    .from("revision_pages")
    .select(`
      id,
      page_number,
      media_assets:media_asset_id (secure_url)
    `)
    .eq("revision_id", currentRevision.id)
    .order("page_number", { ascending: true });

  const initialPages = (pages || []).map((p: any) => ({
    id: p.id,
    pageNumber: p.page_number,
    imageUrl: p.media_assets?.secure_url || "https://picsum.photos/800/1200",
  }));

  // Fetch comments
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

  const isPublished = episode.published_revision_id === currentRevision.id;

  return (
    <div className={styles.layout}>
      <CreatorSidebar />
      <EpisodeEditorClient
        seriesId={series.id}
        seriesSlug={series.slug}
        seriesFormat={series.format}
        seriesTitle={series.title}
        episodeId={episode.id}
        episodeNumber={episode.episode_number}
        episodeTitle={episode.title}
        initialRevisionId={currentRevision.id}
        initialStatus={currentRevision.status}
        initialPages={initialPages}
        initialComments={initialComments}
        isPublished={isPublished}
      />
    </div>
  );
}
