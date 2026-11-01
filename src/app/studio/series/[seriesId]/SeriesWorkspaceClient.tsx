"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "@/app/studio/page.module.css";
import wsStyles from "./SeriesWorkspace.module.css";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SUPPORTED_GENRES } from "@/lib/constants/genres";
import {
  updateSeriesMetadataAction,
  updateSeriesCoverAction,
  deleteSeriesAction,
} from "../actions";
import { deleteEpisodeAction } from "./episodes/actions";
import {
  LuArrowLeft,
  LuArrowRight,
  LuPlus,
  LuLayers,
  LuImage,
  LuUpload,
  LuSettings,
  LuTrash2,
  LuExternalLink,
} from "react-icons/lu";
import type { ComicFormat, SeriesVisibility } from "@/types/database";

interface EpisodeItem {
  id: string;
  episode_number: number;
  title: string;
  slug: string;
  published_revision_id: string | null;
  latestRevisionStatus?: string;
  pageCount?: number;
}

interface SeriesWorkspaceClientProps {
  series: {
    id: string;
    title: string;
    slug: string;
    synopsis: string;
    format: ComicFormat;
    genre: string;
    visibility: SeriesVisibility;
    cover_url: string | null;
    owner_user_id: string | null;
    owner_studio_id: string | null;
    studioName?: string;
  };
  episodes: EpisodeItem[];
  userRole: "owner" | "editor" | "contributor" | "viewer";
}

