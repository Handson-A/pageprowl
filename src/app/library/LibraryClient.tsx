"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import {
  toggleLibraryAction,
  toggleFollowAction,
  updateFollowNotificationAction,
  updateNotificationPreferencesAction,
} from "@/app/actions/reader";
import type { ReaderLibraryItem, ReadingHistoryItem } from "@/lib/data/reader";
import {
  LuBookOpen,
  LuBookmark,
  LuHistory,
  LuBell,
  LuSettings,
  LuTrash2,
  LuArrowRight,
  LuCheck,
  LuBellOff,
  LuLayers,
} from "react-icons/lu";

interface FollowedSeriesItem {
  seriesId: string;
  seriesSlug: string;
  seriesTitle: string;
  seriesCoverUrl: string | null;
  creatorName: string;
  notifyNewEpisodes: boolean;
}

interface LibraryClientProps {
  initialLibrary: ReaderLibraryItem[];
  initialHistory: ReadingHistoryItem[];
  initialFollowed: FollowedSeriesItem[];
  initialPreferences: {
    notifications_enabled: boolean;
    notify_new_episodes: boolean;
  };
}

export function LibraryClient({
  initialLibrary,
  initialHistory,
  initialFollowed,
  initialPreferences,
}: LibraryClientProps) {
  const [activeTab, setActiveTab] = useState<"library" | "history" | "following" | "settings">("library");

  const [library, setLibrary] = useState<ReaderLibraryItem[]>(initialLibrary);
  const [history] = useState<ReadingHistoryItem[]>(initialHistory);
  const [followed, setFollowed] = useState<FollowedSeriesItem[]>(initialFollowed);

  const [prefs, setPrefs] = useState(initialPreferences);
  const [isUpdatingPrefs, setIsUpdatingPrefs] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Remove from library
  const handleRemoveFromLibrary = async (seriesId: string) => {
    try {
      await toggleLibraryAction(seriesId);
      setLibrary((prev) => prev.filter((item) => item.seriesId !== seriesId));
      setMessage({ type: "success", text: "Removed series from your library." });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to remove series." });
    }
  };

  // Toggle follow / unfollow
  const handleToggleFollow = async (seriesId: string) => {
    try {
      const res = await toggleFollowAction(seriesId);
      if (!res.following) {
        setFollowed((prev) => prev.filter((item) => item.seriesId !== seriesId));
        setMessage({ type: "success", text: "Unfollowed series." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to unfollow series." });
    }
  };

  // Toggle follow notification setting
  const handleFollowNotifyToggle = async (seriesId: string, currentVal: boolean) => {
    try {
      await updateFollowNotificationAction(seriesId, !currentVal);
      setFollowed((prev) =>
        prev.map((item) =>
          item.seriesId === seriesId
            ? { ...item, notifyNewEpisodes: !currentVal }
            : item
        )
      );
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to update notification." });
    }
  };

  // Update global preferences
  const handlePrefChange = async (key: "notifications_enabled" | "notify_new_episodes", value: boolean) => {
    const updated = {
      ...prefs,
      [key]: value,
    };
    setPrefs(updated);
    setIsUpdatingPrefs(true);
    setMessage(null);

    try {
      await updateNotificationPreferencesAction({
        notificationsEnabled: updated.notifications_enabled,
        notifyNewEpisodes: updated.notify_new_episodes,
      });
      setMessage({ type: "success", text: "Notification preferences saved." });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save preferences." });
    } finally {
      setIsUpdatingPrefs(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Tab Navigation */}
      <div className={styles.tabBar}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "library" ? styles.tabActive : ""}`}
          onClick={() => {
            setActiveTab("library");
            setMessage(null);
          }}
        >
          <LuBookmark size={16} />
          <span>Saved Series ({library.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tab} ${activeTab === "history" ? styles.tabActive : ""}`}
          onClick={() => {
            setActiveTab("history");
            setMessage(null);
          }}
        >
          <LuHistory size={16} />
          <span>Reading History ({history.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tab} ${activeTab === "following" ? styles.tabActive : ""}`}
          onClick={() => {
            setActiveTab("following");
            setMessage(null);
          }}
        >
          <LuBell size={16} />
          <span>Followed Comics ({followed.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tab} ${activeTab === "settings" ? styles.tabActive : ""}`}
          onClick={() => {
            setActiveTab("settings");
            setMessage(null);
          }}
        >
          <LuSettings size={16} />
          <span>Preferences</span>
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "6px",
            fontSize: "0.875rem",
            backgroundColor:
              message.type === "success"
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            color:
              message.type === "success"
                ? "var(--color-success)"
                : "var(--color-danger)",
            border: `1px solid ${
              message.type === "success"
                ? "rgba(16, 185, 129, 0.3)"
                : "rgba(239, 68, 68, 0.3)"
            }`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Tab 1: Saved Library */}
      {activeTab === "library" && (
        <div>
          {library.length > 0 ? (
            <div className={styles.seriesGrid}>
              {library.map((item) => (
                <div key={item.seriesId} className={styles.seriesCard}>
                  {item.seriesCoverUrl ? (
                    <img
                      src={item.seriesCoverUrl}
                      alt={item.seriesTitle}
                      className={styles.cardCover}
                    />
                  ) : (
                    <div className={styles.cardCoverFallback}>
                      <LuLayers size={32} color="var(--color-text-muted)" />
                    </div>
                  )}

                  <div className={styles.cardBody}>
                    <span style={{ fontSize: "11px", color: "var(--color-primary)", fontWeight: 700 }}>
                      {item.genre} • {item.seriesFormat === "scroll" ? "Scroll" : "Page"}
                    </span>
                    <h3 className={styles.cardTitle}>{item.seriesTitle}</h3>
                    <p className={styles.cardCreator}>By {item.creatorName}</p>

                    {item.readingProgress ? (
                      <div className={styles.cardProgress}>
                        Last read: Chapter #{item.readingProgress.episodeNumber} (Page {item.readingProgress.pageNumber})
                      </div>
                    ) : item.latestEpisode ? (
                      <div className={styles.cardProgress}>
                        Latest: Chapter #{item.latestEpisode.episodeNumber}
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromLibrary(item.seriesId)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-text-muted)",
                        cursor: "pointer",
                        padding: "6px",
                      }}
                      title="Remove from library"
                      aria-label={`Remove ${item.seriesTitle} from library`}
                    >
                      <LuTrash2 size={16} />
                    </button>

                    <Link href={`/series/${item.seriesSlug}`}>
                      <Button variant="primary" size="sm">
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <span>Read</span>
                          <LuArrowRight size={14} />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <LuBookmark size={48} color="var(--color-text-muted)" />
              <h3 className={styles.emptyTitle}>Your Library is Empty</h3>
              <p style={{ fontSize: "0.875rem", maxWidth: "400px" }}>
                Save your favorite comic series to your personal library for one-click access and updates.
              </p>
              <Link href="/browse" style={{ marginTop: "var(--space-2)" }}>
                <Button variant="primary">Browse Comics</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reading History */}
      {activeTab === "history" && (
        <div>
          {history.length > 0 ? (
            <div className={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyLeft}>
                    {item.seriesCoverUrl ? (
                      <img
                        src={item.seriesCoverUrl}
                        alt={item.seriesTitle}
                        className={styles.historyThumb}
                      />
                    ) : (
                      <div
                        className={styles.historyThumb}
                        style={{
                          backgroundColor: "var(--color-surface-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LuBookOpen size={20} color="var(--color-text-muted)" />
                      </div>
                    )}

                    <div className={styles.historyMeta}>
                      <span className={styles.historySeriesTitle}>{item.seriesTitle}</span>
                      <h4 className={styles.historyEpisodeTitle}>
                        Chapter #{item.episodeNumber}: {item.episodeTitle}
                      </h4>
                      <span className={styles.historyProgress}>
                        Page {item.pageNumber} • {item.completed ? "Completed" : "In Progress"} •{" "}
                        {new Date(item.lastReadAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    {item.isPublished ? (
                      <Link href={`/series/${item.seriesSlug}/episodes/${item.episodeSlug}`}>
                        <Button variant="primary" size="sm">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <span>Resume</span>
                            <LuArrowRight size={14} />
                          </span>
                        </Button>
                      </Link>
                    ) : (
                      <span style={{ fontSize: "0.8rem", color: "var(--color-warning)" }}>
                        Chapter temporarily unavailable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <LuHistory size={48} color="var(--color-text-muted)" />
              <h3 className={styles.emptyTitle}>No Reading History Yet</h3>
              <p style={{ fontSize: "0.875rem" }}>
                Chapters you read on PageProwl will automatically synchronize and appear here.
              </p>
              <Link href="/discover" style={{ marginTop: "var(--space-2)" }}>
                <Button variant="primary">Start Reading</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Followed Series */}
      {activeTab === "following" && (
        <div>
          {followed.length > 0 ? (
            <div className={styles.historyList}>
              {followed.map((item) => (
                <div key={item.seriesId} className={styles.historyItem}>
                  <div className={styles.historyLeft}>
                    {item.seriesCoverUrl ? (
                      <img
                        src={item.seriesCoverUrl}
                        alt={item.seriesTitle}
                        className={styles.historyThumb}
                      />
                    ) : (
                      <div
                        className={styles.historyThumb}
                        style={{
                          backgroundColor: "var(--color-surface-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LuBookOpen size={20} color="var(--color-text-muted)" />
                      </div>
                    )}

                    <div className={styles.historyMeta}>
                      <h4 className={styles.historyEpisodeTitle}>{item.seriesTitle}</h4>
                      <span className={styles.historySeriesTitle}>By {item.creatorName}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <button
                      type="button"
                      onClick={() => handleFollowNotifyToggle(item.seriesId, item.notifyNewEpisodes)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid var(--color-border)",
                        backgroundColor: item.notifyNewEpisodes
                          ? "rgba(228, 71, 53, 0.1)"
                          : "var(--color-surface)",
                        color: item.notifyNewEpisodes
                          ? "var(--color-primary)"
                          : "var(--color-text-muted)",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                      title="Toggle chapter release notifications"
                    >
                      {item.notifyNewEpisodes ? <LuBell size={14} /> : <LuBellOff size={14} />}
                      <span>{item.notifyNewEpisodes ? "Notifications On" : "Muted"}</span>
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFollow(item.seriesId)}
                    >
                      Unfollow
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <LuBell size={48} color="var(--color-text-muted)" />
              <h3 className={styles.emptyTitle}>You Are Not Following Any Series</h3>
              <p style={{ fontSize: "0.875rem" }}>
                Follow comic series to receive in-app notifications whenever creators release new chapters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Preferences */}
      {activeTab === "settings" && (
        <div className={styles.settingsCard}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Reader Notification Preferences</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Control when and how you receive alerts about new chapter releases and platform updates.
          </p>

          <div className={styles.prefRow}>
            <div className={styles.prefInfo}>
              <span className={styles.prefTitle}>In-App Notifications</span>
              <span className={styles.prefDesc}>
                Master toggle for all alerts and notices in the notification center.
              </span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={prefs.notifications_enabled}
                onChange={(e) => handlePrefChange("notifications_enabled", e.target.checked)}
                disabled={isUpdatingPrefs}
              />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.prefRow}>
            <div className={styles.prefInfo}>
              <span className={styles.prefTitle}>New Chapter Releases</span>
              <span className={styles.prefDesc}>
                Receive alerts when followed series publish new chapters.
              </span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={prefs.notify_new_episodes}
                onChange={(e) => handlePrefChange("notify_new_episodes", e.target.checked)}
                disabled={!prefs.notifications_enabled || isUpdatingPrefs}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
