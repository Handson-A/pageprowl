import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { getPublicEpisodeContent } from "@/lib/data/series";

interface EpisodeReaderPageProps {
  params: {
    seriesSlug: string;
    episodeSlug: string;
  };
}

export async function generateMetadata({
  params,
}: EpisodeReaderPageProps): Promise<Metadata> {
  const content = await getPublicEpisodeContent(
    params.seriesSlug,
    params.episodeSlug
  );

  if (!content) {
    return {
      title: "Episode Reader | PageProwl",
    };
  }

  return {
    title: `Ch. ${content.episode.episode_number}: ${content.episode.title} - ${content.series.title} | PageProwl`,
    description: `Read ${content.series.title} Chapter ${content.episode.episode_number} online on PageProwl.`,
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

  const {
    series,
    episode,
    pages,
    textContent,
    prevEpisodeSlug,
    nextEpisodeSlug,
    allEpisodes,
  } = content;

  return (
    <ReaderShell
      series={{
        id: series.id,
        title: series.title,
        slug: series.slug,
        format: series.format,
        cover_url: series.cover_url,
      }}
      episode={{
        id: episode.id,
        title: episode.title,
        slug: episode.slug,
        episode_number: episode.episode_number,
      }}
      pages={pages}
      textContent={textContent}
      prevEpisodeSlug={prevEpisodeSlug}
      nextEpisodeSlug={nextEpisodeSlug}
      allEpisodes={allEpisodes}
    />
  );
}
