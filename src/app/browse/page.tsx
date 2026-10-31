import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { SeriesCard } from "@/components/ui/SeriesCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { getPublicSeriesList } from "@/lib/data/series";
import { LuSearch } from "react-icons/lu";
import type { ComicFormat } from "@/types/database";

const GENRES = ["All", "Action", "Fantasy", "Sci-Fi", "Romance", "Horror", "Comedy", "Drama"];

interface BrowsePageProps {
  searchParams: {
    q?: string;
    genre?: string;
    format?: ComicFormat;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const currentGenre = searchParams.genre || "All";
  const currentSearch = searchParams.q || "";
  const currentFormat = searchParams.format;

  const seriesList = await getPublicSeriesList({
    search: currentSearch,
    genre: currentGenre,
    format: currentFormat,
  });

  const genreOptions = GENRES.map((g) => ({
    value: g,
    label: g,
    href: `/browse?genre=${encodeURIComponent(g)}${
      currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
    }${currentFormat ? `&format=${currentFormat}` : ""}`,
  }));

  const activeFormatValue = currentFormat || "all";
  const formatOptions = [
    {
      value: "all",
      label: "All Formats",
      href: `/browse?genre=${encodeURIComponent(currentGenre)}${
        currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
      }`,
    },
    {
      value: "scroll",
      label: "Vertical Scroll",
      href: `/browse?genre=${encodeURIComponent(currentGenre)}&format=scroll${
        currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
      }`,
    },
    {
      value: "page",
      label: "Page-by-Page",
      href: `/browse?genre=${encodeURIComponent(currentGenre)}&format=page${
        currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
      }`,
    },
  ];

  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Browse Comics</h1>
          <p className={styles.subtitle}>
            Discover original creator-published comic series across all genres and reading formats.
          </p>
        </div>

        <div className={styles.filterBar}>
          <form method="GET" action="/browse" className={styles.searchForm}>
            <div className={styles.searchInputWrapper}>
              <LuSearch size={18} className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                name="q"
                defaultValue={currentSearch}
                placeholder="Search comic series by title or theme..."
                className={styles.searchInput}
              />
            </div>
            {currentGenre !== "All" && (
              <input type="hidden" name="genre" value={currentGenre} />
            )}
            {currentFormat && (
              <input type="hidden" name="format" value={currentFormat} />
            )}
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </form>

          {/* Primary Top-level Categories: The Segmented Control / Tabs Hybrid */}
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader}>
              <span className={styles.filterLabel}>Category</span>
            </div>
            <SegmentedControl
              options={genreOptions}
              value={currentGenre}
              variant="pill"
              size="md"
              layoutId="browseGenreIndicator"
              ariaLabel="Comic Genre Selection"
            />
          </div>

          {/* Secondary Reading Format Filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader}>
              <span className={styles.filterLabel}>Format</span>
            </div>
            <SegmentedControl
              options={formatOptions}
              value={activeFormatValue}
              variant="pill"
              size="sm"
              layoutId="browseFormatIndicator"
              ariaLabel="Reading Format Selection"
            />
          </div>
        </div>

        {seriesList.length > 0 ? (
          <MotionReveal delay={0.1}>
            <div className={styles.grid}>
              {seriesList.map((series) => (
                <SeriesCard key={series.id} series={series} />
              ))}
            </div>
          </MotionReveal>
        ) : currentSearch.trim() || currentGenre !== "All" || currentFormat ? (
          <EmptyState
            icon={<LuSearch size={40} color="var(--color-primary)" />}
            title="No matching comics found"
            description={
              currentSearch.trim()
                ? `No titles found matching "${currentSearch.trim()}". Check your spelling, try fewer keywords, or reset your filters.`
                : `No comics found matching category "${currentGenre}" with the selected reading format.`
            }
            action={
              <Link href="/browse">
                <Button variant="secondary">Clear All Filters</Button>
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon={<LuSearch size={40} color="var(--color-text-muted)" />}
            title="The comic catalog is currently empty"
            description="Independent creators and creative teams are currently crafting their series. Be among the first to publish on Panelverse!"
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
