import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { LuMessageSquare, LuArrowRight } from "react-icons/lu";
import styles from "@/app/studio/page.module.css";

export default async function StudioReviewsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/studio/reviews");
  }

  let comments: any[] = [];

  const { data } = await supabase
      .from("review_comments")
      .select(`
        id,
        content,
        status,
        created_at,
        profiles:user_id (display_name),
        episode_revisions:revision_id (
          id,
          revision_number,
          episodes:episode_id (
            id,
            title,
            series:series_id (id, title)
          )
        )
      `)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      comments = data;
    }

  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Editorial Reviews &amp; Tasks</h1>
            <p className={styles.subtitle}>
              Monitor feedback, proofreading notes, and revision comments across all collaborative titles.
            </p>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Editorial Comments ({comments.length})</h2>
          </div>

          {comments.length > 0 ? (
            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Series &amp; Episode</th>
                  <th>Comment</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((c) => {
                  const ep = c.episode_revisions?.episodes;
                  const series = ep?.series;
                  return (
                    <tr key={c.id}>
                      <td>
                        <strong>{series?.title || "Untitled Series"}</strong>
                        <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                          {ep?.title || "Episode"} (Rev #{c.episode_revisions?.revision_number})
                        </div>
                      </td>
                      <td style={{ maxWidth: "300px" }}>{c.content}</td>
                      <td>{c.profiles?.display_name || "Contributor"}</td>
                      <td>
                        <StatusBadge
                          status={c.status === "resolved" ? "published" : "in_review"}
                          label={c.status.toUpperCase()}
                        />
                      </td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                      <td>
                        {series?.id && ep?.id && (
                          <Link href={`/studio/series/${series.id}/episodes/${ep.id}`}>
                            <Button variant="secondary" size="sm">
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <span>Open Revision</span>
                                <LuArrowRight size={14} aria-hidden="true" />
                              </span>
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon={<LuMessageSquare size={44} color="var(--color-text-muted)" />}
              title="No open review comments"
              description="Review comments created during in-review episode passes will appear here for team tracking and resolution."
              action={
                <Link href="/studio">
                  <Button variant="primary">Return to Studio</Button>
                </Link>
              }
            />
          )}
        </section>
      </main>
    </div>
  );
}
