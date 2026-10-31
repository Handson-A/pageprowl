import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";
import { SeriesCard } from "@/components/ui/SeriesCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { HomeHero } from "@/components/home/HomeHero";
import { getFeaturedSeries, getPublicSeriesList } from "@/lib/data/series";
import { LuBookOpen, LuArrowRight } from "react-icons/lu";

export default async function HomePage() {
  const [featuredSeries, recentSeries] = await Promise.all([
    getFeaturedSeries(),
    getPublicSeriesList({}),
  ]);

  return (
    <div className={styles.page}>
      <PublicHeader />

      <HomeHero />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Stories</h2>
          <Link href="/browse" className={styles.sectionLink}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span>View All</span>
              <LuArrowRight size={16} aria-hidden="true" />
            </span>
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
            icon={<LuBookOpen size={44} color="var(--color-text-muted)" />}
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
