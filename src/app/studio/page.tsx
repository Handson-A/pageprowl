import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";

export default async function CreatorDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, query their real data; otherwise show studio onboarding state
  let seriesList: any[] = [];
  let pendingReviewsCount = 0;

  if (user) {
    const { data: userSeries } = await supabase
      .from("series")
      .select("*")
      .or(`owner_user_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (userSeries) {
      seriesList = userSeries;
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

          <Link href="/studio/series/new">
            <Button variant="primary">
              <span>+</span>
              <span>New Series</span>
            </Button>
          </Link>
        </header>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Series</span>
            <span className={styles.statValue}>{seriesList.length}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Pending Reviews</span>
            <span className={styles.statValue}>{pendingReviewsCount}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Platform Status</span>
            <span className={styles.statValue} style={{ fontSize: "1.25rem", color: "var(--color-success)" }}>
              Phase 0/1 Online
            </span>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Series</h2>
            <Link href="/studio/series">
              <Button variant="ghost" size="sm">
                View All &rarr;
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
                          Workspace &rarr;
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon="🎨"
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
