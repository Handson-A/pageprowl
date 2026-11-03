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
import { getPublicSeriesCatalog, SUPPORTED_GENRES } from "@/lib/data/series";
import { LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { ComicFormat } from "@/types/database";

interface BrowsePageProps {
  searchParams: {
    q?: string;
    genre?: string;
    format?: ComicFormat;
    sort?: "latest" | "updated" | "title_asc" | "title_desc";
    page?: string;
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const currentGenre = searchParams.genre || "All";
  const currentSearch = searchParams.q || "";
  const currentFormat = searchParams.format;
  const currentSort = searchParams.sort || "latest";
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const { items: seriesList, total, totalPages } = await getPublicSeriesCatalog({
    search: currentSearch,
    genre: currentGenre,
    format: currentFormat,
    sort: currentSort,
    page: currentPage,
    limit: 12,
  });

  const genreOptions = ["All", ...SUPPORTED_GENRES].map((g) => ({
    value: g,
    label: g,
    href: `/browse?genre=${encodeURIComponent(g)}${
      currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
    }${currentFormat ? `&format=${currentFormat}` : ""}${
      currentSort !== "latest" ? `&sort=${currentSort}` : ""
    }`,
  }));

  const activeFormatValue = currentFormat || "all";
  const formatOptions = [
    {
      value: "all",
      label: "All Formats",
      href: `/browse?genre=${encodeURIComponent(currentGenre)}${
        currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
      }${currentSort !== "latest" ? `&sort=${currentSort}` : ""}`,
    },
    {
      value: "scroll",
      label: "Vertical Scroll",
      href: `/browse?genre=${encodeURIComponent(currentGenre)}&format=scroll${
        currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
      }${currentSort !== "latest" ? `&sort=${currentSort}` : ""}`,
    },
    {
      value: "page",
      label: "Page-by-Page",
      href: `/browse?genre=${encodeURIComponent(currentGenre)}&format=page${
        currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
      }${currentSort !== "latest" ? `&sort=${currentSort}` : ""}`,
    },
  ];

  const sortOptions = [
    {
      value: "latest",
      label: "Newest",
      href: `/browse?sort=latest${
        currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
      }${currentGenre !== "All" ? `&genre=${encodeURIComponent(currentGenre)}` : ""}${
        currentFormat ? `&format=${currentFormat}` : ""
      }`,
    },
    {
      value: "updated",
      label: "Recently Updated",
      href: `/browse?sort=updated${
        currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
      }${currentGenre !== "All" ? `&genre=${encodeURIComponent(currentGenre)}` : ""}${
        currentFormat ? `&format=${currentFormat}` : ""
      }`,
    },
    {
      value: "title_asc",
      label: "Title A-Z",
      href: `/browse?sort=title_asc${
        currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
      }${currentGenre !== "All" ? `&genre=${encodeURIComponent(currentGenre)}` : ""}${
        currentFormat ? `&format=${currentFormat}` : ""
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
            {currentSort !== "latest" && (
              <input type="hidden" name="sort" value={currentSort} />
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
              wrap={true}
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
              wrap={true}
            />
          </div>

          {/* Tertiary Sorting Filter */}
          <div className={styles.filterGroup}>
            <div className={styles.filterHeader}>
              <span className={styles.filterLabel}>Sort</span>
            </div>
            <SegmentedControl
              options={sortOptions}
              value={currentSort}
              variant="pill"
              size="sm"
              layoutId="browseSortIndicator"
              ariaLabel="Sort Order Selection"
              wrap={true}
            />
          </div>
        </div>

        {seriesList.length > 0 ? (
          <>
            <MotionReveal delay={0.1}>
              <div className={styles.grid}>
                {seriesList.map((series) => (
                  <SeriesCard key={series.id} series={series} />
                ))}
              </div>
            </MotionReveal>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Link
                  href={`/browse?page=${currentPage - 1}${
                    currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
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
                  Page {currentPage} of {totalPages} ({total} series)
                </span>

                <Link
                  href={`/browse?page=${currentPage + 1}${
                    currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""
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
          </>
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
