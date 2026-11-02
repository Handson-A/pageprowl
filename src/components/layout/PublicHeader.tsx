"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./PublicHeader.module.css";
import { Button } from "@/components/ui/Button";
import { PageProwlLogo } from "@/components/brand/PageProwlLogo";
import { createClient } from "@/lib/supabase/client";
import { LuSearch, LuBell, LuBookmark, LuUser, LuLogOut } from "react-icons/lu";

export function PublicHeader() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser(data.user);
          supabase
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("user_id", data.user.id)
            .eq("read", false)
            .then(({ count }) => {
              if (count !== null && count !== undefined) {
                setUnreadCount(count);
              }
            });
        }
      });
    } catch {
      // Non-fatal if offline or placeholder
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.brand} aria-label="PageProwl Home">
            <PageProwlLogo variant="full" theme="dark" size="sm" />
          </Link>

          <nav className={styles.nav} aria-label="Main Navigation">
            <Link href="/discover" className={styles.navLink}>
              Discover
            </Link>
            <Link href="/browse" className={styles.navLink}>
              Browse
            </Link>
            <Link href="/genres" className={styles.navLink}>
              Genres
            </Link>
            {user && (
              <Link href="/library" className={styles.navLink}>
                Library
              </Link>
            )}
            <Link href="/studio" className={styles.navLink}>
              Creators
            </Link>
          </nav>
        </div>

        <div className={styles.actions}>
          <Link
            href="/search"
            className={styles.searchButton}
            aria-label="Search comics"
          >
            <LuSearch size={18} aria-hidden="true" />
          </Link>

          {user ? (
            <>
              <Link
                href="/library"
                className={styles.iconButton}
                aria-label="My saved comic library"
                title="My Library"
              >
                <LuBookmark size={18} aria-hidden="true" />
              </Link>

              <Link
                href="/account"
                className={styles.iconButton}
                aria-label="Account and Profile Settings"
                title="Account Settings"
              >
                <LuUser size={18} aria-hidden="true" />
              </Link>

              <Link
                href="/studio/notifications"
                className={styles.iconButton}
                aria-label={
                  unreadCount > 0
                    ? `${unreadCount} unread notifications`
                    : "Notifications"
                }
                title="Notifications"
              >
                <LuBell size={18} aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className={styles.notifBadge}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link href="/studio">
                <Button variant="primary" size="sm">
                  Creator Studio
                </Button>
              </Link>

              <form action="/api/auth/signout" method="POST" style={{ margin: 0 }}>
                <button
                  type="submit"
                  className={styles.iconButton}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-secondary, #94a3b8)",
                  }}
                  title="Sign out of account"
                  aria-label="Sign out"
                >
                  <LuLogOut size={16} />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginLink}>
                <Button variant="ghost" size="sm" className={styles.ghostLight}>
                  Sign In
                </Button>
              </Link>

              <Link href="/studio">
                <Button variant="primary" size="sm">
                  Creator Studio
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
