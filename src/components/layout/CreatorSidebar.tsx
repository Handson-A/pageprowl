"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LuLayoutDashboard,
  LuBookOpen,
  LuBuilding2,
  LuMessageSquare,
  LuListTodo,
  LuBell,
  LuUser,
  LuCompass,
  LuCalendar,
  LuLogOut,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { PageProwlLogo } from "@/components/brand/PageProwlLogo";
import { useStudioProfile } from "@/components/providers/StudioProfileProvider";
import styles from "./CreatorSidebar.module.css";

export interface CreatorSidebarProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string | null;
}

export function CreatorSidebar({
  userName: propUserName,
  userRole: propUserRole,
  avatarUrl: propAvatarUrl,
}: CreatorSidebarProps = {}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, isLoading } = useStudioProfile();

  // Props take precedence when passed directly; otherwise fallback to profile from persistent Studio context
  const userName = propUserName || profile?.displayName || (isLoading ? "" : "Creator");
  const userRole = propUserRole || profile?.role || "Creator";
  const avatarUrl = propAvatarUrl !== undefined ? propAvatarUrl : profile?.avatarUrl;

  const showSkeleton = isLoading && !profile && !propUserName;

  const isLinkActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    if (path === "/studio") {
      return pathname === "/studio";
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    {
      section: "WORKSPACE",
      items: [
        { href: "/studio", label: "Dashboard", icon: LuLayoutDashboard },
        { href: "/studio/series", label: "My Series", icon: LuBookOpen },
        { href: "/studio/publishing", label: "Publishing Calendar", icon: LuCalendar },
        { href: "/studio/studios", label: "Studio Teams", icon: LuBuilding2 },
      ],
    },
    {
      section: "COLLABORATION",
      items: [
        { href: "/studio/tasks", label: "Production Tasks", icon: LuListTodo },
        { href: "/studio/reviews", label: "Reviews & Revisions", icon: LuMessageSquare },
        { href: "/studio/notifications", label: "Notifications", icon: LuBell },
      ],
    },
    {
      section: "ACCOUNT",
      items: [
        { href: "/studio/profile", label: "Profile Settings", icon: LuUser },
        { href: "/", label: "Public Site", icon: LuCompass },
      ],
    },
  ];

  const userInitial = userName.trim().charAt(0).toUpperCase() || "C";

  return (
    <>
      {/* Mobile Studio Top Header */}
      <div className={styles.mobileBar}>
        <Link href="/studio" aria-label="PageProwl Studio">
          <PageProwlLogo variant="full" theme="dark" size="sm" />
        </Link>
        <button
          className={styles.mobileToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileMenuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
        </button>
      </div>

      <aside
        className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileOpen : ""}`}
        aria-label="Creator Studio Navigation"
      >
        <div className={styles.desktopBrand}>
          <Link href="/studio" aria-label="PageProwl Studio">
            <PageProwlLogo variant="full" theme="dark" size="sm" />
          </Link>
          <span className={styles.studioBadge}>Studio</span>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((group) => (
            <div key={group.section} className={styles.navGroup}>
              <span className={styles.navSectionTitle}>{group.section}</span>
              {group.items.map((item) => {
                const active = isLinkActive(item.href);
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${styles.navItem} ${active ? styles.active : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {active && (
                        <motion.span
                          layoutId="activeSidebarIndicator"
                          className={styles.activeIndicator}
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <Icon
                        size={18}
                        className={active ? styles.activeIcon : undefined}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card at bottom of sidebar matching reference */}
        <div className={styles.footer}>
          {showSkeleton ? (
            <div className={styles.userProfileLoading} aria-label="Loading creator profile">
              <div className={styles.avatarSkeleton} />
              <div className={styles.userInfoSkeleton}>
                <div className={styles.userNameSkeleton} />
                <div className={styles.userRoleSkeleton} />
              </div>
            </div>
          ) : (
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className={styles.avatarImg} />
                ) : (
                  userInitial
                )}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName}</span>
                <span className={styles.userRole}>{userRole}</span>
              </div>
            </div>
          )}

          <form action="/api/auth/signout" method="POST" style={{ margin: 0 }}>
            <button type="submit" className={styles.signOutBtn} title="Sign Out">
              <LuLogOut size={16} aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
