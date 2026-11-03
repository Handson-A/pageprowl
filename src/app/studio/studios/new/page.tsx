import React from "react";
import { redirect } from "next/navigation";
import { getCachedAuthUser } from "@/lib/supabase/server";
import { NewStudioClient } from "./NewStudioClient";
import styles from "@/app/studio/page.module.css";

export default async function NewStudioPage() {
  const user = await getCachedAuthUser();

  if (!user) {
    redirect("/login?redirect=" + encodeURIComponent("/studio/studios/new"));
  }

  return (
    <main className={styles.main}>
      <NewStudioClient />
    </main>
  );
}
