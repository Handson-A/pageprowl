import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ContinueReadingButton } from "@/components/series/ContinueReadingButton";
import { SeriesEngagementButtons } from "@/components/series/SeriesEngagementButtons";
import { getPublicSeriesBySlug, getPublishedEpisodes, genreToSlug } from "@/lib/data/series";
import { isSeriesInLibrary, isFollowingSeries } from "@/lib/data/reader";
import { createClient } from "@/lib/supabase/server";
import { LuBookOpen, LuArrowRight, LuLayers, LuUser, LuCalendar } from "react-icons/lu";

interface SeriesPageProps {
  params: {
    seriesSlug: string;
  };
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const series = await getPublicSeriesBySlug(params.seriesSlug);

  if (!series) {
    return {
      title: "Comic Series | PageProwl",
    };
  }

  return {
    title: `${series.title} by ${series.creator_name} | PageProwl`,
    description:
      series.synopsis ||
      `Read the published comic series "${series.title}" on PageProwl.`,
  };
}

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function SeriesOverviewPage({ params }: SeriesPageProps) {
  const series = await getPublicSeriesBySlug(params.seriesSlug);

  // If private or not found, return safe 404 without leaking internal state
  if (!series) {
    notFound();
  }

  const episodes = await getPublishedEpisodes(series.id);
  const firstEpisode = episodes.length > 0 ? episodes[0] : null;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let inLibrary = false;
  let following = false;
  let notify = true;

  if (user) {
    inLibrary = await isSeriesInLibrary(user.id, series.id);
    const followStatus = await isFollowingSeries(user.id, series.id);
    following = followStatus.following;
    notify = followStatus.notifyNewEpisodes;
  }

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
              <Link href={`/genres/${genreToSlug(series.genre)}`} className={styles.badgeLink}>
                <span className={styles.badge}>{series.genre}</span>
              </Link>
              <span className={styles.formatBadge}>
                {series.format === "scroll" ? "Vertical Scroll" : "Page-by-Page"}
              </span>
              <StatusBadge status="published" label="PUBLISHED" />
            </div>

            <h1 className={styles.title}>{series.title}</h1>

            <p className={styles.creator}>
              Story by{" "}
              {series.creator_username ? (
                <Link
                  href={`/creators/${series.creator_username}`}
                  className={styles.creatorLink}
                >
                  <strong>{series.creator_name}</strong>
                </Link>
              ) : (
                <strong>{series.creator_name}</strong>
              )}
              {series.studio_name ? ` • Studio: ${series.studio_name}` : ""}
            </p>

            {/* Contributor Credits if any */}
            {series.credits && series.credits.length > 0 && (
              <div className={styles.creditsList} aria-label="Creative Credits">
                {series.credits.map((credit) => (
                  <span key={credit.id} className={styles.creditItem}>
                    <span className={styles.creditRole}>{credit.role_category}:</span>{" "}
                    {credit.username ? (
                      <Link
                        href={`/creators/${credit.username}`}
                        className={styles.creditNameLink}
                      >
                        {credit.display_name}
                      </Link>
                    ) : (
                      <span className={styles.creditName}>{credit.display_name}</span>
                    )}
                  </span>
                ))}
              </div>
            )}

            <p className={styles.synopsis}>
              {series.synopsis || "No series synopsis available."}
            </p>

            <div className={styles.actions}>
              <ContinueReadingButton
                seriesSlug={series.slug}
                firstEpisodeSlug={firstEpisode?.slug}
                firstEpisodeNumber={firstEpisode?.episode_number}
              />
              <SeriesEngagementButtons
                seriesId={series.id}
                seriesSlug={series.slug}
                initialInLibrary={inLibrary}
                initialFollowing={following}
                initialNotify={notify}
                isAuthenticated={!!user}
              />
            </div>
          </div>
        </div>

        <section className={styles.episodesSection}>
          <div className={styles.episodesHeader}>
            <h2 className={styles.episodesTitle}>
              Published Episodes ({episodes.length})
            </h2>
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
                      <div className={styles.episodeSubRow}>
                        <span className={styles.episodeFormat}>
                          {series.format === "scroll" ? "Scroll Mode" : "Page Mode"}
                        </span>
                        {ep.created_at && (
                          <span className={styles.episodeDate}>
                            <LuCalendar size={11} aria-hidden="true" />
                            <span>{formatDate(ep.created_at)}</span>
                          </span>
                        )}
                      </div>
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
