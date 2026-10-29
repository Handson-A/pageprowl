import React from "react";
import { notFound } from "next/navigation";
import { ReaderToolbar } from "@/components/reader/ReaderToolbar";
import { VerticalReader } from "@/components/reader/VerticalReader";
import { PaginatedReader } from "@/components/reader/PaginatedReader";
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
    <div style={{ backgroundColor: "var(--reader-bg)", minHeight: "100vh" }}>
      <ReaderToolbar
        seriesTitle={series.title}
        seriesSlug={series.slug}
        episodeTitle={episode.title}
        episodeNumber={episode.episode_number}
        currentPage={1}
        totalPages={pages.length}
        prevEpisodeSlug={prevEpisodeSlug}
        nextEpisodeSlug={nextEpisodeSlug}
      />

      {series.format === "scroll" ? (
        <VerticalReader
          pages={pages}
          seriesSlug={series.slug}
          nextEpisodeSlug={nextEpisodeSlug}
        />
      ) : (
        <PaginatedReader
          pages={pages}
          seriesSlug={series.slug}
          nextEpisodeSlug={nextEpisodeSlug}
        />
      )}
    </div>
  );
}
