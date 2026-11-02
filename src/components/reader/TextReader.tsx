"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "./TextReader.module.css";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  LuBookOpen,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuCircleCheck,
} from "react-icons/lu";

export interface TextReaderProps {
  textContent: string;
  seriesSlug: string;
  seriesTitle?: string;
  episodeTitle?: string;
  episodeNumber?: number;
  prevEpisodeSlug?: string | null;
  nextEpisodeSlug?: string | null;
  onTextClick?: () => void;
}

type ParsedBlock =
  | { type: "dialogue"; text: string; speaker?: string }
  | { type: "scene-heading"; text: string }
  | { type: "scene-break" }
  | { type: "prose"; text: string };

export function TextReader({
  textContent,
  seriesSlug,
  seriesTitle,
  episodeTitle,
  episodeNumber,
  prevEpisodeSlug,
  nextEpisodeSlug,
  onTextClick,
}: TextReaderProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Parse raw text narrative into structured semantic paragraphs
  const parsedBlocks = useMemo<ParsedBlock[]>(() => {
    if (!textContent || typeof textContent !== "string") return [];

    const rawParagraphs = textContent
      .split(/\r?\n\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    return rawParagraphs.map((para) => {
      // 1. Scene Break
      if (/^(\*\s*\*\s*\*|---|===|\*{3,}|_{3,})$/.test(para)) {
        return { type: "scene-break" };
      }

      // 2. Scene Heading (### Heading or [Scene: ...])
      if (/^(###|##|\[Scene|Scene\s+\d+:)/i.test(para)) {
        const cleanHeading = para.replace(/^(###\s*|##\s*|\[|\])/g, "").trim();
        return { type: "scene-heading", text: cleanHeading };
      }

      // 3. Character Dialogue (Starts with quote or Speaker: "...")
      const speakerDialogueMatch = para.match(/^([A-Z][A-Za-z0-9\s\-]+):\s*["“](.+)["”]$/);
      if (speakerDialogueMatch) {
        return {
          type: "dialogue",
          speaker: speakerDialogueMatch[1],
          text: `"${speakerDialogueMatch[2]}"`,
        };
      }

      if (/^["“'‘]/.test(para)) {
        return { type: "dialogue", text: para };
      }

      // 4. Default Narrative Prose
      return { type: "prose", text: para };
    });
  }, [textContent]);

  if (!textContent || parsedBlocks.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <EmptyState
          icon={<LuBookOpen size={48} color="#9CA3AF" />}
          title="No Story Published"
          description="This episode currently has no written story content published in this revision."
          action={
            <Link href={`/series/${seriesSlug}`} className={styles.primaryBtn}>
              <LuArrowLeft size={16} aria-hidden="true" />
              <span>Back to Series</span>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.textContainer} onClick={onTextClick}>
      <article className={styles.storyCanvas} role="region" aria-label="Episode Story Narrative">
        {/* Story Header */}
        <header className={styles.storyHeader}>
          {seriesTitle && (
            <Link href={`/series/${seriesSlug}`} className={styles.seriesBreadcrumb}>
              <LuArrowLeft size={14} aria-hidden="true" />
              <span>{seriesTitle}</span>
            </Link>
          )}
          {episodeNumber !== undefined && (
            <div className={styles.chapterNumber}>Chapter {episodeNumber}</div>
          )}
          <h1 className={styles.chapterTitle}>{episodeTitle || `Episode ${episodeNumber}`}</h1>
        </header>

        {/* Narrative Prose Blocks */}
        <div className={styles.storyBody}>
          {parsedBlocks.map((block, index) => {
            if (block.type === "scene-break") {
              return (
                <div key={index} className={styles.sceneBreak} aria-hidden="true">
                  <span>✦ ✦ ✦</span>
                </div>
              );
            }

            if (block.type === "scene-heading") {
              return (
                <h2 key={index} className={styles.sceneHeading}>
                  {block.text}
                </h2>
              );
            }

            if (block.type === "dialogue") {
              return (
                <p key={index} className={styles.dialogueParagraph}>
                  {block.speaker && (
                    <strong style={{ color: "var(--color-accent, #f2c14e)", marginRight: "8px" }}>
                      {block.speaker}:
                    </strong>
                  )}
                  {block.text}
                </p>
              );
            }

            return (
              <p key={index} className={styles.proseParagraph}>
                {block.text}
              </p>
            );
          })}
        </div>

        {/* End of Episode Card */}
        <footer className={styles.endOfEpisodeCard}>
          <div className={styles.completionBadge}>
            <LuCircleCheck size={16} aria-hidden="true" />
            <span>Chapter Complete</span>
          </div>

          <h3 className={styles.endTitle}>You&apos;ve reached the end of this chapter</h3>
          <p className={styles.endSubtitle}>
            {nextEpisodeSlug
              ? "Continue following the journey in the next chapter."
              : "You're caught up with the latest published chapter for this series."}
          </p>

          <div className={styles.navigationActions}>
            {prevEpisodeSlug && (
              <Link
                href={`/series/${seriesSlug}/episodes/${prevEpisodeSlug}`}
                className={styles.secondaryBtn}
              >
                <LuArrowLeft size={16} aria-hidden="true" />
                <span>Previous Chapter</span>
              </Link>
            )}

            <Link href={`/series/${seriesSlug}`} className={styles.secondaryBtn}>
              <span>Series Overview</span>
            </Link>

            {nextEpisodeSlug && (
              <Link
                href={`/series/${seriesSlug}/episodes/${nextEpisodeSlug}`}
                className={styles.primaryBtn}
              >
                <span>Next Chapter</span>
                <LuArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </div>
        </footer>
      </article>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={styles.scrollTopBtn}
          aria-label="Scroll back to top of chapter"
        >
          <LuArrowUp size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
