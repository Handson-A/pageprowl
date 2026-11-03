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
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { MotionReveal } from "@/components/ui/MotionReveal";
import {
  slugToGenre,
  GENRE_METADATA,
  getPublicSeriesCatalog,
} from "@/lib/data/series";
import type { ComicFormat } from "@/types/database";
import { LuBookOpen, LuChevronLeft, LuChevronRight, LuCompass } from "react-icons/lu";

interface GenrePageProps {
  params: {
    slug: string;
  };
  searchParams: {
    format?: ComicFormat;
    sort?: "latest" | "updated" | "title_asc" | "title_desc";
    page?: string;
  };
}

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const genre = slugToGenre(params.slug);
  if (!genre) {
    return {
      title: "Genre Not Found | PageProwl",
    };
  }

  const meta = GENRE_METADATA[genre];
  return {
    title: `${genre} Comics & Webtoons | PageProwl`,
    description: meta.description,
  };
}

export default async function GenreComicsPage({
  params,
  searchParams,
}: GenrePageProps) {
  const genre = slugToGenre(params.slug);

  if (!genre) {
    notFound();
  }

  const meta = GENRE_METADATA[genre];
  const currentFormat = searchParams.format;
  const currentSort = searchParams.sort || "latest";
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const { items, total, totalPages } = await getPublicSeriesCatalog({
    genre,
    format: currentFormat,
    sort: currentSort,
    page: currentPage,
    limit: 12,
  });

  const activeFormatValue = currentFormat || "all";
  const formatOptions = [
    {
      value: "all",
      label: "All Formats",
      href: `/genres/${params.slug}?sort=${currentSort}`,
    },
    {
      value: "scroll",
      label: "Vertical Scroll",
      href: `/genres/${params.slug}?format=scroll&sort=${currentSort}`,
    },
    {
      value: "page",
      label: "Page-by-Page",
      href: `/genres/${params.slug}?format=page&sort=${currentSort}`,
    },
  ];

  return (
    <div className={styles.container}>
      <PublicHeader />

      <main className={styles.content}>
        <div className={styles.header}>
          <div className={styles.breadcrumbs}>
            <Link href="/genres" className={styles.breadcrumbLink}>
              Genres
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{genre}</span>
          </div>

          <h1 className={styles.title}>{genre} Comics</h1>
          <p className={styles.tagline}>{meta.tagline}</p>
          <p className={styles.description}>{meta.description}</p>
        </div>

        {/* Filter and sorting toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Format</span>
            <SegmentedControl
              options={formatOptions}
              value={activeFormatValue}
              variant="pill"
              size="sm"
              layoutId="genreFormatIndicator"
              ariaLabel="Comic Reading Format"
              wrap={true}
            />
          </div>

          <div className={styles.sortGroup}>
            <span className={styles.filterLabel}>Sort</span>
            <div className={styles.sortLinks}>
              <Link
                href={`/genres/${params.slug}?${
                  currentFormat ? `format=${currentFormat}&` : ""
                }sort=latest`}
                className={`${styles.sortBtn} ${
                  currentSort === "latest" ? styles.sortBtnActive : ""
                }`}
              >
                Newest
              </Link>
              <Link
                href={`/genres/${params.slug}?${
                  currentFormat ? `format=${currentFormat}&` : ""
                }sort=updated`}
                className={`${styles.sortBtn} ${
                  currentSort === "updated" ? styles.sortBtnActive : ""
                }`}
              >
                Recently Updated
              </Link>
              <Link
                href={`/genres/${params.slug}?${
                  currentFormat ? `format=${currentFormat}&` : ""
                }sort=title_asc`}
                className={`${styles.sortBtn} ${
                  currentSort === "title_asc" ? styles.sortBtnActive : ""
                }`}
              >
                Title A-Z
              </Link>
            </div>
          </div>
        </div>

        {/* Catalog results */}
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
                  href={`/genres/${params.slug}?page=${currentPage - 1}${
                    currentFormat ? `&format=${currentFormat}` : ""
                  }${currentSort ? `&sort=${currentSort}` : ""}`}
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
                  href={`/genres/${params.slug}?page=${currentPage + 1}${
                    currentFormat ? `&format=${currentFormat}` : ""
                  }${currentSort ? `&sort=${currentSort}` : ""}`}
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
        ) : (
          <EmptyState
            icon={<LuBookOpen size={40} color="var(--color-primary)" />}
            title={`No ${genre} comics published yet`}
            description={
              currentFormat
                ? `No published ${genre} comics match the "${currentFormat}" format. Try selecting all formats or explore other categories.`
                : `Creators have not published any ${genre} series yet. Explore other genres or be the first to publish a ${genre} comic!`
            }
            action={
              <Link href="/genres">
                <Button variant="secondary">Explore All Genres</Button>
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
