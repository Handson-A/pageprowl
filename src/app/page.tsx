import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/Button";
import { SeriesCard } from "@/components/ui/SeriesCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { HomeHero } from "@/components/home/HomeHero";
import { getFeaturedSeries, getPublicSeriesList } from "@/lib/data/series";
import { LuBookOpen, LuArrowRight, LuSparkles } from "react-icons/lu";

export default async function HomePage() {
  const [featuredSeries, recentSeries] = await Promise.all([
    getFeaturedSeries(),
    getPublicSeriesList({}),
  ]);

  const displayList = featuredSeries.length > 0 ? featuredSeries : recentSeries;

  return (
    <div className={styles.page}>
      <PublicHeader />

      <main className={styles.mainContent}>
        <HomeHero />

        {/* Featured Stories Section */}
        <section className={styles.featuredSection}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.eyebrow}>Curated Spotlight</span>
                <h2 className={styles.sectionTitle}>Featured Series</h2>
              </div>
              <Link href="/browse" className={styles.viewAllLink}>
                <span>View all</span>
                <LuArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            {displayList.length > 0 ? (
              <div className={styles.grid}>
                {displayList.slice(0, 6).map((s) => (
                  <SeriesCard key={s.id} series={s} aspectRatio="cinematic" />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<LuBookOpen size={44} color="var(--color-primary)" />}
                title="The comic catalog is just beginning"
                description="No published series are available yet. Be among the first independent comic creators to publish and showcase your stories on Panelverse!"
                action={
                  <Link href="/studio">
                    <Button variant="primary">
                      <span>Go to Creator Studio</span>
                    </Button>
                  </Link>
                }
              />
            )}

            {/* Creator Invitation Banner */}
            <div className={styles.creatorBanner}>
              <div className={styles.creatorContent}>
                <div className={styles.creatorBadge}>
                  <LuSparkles size={14} color="#F2C14E" aria-hidden="true" />
                  <span>Creator Studio</span>
                </div>
                <h3 className={styles.creatorTitle}>
                  Are you a comic creator, artist, or studio?
                </h3>
                <p className={styles.creatorDesc}>
                  Organize your creative team, assemble episodes with batch artwork uploads,
                  manage revisions, and publish with complete creative ownership.
                </p>
              </div>

              <div className={styles.creatorActions}>
                <Link href="/studio">
                  <Button variant="primary" size="lg">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>Start Publishing</span>
                      <LuArrowRight size={16} aria-hidden="true" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
      <BottomNav />
    </div>
  );
}