export function SeriesWorkspaceClient({
  series,
  episodes,
  userRole,
}: SeriesWorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState<"episodes" | "metadata" | "cover" | "danger">(
    "episodes"
  );

  // Metadata form state
  const [title, setTitle] = useState(series.title);
  const [synopsis, setSynopsis] = useState(series.synopsis);
  const [genre, setGenre] = useState(series.genre);
  const [format, setFormat] = useState<ComicFormat>(series.format);
  const [visibility, setVisibility] = useState<SeriesVisibility>(series.visibility);
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [metaMessage, setMetaMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  // Cover upload state
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(series.cover_url);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverMessage, setCoverMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canEdit = userRole === "owner" || userRole === "editor";
  const isOwner = userRole === "owner";

  const handleMetadataSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canEdit) return;

    if (typeof window !== "undefined" && !navigator.onLine) {
      setMetaMessage({
        type: "error",
        text: "You are currently offline. Please reconnect to save series details.",
      });
      return;
    }

    setIsSavingMeta(true);
    setMetaMessage(null);

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("synopsis", synopsis);
      formData.set("genre", genre);
      formData.set("format", format);
      formData.set("visibility", visibility);

      await updateSeriesMetadataAction(series.id, formData);
      setMetaMessage({ type: "success", text: "Series details updated successfully." });
    } catch (err: any) {
      setMetaMessage({ type: "error", text: err?.message || "Failed to update series metadata." });
    } finally {
      setIsSavingMeta(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canEdit) return;

    if (typeof window !== "undefined" && !navigator.onLine) {
      setCoverMessage({
        type: "error",
        text: "You are currently offline. Please reconnect before uploading cover artwork.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setCoverMessage({ type: "error", text: "Cover image must be a JPG, PNG, or WebP file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCoverMessage({ type: "error", text: "Cover image file size must be under 5MB." });
      return;
    }

    setIsUploadingCover(true);
    setCoverMessage(null);

    const slowTimer = setTimeout(() => {
      setCoverMessage({
        type: "success",
        text: "Uploading cover artwork... taking slightly longer due to network latency.",
      });
    }, 7000);

    try {
      // 1. Get signed signature
      const sigRes = await fetch("/api/media/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: series.id, type: "cover" }),
      });

      if (!sigRes.ok) {
        const errJson = await sigRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to authorize cover upload.");
      }

      const sigData = await sigRes.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);
      formData.append("tags", "pageprowl,cover");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.error?.message || "Failed to upload cover image.");
      }

      const uploadData = await uploadRes.json();

      // 3. Register media asset
      let assetId: string | undefined;
      const assetRes = await fetch("/api/media/asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cloudinaryPublicId: uploadData.public_id,
          format: uploadData.format,
          width: uploadData.width,
          height: uploadData.height,
          byteSize: uploadData.bytes,
          secureUrl: uploadData.secure_url,
          seriesId: series.id,
        }),
      });

      if (assetRes.ok) {
        const { asset } = await assetRes.json();
        assetId = asset.id;
      }

      // 4. Update series cover
      await updateSeriesCoverAction(series.id, uploadData.secure_url, assetId);
      setCurrentCoverUrl(uploadData.secure_url);
      setCoverMessage({ type: "success", text: "Cover artwork successfully updated." });
    } catch (err: any) {
      setCoverMessage({ type: "error", text: err.message || "Failed to update cover artwork." });
    } finally {
      clearTimeout(slowTimer);
      setIsUploadingCover(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string, episodeTitle: string) => {
    if (!confirm(`Are you sure you want to delete episode "${episodeTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteEpisodeAction(series.id, episodeId);
    } catch (err: any) {
      alert(err.message || "Failed to delete episode.");
    }
  };

  const handleDeleteSeries = async () => {
    if (!isOwner) return;
    const promptText = `Please type "${series.title}" to confirm permanent deletion:`;
    const input = prompt(promptText);
    if (input !== series.title) {
      alert("Series title did not match. Deletion cancelled.");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteSeriesAction(series.id);
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete series.");
      setIsDeleting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={wsStyles.container}>
        {/* Breadcrumb */}
        <div className={wsStyles.breadcrumbBar}>
          <Link href="/studio/series" className={wsStyles.breadcrumbLink}>
            <LuArrowLeft size={14} aria-hidden="true" />
            <span>All Series</span>
          </Link>
        </div>

        {/* Cinematic Hero Header (Screen 3 from Reference) */}
        <header className={wsStyles.heroBanner}>
          {currentCoverUrl && (
            <img
              src={currentCoverUrl}
              alt={title}
              className={wsStyles.heroImage}
            />
          )}
          <div className={wsStyles.heroOverlay} />

          <div className={wsStyles.heroContent}>
            <div className={wsStyles.heroMeta}>
              <div className={wsStyles.tagRow}>
                <span className={wsStyles.formatBadge}>
                  {format === "scroll" ? "Vertical Scroll" : "Page-by-Page"}
                </span>
                <span className={wsStyles.formatBadge}>{genre}</span>
                <StatusBadge
                  status={visibility === "public" ? "published" : "in_progress"}
                  label={visibility === "public" ? "PUBLISHED" : "IN PROGRESS"}
                />
              </div>

              <h1 className={wsStyles.heroTitle}>{title}</h1>

              {synopsis && (
                <p className={wsStyles.heroSynopsis}>{synopsis}</p>
              )}

              <p className={wsStyles.heroDetails}>
                {series.studioName ? `Studio: ${series.studioName}` : "Independent Creator"} &bull;{" "}
                <code>/{series.slug}</code>
              </p>
            </div>

            <div className={wsStyles.heroActions}>
              {visibility === "public" && (
                <Link href={`/series/${series.slug}`} target="_blank">
                  <Button variant="secondary" size="sm">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>Public View</span>
                      <LuExternalLink size={14} aria-hidden="true" />
                    </span>
                  </Button>
                </Link>
              )}
              {canEdit && (
                <Link href={`/studio/series/${series.id}/episodes/new`}>
                  <Button variant="primary" size="sm">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <LuPlus size={16} aria-hidden="true" />
                      <span>New Episode</span>
                    </span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Workspace Tab Navigation */}
        <nav className={wsStyles.tabNav} aria-label="Series Management Tabs">
          <button
            onClick={() => setActiveTab("episodes")}
            className={`${wsStyles.tabBtn} ${activeTab === "episodes" ? wsStyles.tabActive : ""}`}
          >
            <span>Episodes ({episodes.length})</span>
            {activeTab === "episodes" && (
              <motion.span
                layoutId="seriesWorkspaceTabIndicator"
                className={wsStyles.tabIndicator}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
          </button>

          {canEdit && (
            <button
              onClick={() => setActiveTab("metadata")}
              className={`${wsStyles.tabBtn} ${activeTab === "metadata" ? wsStyles.tabActive : ""}`}
            >
              <span>Series Details &amp; Metadata</span>
              {activeTab === "metadata" && (
                <motion.span
                  layoutId="seriesWorkspaceTabIndicator"
                  className={wsStyles.tabIndicator}
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => setActiveTab("cover")}
              className={`${wsStyles.tabBtn} ${activeTab === "cover" ? wsStyles.tabActive : ""}`}
            >
              <span>Cover Artwork</span>
              {activeTab === "cover" && (
                <motion.span
                  layoutId="seriesWorkspaceTabIndicator"
                  className={wsStyles.tabIndicator}
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => setActiveTab("danger")}
              className={`${wsStyles.tabBtn} ${activeTab === "danger" ? wsStyles.tabDangerActive : ""}`}
            >
              <span>Danger Zone</span>
              {activeTab === "danger" && (
                <motion.span
                  layoutId="seriesWorkspaceTabIndicator"
                  className={wsStyles.tabDangerIndicator}
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          )}
        </nav>

        {/* Tab 1: Episodes (Screen 3 Card List from Reference) */}
        {activeTab === "episodes" && (
          <section className={styles.section}>
            <div className={wsStyles.sectionHeader}>
              <h2 className={wsStyles.sectionTitle}>Episodes ({episodes.length})</h2>
              {canEdit && (
                <Link href={`/studio/series/${series.id}/episodes/new`}>
                  <Button variant="primary" size="sm">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <LuPlus size={16} aria-hidden="true" />
                      <span>New Episode</span>
                    </span>
                  </Button>
                </Link>
              )}
            </div>

            {episodes.length > 0 ? (
              <div className={wsStyles.episodeList}>
                {episodes.map((ep) => (
                  <div key={ep.id} className={wsStyles.episodeCard}>
                    <div className={wsStyles.episodeLeft}>
                      <div className={wsStyles.episodeThumb}>
                        <div className={wsStyles.thumbPlaceholder}>
                          #{ep.episode_number}
                        </div>
                      </div>

                      <div className={wsStyles.episodeInfo}>
                        <div className={wsStyles.episodeTitleRow}>
                          <h3 className={wsStyles.episodeTitle}>
                            Episode {ep.episode_number}: {ep.title}
                          </h3>
                          <StatusBadge status={(ep.latestRevisionStatus as any) || "draft"} />
                        </div>
                        <span className={wsStyles.episodeMetaText}>
                          <code>/{ep.slug}</code> &bull;{" "}
                          {ep.published_revision_id ? (
                            <span style={{ color: "var(--color-success)", fontWeight: 600 }}>
                              Live on Public Reader
                            </span>
                          ) : (
                            <span>Unpublished Draft</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className={wsStyles.episodeActions}>
                      <Link href={`/studio/series/${series.id}/episodes/${ep.id}`}>
                        <Button variant="secondary" size="sm">
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <span>Workspace</span>
                            <LuArrowRight size={14} aria-hidden="true" />
                          </span>
                        </Button>
                      </Link>
                      {canEdit && !ep.published_revision_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ color: "var(--color-danger)" }}
                          onClick={() => handleDeleteEpisode(ep.id, ep.title)}
                          title="Delete draft episode"
                          aria-label="Delete draft episode"
                        >
                          <LuTrash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<LuLayers size={44} color="var(--color-primary)" />}
                title="No episodes yet"
                description="Create Episode 1 to start uploading comic artwork pages and organizing revisions."
                action={
                  canEdit ? (
                    <Link href={`/studio/series/${series.id}/episodes/new`}>
                      <Button variant="primary">Create First Episode</Button>
                    </Link>
                  ) : undefined
                }
              />
            )}
          </section>
        )}

      {/* Tab 2: Series Details & Metadata */}
      {activeTab === "metadata" && canEdit && (
        <section
          style={{
            maxWidth: "680px",
            backgroundColor: "var(--color-surface)",
            padding: "var(--space-8)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
          }}
        >
          {metaMessage && (
            <div
              style={{
                backgroundColor:
                  metaMessage.type === "success" ? "var(--color-success-bg)" : "var(--color-danger-bg)",
                color:
                  metaMessage.type === "success" ? "var(--color-success)" : "var(--color-danger)",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "0.875rem",
              }}
            >
              {metaMessage.text}
            </div>
          )}

          <form onSubmit={handleMetadataSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <FormField label="Series Title" htmlFor="meta-title" required>
              <input
                id="meta-title"
                type="text"
                required
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-main)",
                }}
              />
            </FormField>

            <FormField label="Synopsis / Description" htmlFor="meta-synopsis" required>
              <textarea
                id="meta-synopsis"
                required
                rows={4}
                minLength={10}
                maxLength={2000}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-main)",
                  resize: "vertical",
                }}
              />
            </FormField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Primary Genre" htmlFor="meta-genre" required>
                <select
                  id="meta-genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-main)",
                  }}
                >
                  {SUPPORTED_GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Comic Format" htmlFor="meta-format" required>
                <select
                  id="meta-format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text-main)",
                  }}
                >
                  <option value="scroll">Vertical Scroll (Webtoon / Mobile)</option>
                  <option value="page">Page-by-Page (Traditional)</option>
                </select>
              </FormField>
            </div>

            <FormField label="Visibility State" htmlFor="meta-visibility" required>
              <select
                id="meta-visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-main)",
                }}
              >
                <option value="private">Private (Workspace only, hidden from readers)</option>
                <option value="public">Public (Discoverable in browse catalog once chapters are live)</option>
              </select>
            </FormField>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
              <Button type="submit" variant="primary" isLoading={isSavingMeta}>
                Save Changes
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* Tab 3: Cover Artwork */}
      {activeTab === "cover" && canEdit && (
        <section
          style={{
            maxWidth: "600px",
            backgroundColor: "var(--color-surface)",
            padding: "var(--space-8)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "8px" }}>
            Cover Artwork Management
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "20px" }}>
            Upload high-resolution cover art (recommended 600x900px, JPG/PNG/WebP under 5MB).
          </p>

          {coverMessage && (
            <div
              style={{
                backgroundColor:
                  coverMessage.type === "success" ? "var(--color-success-bg)" : "var(--color-danger-bg)",
                color:
                  coverMessage.type === "success" ? "var(--color-success)" : "var(--color-danger)",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "0.875rem",
              }}
            >
              {coverMessage.text}
            </div>
          )}

          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div
              style={{
                width: "180px",
                height: "250px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface-hover)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {currentCoverUrl ? (
                <img
                  src={currentCoverUrl}
                  alt="Cover Artwork"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <LuImage size={40} color="var(--color-text-muted)" style={{ marginBottom: "8px" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    No cover artwork uploaded
                  </span>
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: "240px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCoverUpload}
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
              />

              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploadingCover}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <LuUpload size={16} />
                  <span>{currentCoverUrl ? "Replace Cover Artwork" : "Upload New Cover"}</span>
                </span>
              </Button>

              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                Images are automatically processed, resized, and optimized via Cloudinary.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Danger Zone */}
      {activeTab === "danger" && isOwner && (
        <section
          style={{
            maxWidth: "600px",
            backgroundColor: "var(--color-surface)",
            padding: "var(--space-8)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-danger)",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-danger)", marginBottom: "8px" }}>
            Delete Comic Series
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "20px" }}>
            Permanently remove <strong>{series.title}</strong>, all its episodes, draft revisions, and reader references.
            This action cannot be undone.
          </p>

          {deleteError && (
            <div
              style={{
                backgroundColor: "var(--color-danger-bg)",
                color: "var(--color-danger)",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "0.875rem",
              }}
            >
              {deleteError}
            </div>
          )}

          <Button
            variant="danger"
            onClick={handleDeleteSeries}
            isLoading={isDeleting}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <LuTrash2 size={16} />
              <span>Delete Series Permanently</span>
            </span>
          </Button>
        </section>
      )}
      </div>
    </main>
  );
}
