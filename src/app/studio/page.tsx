import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { getCreatorSeries } from "@/lib/data/series";
import {
  LuPlus,
  LuArrowRight,
  LuBookOpen,
  LuClock,
  LuSparkles,
  LuLayers,
  LuBuilding2,
  LuMessageSquare,
  LuCircleCheck,
} from "react-icons/lu";

export default async function CreatorDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/studio");
  }

  let seriesList: any[] = [];
  let studiosCount = 0;
  let pendingReviewsCount = 0;
  let userName = "Creator";
  let recentProject: any = null;
  let latestEpisode: any = null;

  if (user) {
    // 1. Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    if (profile?.display_name) {
      userName = profile.display_name;
    } else if (user.email) {
      userName = user.email.split("@")[0];
    }

    // 2. Fetch accessible series
    seriesList = await getCreatorSeries(user.id);

    // 3. Studio count
    const { count: sCount } = await supabase
      .from("studio_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (sCount !== null) {
      studiosCount = sCount;
    }

    // 4. Pending reviews across user's series
    if (seriesList.length > 0) {
      const seriesIds = seriesList.map((s) => s.id);
      const { count: rCount } = await supabase
        .from("episode_revisions")
        .select("id, episodes!inner(series_id)", { count: "exact", head: true })
        .in("episodes.series_id", seriesIds)
        .eq("status", "in_review");

      if (rCount !== null) {
        pendingReviewsCount = rCount;
      }

      // 5. Recent project for "Continue Working"
      recentProject = seriesList[0];
      const { data: epData } = await supabase
        .from("episodes")
        .select(`
          id,
          episode_number,
          title,
          slug,
          episode_revisions (
            id,
            revision_number,
            status,
            updated_at
          )
        `)
        .eq("series_id", recentProject.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      latestEpisode = epData;
    }
  }

  return (
    <div className={styles.layout}>
      <CreatorSidebar userName={userName} userRole="Creator" />

      <main className={styles.main}>
        {/* Welcome Banner matching Screen 2 of reference */}
        <section className={styles.welcomeBanner}>
          <div className={styles.welcomeContent}>
            <div className={styles.welcomeText}>
              <h1 className={styles.welcomeHeading}>
                Good day, {userName}. 👋
              </h1>
              <p className={styles.welcomeSubhead}>
                Here&apos;s what&apos;s happening with your comics today.
              </p>
            </div>

            <div className={styles.welcomeActions}>
              <Link href="/studio/series/new">
                <Button variant="primary">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuPlus size={16} aria-hidden="true" />
                    <span>New Series</span>
                  </span>
                </Button>
              </Link>
              <Link href="/studio/studios/new">
                <Button variant="secondary" className={styles.secondaryActionBtn}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuBuilding2 size={16} aria-hidden="true" />
                    <span>New Studio</span>
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Comic Panel Graphic Backdrop Accent */}
          <div className={styles.welcomeGraphic} aria-hidden="true">
            <svg viewBox="0 0 200 120" fill="none" className={styles.welcomeSvg}>
              <path d="M40 0L200 0V120H0L40 0Z" fill="#171717" />
              <path d="M70 0L200 0V120H30L70 0Z" fill="#E44735" opacity="0.9" />
              <path d="M120 0L200 0V120H80L120 0Z" fill="#F2C14E" opacity="0.95" />
            </svg>
          </div>
        </section>

        {/* 3 Metric Summary Cards matching reference */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Active Series</span>
              <LuBookOpen size={16} className={styles.statIcon} aria-hidden="true" />
            </div>
            <span className={styles.statValue}>{seriesList.length}</span>
            <span className={styles.statSubtext}>
              {seriesList.length === 1 ? "1 series in workspace" : `${seriesList.length} titles in workspace`}
            </span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Studio Teams</span>
              <LuBuilding2 size={16} className={styles.statIcon} aria-hidden="true" />
            </div>
            <span className={styles.statValue}>{studiosCount}</span>
            <span className={styles.statSubtext}>
              {studiosCount === 1 ? "1 studio team" : `${studiosCount} team collaborations`}
            </span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Pending Reviews</span>
              <LuMessageSquare size={16} className={styles.statIcon} aria-hidden="true" />
            </div>
            <span className={styles.statValue} style={{ color: pendingReviewsCount > 0 ? "var(--color-primary)" : "inherit" }}>
              {pendingReviewsCount}
            </span>
            <span className={styles.statSubtext}>
              {pendingReviewsCount === 1 ? "1 revision awaiting review" : `${pendingReviewsCount} revisions in review`}
            </span>
          </div>
        </section>

        {/* 2-Column Section: Continue Working & Recent Activity */}
        <section className={styles.twoColumnGrid}>
          {/* Column 1: Continue Working */}
          <div className={styles.columnCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Continue Working</h2>
              {recentProject && (
                <Link href={`/studio/series/${recentProject.id}`} className={styles.headerLink}>
                  <span>Workspace</span>
                  <LuArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </div>

            {recentProject ? (
              <div className={styles.continueCard}>
                <div className={styles.continueCover}>
                  {recentProject.cover_url ? (
                    <img
                      src={recentProject.cover_url}
                      alt={recentProject.title}
                      className={styles.coverImg}
                    />
                  ) : (
                    <div className={styles.coverPlaceholder}>
                      <LuLayers size={32} color="#F7F0E3" />
                      <span>{recentProject.title}</span>
                    </div>
                  )}
                </div>

                <div className={styles.continueDetails}>
                  <div className={styles.continueTags}>
                    <span className={styles.genreTag}>{recentProject.genre}</span>
                    <StatusBadge
                      status={recentProject.visibility === "public" ? "published" : "draft"}
                      label={recentProject.visibility.toUpperCase()}
                    />
                  </div>

                  <h3 className={styles.projectTitle}>{recentProject.title}</h3>

                  <p className={styles.episodeText}>
                    {latestEpisode ? (
                      <>
                        Episode {latestEpisode.episode_number}: <strong>{latestEpisode.title}</strong>
                      </>
                    ) : (
                      "No episodes created yet"
                    )}
                  </p>

                  <div className={styles.continueActions}>
                    {latestEpisode ? (
                      <Link href={`/studio/series/${recentProject.id}/episodes/${latestEpisode.id}`}>
                        <Button variant="primary" size="sm">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <span>Continue Editing</span>
                            <LuArrowRight size={14} aria-hidden="true" />
                          </span>
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/studio/series/${recentProject.id}/episodes/new`}>
                        <Button variant="primary" size="sm">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <LuPlus size={14} aria-hidden="true" />
                            <span>Create First Episode</span>
                          </span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyContinue}>
                <p className={styles.emptyText}>
                  You haven&apos;t started a comic series yet.
                </p>
                <Link href="/studio/series/new">
                  <Button variant="primary" size="sm">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <LuPlus size={14} aria-hidden="true" />
                      <span>Create Series</span>
                    </span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Column 2: Recent Activity */}
          <div className={styles.columnCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Activity</h2>
              <Link href="/studio/series" className={styles.headerLink}>
                <span>View all</span>
                <LuArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {seriesList.length > 0 ? (
              <div className={styles.activityList}>
                {seriesList.slice(0, 4).map((s) => (
                  <div key={s.id} className={styles.activityItem}>
                    <div className={styles.activityDot}>
                      <LuCircleCheck size={16} color="var(--color-primary)" />
                    </div>
                    <div className={styles.activityInfo}>
                      <p className={styles.activityText}>
                        Updated series <strong>{s.title}</strong>
                      </p>
                      <span className={styles.activityTime}>
                        {s.format === "scroll" ? "Vertical Scroll" : "Page-by-Page"} &bull; {s.genre}
                      </span>
                    </div>
                    <Link href={`/studio/series/${s.id}`} className={styles.activityAction}>
                      Workspace
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyActivity}>
                <LuClock size={28} color="var(--color-text-muted)" aria-hidden="true" />
                <p>No recent activity recorded yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Your Series Section matching reference */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Your Series</h2>
              <p className={styles.sectionSubtitle}>
                Manage your comics, chapters, and team assignments.
              </p>
            </div>
            <Link href="/studio/series/new">
              <Button variant="primary" size="sm">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <LuPlus size={14} aria-hidden="true" />
                  <span>New Series</span>
                </span>
              </Button>
            </Link>
          </div>

          {seriesList.length > 0 ? (
            <div className={styles.seriesGrid}>
              {seriesList.map((s) => (
                <div key={s.id} className={styles.seriesCard}>
                  <div className={styles.seriesCoverWrapper}>
                    {s.cover_url ? (
                      <img src={s.cover_url} alt={s.title} className={styles.seriesCardCover} />
                    ) : (
                      <div className={styles.seriesCoverPlaceholder}>
                        <LuBookOpen size={32} color="#F7F0E3" />
                      </div>
                    )}
                    <span className={styles.seriesFormatBadge}>
                      {s.format === "scroll" ? "Scroll" : "Pages"}
                    </span>
                  </div>

                  <div className={styles.seriesCardBody}>
                    <div className={styles.seriesCardMeta}>
                      <span className={styles.seriesGenre}>{s.genre}</span>
                      <StatusBadge
                        status={s.visibility === "public" ? "published" : "draft"}
                        label={s.visibility.toUpperCase()}
                      />
                    </div>

                    <h3 className={styles.seriesCardTitle}>{s.title}</h3>

                    <p className={styles.seriesCardDesc}>
                      {s.synopsis || "No series synopsis provided yet."}
                    </p>

                    <div className={styles.seriesCardFooter}>
                      <span className={styles.seriesEpisodeCount}>
                        {s.episode_count ?? 0} {s.episode_count === 1 ? "episode" : "episodes"}
                      </span>
                      <Link href={`/studio/series/${s.id}`}>
                        <Button variant="secondary" size="sm">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <span>Workspace</span>
                            <LuArrowRight size={14} aria-hidden="true" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<LuLayers size={44} color="var(--color-primary)" />}
              title="No series created yet"
              description="Start your first comic series to assemble episodes, invite team collaborators, and publish revisions."
              action={
                <Link href="/studio/series/new">
                  <Button variant="primary">Create Your First Series</Button>
                </Link>
              }
            />
          )}
        </section>
      </main>
    </div>
  );
}
