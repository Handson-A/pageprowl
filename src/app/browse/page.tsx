import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { SeriesCard } from "@/components/ui/SeriesCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { getPublicSeriesList } from "@/lib/data/series";
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
            <input
              type="search"
              name="q"
              defaultValue={currentSearch}
              placeholder="Search by series title..."
              className={styles.searchInput}
            />
            {currentGenre !== "All" && (
              <input type="hidden" name="genre" value={currentGenre} />
            )}
            {currentFormat && (
              <input type="hidden" name="format" value={currentFormat} />
            )}
            <Button type="submit" variant="primary" size="sm">
              Search
            </Button>
          </form>

          <div className={styles.chipRow}>
            <span className={styles.filterLabel}>Genre:</span>
            {GENRES.map((g) => {
              const isActive = currentGenre === g;
              const href = `/browse?genre=${encodeURIComponent(g)}${
                currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
              }${currentFormat ? `&format=${currentFormat}` : ""}`;

              return (
                <Link
                  key={g}
                  href={href}
                  className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
                >
                  {g}
                </Link>
              );
            })}
          </div>

          <div className={styles.chipRow}>
            <span className={styles.filterLabel}>Format:</span>
            <Link
              href={`/browse?genre=${encodeURIComponent(currentGenre)}${
                currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
              }`}
              className={`${styles.chip} ${!currentFormat ? styles.chipActive : ""}`}
            >
              All Formats
            </Link>
            <Link
              href={`/browse?genre=${encodeURIComponent(currentGenre)}&format=scroll${
                currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
              }`}
              className={`${styles.chip} ${
                currentFormat === "scroll" ? styles.chipActive : ""
              }`}
            >
              Vertical Scroll
            </Link>
            <Link
              href={`/browse?genre=${encodeURIComponent(currentGenre)}&format=page${
                currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
              }`}
              className={`${styles.chip} ${
                currentFormat === "page" ? styles.chipActive : ""
              }`}
            >
              Page-by-Page
            </Link>
          </div>
        </div>

        {seriesList.length > 0 ? (
          <div className={styles.grid}>
            {seriesList.map((series) => (
              <SeriesCard key={series.id} series={series} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="No matching comics found"
            description="Try adjusting your search terms or filters to find published titles."
            action={
              <Link href="/browse">
                <Button variant="secondary">Reset Filters</Button>
              </Link>
            }
          />
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
