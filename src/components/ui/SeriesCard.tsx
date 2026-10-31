"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./SeriesCard.module.css";
import { LuArrowRight } from "react-icons/lu";
import type { SeriesWithCreator } from "@/lib/data/series";

export interface SeriesCardProps {
  series: SeriesWithCreator;
  aspectRatio?: "cinematic" | "portrait";
  showAction?: boolean;
}

export function SeriesCard({
  series,
  aspectRatio = "cinematic",
  showAction = true,
}: SeriesCardProps) {
  const formatLabel = series.format === "scroll" ? "Vertical Scroll" : "Page-by-Page";
  const episodeCountText =
    typeof series.episode_count === "number"
      ? `${series.episode_count} ${series.episode_count === 1 ? "episode" : "episodes"}`
      : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{ height: "100%" }}
    >
      <Link
        href={`/series/${series.slug}`}
        className={`${styles.card} ${aspectRatio === "portrait" ? styles.portraitCard : ""}`}
        aria-label={`View series ${series.title}`}
      >
        <div className={styles.coverWrapper}>
          {series.cover_url ? (
            <img
              src={series.cover_url}
              alt={series.title}
              className={styles.coverImage}
              loading="lazy"
            />
          ) : (
            <div className={styles.coverFallback} aria-label="Cover artwork placeholder">
              {/* Artistic Comic-Panel Placeholder Graphic */}
              <div className={styles.fallbackGraphic}>
                <div className={styles.panelTopLeft} />
                <div className={styles.panelTopRight} />
                <div className={styles.panelBottom} />
                <div className={styles.fallbackTitle}>{series.title}</div>
              </div>
            </div>
          )}
          <div className={styles.formatTag}>{formatLabel}</div>
        </div>

        <div className={styles.info}>
          <div className={styles.metaRow}>
            <span className={styles.genreBadge}>{series.genre}</span>
            {episodeCountText && (
              <span className={styles.episodeCount}>{episodeCountText}</span>
            )}
          </div>

          <h3 className={styles.title}>{series.title}</h3>

          <p className={styles.creator}>
            By <span>{series.creator_name || "Creator"}</span>
          </p>

          {series.synopsis && (
            <p className={styles.synopsis}>{series.synopsis}</p>
          )}

          {showAction && (
            <div className={styles.actionRow}>
              <span className={styles.actionLink}>
                <span>View Series</span>
                <LuArrowRight size={14} className={styles.actionArrow} aria-hidden="true" />
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
