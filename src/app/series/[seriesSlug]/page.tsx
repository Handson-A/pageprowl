import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getPublicSeriesBySlug, getPublishedEpisodes } from "@/lib/data/series";
import { LuBookOpen, LuArrowRight, LuLayers } from "react-icons/lu";

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
              <div className={styles.coverFallback} aria-label="Cover artwork placeholder">
                <LuLayers size={48} color="#F7F0E3" />
                <span className={styles.fallbackTitle}>{series.title}</span>
              </div>
            )}
          </div>

          <div className={styles.seriesMeta}>
            <div className={styles.badges}>
              <span className={styles.badge}>{series.genre}</span>
              <span className={styles.formatBadge}>
                {series.format === "scroll" ? "Vertical Scroll" : "Page-by-Page"}
              </span>
              <StatusBadge status="published" label="PUBLISHED" />
            </div>

            <h1 className={styles.title}>{series.title}</h1>
            <p className={styles.creator}>
              Story by <strong>{series.creator_name}</strong>
              {series.studio_name ? ` &bull; Studio: ${series.studio_name}` : ""}
            </p>

            <p className={styles.synopsis}>{series.synopsis || "No series synopsis available."}</p>

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
          <div className={styles.episodesHeader}>
            <h2 className={styles.episodesTitle}>Published Episodes ({episodes.length})</h2>
            <span className={styles.readingOrderNotice}>In Official Reading Order</span>
          </div>

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
                    <div className={styles.episodeTextGroup}>
                      <span className={styles.episodeItemTitle}>{ep.title}</span>
                      <span className={styles.episodeFormat}>
                        {series.format === "scroll" ? "Scroll Mode" : "Page Mode"}
                      </span>
                    </div>
                  </div>
                  <span className={styles.readButton}>
                    <span>Read</span>
                    <LuArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.noEpisodes}>
              No episodes have been published yet for this series. Check back soon!
            </p>
          )}
        </section>
      </main>

      <PublicFooter />
      <BottomNav />
    </div>
  );
}
