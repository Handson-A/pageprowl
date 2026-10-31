import React from "react";
import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { getPublicEpisodeContent } from "@/lib/data/series";

interface EpisodeReaderPageProps {
  params: {
    seriesSlug: string;
    episodeSlug: string;
  };
}

export default async function EpisodeReaderPage({
  params,
}: EpisodeReaderPageProps) {
  const content = await getPublicEpisodeContent(
    params.seriesSlug,
    params.episodeSlug
  );

  // Enforce security invariant: unpublished drafts or non-existent episodes return safe 404
  if (!content) {
    notFound();
  }

  const { series, episode, pages, prevEpisodeSlug, nextEpisodeSlug } = content;

  return (
    <ReaderShell
      series={{
        id: series.id,
        title: series.title,
        slug: series.slug,
        format: series.format,
      }}
      episode={{
        id: episode.id,
        title: episode.title,
        slug: episode.slug,
        episode_number: episode.episode_number,
      }}
      pages={pages}
      prevEpisodeSlug={prevEpisodeSlug}
      nextEpisodeSlug={nextEpisodeSlug}
    />
  );
}
