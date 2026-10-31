import React from "react";
import Link from "next/link";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { LuPlus, LuBuilding2, LuUser, LuArrowRight, LuBookOpen } from "react-icons/lu";
import styles from "@/app/studio/page.module.css";

export default async function StudioSeriesListPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let seriesList: any[] = [];

  if (user) {
    const { data } = await supabase
      .from("series")
      .select(`
        *,
        studios:owner_studio_id (name)
      `)
      .or(`owner_user_id.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (data) {
      seriesList = data;
    }
  }

  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>All Series</h1>
            <p className={styles.subtitle}>
              Full catalog of comic publications you have created or collaborate on.
            </p>
          </div>

          <Link href="/studio/series/new">
            <Button variant="primary">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <LuPlus size={16} aria-hidden="true" />
                <span>New Series</span>
              </span>
            </Button>
          </Link>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Titles ({seriesList.length})</h2>
          </div>

          {seriesList.length > 0 ? (
            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Ownership</th>
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
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                        <code>/{s.slug}</code>
                      </div>
                    </td>
                    <td>
                      {s.studios?.name ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <LuBuilding2 size={15} color="var(--color-primary)" aria-hidden="true" />
                          <strong>{s.studios.name}</strong>
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <LuUser size={15} color="var(--color-text-muted)" aria-hidden="true" />
                          <span>Personal</span>
                        </span>
                      )}
                    </td>
                    <td>{s.format === "scroll" ? "Vertical Scroll" : "Page-by-Page"}</td>
                    <td>{s.genre}</td>
                    <td>
                      <StatusBadge
                        status={s.visibility === "public" ? "published" : "draft"}
                        label={s.visibility.toUpperCase()}
                      />
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
              icon={<LuBookOpen size={44} color="var(--color-text-muted)" />}
              title="No series found"
              description="You have not created any comic series yet. Launch your first title to start uploading and editing chapters."
              action={
                <Link href="/studio/series/new">
                  <Button variant="primary">Create Series</Button>
                </Link>
              }
            />
          )}
        </section>
      </main>
    </div>
  );
}
