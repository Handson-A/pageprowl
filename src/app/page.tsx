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
import { ContinueReadingShelf } from "@/components/home/ContinueReadingShelf";
import { MotionReveal } from "@/components/ui/MotionReveal";
import {
  getFeaturedSeries,
  getRecentlyUpdatedSeries,
  getNewlyPublishedSeries,
  SUPPORTED_GENRES,
  genreToSlug,
} from "@/lib/data/series";
import { getFeaturedCreators } from "@/lib/data/profiles";
import {
  LuBookOpen,
  LuArrowRight,
  LuSparkles,
  LuClock,
  LuCompass,
  LuUsers,
} from "react-icons/lu";

export default async function HomePage() {
  const [featuredSeries, recentUpdates, newReleases, featuredCreators] =
    await Promise.all([
      getFeaturedSeries(3),
      getRecentlyUpdatedSeries(4),
      getNewlyPublishedSeries(4),
      getFeaturedCreators(6),
    ]);

  const hasAnyComics =
    featuredSeries.length > 0 ||
    recentUpdates.length > 0 ||
    newReleases.length > 0;

  return (
    <div className={styles.page}>
      <PublicHeader />

      <main className={styles.mainContent}>
        <HomeHero />

        {/* 1. Continue Reading shelf (client-side localStorage) */}
        <ContinueReadingShelf />

        {/* 2. Curated Spotlight / Featured Stories Section */}
        <section className={styles.section} aria-label="Featured Series">
          <div className={styles.sectionInner}>
            <MotionReveal delay={0.05}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.eyebrow}>Curated Spotlight</span>
                  <h2 className={styles.sectionTitle}>Featured Comics</h2>
                </div>
                <Link href="/discover" className={styles.viewAllLink}>
                  <span>Explore catalog</span>
                  <LuArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </MotionReveal>

            {hasAnyComics ? (
              <MotionReveal delay={0.1}>
                <div className={styles.featuredTrack}>
                  {(featuredSeries.length > 0 ? featuredSeries : recentUpdates)
                    .slice(0, 3)
                    .map((s) => (
                      <div key={s.id} className={styles.featuredCardSlot}>
                        <SeriesCard
                          series={s}
                          aspectRatio="cinematic"
                          variant="featured"
                        />
                      </div>
                    ))}
                </div>
              </MotionReveal>
            ) : (
              <EmptyState
                icon={<LuBookOpen size={44} color="var(--color-primary)" />}
                title="The comic catalog is just beginning"
                description="No published series are available yet. Be among the first independent comic creators to publish and showcase your stories on PageProwl!"
                action={
                  <Link href="/studio">
                    <Button variant="primary">
                      <span>Go to Creator Studio</span>
                    </Button>
                  </Link>
                }
              />
            )}
          </div>
        </section>

        {/* 3. Browse by Genre Shelf (Soft Organic Parchment Layer) */}
        <section className={styles.genreSection} aria-label="Browse by Genre">
          <div className={styles.genreTopCurve} aria-hidden="true">
            <svg
              viewBox="0 0 1440 20"
              fill="none"
              preserveAspectRatio="none"
              className={styles.genreCurveSvg}
            >
              <path
                d="M0,20 C360,2 1080,2 1440,20 L1440,0 L0,0 Z"
                fill="var(--color-bg)"
              />
            </svg>
          </div>

          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.eyebrow}>Genres &amp; Themes</span>
                <h2 className={styles.sectionTitle}>Find Your Vibe</h2>
              </div>
              <Link href="/genres" className={styles.viewAllLink}>
                <span>All genres</span>
                <LuArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className={styles.genrePills}>
              {SUPPORTED_GENRES.map((genre) => (
                <Link
                  key={genre}
                  href={`/genres/${genreToSlug(genre)}`}
                  className={styles.genrePill}
                >
                  <LuCompass size={14} className={styles.genreIcon} aria-hidden="true" />
                  <span>{genre}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.genreBottomCurve} aria-hidden="true">
            <svg
              viewBox="0 0 1440 20"
              fill="none"
              preserveAspectRatio="none"
              className={styles.genreCurveSvg}
            >
              <path
                d="M0,0 C360,18 1080,18 1440,0 L1440,20 L0,20 Z"
                fill="var(--color-bg)"
              />
            </svg>
          </div>
        </section>

        {/* 4. Recently Updated Series Section */}
        {recentUpdates.length > 0 && (
          <section className={styles.section} aria-label="Recently Updated Comics">
            <div className={styles.sectionInner}>
              <MotionReveal delay={0.05}>
                <div className={styles.sectionHeader}>
                  <div className={styles.titleWithIcon}>
                    <LuClock size={18} className={styles.sectionIcon} aria-hidden="true" />
                    <div>
                      <span className={styles.eyebrow}>Active Serials</span>
                      <h2 className={styles.sectionTitle}>Recently Updated</h2>
                    </div>
                  </div>
                  <Link href="/discover?sort=updated" className={styles.viewAllLink}>
                    <span>View all updates</span>
                    <LuArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.1}>
                <div className={styles.twoColumnGrid}>
                  {recentUpdates.slice(0, 4).map((s) => (
                    <SeriesCard
                      key={s.id}
                      series={s}
                      aspectRatio="portrait"
                      variant="compact"
                    />
                  ))}
                </div>
              </MotionReveal>
            </div>
          </section>
        )}

        {/* 5. Newly Published Releases Section */}
        {newReleases.length > 0 && (
          <section className={styles.section} aria-label="New Comic Releases">
            <div className={styles.sectionInner}>
              <MotionReveal delay={0.05}>
                <div className={styles.sectionHeader}>
                  <div className={styles.titleWithIcon}>
                    <LuSparkles size={18} className={styles.sectionIcon} aria-hidden="true" />
                    <div>
                      <span className={styles.eyebrow}>Fresh Releases</span>
                      <h2 className={styles.sectionTitle}>New on PageProwl</h2>
                    </div>
                  </div>
                  <Link href="/discover?sort=latest" className={styles.viewAllLink}>
                    <span>View all releases</span>
                    <LuArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.1}>
                <div className={styles.twoColumnGrid}>
                  {newReleases.slice(0, 4).map((s) => (
                    <SeriesCard
                      key={s.id}
                      series={s}
                      aspectRatio="portrait"
                      variant="compact"
                    />
                  ))}
                </div>
              </MotionReveal>
            </div>
          </section>
        )}

        {/* 6. Spotlight on Independent Creators */}
        {featuredCreators.length > 0 && (
          <section className={styles.creatorsSection} aria-label="Independent Creators">
            <div className={styles.sectionInner}>
              <div className={styles.sectionHeader}>
                <div className={styles.titleWithIcon}>
                  <LuUsers size={18} className={styles.sectionIcon} aria-hidden="true" />
                  <div>
                    <span className={styles.eyebrow}>Community</span>
                    <h2 className={styles.sectionTitle}>Independent Creators</h2>
                  </div>
                </div>
              </div>

              <div className={styles.creatorsTrack}>
                {featuredCreators.map((creator) => (
                  <Link
                    key={creator.id}
                    href={`/creators/${creator.username}`}
                    className={styles.creatorCard}
                  >
                    <div className={styles.creatorAvatarWrapper}>
                      {creator.avatarUrl ? (
                        <img
                          src={creator.avatarUrl}
                          alt={creator.displayName}
                          className={styles.creatorAvatar}
                        />
                      ) : (
                        <div className={styles.creatorAvatarFallback}>
                          <span>{creator.displayName.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.creatorInfo}>
                      <span className={styles.creatorName}>{creator.displayName}</span>
                      <span className={styles.creatorHandle}>@{creator.username}</span>
                      <span className={styles.creatorCount}>
                        {creator.publishedSeriesCount}{" "}
                        {creator.publishedSeriesCount === 1 ? "series" : "series"} published
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. Creator Studio Invitation Banner */}
        <section className={styles.bannerSection}>
          <div className={styles.sectionInner}>
            <MotionReveal delay={0.1}>
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
            </MotionReveal>
          </div>
        </section>
      </main>

      <PublicFooter />
      <BottomNav />
    </div>
  );
}
