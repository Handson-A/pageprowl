import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";
import { SeriesCard } from "@/components/ui/SeriesCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getFeaturedSeries, getPublicSeriesList } from "@/lib/data/series";

export default async function HomePage() {
  const [featuredSeries, recentSeries] = await Promise.all([
    getFeaturedSeries(),
    getPublicSeriesList({}),
  ]);

  return (
    <div className={styles.page}>
      <PublicHeader />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>
            <span>⚡</span>
            <span>A Publishing Platform for Comic Creators</span>
          </div>

          <h1 className={styles.heroTitle}>
            Where great stories are created, collaborated on, and published.
          </h1>

          <p className={styles.heroLead}>
            Panelverse brings together independent creators, studios, and passionate
            readers. Enjoy vertical-scroll and page-by-page comics straight from
            the creators.
          </p>

          <div className={styles.heroActions}>
            <Link href="/browse">
              <Button variant="primary" size="lg">
                Explore Comics
              </Button>
            </Link>
            <Link href="/studio">
              <Button variant="secondary" size="lg">
                Creator Studio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Stories</h2>
          <Link href="/browse" className={styles.sectionLink}>
            View All &rarr;
          </Link>
        </div>

        {featuredSeries.length > 0 ? (
          <div className={styles.grid}>
            {featuredSeries.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        ) : recentSeries.length > 0 ? (
          <div className={styles.grid}>
            {recentSeries.slice(0, 4).map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📚"
            title="The catalog is just beginning"
            description="No published series are available yet. Be among the first independent creators to publish on Panelverse!"
            action={
              <Link href="/studio">
                <Button variant="primary">Go to Creator Studio</Button>
              </Link>
            }
          />
        )}

        <div className={styles.creatorBanner}>
          <div className={styles.creatorText}>
            <h3 className={styles.creatorTitle}>Are you a comic creator or studio?</h3>
            <p className={styles.creatorDesc}>
              Organize your creative team, assemble chapters with batch artwork uploads,
              manage revisions, and publish with complete creative ownership.
            </p>
          </div>
          <Link href="/studio">
            <Button variant="accent" size="lg">
              Start Publishing
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
