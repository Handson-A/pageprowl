import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { SeriesCard } from "@/components/ui/SeriesCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublicCreatorProfile } from "@/lib/data/profiles";
import {
  LuUser,
  LuGlobe,
  LuSparkles,
  LuBookOpen,
  LuExternalLink,
  LuLayers,
} from "react-icons/lu";

interface CreatorPageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({
  params,
}: CreatorPageProps): Promise<Metadata> {
  const profile = await getPublicCreatorProfile(params.username);

  if (!profile) {
    return {
      title: "Creator Profile | PageProwl",
    };
  }

  const name = profile.penName || profile.displayName;
  return {
    title: `${name} (@${profile.username}) - Comic Creator | PageProwl`,
    description:
      profile.bio ||
      `Discover published comic series by ${name} (@${profile.username}) on PageProwl.`,
  };
}

export default async function CreatorProfilePage({ params }: CreatorPageProps) {
  const creator = await getPublicCreatorProfile(params.username);

  if (!creator) {
    notFound();
  }

  const primaryName = creator.penName || creator.displayName;
  const hasSeries = creator.series.length > 0;
  const hasContributions = creator.contributions.length > 0;

  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        {/* Creator Identity Hero */}
        <section className={styles.heroSection} aria-label="Creator Profile">
          <div className={styles.heroInner}>
            <div className={styles.avatarWrapper}>
              {creator.avatarUrl ? (
                <img
                  src={creator.avatarUrl}
                  alt={primaryName}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarFallback} aria-label="Creator avatar placeholder">
                  <span className={styles.avatarLetter}>
                    {primaryName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.profileMeta}>
              <div className={styles.titleRow}>
                <h1 className={styles.displayName}>{primaryName}</h1>
                <div className={styles.badgeGroup}>
                  <span className={styles.creatorBadge}>
                    <LuSparkles size={12} aria-hidden="true" />
                    <span>Independent Creator</span>
                  </span>
                </div>
              </div>

              <span className={styles.username}>@{creator.username}</span>

              {creator.penName && creator.displayName !== creator.penName && (
                <span className={styles.realNameHint}>
                  Real name / Studio name: {creator.displayName}
                </span>
              )}

              {creator.bio && <p className={styles.bio}>{creator.bio}</p>}

              {/* Website and Social Links */}
              <div className={styles.linksRow}>
                {creator.websiteUrl && (
                  <a
                    href={creator.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    <LuGlobe size={14} aria-hidden="true" />
                    <span>Website</span>
                    <LuExternalLink size={12} aria-hidden="true" />
                  </a>
                )}

                {Object.entries(creator.socialLinks).map(([platform, url]) => {
                  if (!url || typeof url !== "string") return null;
                  return (
                    <a
                      key={platform}
                      href={url.startsWith("http") ? url : `https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <span>{platform}</span>
                      <LuExternalLink size={12} aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Published Series Portfolio */}
        <section className={styles.portfolioSection} aria-label="Published Comic Series">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Portfolio</span>
              <h2 className={styles.sectionTitle}>
                Published Series ({creator.series.length})
              </h2>
            </div>
          </div>

          {hasSeries ? (
            <div className={styles.grid}>
              {creator.series.map((series) => (
                <SeriesCard key={series.id} series={series} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<LuBookOpen size={40} color="var(--color-primary)" />}
              title="No published series yet"
              description={`${primaryName} is currently preparing comic projects. Check back soon for new releases!`}
            />
          )}
        </section>

        {/* Creative Contributions Section if any */}
        {hasContributions && (
          <section className={styles.contributionsSection} aria-label="Collaborative Credits">
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Teamwork</span>
                <h2 className={styles.sectionTitle}>
                  Collaborative Credits ({creator.contributions.length})
                </h2>
              </div>
            </div>

            <div className={styles.grid}>
              {creator.contributions.map((item, idx) => (
                <div key={`${item.series.id}-${idx}`} className={styles.creditCardWrapper}>
                  <div className={styles.creditRoleBadge}>
                    <span>Role: {item.roleCategory}</span>
                  </div>
                  <SeriesCard series={item.series} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <PublicFooter />
      <BottomNav />
    </div>
  );
}
