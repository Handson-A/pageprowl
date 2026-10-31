"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "@/app/studio/page.module.css";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { markNotificationReadAction, markAllNotificationsReadAction } from "./actions";
import {
  LuBell,
  LuCheckCheck,
  LuArrowRight,
  LuLayers,
  LuMessageSquare,
  LuCheck,
  LuClock,
} from "react-icons/lu";
import type { NotificationRow } from "@/lib/data/notifications";

interface NotificationsClientProps {
  initialNotifications: NotificationRow[];
}

export function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<NotificationRow[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationReadAction(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllNotificationsReadAction();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all read", err);
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>
            Stay informed about assignments, review requests, revision notes, and publishing updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="secondary" onClick={handleMarkAllRead} disabled={isMarkingAll}>
            <LuCheckCheck size={16} style={{ marginRight: "4px" }} />
            <span>Mark All as Read ({unreadCount})</span>
          </Button>
        )}
      </header>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "var(--space-2)", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        <button
          type="button"
          onClick={() => setFilter("all")}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: filter === "all" ? "2px solid var(--color-primary)" : "none",
            padding: "var(--space-2) var(--space-4)",
            fontWeight: filter === "all" ? 700 : 500,
            color: filter === "all" ? "var(--color-primary)" : "var(--color-text-muted)",
            cursor: "pointer",
          }}
        >
          All Notifications ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter("unread")}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: filter === "unread" ? "2px solid var(--color-primary)" : "none",
            padding: "var(--space-2) var(--space-4)",
            fontWeight: filter === "unread" ? 700 : 500,
            color: filter === "unread" ? "var(--color-primary)" : "var(--color-text-muted)",
            cursor: "pointer",
          }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <section className={styles.section}>
        {filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.read && handleMarkAsRead(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-4)",
                  backgroundColor: item.read ? "var(--color-surface)" : "var(--color-surface-muted)",
                  border: item.read ? "1px solid var(--color-border)" : "1px solid var(--color-primary)",
                  borderRadius: "var(--pv-radius-md)",
                  boxShadow: "var(--pv-shadow-card)",
                  cursor: "pointer",
                  gap: "var(--space-4)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: item.read ? "transparent" : "var(--color-primary)",
                      marginTop: "6px",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: "var(--font-size-sm)", fontWeight: item.read ? 600 : 800 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text)", marginTop: "2px" }}>
                      {item.message}
                    </p>
                    <span style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px", display: "inline-block" }}>
                      {new Date(item.created_at).toLocaleDateString()} at{" "}
                      {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  {item.link && (
                    <Link href={item.link}>
                      <Button variant="secondary" size="sm">
                        <span>View</span>
                        <LuArrowRight size={14} style={{ marginLeft: "4px" }} />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<LuBell size={44} color="var(--color-text-muted)" />}
            title="No notifications"
            description="You are all caught up on your studio collaborations."
          />
        )}
      </section>
    </main>
  );
}
