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
import {
  inviteStudioMemberAction,
  updateStudioMemberRoleAction,
  removeStudioMemberAction,
} from "@/app/studio/studios/actions";
import { hasStudioPermission, ForbiddenError } from "@/lib/auth/guards";
import { LuPlus, LuArrowRight, LuMail, LuUsers } from "react-icons/lu";
import styles from "@/app/studio/page.module.css";
import type { StudioRole } from "@/types/database";

interface StudioWorkspacePageProps {
  params: {
    studioId: string;
  };
}

export default async function StudioWorkspacePage({ params }: StudioWorkspacePageProps) {
  const { studioId } = params;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const studio = await getStudioById(studioId);
  if (!studio) {
    notFound();
  }

  const members = await getStudioMembers(studioId);
  const currentMember = members.find((m) => m.user_id === user.id);

  if (!currentMember) {
    throw new ForbiddenError("You are not a member of this studio workspace.");
  }

  const seriesList = await getStudioSeries(studioId);
  const userRole = currentMember.role;
  const canManage = hasStudioPermission(userRole, "admin");

  const invitations = canManage ? await getStudioInvitations(studioId) : [];

  const handleInvite = inviteStudioMemberAction.bind(null, studioId);

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

        {/* Studio Series Section */}
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

        {/* Studio Members Section */}
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
                        {/* Only show management controls if target is not owner, or if caller is owner */}
                        {!(member.role === "owner" && userRole !== "owner") && (
                          <form
                            action={async (formData: FormData) => {
                              "use server";
                              const role = formData.get("role") as StudioRole;
                              await updateStudioMemberRoleAction(studioId, member.user_id, role);
                            }}
                            style={{ display: "inline-flex", gap: "var(--space-1)" }}
                          >
                            <select
                              name="role"
                              defaultValue={member.role}
                              style={{
                                padding: "4px 8px",
                                fontSize: "var(--font-size-xs)",
                                borderRadius: "var(--radius-sm)",
                                border: "1px solid var(--color-border)",
                                backgroundColor: "var(--color-bg)",
                                color: "var(--color-text)",
                              }}
                            >
                              {userRole === "owner" && <option value="owner">Owner</option>}
                              <option value="admin">Admin</option>
                              <option value="editor">Editor</option>
                              <option value="member">Member</option>
                            </select>
                            <Button type="submit" variant="secondary" size="sm">
                              Update
                            </Button>
                          </form>
                        )}

                        {!(member.role === "owner" && userRole !== "owner") && (
                          <form
                            action={async () => {
                              "use server";
                              await removeStudioMemberAction(studioId, member.user_id);
                            }}
                          >
                            <Button type="submit" variant="ghost" size="sm" style={{ color: "var(--color-danger)" }}>
                              Remove
                            </Button>
                          </form>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Invite Member Section (Only for Admin / Owner) */}
        {canManage && (
          <section className={styles.section} style={{ maxWidth: "600px" }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Invite New Team Member</h2>
            </div>

            <form
              action={handleInvite}
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
              }}
            >
              <FormField
                label="Member Email"
                description="An invitation link will be registered for this creator."
                required
              >
                <input
                  type="email"
                  name="email"
                  placeholder="collaborator@example.com"
                  required
                  style={{
                    width: "100%",
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    fontSize: "var(--font-size-base)",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                  }}
                />
              </FormField>

              <FormField
                label="Role Assignment"
                description="Admins can manage members and settings; Editors can edit episodes; Members can view draft work."
                required
              >
                <select
                  name="role"
                  defaultValue="member"
                  style={{
                    width: "100%",
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    fontSize: "var(--font-size-base)",
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)",
                  }}
                >
                  <option value="member">Member (Contributor)</option>
                  <option value="editor">Editor (Episode production &amp; comments)</option>
                  <option value="admin">Admin (Manage team, series, and settings)</option>
                </select>
              </FormField>

              <div>
                <Button type="submit" variant="primary">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuMail size={16} aria-hidden="true" />
                    <span>Send Studio Invitation</span>
                  </span>
                </Button>
              </div>
            </form>
          </section>
        )}

        {/* Pending Invitations Section */}
        {canManage && invitations.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Pending Invitations ({invitations.length})</h2>
            </div>

            <table className={styles.seriesTable}>
              <thead>
                <tr>
                  <th>Invited Email</th>
                  <th>Assigned Role</th>
                  <th>Expires</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <code>{inv.invited_email}</code>
                    </td>
                    <td>{inv.role.toUpperCase()}</td>
                    <td>{new Date(inv.expires_at).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status="in_review" label={inv.status.toUpperCase()} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}
