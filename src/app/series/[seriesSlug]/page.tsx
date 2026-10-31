import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublicSeriesBySlug, getPublishedEpisodes } from "@/lib/data/series";
import { LuImage, LuClock, LuBookOpen, LuArrowRight } from "react-icons/lu";

interface SeriesPageProps {
  params: {
    seriesSlug: string;
  };
}

export default async function SeriesOverviewPage({ params }: SeriesPageProps) {
  const series = await getPublicSeriesBySlug(params.seriesSlug);

  // If private or not found, return safe 404 without leaking internal state
  if (!series) {
    notFound();
  }

  const episodes = await getPublishedEpisodes(series.id);
  const firstEpisode = episodes.length > 0 ? episodes[0] : null;

  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        <div className={styles.seriesHeader}>
          <div className={styles.coverWrapper}>
            {series.cover_url ? (
              <img
                src={series.cover_url}
                alt={series.title}
                className={styles.coverImage}
              />
            ) : (
              <div className={styles.coverFallback} aria-label="Cover Artwork Placeholder">
                <LuImage size={44} color="var(--color-text-muted)" />
              </div>
            )}
          </div>

          <div className={styles.seriesMeta}>
            <div className={styles.badges}>
              <span className={styles.badge}>{series.genre}</span>
              <span className={styles.badge}>
                {series.format === "scroll" ? "Vertical Scroll" : "Page-by-Page"}
              </span>
            </div>

            <h1 className={styles.title}>{series.title}</h1>
            <p className={styles.creator}>Created by {series.creator_name}</p>
            <p className={styles.synopsis}>{series.synopsis}</p>

            <div className={styles.actions}>
              {firstEpisode ? (
                <Link href={`/series/${series.slug}/episodes/${firstEpisode.slug}`}>
                  <Button variant="primary" size="lg">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <LuBookOpen size={18} aria-hidden="true" />
                      <span>Start Reading (Ep. {firstEpisode.episode_number})</span>
                    </span>
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" size="lg" disabled>
                  Coming Soon
                </Button>
              )}
            </div>
          </div>
        </div>

        <section className={styles.episodesSection}>
          <h2 className={styles.episodesTitle}>Published Episodes ({episodes.length})</h2>

          {episodes.length > 0 ? (
            <div className={styles.episodeList}>
              {episodes.map((ep) => (
                <Link
                  key={ep.id}
                  href={`/series/${series.slug}/episodes/${ep.slug}`}
                  className={styles.episodeItem}
                >
                  <div className={styles.episodeLeft}>
                    <span className={styles.episodeNumber}>
                      #{ep.episode_number}
                    </span>
                    <span className={styles.episodeItemTitle}>{ep.title}</span>
                  </div>
                  <span className={styles.readButton} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <span>Read</span>
                    <LuArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<LuClock size={40} color="var(--color-text-muted)" />}
              title="No published episodes yet"
              description="The creator is currently preparing the first chapter. Check back soon!"
            />
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
