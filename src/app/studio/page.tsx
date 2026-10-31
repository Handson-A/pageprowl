import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { MotionReveal, MotionItem } from "@/components/ui/MotionReveal";
import { createClient } from "@/lib/supabase/server";
import { getCreatorSeries } from "@/lib/data/series";
import { getPersonalDashboardData } from "@/lib/data/dashboards";
import { formatActivityDescription } from "@/lib/data/activity";
import {
  LuPlus,
  LuArrowRight,
  LuBookOpen,
  LuClock,
  LuLayers,
  LuBuilding2,
  LuMessageSquare,
  LuCircleCheck,
  LuListTodo,
  LuTriangleAlert,
  LuFileText,
} from "react-icons/lu";

export default async function CreatorDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/studio");
  }

  let userName = "Creator";
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

  // 1. Fetch accessible series and studios count
  const [seriesList, { count: studiosCount }, personalData] = await Promise.all([
    getCreatorSeries(user.id),
    supabase
      .from("studio_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    getPersonalDashboardData(user.id),
  ]);

  const { myTasks, dueSoonTasks, needsAttention, myReviews, recentActivity } = personalData;
  const activeTasks = myTasks.filter((t) => t.status !== "done");

  // Latest project for "Continue Working"
  const recentProject = seriesList.length > 0 ? seriesList[0] : null;
  let latestEpisode: any = null;

  if (recentProject) {
    const { data: epData } = await supabase
      .from("episodes")
      .select(`
        id,
        episode_number,
        title,
        slug,
        status,
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

  const overdueCount = needsAttention.overdueTasks.length;
  const pendingReviewsCount = myReviews.length;
  const attentionTotal = overdueCount + pendingReviewsCount;

  return (
    <div className={styles.layout}>
      <CreatorSidebar userName={userName} userRole="Creator" />

      <main className={styles.main}>
        {/* Welcome Banner matching reference */}
        <MotionReveal delay={0.05}>
          <section className={styles.welcomeBanner}>
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeText}>
                <h1 className={styles.welcomeHeading}>Good day, {userName}. 👋</h1>
                <p className={styles.welcomeSubhead}>
                  Here&apos;s what&apos;s happening across your collaborative productions today.
                </p>
              </div>

              <div className={styles.welcomeActions}>
                <Link href="/studio/tasks">
                  <Button variant="primary">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <LuListTodo size={16} aria-hidden="true" />
                      <span>Manage Tasks</span>
                    </span>
                  </Button>
                </Link>
                <Link href="/studio/series/new">
                  <Button variant="secondary" className={styles.secondaryActionBtn}>
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

            <div className={styles.welcomeGraphic} aria-hidden="true">
              <svg viewBox="0 0 200 120" fill="none" className={styles.welcomeSvg}>
                <path d="M40 0L200 0V120H0L40 0Z" fill="#171717" />
                <path d="M70 0L200 0V120H30L70 0Z" fill="#E44735" opacity="0.9" />
                <path d="M120 0L200 0V120H80L120 0Z" fill="#F2C14E" opacity="0.95" />
              </svg>
            </div>
          </section>
        </MotionReveal>

        {/* Needs My Attention Alert Banner if overdue tasks or pending reviews exist */}
        {attentionTotal > 0 && (
          <MotionReveal delay={0.1}>
            <section className={styles.attentionBanner}>
              <div className={styles.attentionLeft}>
                <LuTriangleAlert size={20} color="var(--color-danger)" aria-hidden="true" />
                <div>
                  <span className={styles.attentionTitle}>Needs Your Immediate Attention: </span>
                  <span className={styles.attentionText}>
                    {overdueCount > 0 && `${overdueCount} overdue task${overdueCount > 1 ? "s" : ""} require action. `}
                    {pendingReviewsCount > 0 && `${pendingReviewsCount} review request${pendingReviewsCount > 1 ? "s" : ""} awaiting your verdict.`}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                {overdueCount > 0 && (
                  <Link href="/studio/tasks">
                    <Button variant="danger" size="sm">
                      View Overdue ({overdueCount})
                    </Button>
                  </Link>
                )}
                {pendingReviewsCount > 0 && (
                  <Link href="/studio/reviews">
                    <Button variant="primary" size="sm">
                      Review Queue ({pendingReviewsCount})
                    </Button>
                  </Link>
                )}
              </div>
            </section>
          </MotionReveal>
        )}

        {/* 4 Summary Stats Cards with Real Production Metrics */}
        <MotionReveal delay={0.15} staggerChildren={0.06}>
          <section className={styles.statsGrid}>
            <MotionItem whileHover={{ y: -3 }} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Active Series</span>
                <LuBookOpen size={16} className={styles.statIcon} aria-hidden="true" />
              </div>
              <span className={styles.statValue}>{seriesList.length}</span>
              <span className={styles.statSubtext}>
                {seriesList.length === 1 ? "1 series in workspace" : `${seriesList.length} titles in workspace`}
              </span>
            </MotionItem>

            <MotionItem whileHover={{ y: -3 }} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>My Active Tasks</span>
                <LuListTodo size={16} className={styles.statIcon} aria-hidden="true" />
              </div>
              <span className={styles.statValue}>{activeTasks.length}</span>
              <span className={styles.statSubtext}>
                {dueSoonTasks.length > 0
                  ? `${dueSoonTasks.length} due within 7 days`
                  : "No upcoming deadlines"}
              </span>
            </MotionItem>

            <MotionItem whileHover={{ y: -3 }} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Assigned Reviews</span>
                <LuMessageSquare size={16} className={styles.statIcon} aria-hidden="true" />
              </div>
              <span
                className={styles.statValue}
                style={{ color: pendingReviewsCount > 0 ? "var(--color-primary)" : "inherit" }}
              >
                {pendingReviewsCount}
              </span>
              <span className={styles.statSubtext}>
                {pendingReviewsCount === 1 ? "1 request awaiting verdict" : `${pendingReviewsCount} requests in queue`}
              </span>
            </MotionItem>

            <MotionItem whileHover={{ y: -3 }} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Studio Teams</span>
                <LuBuilding2 size={16} className={styles.statIcon} aria-hidden="true" />
              </div>
              <span className={styles.statValue}>{studiosCount || 0}</span>
              <span className={styles.statSubtext}>
                {studiosCount === 1 ? "1 studio team" : `${studiosCount || 0} team collaborations`}
              </span>
            </MotionItem>
          </section>
        </MotionReveal>

        {/* Continue Working & My Tasks Overview */}
        <MotionReveal delay={0.2}>
          <section className={styles.twoColumnGrid}>
          {/* Column 1: Continue Working on Latest Series */}
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

                  <div className={styles.episodeText}>
                    {latestEpisode ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        Episode {latestEpisode.episode_number}: <strong>{latestEpisode.title}</strong>
                        <StatusBadge status={latestEpisode.status || "draft"} />
                      </span>
                    ) : (
                      "No episodes created yet"
                    )}
                  </div>

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
                <p className={styles.emptyText}>You haven&apos;t started a comic series yet.</p>
                <Link href="/studio/series/new">
                  <Button variant="primary" size="sm">
                    Create Series
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Column 2: My Assigned Tasks Preview */}
          <div className={styles.columnCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>My Tasks ({activeTasks.length})</h2>
              <Link href="/studio/tasks" className={styles.headerLink}>
                <span>Task Board</span>
                <LuArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {activeTasks.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {activeTasks.slice(0, 4).map((task) => {
                  const isOverdue =
                    task.due_date && new Date(task.due_date).getTime() < Date.now();
                  return (
                    <div key={task.id} className={styles.taskItem}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className={styles.taskTitle}>{task.title}</div>
                        <div className={styles.taskSub}>
                          <span>{task.series?.title || "General Task"}</span>
                          {task.due_date && (
                            <span className={isOverdue ? styles.dueBadgeOverdue : undefined}>
                              • Due {new Date(task.due_date).toLocaleDateString()}
                              {isOverdue && " (Overdue)"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <span
                          className={`${styles.priorityBadge} ${
                            task.priority === "urgent"
                              ? styles.priorityUrgent
                              : task.priority === "high"
                              ? styles.priorityHigh
                              : task.priority === "medium"
                              ? styles.priorityMedium
                              : styles.priorityLow
                          }`}
                        >
                          {task.priority}
                        </span>
                        <StatusBadge status={task.status as any} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-muted)" }}>
                <p style={{ fontSize: "var(--font-size-sm)" }}>No pending tasks assigned to you.</p>
                <div style={{ marginTop: "var(--space-3)" }}>
                  <Link href="/studio/tasks">
                    <Button variant="secondary" size="sm">
                      Create Production Task
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Two-Column Section: My Reviews Queue & Recent Activity Timeline */}
        <section className={styles.twoColumnGrid}>
          {/* Left Column: My Review Requests Queue */}
          <div className={styles.columnCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>My Reviews Queue ({myReviews.length})</h2>
              <Link href="/studio/reviews" className={styles.headerLink}>
                <span>View all</span>
                <LuArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {myReviews.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {myReviews.slice(0, 4).map((req) => (
                  <div key={req.id} className={styles.taskItem}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={styles.taskTitle}>
                        {req.series?.title}: {req.episode?.title}
                      </div>
                      <div className={styles.taskSub}>
                        <span>Round #{req.round}</span>
                        <span>• Requester: {req.requester?.display_name || "Creator"}</span>
                      </div>
                    </div>
                    <Link href={`/studio/reviews?requestId=${req.id}`}>
                      <Button variant="secondary" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-muted)" }}>
                <p style={{ fontSize: "var(--font-size-sm)" }}>No review requests currently waiting for you.</p>
              </div>
            )}
          </div>

          {/* Right Column: Recent Production Activity Feed */}
          <div className={styles.columnCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Production Activity</h2>
            </div>

            {recentActivity.length > 0 ? (
              <div className={styles.activityList}>
                {recentActivity.slice(0, 5).map((event) => (
                  <div key={event.id} className={styles.activityItem}>
                    <div className={styles.activityDot}>
                      <LuCircleCheck size={16} color="var(--color-primary)" />
                    </div>
                    <div className={styles.activityInfo}>
                      <p className={styles.activityText}>{formatActivityDescription(event)}</p>
                      <span className={styles.activityTime}>
                        {new Date(event.created_at).toLocaleDateString()} at{" "}
                        {new Date(event.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)", padding: "var(--space-4)" }}>
                No recent activity recorded yet.
              </p>
            )}
          </div>
        </section>
      </MotionReveal>

        {/* My Comic Titles Section */}
        <MotionReveal delay={0.25}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Your Comic Titles ({seriesList.length})</h2>
              <Link href="/studio/series">
                <Button variant="secondary" size="sm">
                  <span>View All Titles</span>
                  <LuArrowRight size={14} aria-hidden="true" />
                </Button>
              </Link>
            </div>

            {seriesList.length > 0 ? (
              <div className={styles.seriesGrid}>
                {seriesList.slice(0, 3).map((series) => (
                  <MotionItem
                    key={series.id}
                    whileHover={{ y: -4 }}
                    className={styles.seriesCard}
                  >
                    <div className={styles.seriesCoverWrapper}>
                      {series.cover_url ? (
                        <img
                          src={series.cover_url}
                          alt={series.title}
                          className={styles.seriesCardCover}
                        />
                      ) : (
                        <div className={styles.seriesCoverPlaceholder}>
                          <LuLayers size={36} color="var(--color-text-muted)" />
                        </div>
                      )}
                      <span className={styles.seriesFormatBadge}>
                        {series.format === "scroll" ? "Scroll" : "Page"}
                      </span>
                    </div>

                    <div className={styles.seriesCardBody}>
                      <div className={styles.seriesCardMeta}>
                        <span className={styles.seriesGenre}>{series.genre}</span>
                        <StatusBadge
                          status={series.visibility === "public" ? "published" : "draft"}
                          label={series.visibility.toUpperCase()}
                        />
                      </div>

                      <h3 className={styles.seriesCardTitle}>{series.title}</h3>
                      <p className={styles.seriesCardDesc}>{series.synopsis}</p>

                      <div className={styles.seriesCardFooter}>
                        <span className={styles.seriesEpisodeCount}>
                          {series.episode_count ?? 0} Chapters
                        </span>
                        <Link href={`/studio/series/${series.id}`}>
                          <Button variant="secondary" size="sm">
                            Workspace
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </MotionItem>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<LuBookOpen size={48} color="var(--color-text-muted)" />}
                title="No comics published yet"
                description="Start producing your first comic series today."
                action={
                  <Link href="/studio/series/new">
                    <Button variant="primary" size="sm">
                      Create Series
                    </Button>
                  </Link>
                }
              />
            )}
          </section>
        </MotionReveal>
      </main>
    </div>
  );
}
