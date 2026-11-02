import path from "node:path";
import fs from "node:fs";
import { SEED_CREATORS } from "../fixtures/creators.ts";
import { SEED_STUDIOS } from "../fixtures/studios.ts";
import { ALL_SEED_SERIES } from "../fixtures/series/index.ts";

export interface ArtworkAssetItem {
  assetKey: string;
  type: "avatar" | "logo" | "cover" | "page";
  seriesId?: string;
  seriesSlug?: string;
  episodeId?: string;
  episodeNumber?: number;
  pageNumber?: number;
  creatorUsername?: string;
  studioSlug?: string;
  localRelativePath: string;
  fullLocalPath: string;
  cloudinaryFolder: string;
  cloudinaryTags: string[];
  prompt: string;
  aspectRatio: "1:1" | "2:3" | "9:16" | "16:9";
  batchNumber?: number;
}

export const ASSETS_BASE_DIR = path.resolve(process.cwd(), "scripts/seed/assets");

export function resolveExistingPath(relPath: string): { relative: string; full: string } {
  const full = path.join(ASSETS_BASE_DIR, relPath);
  if (fs.existsSync(full)) {
    return { relative: relPath, full };
  }
  const ext = path.extname(relPath);
  const baseWithoutExt = relPath.slice(0, relPath.length - ext.length);
  const alternatives = [".png", ".jpg", ".jpeg", ".webp"];
  for (const alt of alternatives) {
    const candidateRel = `${baseWithoutExt}${alt}`;
    const candidateFull = path.join(ASSETS_BASE_DIR, candidateRel);
    if (fs.existsSync(candidateFull)) {
      return { relative: candidateRel, full: candidateFull };
    }
  }
  return { relative: relPath, full };
}

export function getAllRequiredArtworkAssets(): ArtworkAssetItem[] {
  const assets: ArtworkAssetItem[] = [];

  // 1. Creator Avatars (15)
  for (const creator of SEED_CREATORS) {
    const rel = creator.avatarFile || `avatars/${creator.username}.png`;
    const resolved = resolveExistingPath(rel);
    assets.push({
      assetKey: `avatar:${creator.username}`,
      type: "avatar",
      creatorUsername: creator.username,
      localRelativePath: resolved.relative,
      fullLocalPath: resolved.full,
      cloudinaryFolder: `pageprowl/seed/avatars`,
      cloudinaryTags: ["pageprowl", "pageprowl_seed", "avatar"],
      prompt: creator.avatarPrompt,
      aspectRatio: "1:1",
    });
  }

  // 2. Studio Logos (4)
  for (const studio of SEED_STUDIOS) {
    const rel = studio.logoFile || `studios/${studio.slug}.png`;
    const resolved = resolveExistingPath(rel);
    assets.push({
      assetKey: `logo:${studio.slug}`,
      type: "logo",
      studioSlug: studio.slug,
      localRelativePath: resolved.relative,
      fullLocalPath: resolved.full,
      cloudinaryFolder: `pageprowl/seed/studios`,
      cloudinaryTags: ["pageprowl", "pageprowl_seed", "studio"],
      prompt: studio.logoPrompt,
      aspectRatio: "1:1",
    });
  }

  // 3. Series Covers (50) & Episode Pages (600)
  for (const series of ALL_SEED_SERIES) {
    const coverRel = series.coverFile || `covers/${series.slug}.png`;
    const resolvedCover = resolveExistingPath(coverRel);
    assets.push({
      assetKey: `cover:${series.slug}`,
      type: "cover",
      seriesId: series.id,
      seriesSlug: series.slug,
      batchNumber: series.batchNumber,
      localRelativePath: resolvedCover.relative,
      fullLocalPath: resolvedCover.full,
      cloudinaryFolder: `pageprowl/seed/series/${series.slug}/cover`,
      cloudinaryTags: ["pageprowl", "pageprowl_seed", "cover", series.genre.toLowerCase()],
      prompt: series.coverPrompt,
      aspectRatio: series.format === "scroll" ? "16:9" : "2:3",
    });

    for (const ep of series.episodes) {
      if (ep.pages && Array.isArray(ep.pages)) {
        for (const page of ep.pages) {
          const pageRel =
            page.imageFile ||
            `episodes/${series.slug}/ep${ep.episodeNumber}_p${page.pageNumber}.png`;
          const resolvedPage = resolveExistingPath(pageRel);
          assets.push({
            assetKey: `page:${series.slug}:${ep.episodeNumber}:${page.pageNumber}`,
            type: "page",
            seriesId: series.id,
            seriesSlug: series.slug,
            batchNumber: series.batchNumber,
            episodeNumber: ep.episodeNumber,
            pageNumber: page.pageNumber,
            localRelativePath: resolvedPage.relative,
            fullLocalPath: resolvedPage.full,
            cloudinaryFolder: `pageprowl/seed/series/${series.slug}/episodes/${ep.slug}`,
            cloudinaryTags: ["pageprowl", "pageprowl_seed", "page", series.genre.toLowerCase()],
            prompt: page.imagePrompt,
            aspectRatio: series.format === "scroll" ? "9:16" : "2:3",
          });
        }
      }
    }
  }

  return assets;
}

export function getArtworkStatus() {
  const all = getAllRequiredArtworkAssets();
  const existing: ArtworkAssetItem[] = [];
  const missing: ArtworkAssetItem[] = [];

  for (const asset of all) {
    if (fs.existsSync(asset.fullLocalPath)) {
      existing.push(asset);
    } else {
      missing.push(asset);
    }
  }

  return {
    total: all.length,
    existingCount: existing.length,
    missingCount: missing.length,
    existing,
    missing,
  };
}
