"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  formatReleaseDisplayDate,
  type ScheduledReleaseItem,
} from "@/lib/data/publishing-pure";
import {
  LuCalendar,
  LuClock,
  LuExternalLink,
  LuBookOpen,
  LuFilter,
  LuArrowRight,
  LuCheck,
} from "react-icons/lu";

interface PublishedItem {
  id: string;
  seriesId: string;
  seriesTitle: string;
  seriesSlug: string;
  title: string;
  episodeNumber: number;
  slug: string;
  publishedAt: string;
}

interface SeriesOption {
  id: string;
  title: string;
  slug: string;
}

interface PublishingCalendarClientProps {
  scheduled: ScheduledReleaseItem[];
  published: PublishedItem[];
  seriesList: SeriesOption[];
}

export function PublishingCalendarClient({
  scheduled,
  published,
  seriesList,
}: PublishingCalendarClientProps) {
  const [activeTab, setActiveTab] = useState<"scheduled" | "published">("scheduled");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("all");

  const filteredScheduled = scheduled.filter((item) =>
    selectedSeriesId === "all" ? true : item.seriesId === selectedSeriesId
  );

  const filteredPublished = published.filter((item) =>
    selectedSeriesId === "all" ? true : item.seriesId === selectedSeriesId
  );

  const parseMonthDay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        month: d.toLocaleString("en-US", { month: "short" }),
        day: d.getDate(),
      };
    } catch {
      return { month: "REL", day: 1 };
    }
  };

  return (
    <div className={styles.card}>
      {/* Filter Bar */}
      <div className={styles.filterRow}>
        <div className={styles.tabBar} style={{ borderBottom: "none" }}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "scheduled" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("scheduled")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <LuClock size={16} />
              <span>Upcoming Scheduled ({filteredScheduled.length})</span>
            </span>
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "published" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("published")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <LuCheck size={16} />
              <span>Published Releases ({filteredPublished.length})</span>
            </span>
          </button>
        </div>

        {seriesList.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LuFilter size={16} color="var(--color-text-muted)" />
            <select
              className={styles.seriesSelect}
              value={selectedSeriesId}
              onChange={(e) => setSelectedSeriesId(e.target.value)}
              aria-label="Filter releases by series"
            >
              <option value="all">All My Series ({seriesList.length})</option>
              {seriesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Scheduled Releases Tab */}
      {activeTab === "scheduled" && (
        <div>
          {filteredScheduled.length > 0 ? (
            <div className={styles.releaseList}>
              {filteredScheduled.map((item) => {
                const dateParts = parseMonthDay(item.scheduledFor);
                return (
                  <div key={item.id} className={styles.releaseItem}>
                    <div className={styles.releaseLeft}>
                      <div className={styles.dateBadge}>
                        <span className={styles.dateMonth}>{dateParts.month}</span>
                        <span className={styles.dateDay}>{dateParts.day}</span>
                      </div>
                      <div className={styles.releaseMeta}>
                        <span className={styles.releaseSeries}>{item.seriesTitle}</span>
                        <span className={styles.releaseTitle}>
                          Chapter #{item.episodeNumber}: {item.episodeTitle}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          Scheduled for {formatReleaseDisplayDate(item.scheduledFor)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.releaseRight}>
                      <StatusBadge status="scheduled" />
                      <Link
                        href={`/studio/series/${item.seriesId}/episodes/${item.episodeId}`}
                      >
                        <Button variant="secondary" size="sm">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <span>Manage</span>
                            <LuArrowRight size={14} />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <LuCalendar size={40} />
              <h3 style={{ fontWeight: 700, color: "var(--color-text)" }}>
                No Upcoming Scheduled Releases
              </h3>
              <p style={{ fontSize: "0.875rem" }}>
                Episodes approved by editors can be scheduled for automatic release on future dates.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Published Releases Tab */}
      {activeTab === "published" && (
        <div>
          {filteredPublished.length > 0 ? (
            <div className={styles.releaseList}>
              {filteredPublished.map((item) => {
                const dateParts = parseMonthDay(item.publishedAt);
                return (
                  <div key={item.id} className={styles.releaseItem}>
                    <div className={styles.releaseLeft}>
                      <div className={styles.dateBadge}>
                        <span className={styles.dateMonth}>{dateParts.month}</span>
                        <span className={styles.dateDay}>{dateParts.day}</span>
                      </div>
                      <div className={styles.releaseMeta}>
                        <span className={styles.releaseSeries}>{item.seriesTitle}</span>
                        <span className={styles.releaseTitle}>
                          Chapter #{item.episodeNumber}: {item.title}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                          Published on {new Date(item.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className={styles.releaseRight}>
                      <StatusBadge status="published" />
                      <Link
                        href={`/series/${item.seriesSlug}/episodes/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <LuExternalLink size={14} />
                            <span>Reader</span>
                          </span>
                        </Button>
                      </Link>
                      <Link href={`/studio/series/${item.seriesId}/episodes/${item.id}`}>
                        <Button variant="secondary" size="sm">
                          <span>Editor</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <LuBookOpen size={40} />
              <h3 style={{ fontWeight: 700, color: "var(--color-text)" }}>
                No Published Episodes Yet
              </h3>
              <p style={{ fontSize: "0.875rem" }}>
                Published episodes will appear here in chronological release order.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
