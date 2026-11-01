import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { MotionReveal } from "@/components/ui/MotionReveal";
import {
  SUPPORTED_GENRES,
  GENRE_METADATA,
  genreToSlug,
  getGenreCounts,
} from "@/lib/data/series";
import { LuArrowRight, LuSparkles, LuCompass } from "react-icons/lu";

export const metadata: Metadata = {
  title: "Comic Genres Directory | PageProwl",
  description:
    "Explore independent comics across all categories: Action, Fantasy, Sci-Fi, Romance, Horror, Comedy, Drama, Slice of Life, Mystery, and Supernatural.",
};

export default async function GenresIndexPage() {
  const counts = await getGenreCounts();

  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <LuCompass size={14} aria-hidden="true" />
            <span>Categories &amp; Themes</span>
          </div>
          <h1 className={styles.title}>Explore Comic Genres</h1>
          <p className={styles.subtitle}>
            From high-stakes sci-fi adventures to heartwarming slice-of-life moments,
            find original stories crafted by independent creators and studios.
          </p>
        </div>

        <MotionReveal delay={0.1}>
          <div className={styles.genreGrid}>
            {SUPPORTED_GENRES.map((genre) => {
              const meta = GENRE_METADATA[genre];
              const count = counts[genre] || 0;
              const slug = genreToSlug(genre);

              return (
                <Link
                  key={genre}
                  href={`/genres/${slug}`}
                  className={styles.genreCard}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.genreName}>{genre}</span>
                    <span className={styles.countBadge}>
                      {count} {count === 1 ? "series" : "series"}
                    </span>
                  </div>

                  <p className={styles.tagline}>{meta.tagline}</p>
                  <p className={styles.description}>{meta.description}</p>

                  <div className={styles.cardBottom}>
                    <span className={styles.exploreLink}>
                      <span>Browse {genre}</span>
                      <LuArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </MotionReveal>
      </main>

      <PublicFooter />
      <BottomNav />
    </div>
  );
}
