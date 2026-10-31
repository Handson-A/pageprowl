import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createStudioAction } from "@/app/studio/studios/actions";
import { createClient } from "@/lib/supabase/server";
import styles from "@/app/studio/page.module.css";

export default async function NewStudioPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/studio/studios/new");
  }
  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Create Studio Workspace</h1>
            <p className={styles.subtitle}>
              Form a dedicated creative organization to manage serialized comics and creator teams.
            </p>
          </div>
        </header>

        <section style={{ maxWidth: "600px" }}>
          <form
            action={createStudioAction}
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
            <FormField
              label="Studio Name"
              description="The public name of your production studio or creative imprint."
              required
            >
              <input
                type="text"
                name="name"
                placeholder="e.g. Ironclad Manga Studio"
                required
                minLength={2}
                maxLength={80}
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
              label="Studio Description"
              description="Brief summary of your studio's publishing mission and genres."
            >
              <textarea
                name="description"
                rows={4}
                placeholder="Indie manga collective focusing on cyberpunk and dark fantasy series..."
                maxLength={400}
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

            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
              <Button type="submit" variant="primary">
                Create Studio
              </Button>
              <Link href="/studio/studios">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
