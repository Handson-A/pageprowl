"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./BottomNav.module.css";
import { LuHouse, LuCompass, LuSearch, LuLayers } from "react-icons/lu";

export function BottomNav() {
  const pathname = usePathname();

  // Helper to determine active route
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: "/", label: "Home", icon: LuHouse },
    { href: "/discover", label: "Discover", icon: LuCompass },
    { href: "/search", label: "Search", icon: LuSearch },
    { href: "/studio", label: "Studio", icon: LuLayers },
  ];

  return (
    <nav className={styles.bottomNav} aria-label="Mobile Bottom Navigation">
      <div className={styles.inner}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.item} ${active ? styles.active : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.span
                  layoutId="bottomNavIndicator"
                  className={styles.activeIndicator}
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className={styles.iconWrapper}>
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
