import React from "react";
import { redirect } from "next/navigation";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/data/profiles";
import { updateProfileFormAction } from "@/app/studio/profile/actions";
import { LuSave } from "react-icons/lu";
import styles from "@/app/studio/page.module.css";

export default async function ProfileSettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userProfile = await getUserProfile(user.id);
  const profile = userProfile?.profile;
  const creatorProfile = userProfile?.creatorProfile;

  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Creator Profile Settings</h1>
            <p className={styles.subtitle}>
              Manage your public author credentials, pen name, and platform identity.
            </p>
          </div>
        </header>

        <section style={{ maxWidth: "680px" }}>
          <form
            action={updateProfileFormAction}
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-6)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}
          >
            {/* Account Metadata (Read-only / Security verification) */}
            <div
              style={{
                padding: "var(--space-4)",
                backgroundColor: "var(--color-surface-muted)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", display: "block" }}>
                  AUTHENTICATED ACCOUNT
                </span>
                <strong style={{ fontSize: "var(--font-size-sm)" }}>@{profile?.username || user.email?.split("@")[0]}</strong>
              </div>
              <div>
                <StatusBadge
                  status={profile?.role === "admin" ? "published" : profile?.role === "moderator" ? "ready_to_publish" : "draft"}
                  label={`ROLE: ${(profile?.role || "user").toUpperCase()}`}
                />
              </div>
            </div>

            <FormField
              label="Display Name"
              description="Your name as shown across comic reader comments and credits."
              required
            >
              <input
                type="text"
                name="display_name"
                defaultValue={profile?.display_name || ""}
                required
                minLength={2}
                maxLength={50}
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
              label="Avatar URL"
              description="URL to your creator avatar image."
            >
              <input
                type="url"
                name="avatar_url"
                defaultValue={profile?.avatar_url || ""}
                placeholder="https://images.example.com/avatar.jpg"
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
              label="Biography"
              description="Brief creator bio visible on your series pages (max 500 characters)."
            >
              <textarea
                name="bio"
                defaultValue={profile?.bio || ""}
                rows={3}
                maxLength={500}
                placeholder="Storyteller, illustrator, manga lover..."
                style={{
                  width: "100%",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  fontSize: "var(--font-size-base)",
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-text)",
                  resize: "vertical",
                }}
              />
            </FormField>

            <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "var(--space-2) 0" }} />

            <div>
              <h3 style={{ fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)", marginBottom: "var(--space-1)" }}>
                Creator Imprint Details
              </h3>
              <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                These attributes appear on published comic credits.
              </p>
            </div>

            <FormField
              label="Creator Pen Name"
              description="Nom de plume for official comic publications."
            >
              <input
                type="text"
                name="pen_name"
                defaultValue={creatorProfile?.pen_name || profile?.display_name || ""}
                minLength={2}
                maxLength={50}
                placeholder="e.g. A. Y. Son"
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
              label="Creator Portfolio or Website"
              description="Link to your portfolio, ArtStation, or studio site."
            >
              <input
                type="url"
                name="website_url"
                defaultValue={creatorProfile?.website_url || ""}
                placeholder="https://myartportfolio.com"
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

            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
              <Button type="submit" variant="primary">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <LuSave size={16} aria-hidden="true" />
                  <span>Save Profile Changes</span>
                </span>
              </Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
