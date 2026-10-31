"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";
import { LuHouse, LuCompass, LuLayers, LuUser } from "react-icons/lu";

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
    { href: "/browse", label: "Browse", icon: LuCompass },
    { href: "/studio", label: "Studio", icon: LuLayers },
    { href: "/studio/profile", label: "Profile", icon: LuUser },
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
