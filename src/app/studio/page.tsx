import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { LuPlus, LuArrowRight, LuLayers } from "react-icons/lu";

export default async function CreatorDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, query their real data; otherwise show studio onboarding state
  let seriesList: any[] = [];
  let studiosCount = 0;

  if (user) {
    const { data: userSeries } = await supabase
      .from("series")
      .select("*")
      .or(`owner_user_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (userSeries) {
      seriesList = userSeries;
    }

    const { count: sCount } = await supabase
      .from("studio_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (sCount !== null) {
      studiosCount = sCount;
    }
  }

  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Creator Studio</h1>
            <p className={styles.subtitle}>
              Manage your series, collaborate with your team, and publish chapters.
            </p>
          </div>

          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Link href="/studio/studios/new">
              <Button variant="secondary">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <LuPlus size={16} aria-hidden="true" />
                  <span>New Studio</span>
                </span>
              </Button>
            </Link>
            <Link href="/studio/series/new">
              <Button variant="primary">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <LuPlus size={16} aria-hidden="true" />
                  <span>New Series</span>
                </span>
              </Button>
            </Link>
          </div>
        </header>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Series</span>
            <span className={styles.statValue}>{seriesList.length}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Studio Teams</span>
            <span className={styles.statValue}>{studiosCount}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Platform Status</span>
            <span className={styles.statValue} style={{ fontSize: "1.25rem", color: "var(--color-success)" }}>
              Phase 3 Foundation
            </span>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Series</h2>
            <Link href="/studio/series">
              <Button variant="ghost" size="sm">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span>View All</span>
                  <LuArrowRight size={14} aria-hidden="true" />
                </span>
              </Button>
            </Link>
          </div>

          {seriesList.length > 0 ? (
            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Format</th>
                  <th>Genre</th>
                  <th>Visibility</th>
                  <th>Actions</th>
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
            <EmptyState
              icon={<LuLayers size={44} color="var(--color-text-muted)" />}
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
