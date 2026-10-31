import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { getCreatorSeries } from "@/lib/data/series";
import {
  LuPlus,
  LuArrowRight,
  LuBookOpen,
  LuLayers,
} from "react-icons/lu";
import styles from "@/app/studio/page.module.css";

export default async function StudioSeriesListPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/studio/series");
  }

  const seriesList = await getCreatorSeries(user.id);
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

  return (
    <div className={styles.layout}>
      <CreatorSidebar userName={userName} userRole="Creator" />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.sectionTitle} style={{ fontSize: "2rem" }}>All Series</h1>
            <p className={styles.sectionSubtitle}>
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
              title="No series found"
              description="You have not created any comic series yet. Launch your first title to start uploading and editing chapters."
              action={
                <Link href="/studio/series/new">
                  <Button variant="primary">Create First Series</Button>
                </Link>
              }
            />
          )}
        </section>
      </main>
    </div>
  );
}
