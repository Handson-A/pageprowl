import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FormField } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/server";
import {
  getStudioById,
  getStudioMembers,
  getStudioSeries,
  getStudioInvitations,
} from "@/lib/data/studios";
import { getStudioDashboardData } from "@/lib/data/dashboards";
import { formatActivityDescription } from "@/lib/data/activity";
import {
  inviteStudioMemberAction,
  updateStudioMemberRoleAction,
  removeStudioMemberAction,
} from "@/app/studio/studios/actions";
import { hasStudioPermission, ForbiddenError } from "@/lib/auth/guards";
import {
  LuPlus,
  LuArrowRight,
  LuMail,
  LuUsers,
  LuLayers,
  LuListTodo,
  LuMessageSquare,
  LuTriangleAlert,
  LuCircleCheck,
  LuClock,
} from "react-icons/lu";
import styles from "@/app/studio/page.module.css";
import type { StudioRole, EpisodeProductionStatus } from "@/types/database";

interface StudioWorkspacePageProps {
  params: {
    studioId: string;
  };
}

const PRODUCTION_STAGES: { key: EpisodeProductionStatus; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "in_production", label: "In Production" },
  { key: "in_review", label: "In Review" },
  { key: "revisions_required", label: "Revisions Required" },
  { key: "approved", label: "Approved" },
  { key: "published", label: "Published" },
];

