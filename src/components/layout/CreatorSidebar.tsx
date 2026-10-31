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
  LuUser,
  LuCompass,
  LuLogOut,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { PanelverseLogo } from "@/components/brand/PanelverseLogo";
import styles from "./CreatorSidebar.module.css";

interface CreatorSidebarProps {
  userName?: string;
  userRole?: string;
}

export function CreatorSidebar({
  userName = "Creator",
  userRole = "Studio Member",
}: CreatorSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLinkActive = (path: string) => {
    if (path === "/studio" && pathname === "/studio") return true;
    if (path !== "/studio" && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    {
      section: "WORKSPACE",
      items: [
        { href: "/studio", label: "Dashboard", icon: LuLayoutDashboard },
        { href: "/studio/series", label: "My Series", icon: LuBookOpen },
        { href: "/studio/studios", label: "Studio Teams", icon: LuBuilding2 },
      ],
    },
    {
      section: "COLLABORATION",
      items: [
        { href: "/studio/reviews", label: "Reviews & Tasks", icon: LuMessageSquare },
      ],
    },
    {
      section: "ACCOUNT",
      items: [
        { href: "/studio/profile", label: "Profile Settings", icon: LuUser },
        { href: "/", label: "Public Reader", icon: LuCompass },
      ],
    },
  ];

  const userInitial = userName.trim().charAt(0).toUpperCase() || "C";

  return (
    <>
      {/* Mobile Studio Top Header */}
      <div className={styles.mobileBar}>
        <Link href="/studio" aria-label="Panelverse Studio">
          <PanelverseLogo variant="full" theme="dark" size="sm" />
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
          <Link href="/studio" aria-label="Panelverse Studio">
            <PanelverseLogo variant="full" theme="dark" size="sm" />
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
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${styles.navItem} ${active ? styles.active : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon size={18} aria-hidden="true" />
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
          <div className={styles.userProfile}>
            <div className={styles.avatar}>{userInitial}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{userRole}</span>
            </div>
          </div>

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
