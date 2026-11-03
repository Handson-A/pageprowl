import React from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { PublishingCalendarClient } from "./PublishingCalendarClient";
import { requireAuth } from "@/lib/auth/guards";
import { getCreatorSeries } from "@/lib/data/series";
import { getStudioPublishingCalendar } from "@/lib/data/publishing";

export const metadata: Metadata = {
  title: "Publishing Calendar | Creator Studio | PageProwl",
  description: "Schedule, manage, and monitor automated comic releases and publication history.",
};

export default async function PublishingCalendarPage() {
  const user = await requireAuth();

  // Fetch creator's series
  const creatorSeries = await getCreatorSeries(user.id);
  const seriesIds = creatorSeries.map((s) => s.id);

  // Fetch calendar items (scheduled releases & published episodes)
  const calendarData = await getStudioPublishingCalendar(seriesIds);

  const seriesList = creatorSeries.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
  }));

  return (
    <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Publishing Calendar</h1>
            <p className={styles.subtitle}>
              Monitor scheduled automated comic releases and chronological release history.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Upcoming Scheduled</span>
            <span className={styles.statValue}>{calendarData.scheduled.length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Published Chapters</span>
            <span className={styles.statValue}>{calendarData.published.length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Monitored Series</span>
            <span className={styles.statValue}>{creatorSeries.length}</span>
          </div>
        </div>

        <PublishingCalendarClient
          scheduled={calendarData.scheduled}
          published={calendarData.published}
          seriesList={seriesList}
        />
      </main>
  );
}
