import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { SeriesCard } from "@/components/ui/SeriesCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { getPublicSeriesCatalog, SUPPORTED_GENRES } from "@/lib/data/series";
import type { ComicFormat } from "@/types/database";
import {
  LuCompass,
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuSparkles,
} from "react-icons/lu";

export const metadata: Metadata = {
  title: "Discover Independent Comics | PageProwl",
  description:
    "Discover original comic series and webtoons across genres and reading formats, published directly by indie creators and studios.",
};

interface DiscoverPageProps {
  searchParams: {
    genre?: string;
    format?: ComicFormat;
    sort?: "latest" | "updated" | "title_asc" | "title_desc";
    page?: string;
  };
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const currentGenre = searchParams.genre || "All";
  const currentFormat = searchParams.format;
  const currentSort = searchParams.sort || "latest";
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const { items, total, totalPages } = await getPublicSeriesCatalog({
    genre: currentGenre,
    format: currentFormat,
    sort: currentSort,
    page: currentPage,
    limit: 12,
  });

  const genreOptions = ["All", ...SUPPORTED_GENRES].map((g) => ({
    value: g,
    label: g,
    href: `/discover?genre=${encodeURIComponent(g)}${
      currentFormat ? `&format=${currentFormat}` : ""
    }${currentSort !== "latest" ? `&sort=${currentSort}` : ""}`,
  }));

  const activeFormatValue = currentFormat || "all";
  const formatOptions = [
    {
      value: "all",
      label: "All Formats",
      href: `/discover?genre=${encodeURIComponent(currentGenre)}${
        currentSort !== "latest" ? `&sort=${currentSort}` : ""
      }`,
    },
    {
      value: "scroll",
      label: "Vertical Scroll",
      href: `/discover?genre=${encodeURIComponent(currentGenre)}&format=scroll${
        currentSort !== "latest" ? `&sort=${currentSort}` : ""
      }`,
    },
    {
      value: "page",
      label: "Page-by-Page",
      href: `/discover?genre=${encodeURIComponent(currentGenre)}&format=page${
        currentSort !== "latest" ? `&sort=${currentSort}` : ""
      }`,
    },
  ];

  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        <div className={styles.heroBanner}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <LuSparkles size={14} aria-hidden="true" />
              <span>Catalog Discovery</span>
            </div>
            <h1 className={styles.title}>Discover Original Comics</h1>
            <p className={styles.subtitle}>
              Explore fresh storylines, breathtaking art styles, and serialized releases
              from indie creators around the world.
            </p>
          </div>

          <div className={styles.searchShortcut}>
            <Link href="/search" className={styles.searchShortcutBtn}>
              <LuSearch size={18} aria-hidden="true" />
              <span>Search comics by title or creator...</span>
            </Link>
          </div>
        </div>

        {/* Discovery Filter Controls */}
        <div className={styles.controlsBar}>
          <div className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <span className={styles.filterLabel}>Genre</span>
            </div>
            <SegmentedControl
              options={genreOptions}
              value={currentGenre}
              variant="pill"
              size="md"
              layoutId="discoverGenreIndicator"
              ariaLabel="Comic Genre Selection"
              wrap={true}
            />
          </div>

          <div className={styles.secondaryControls}>
            <div className={styles.formatControl}>
              <span className={styles.filterLabel}>Format</span>
              <SegmentedControl
                options={formatOptions}
                value={activeFormatValue}
                variant="pill"
                size="sm"
                layoutId="discoverFormatIndicator"
                ariaLabel="Reading Format Selection"
                wrap={true}
              />
            </div>

            <div className={styles.sortControl}>
              <span className={styles.filterLabel}>Sort</span>
              <div className={styles.sortLinks}>
                <Link
                  href={`/discover?genre=${encodeURIComponent(currentGenre)}${
                    currentFormat ? `&format=${currentFormat}` : ""
                  }&sort=latest`}
                  className={`${styles.sortBtn} ${
                    currentSort === "latest" ? styles.sortBtnActive : ""
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href={`/discover?genre=${encodeURIComponent(currentGenre)}${
                    currentFormat ? `&format=${currentFormat}` : ""
                  }&sort=updated`}
                  className={`${styles.sortBtn} ${
                    currentSort === "updated" ? styles.sortBtnActive : ""
                  }`}
                >
                  Updated
                </Link>
                <Link
                  href={`/discover?genre=${encodeURIComponent(currentGenre)}${
                    currentFormat ? `&format=${currentFormat}` : ""
                  }&sort=title_asc`}
                  className={`${styles.sortBtn} ${
                    currentSort === "title_asc" ? styles.sortBtnActive : ""
                  }`}
                >
                  A-Z
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Results grid */}
        {items.length > 0 ? (
          <>
            <MotionReveal delay={0.1}>
              <div className={styles.grid}>
                {items.map((series) => (
                  <SeriesCard key={series.id} series={series} />
                ))}
              </div>
            </MotionReveal>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Link
                  href={`/discover?page=${currentPage - 1}${
                    currentGenre !== "All" ? `&genre=${encodeURIComponent(currentGenre)}` : ""
                  }${currentFormat ? `&format=${currentFormat}` : ""}${
                    currentSort !== "latest" ? `&sort=${currentSort}` : ""
                  }`}
                  aria-disabled={currentPage <= 1}
                  tabIndex={currentPage <= 1 ? -1 : undefined}
                >
                  <Button variant="secondary" size="sm" disabled={currentPage <= 1}>
                    <LuChevronLeft size={16} aria-hidden="true" />
                    <span>Previous</span>
                  </Button>
                </Link>

                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages} ({total} series)
                </span>

                <Link
                  href={`/discover?page=${currentPage + 1}${
                    currentGenre !== "All" ? `&genre=${encodeURIComponent(currentGenre)}` : ""
                  }${currentFormat ? `&format=${currentFormat}` : ""}${
                    currentSort !== "latest" ? `&sort=${currentSort}` : ""
                  }`}
                  aria-disabled={currentPage >= totalPages}
                  tabIndex={currentPage >= totalPages ? -1 : undefined}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage >= totalPages}
                  >
                    <span>Next</span>
                    <LuChevronRight size={16} aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : currentGenre !== "All" || currentFormat ? (
          <EmptyState
            icon={<LuCompass size={40} color="var(--color-primary)" />}
            title="No matching comics found"
            description={`No comics match category "${currentGenre}" with the selected format. Try exploring other categories.`}
            action={
              <Link href="/discover">
                <Button variant="secondary">Reset Filters</Button>
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon={<LuCompass size={40} color="var(--color-text-muted)" />}
            title="The comic catalog is currently empty"
            description="Independent creators and creative teams are currently crafting their series. Be among the first to publish on PageProwl!"
            action={
              <Link href="/studio">
                <Button variant="primary">Go to Creator Studio</Button>
              </Link>
            }
          />
        )}
      </main>

      <PublicFooter />
      <BottomNav />
    </div>
  );
}
