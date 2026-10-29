import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/app/studio/page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";

interface SeriesWorkspaceProps {
  params: {
    seriesId: string;
  };
}

export default async function SeriesWorkspacePage({
  params,
}: SeriesWorkspaceProps) {
  const supabase = createClient();

  const { data: series } = await supabase
    .from("series")
    .select("*")
    .eq("id", params.seriesId)
    .single();

  if (!series) {
    notFound();
  }

  const { data: episodes } = await supabase
    .from("episodes")
    .select(`
      *,
      episode_revisions (
        id,
        revision_number,
        status,
        updated_at
      )
    `)
    .eq("series_id", series.id)
    .order("episode_number", { ascending: true });

  const episodeList = episodes || [];

  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                href="/studio/series"
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "0.875rem",
                }}
              >
                &larr; Series
              </Link>
            </div>
            <h1 className={styles.title}>{series.title}</h1>
            <p className={styles.subtitle}>
              Format: {series.format === "scroll" ? "Vertical Scroll" : "Page-by-Page"} &bull; Genre: {series.genre} &bull; Visibility: {series.visibility}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <Link href={`/series/${series.slug}`} target="_blank">
              <Button variant="secondary" size="sm">
                View Public Page &rarr;
              </Button>
            </Link>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Episodes ({episodeList.length})
            </h2>

            <Link href={`/studio/series/${series.id}/episodes/new`}>
              <Button variant="primary" size="sm">
                + New Episode
              </Button>
            </Link>
          </div>

          {episodeList.length > 0 ? (
            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {episodeList.map((ep: any) => {
                  const latestRev =
                    ep.episode_revisions && ep.episode_revisions.length > 0
                      ? ep.episode_revisions.sort(
                          (a: any, b: any) =>
                            b.revision_number - a.revision_number
                        )[0]
                      : null;

                  return (
                    <tr key={ep.id}>
                      <td>
                        <strong>#{ep.episode_number}</strong>
                      </td>
                      <td>{ep.title}</td>
                      <td>
                        {latestRev ? (
                          <StatusBadge status={latestRev.status} />
                        ) : (
                          <StatusBadge status="draft" />
                        )}
                      </td>
                      <td>
                        {ep.published_revision_id ? (
                          <span style={{ color: "var(--color-success)" }}>
                            Live
                          </span>
                        ) : (
                          <span style={{ color: "var(--color-text-muted)" }}>
                            Draft
                          </span>
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/studio/series/${series.id}/episodes/${ep.id}`}
                        >
                          <Button variant="secondary" size="sm">
                            Open Workspace &rarr;
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <EmptyState
              icon="🎬"
              title="No episodes yet"
              description="Create Chapter 1 to start uploading pages and preparing revisions."
              action={
                <Link href={`/studio/series/${series.id}/episodes/new`}>
                  <Button variant="primary">Create First Episode</Button>
                </Link>
              }
            />
          )}
        </section>
      </main>
    </div>
  );
}
