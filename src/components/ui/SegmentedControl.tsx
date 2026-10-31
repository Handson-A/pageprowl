"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./SegmentedControl.module.css";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
  href?: string;
  icon?: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange?: (value: T) => void;
  variant?: "pill" | "line";
  size?: "sm" | "md" | "lg";
  layoutId?: string;
  className?: string;
  ariaLabel?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  variant = "pill",
  size = "md",
  layoutId = "segmentedControlIndicator",
  className,
  ariaLabel = "Filter options",
}: SegmentedControlProps<T>) {
  const isLine = variant === "line";
  const trackClass = isLine ? styles.lineTrack : styles.pillTrack;
  const sizeClass = isLine
    ? size === "sm"
      ? styles.lineSm
      : size === "lg"
      ? styles.lineLg
      : styles.lineMd
    : size === "sm"
    ? styles.pillSm
    : size === "lg"
    ? styles.pillLg
    : styles.pillMd;

  return (
    <div className={`${styles.wrapper} ${className || ""}`} role="navigation" aria-label={ariaLabel}>
      <div className={trackClass} role={onChange ? "tablist" : undefined}>
        {options.map((option) => {
          const isActive = option.value === value;
          const Icon = option.icon;

          const content = (
            <>
              {Icon && <Icon size={size === "sm" ? 14 : 16} aria-hidden="true" />}
              <span>{option.label}</span>
              {typeof option.count === "number" && (
                <span
                  style={{
                    fontSize: "0.85em",
                    opacity: isActive ? 0.9 : 0.6,
                    marginLeft: "4px",
                  }}
                >
                  ({option.count})
                </span>
              )}
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className={isLine ? styles.lineIndicator : styles.pillIndicator}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}
            </>
          );

          if (option.href) {
            return (
              <Link
                key={option.value}
                href={option.href}
                className={`${styles.item} ${sizeClass} ${
                  isActive ? styles.active : styles.inactive
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange?.(option.value)}
              className={`${styles.item} ${sizeClass} ${
                isActive ? styles.active : styles.inactive
              }`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
