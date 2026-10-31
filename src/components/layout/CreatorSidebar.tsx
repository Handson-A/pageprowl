"use client";

import React from "react";
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
} from "react-icons/lu";
import { PanelverseLogo } from "@/components/brand/PanelverseLogo";
import styles from "./CreatorSidebar.module.css";

export function CreatorSidebar() {
  const pathname = usePathname();

  const isLinkActive = (path: string) => {
    if (path === "/studio" && pathname === "/studio") return true;
    if (path !== "/studio" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className={styles.sidebar} aria-label="Creator Studio Navigation">
      <Link href="/studio" className={styles.brand} aria-label="Panelverse Studio">
        <PanelverseLogo variant="full" size="sm" />
        <span className={styles.studioBadge}>Studio</span>
      </Link>

      <nav className={styles.nav}>
        <span className={styles.navSectionTitle}>Workspace</span>
        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <Link
            href="/studio"
            className={`${styles.navItem} ${
              isLinkActive("/studio") ? styles.active : ""
            }`}
          >
            <LuLayoutDashboard size={18} aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <Link
            href="/studio/series"
            className={`${styles.navItem} ${
              isLinkActive("/studio/series") ? styles.active : ""
            }`}
          >
            <LuBookOpen size={18} aria-hidden="true" />
            <span>My Series</span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <Link
            href="/studio/studios"
            className={`${styles.navItem} ${
              isLinkActive("/studio/studios") ? styles.active : ""
            }`}
          >
            <LuBuilding2 size={18} aria-hidden="true" />
            <span>Studio Teams</span>
          </Link>
        </motion.div>

        <span className={styles.navSectionTitle}>Collaboration</span>
        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <Link
            href="/studio/reviews"
            className={`${styles.navItem} ${
              isLinkActive("/studio/reviews") ? styles.active : ""
            }`}
          >
            <LuMessageSquare size={18} aria-hidden="true" />
            <span>Reviews &amp; Tasks</span>
          </Link>
        </motion.div>

        <span className={styles.navSectionTitle}>Account</span>
        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <Link
            href="/studio/profile"
            className={`${styles.navItem} ${
              isLinkActive("/studio/profile") ? styles.active : ""
            }`}
          >
            <LuUser size={18} aria-hidden="true" />
            <span>Profile Settings</span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <Link href="/" className={styles.navItem}>
            <LuCompass size={18} aria-hidden="true" />
            <span>Public Reader</span>
          </Link>
        </motion.div>
      </nav>

      <div className={styles.footer}>
        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <Link href="/login?action=signout" className={styles.navItem}>
            <LuLogOut size={18} aria-hidden="true" />
            <span>Sign Out</span>
          </Link>
        </motion.div>
      </div>
    </aside>
  );
}
