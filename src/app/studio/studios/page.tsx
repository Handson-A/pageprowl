import React from "react";
import Link from "next/link";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { getUserStudios } from "@/lib/data/studios";
import { LuPlus, LuArrowRight, LuBuilding2 } from "react-icons/lu";
import styles from "@/app/studio/page.module.css";

export default async function StudiosListPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const studios = user ? await getUserStudios(user.id) : [];

  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Studio Teams</h1>
            <p className={styles.subtitle}>
              Collaborate in multi-creator studios with shared series and team permissions.
            </p>
          </div>

          <Link href="/studio/studios/new">
            <Button variant="primary">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <LuPlus size={16} aria-hidden="true" />
                <span>New Studio</span>
              </span>
            </Button>
          </Link>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Studios ({studios.length})</h2>
          </div>

          {studios.length > 0 ? (
            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Studio Name</th>
                  <th>Your Role</th>
                  <th>Slug</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studios.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.name}</strong>
                      {s.description && (
                        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-xs)", margin: "4px 0 0" }}>
                          {s.description}
                        </p>
                      )}
                    </td>
                    <td>
                      <StatusBadge
                        status={
                          s.member_role === "owner"
                            ? "published"
                            : s.member_role === "admin"
                            ? "ready_to_publish"
                            : s.member_role === "editor"
                            ? "in_review"
                            : "draft"
                        }
                        label={s.member_role.toUpperCase()}
                      />
                    </td>
                    <td>
                      <code>{s.slug}</code>
                    </td>
                    <td>{new Date(s.created_at).toLocaleDateString()}</td>
                    <td>
                      <Link href={`/studio/studios/${s.id}`}>
                        <Button variant="secondary" size="sm">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <span>Manage Workspace</span>
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
              icon={<LuBuilding2 size={44} color="var(--color-text-muted)" />}
              title="No studio teams yet"
              description="Create a studio workspace to invite artists, writers, and editors to collaborate under a unified banner."
              action={
                <Link href="/studio/studios/new">
                  <Button variant="primary">Create Studio Workspace</Button>
                </Link>
              }
            />
          )}
        </section>
      </main>
    </div>
  );
}