export default async function StudioWorkspacePage({ params }: StudioWorkspacePageProps) {
  const { studioId } = params;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/studio/studios/${studioId}`)}`);
  }

  const studio = await getStudioById(studioId);
  if (!studio) {
    notFound();
  }

  const [members, dashboardData] = await Promise.all([
    getStudioMembers(studioId),
    getStudioDashboardData(studioId),
  ]);

  const currentMember = members.find((m) => m.user_id === user.id);
  if (!currentMember) {
    throw new ForbiddenError("You are not a member of this studio workspace.");
  }

  const userRole = currentMember.role;
  const canManage = hasStudioPermission(userRole, "admin");
  const invitations = canManage ? await getStudioInvitations(studioId) : [];
  const seriesList = await getStudioSeries(studioId);

  const handleInvite = inviteStudioMemberAction.bind(null, studioId);

  const {
    episodesByStage,
    taskProgress,
    itemsAwaitingReview,
    overdueTasks,
    teamWorkload,
    recentActivity,
  } = dashboardData || {
    episodesByStage: {
      draft: [],
      in_production: [],
      in_review: [],
      revisions_required: [],
      approved: [],
      published: [],
    },
    taskProgress: { total: 0, backlog: 0, todo: 0, inProgress: 0, inReview: 0, done: 0, completionPercentage: 0 },
    itemsAwaitingReview: [],
    overdueTasks: [],
    teamWorkload: [],
    recentActivity: [],
  };

  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-1)" }}>
              <h1 className={styles.title}>{studio.name}</h1>
              {userRole && (
                <StatusBadge
                  status={userRole === "owner" ? "published" : userRole === "admin" ? "ready_to_publish" : "draft"}
                  label={`YOUR ROLE: ${userRole.toUpperCase()}`}
                />
              )}
            </div>
            <p className={styles.subtitle}>
              Studio Slug: <code>{studio.slug}</code> • Established {new Date(studio.created_at).toLocaleDateString()}
            </p>
            {studio.description && (
              <p style={{ color: "var(--color-text)", fontSize: "var(--font-size-sm)", marginTop: "var(--space-2)" }}>
                {studio.description}
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Link href={`/studio/tasks?studioId=${studio.id}`}>
              <Button variant="secondary">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <LuListTodo size={16} aria-hidden="true" />
                  <span>Studio Tasks ({taskProgress.total})</span>
                </span>
              </Button>
            </Link>
            <Link href={`/studio/series/new?studioId=${studio.id}`}>
              <Button variant="primary">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <LuPlus size={16} aria-hidden="true" />
                  <span>Create Studio Series</span>
                </span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Overdue and Pending Review Alerts */}
        {(overdueTasks.length > 0 || itemsAwaitingReview.length > 0) && (
          <section className={styles.attentionBanner}>
            <div className={styles.attentionLeft}>
              <LuTriangleAlert size={20} color="var(--color-danger)" aria-hidden="true" />
              <div>
                <span className={styles.attentionTitle}>Production Bottlenecks: </span>
                <span className={styles.attentionText}>
                  {overdueTasks.length > 0 && `${overdueTasks.length} studio task(s) are overdue. `}
                  {itemsAwaitingReview.length > 0 && `${itemsAwaitingReview.length} episode review(s) awaiting completion.`}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              {itemsAwaitingReview.length > 0 && (
                <Link href="/studio/reviews">
                  <Button variant="primary" size="sm">
                    Open Reviews ({itemsAwaitingReview.length})
                  </Button>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* 1. Episode Production Pipeline by Stage */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Episode Production Pipeline</h2>
            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
              Active Workflow: Draft → In Production → In Review → Revisions Required → Approved → Published
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-3)" }}>
            {PRODUCTION_STAGES.map((stage) => {
              const count = episodesByStage[stage.key]?.length || 0;
              return (
                <div
                  key={stage.key}
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--pv-radius-md)",
                    padding: "var(--space-4)",
                    boxShadow: "var(--pv-shadow-card)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <StatusBadge status={stage.key as any} />
                    <span style={{ fontSize: "var(--font-size-lg)", fontWeight: 800, fontFamily: "var(--font-family-heading)" }}>
                      {count}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "var(--space-2)" }}>
                    {episodesByStage[stage.key]?.slice(0, 3).map((ep: any) => (
                      <Link
                        key={ep.id}
                        href={`/studio/series/${ep.series_id}/episodes/${ep.id}`}
                        style={{
                          fontSize: "var(--font-size-xs)",
                          color: "var(--color-text)",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        • Ch {ep.episode_number}: {ep.title}
                      </Link>
                    ))}
                    {count > 3 && (
                      <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                        +{count - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Studio Task Progress & Workload Summary */}
        <section className={styles.twoColumnGrid}>
          {/* Column 1: Task Progress Bar & Breakdown */}
          <div className={styles.columnCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Task Progress ({taskProgress.done}/{taskProgress.total} Done)</h2>
              <Link href={`/studio/tasks?studioId=${studio.id}`} className={styles.headerLink}>
                <span>Manage</span>
                <LuArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {/* Progress Bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-size-xs)", marginBottom: "var(--space-1)" }}>
                  <span>Completion Rate</span>
                  <strong>{taskProgress.completionPercentage}%</strong>
                </div>
                <div
                  style={{
                    height: "8px",
                    backgroundColor: "var(--color-surface-muted)",
                    borderRadius: "var(--radius-full)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${taskProgress.completionPercentage}%`,
                      backgroundColor: "var(--color-primary)",
                      borderRadius: "var(--radius-full)",
                      transition: "width var(--pv-motion-standard)",
                    }}
                  />
                </div>
              </div>

              {/* Status Breakdown Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)", textAlign: "center" }}>
                <div style={{ padding: "var(--space-2)", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>{taskProgress.todo}</div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>To Do</div>
                </div>
                <div style={{ padding: "var(--space-2)", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>{taskProgress.inProgress}</div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>In Progress</div>
                </div>
                <div style={{ padding: "var(--space-2)", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontSize: "var(--font-size-lg)", fontWeight: 700 }}>{taskProgress.inReview}</div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>In Review</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Team Workload Overview */}
          <div className={styles.columnCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Team Workload</h2>
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                {members.length} Collaborators
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {teamWorkload.map((tw) => (
                <div
                  key={tw.userId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--space-2) var(--space-3)",
                    backgroundColor: "var(--color-surface-muted)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--font-size-xs)",
                  }}
                >
                  <div>
                    <strong>{tw.displayName}</strong>
                    <span style={{ color: "var(--color-text-muted)", marginLeft: "4px" }}>
                      ({tw.role})
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                    <span>Active: <strong>{tw.activeCount}</strong></span>
                    {tw.overdueCount > 0 && (
                      <span style={{ color: "var(--color-danger)", fontWeight: "bold" }}>
                        {tw.overdueCount} Overdue
                      </span>
                    )}
                    <span style={{ color: "var(--color-success)" }}>
                      Done: {tw.completedCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Studio Series Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Studio Series ({seriesList.length})</h2>
          </div>

          {seriesList.length > 0 ? (
            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Series Title</th>
                  <th>Format</th>
                  <th>Genre</th>
                  <th>Visibility</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {seriesList.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.title}</strong>
                    </td>
                    <td>{s.format === "scroll" ? "Vertical Scroll" : "Page-by-Page"}</td>
                    <td>{s.genre}</td>
                    <td>
                      <span style={{ textTransform: "capitalize" }}>{s.visibility}</span>
                    </td>
                    <td>
                      <Link href={`/studio/series/${s.id}`}>
                        <Button variant="secondary" size="sm">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <span>Workspace</span>
                            <LuArrowRight size={14} aria-hidden="true" />
                          </span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                padding: "var(--space-6)",
                backgroundColor: "var(--color-surface)",
                border: "1px dashed var(--color-border)",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
                color: "var(--color-text-muted)",
              }}
            >
              No comic series registered under this studio yet.
            </div>
          )}
        </section>

        {/* 4. Studio Members & Invitations Management */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Team Members ({members.length})</h2>
          </div>

          <table className={styles.seriesTable}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Joined</th>
                {canManage && <th>Management</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.user_id}>
                  <td>
                    <strong>{member.display_name}</strong>
                    <span style={{ color: "var(--color-text-muted)", marginLeft: "var(--space-2)", fontSize: "var(--font-size-xs)" }}>
                      (@{member.username})
                    </span>
                  </td>
                  <td>
                    <StatusBadge
                      status={
                        member.role === "owner"
                          ? "published"
                          : member.role === "admin"
                          ? "ready_to_publish"
                          : member.role === "editor"
                          ? "in_review"
                          : "draft"
                      }
                      label={member.role.toUpperCase()}
                    />
                  </td>
                  <td>{new Date(member.created_at).toLocaleDateString()}</td>
                  {canManage && (
                    <td>
                      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                        {member.user_id !== user.id && (
                          <>
                            <form
                              action={async (formData: FormData) => {
                                "use server";
                                const newRole = formData.get("role") as StudioRole;
                                await updateStudioMemberRoleAction(studioId, member.user_id, newRole);
                              }}
                              style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}
                            >
                              <select
                                name="role"
                                defaultValue={member.role}
                                className={styles.selectInput}
                                style={{ padding: "2px 6px", fontSize: "11px" }}
                              >
                                {userRole === "owner" && <option value="owner">Owner</option>}
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="member">Member</option>
                              </select>
                              <Button variant="secondary" size="sm" type="submit">
                                Update
                              </Button>
                            </form>

                            <form
                              action={async () => {
                                "use server";
                                await removeStudioMemberAction(studioId, member.user_id);
                              }}
                            >
                              <Button variant="danger" size="sm" type="submit">
                                Remove
                              </Button>
                            </form>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {canManage && (
            <div style={{ marginTop: "var(--space-6)", padding: "var(--space-4)", backgroundColor: "var(--color-surface)", borderRadius: "var(--pv-radius-md)", border: "1px solid var(--color-border)" }}>
              <h3 style={{ fontSize: "var(--font-size-sm)", fontWeight: "bold", marginBottom: "var(--space-3)" }}>
                Invite Team Member
              </h3>
              <form action={handleInvite} style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-end", flexWrap: "wrap" }}>
                <FormField label="Collaborator Email" required htmlFor="inviteEmail">
                  <input id="inviteEmail" name="email" type="email" placeholder="colleague@domain.com" required />
                </FormField>
                <FormField label="Assigned Role" required htmlFor="inviteRole">
                  <select id="inviteRole" name="role" defaultValue="member">
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="member">Member</option>
                  </select>
                </FormField>
                <Button type="submit" variant="primary">
                  <LuMail size={16} style={{ marginRight: "4px" }} />
                  Send Invitation
                </Button>
              </form>
            </div>
          )}
        </section>

        {/* 5. Recent Studio Activity */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Studio Production Activity</h2>
          </div>

          {recentActivity.length > 0 ? (
            <div className={styles.activityList}>
              {recentActivity.slice(0, 6).map((event) => (
                <div key={event.id} className={styles.activityItem}>
                  <div className={styles.activityDot}>
                    <LuCircleCheck size={16} color="var(--color-primary)" />
                  </div>
                  <div className={styles.activityInfo}>
                    <p className={styles.activityText}>{formatActivityDescription(event)}</p>
                    <span className={styles.activityTime}>
                      {new Date(event.created_at).toLocaleDateString()} at{" "}
                      {new Date(event.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
              No production activity recorded for this studio yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
