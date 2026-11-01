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
  LuSearch,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuBookOpen,
  LuFilter,
} from "react-icons/lu";

interface SearchPageProps {
  searchParams: {
    q?: string;
    genre?: string;
    format?: ComicFormat;
    sort?: "latest" | "updated" | "title_asc" | "title_desc";
    page?: string;
  };
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q?.trim();
  if (query) {
    return {
      title: `"${query}" - Search Results | PageProwl`,
      description: `Search results for "${query}" on PageProwl comic publishing platform.`,
    };
  }
  return {
    title: "Search Comics | PageProwl",
    description: "Search independent comics and webtoons by title, synopsis, or creator on PageProwl.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const currentQuery = searchParams.q?.trim() || "";
  const currentGenre = searchParams.genre || "All";
  const currentFormat = searchParams.format;
  const currentSort = searchParams.sort || "latest";
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const hasSearchCriteria = !!(
    currentQuery ||
    currentGenre !== "All" ||
    currentFormat
  );

  let searchResults = {
    items: [] as any[],
    total: 0,
    page: currentPage,
    limit: 12,
    totalPages: 0,
  };

  if (hasSearchCriteria) {
    searchResults = await getPublicSeriesCatalog({
      search: currentQuery,
      genre: currentGenre,
      format: currentFormat,
      sort: currentSort,
      page: currentPage,
      limit: 12,
    });
  }

  const { items, total, totalPages } = searchResults;

  // Build genre options
  const genreList = ["All", ...SUPPORTED_GENRES];
  const genreOptions = genreList.map((g) => ({
    value: g,
    label: g,
    href: `/search?genre=${encodeURIComponent(g)}${
      currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""
    }${currentFormat ? `&format=${currentFormat}` : ""}${
      currentSort !== "latest" ? `&sort=${currentSort}` : ""
    }`,
  }));

  const activeFormatValue = currentFormat || "all";
  const formatOptions = [
    {
      value: "all",
      label: "All Formats",
      href: `/search?genre=${encodeURIComponent(currentGenre)}${
        currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""
      }${currentSort !== "latest" ? `&sort=${currentSort}` : ""}`,
    },
    {
      value: "scroll",
      label: "Vertical Scroll",
      href: `/search?genre=${encodeURIComponent(currentGenre)}&format=scroll${
        currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""
      }${currentSort !== "latest" ? `&sort=${currentSort}` : ""}`,
    },
    {
      value: "page",
      label: "Page-by-Page",
      href: `/search?genre=${encodeURIComponent(currentGenre)}&format=page${
        currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""
      }${currentSort !== "latest" ? `&sort=${currentSort}` : ""}`,
    },
  ];

  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Search Comics</h1>
          <p className={styles.subtitle}>
            Find comics across PageProwl by series title, synopsis, or theme.
          </p>
        </div>

        {/* Search Bar Form */}
        <div className={styles.searchSection}>
          <form method="GET" action="/search" className={styles.searchForm}>
            <div className={styles.inputContainer}>
              <LuSearch size={20} className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                name="q"
                defaultValue={currentQuery}
                placeholder="Search by comic title, storyline, or keywords..."
                className={styles.searchInput}
                autoFocus={!currentQuery}
              />
              {currentQuery && (
                <Link
                  href="/search"
                  className={styles.clearBtn}
                  title="Clear search query"
                  aria-label="Clear search query"
                >
                  <LuX size={16} aria-hidden="true" />
                </Link>
              )}
            </div>

            {currentGenre !== "All" && (
              <input type="hidden" name="genre" value={currentGenre} />
            )}
            {currentFormat && (
              <input type="hidden" name="format" value={currentFormat} />
            )}
            {currentSort !== "latest" && (
              <input type="hidden" name="sort" value={currentSort} />
            )}

            <Button type="submit" variant="primary" size="md">
              <span>Search</span>
            </Button>
          </form>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Genre</span>
              <SegmentedControl
                options={genreOptions}
                value={currentGenre}
                variant="pill"
                size="sm"
                layoutId="searchGenreIndicator"
                ariaLabel="Genre Selection"
              />
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Format</span>
              <SegmentedControl
                options={formatOptions}
                value={activeFormatValue}
                variant="pill"
                size="sm"
                layoutId="searchFormatIndicator"
                ariaLabel="Reading Format Selection"
              />
            </div>
          </div>
        </div>

        {/* Search Results Display */}
        {!hasSearchCriteria ? (
          <div className={styles.initialState}>
            <EmptyState
              icon={<LuSearch size={44} color="var(--color-primary)" />}
              title="Explore the comic catalog"
              description="Enter a comic title, story concept, or keyword above, or select a genre filter to discover series."
              action={
                <Link href="/browse">
                  <Button variant="secondary">Browse All Comics</Button>
                </Link>
              }
            />
          </div>
        ) : items.length > 0 ? (
          <section className={styles.resultsSection} aria-label="Search Results">
            <div className={styles.resultsMeta}>
              <span className={styles.resultsCount}>
                Found {total} {total === 1 ? "comic series" : "comic series"}
                {currentQuery ? ` for "${currentQuery}"` : ""}
                {currentGenre !== "All" ? ` in ${currentGenre}` : ""}
              </span>

              <div className={styles.sortLinks}>
                <span className={styles.sortLabel}>Sort:</span>
                <Link
                  href={`/search?${currentQuery ? `q=${encodeURIComponent(currentQuery)}&` : ""}${
                    currentGenre !== "All" ? `genre=${encodeURIComponent(currentGenre)}&` : ""
                  }${currentFormat ? `format=${currentFormat}&` : ""}sort=latest`}
                  className={`${styles.sortBtn} ${
                    currentSort === "latest" ? styles.sortBtnActive : ""
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href={`/search?${currentQuery ? `q=${encodeURIComponent(currentQuery)}&` : ""}${
                    currentGenre !== "All" ? `genre=${encodeURIComponent(currentGenre)}&` : ""
                  }${currentFormat ? `format=${currentFormat}&` : ""}sort=updated`}
                  className={`${styles.sortBtn} ${
                    currentSort === "updated" ? styles.sortBtnActive : ""
                  }`}
                >
                  Recently Updated
                </Link>
                <Link
                  href={`/search?${currentQuery ? `q=${encodeURIComponent(currentQuery)}&` : ""}${
                    currentGenre !== "All" ? `genre=${encodeURIComponent(currentGenre)}&` : ""
                  }${currentFormat ? `format=${currentFormat}&` : ""}sort=title_asc`}
                  className={`${styles.sortBtn} ${
                    currentSort === "title_asc" ? styles.sortBtnActive : ""
                  }`}
                >
                  A-Z
                </Link>
              </div>
            </div>

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
                  href={`/search?page=${currentPage - 1}${
                    currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""
                  }${currentGenre !== "All" ? `&genre=${encodeURIComponent(currentGenre)}` : ""}${
                    currentFormat ? `&format=${currentFormat}` : ""
                  }${currentSort !== "latest" ? `&sort=${currentSort}` : ""}`}
                  aria-disabled={currentPage <= 1}
                  tabIndex={currentPage <= 1 ? -1 : undefined}
                >
                  <Button variant="secondary" size="sm" disabled={currentPage <= 1}>
                    <LuChevronLeft size={16} aria-hidden="true" />
                    <span>Previous</span>
                  </Button>
                </Link>

                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>

                <Link
                  href={`/search?page=${currentPage + 1}${
                    currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""
                  }${currentGenre !== "All" ? `&genre=${encodeURIComponent(currentGenre)}` : ""}${
                    currentFormat ? `&format=${currentFormat}` : ""
                  }${currentSort !== "latest" ? `&sort=${currentSort}` : ""}`}
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
          </section>
        ) : (
          <EmptyState
            icon={<LuSearch size={40} color="var(--color-primary)" />}
            title="No matching comics found"
            description={
              currentQuery
                ? `No published titles or descriptions matched "${currentQuery}". Try checking your spelling or selecting fewer filters.`
                : `No comics matched the selected filters.`
            }
            action={
              <Link href="/search">
                <Button variant="secondary">Clear All Filters</Button>
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
