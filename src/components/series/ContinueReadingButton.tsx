"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getSeriesReadingProgress, type ReadingProgressEntry } from "@/lib/reading-progress";
import { LuBookOpen, LuRotateCcw } from "react-icons/lu";

interface ContinueReadingButtonProps {
  seriesSlug: string;
  firstEpisodeSlug?: string | null;
  firstEpisodeNumber?: number;
}

export function ContinueReadingButton({
  seriesSlug,
  firstEpisodeSlug,
  firstEpisodeNumber = 1,
}: ContinueReadingButtonProps) {
  const [progress, setProgress] = useState<ReadingProgressEntry | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getSeriesReadingProgress(seriesSlug));
  }, [seriesSlug]);

  if (!firstEpisodeSlug) {
    return (
      <Button variant="secondary" size="lg" disabled>
        Coming Soon
      </Button>
    );
  }

  // Before client mount, render the default server button to avoid hydration mismatch
  if (!mounted || !progress) {
    return (
      <Link href={`/series/${seriesSlug}/episodes/${firstEpisodeSlug}`}>
        <Button variant="primary" size="lg">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <LuBookOpen size={18} aria-hidden="true" />
            <span>Start Reading (Ep. {firstEpisodeNumber})</span>
          </span>
        </Button>
      </Link>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
      <Link href={`/series/${seriesSlug}/episodes/${progress.episodeSlug}`}>
        <Button variant="primary" size="lg">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <LuBookOpen size={18} aria-hidden="true" />
            <span>
              Resume Ep. {progress.episodeNumber}
              {progress.format !== "scroll" && progress.pageNumber ? ` (p. ${progress.pageNumber})` : ""}
            </span>
          </span>
        </Button>
      </Link>

      <Link href={`/series/${seriesSlug}/episodes/${firstEpisodeSlug}`}>
        <Button variant="secondary" size="lg">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <LuRotateCcw size={16} aria-hidden="true" />
            <span>Restart (Ep. {firstEpisodeNumber})</span>
          </span>
        </Button>
      </Link>
    </div>
  );
}
