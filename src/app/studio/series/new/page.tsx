"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./NewSeries.module.css";
import pageStyles from "@/app/studio/page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/client";
import { getAuthorizedUserStudios, type StudioOption } from "@/lib/data/studiosClient";
import { createSeriesAction } from "../actions";
import { SUPPORTED_GENRES } from "@/lib/constants/genres";
import {
  LuArrowLeft,
  LuArrowRight,
  LuUpload,
  LuImage,
  LuCheck,
  LuSparkles,
  LuLayers,
  LuBookOpen,
  LuShieldCheck,
  LuCircleHelp,
  LuEye,
  LuLock,
} from "react-icons/lu";

function NewSeriesWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStudioId = searchParams.get("studioId") || "";

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [format, setFormat] = useState<"scroll" | "page">("scroll");
  const [genre, setGenre] = useState<string>(SUPPORTED_GENRES[0]);
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [ownerType, setOwnerType] = useState<"individual" | "studio">(
    initialStudioId ? "studio" : "individual"
  );
  const [selectedStudioId, setSelectedStudioId] = useState(initialStudioId);
  const [userStudios, setUserStudios] = useState<StudioOption[]>([]);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [coverAssetId, setCoverAssetId] = useState<string>("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadStudios() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login?redirect=" + encodeURIComponent("/studio/series/new"));
          return;
        }

        // Fetch authorized studios using deduplicated, cached client helper
        const studios = await getAuthorizedUserStudios(user.id);
        if (isCancelled) return;

        setUserStudios(studios);

        if (initialStudioId && studios.some((s) => s.id === initialStudioId)) {
          setSelectedStudioId(initialStudioId);
          setOwnerType("studio");
        } else if (studios.length > 0 && !selectedStudioId) {
          setSelectedStudioId(studios[0].id);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("Could not load authorized studios for series creation:", err);
        }
      }
    }

    loadStudios();

    return () => {
      isCancelled = true;
    };
  }, [initialStudioId, router, selectedStudioId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (typeof window !== "undefined" && !navigator.onLine) {
      setUploadError("You are currently offline. Please reconnect before uploading a cover.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files (JPEG, PNG, WebP) are accepted.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Cover image must be under 5MB.");
      return;
    }

    setUploadError(null);
    setIsUploadingCover(true);

    try {
      const sigRes = await fetch("/api/media/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cover" }),
      });

      if (!sigRes.ok) {
        throw new Error("Failed to get secure upload authorization.");
      }

      const sigData = await sigRes.json();

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", sigData.apiKey);
      uploadData.append("timestamp", sigData.timestamp.toString());
      uploadData.append("signature", sigData.signature);
      uploadData.append("folder", sigData.folder);
      if (sigData.tags) {
        uploadData.append("tags", sigData.tags);
      }

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!cloudinaryRes.ok) {
        const errorData = await cloudinaryRes.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Direct image upload failed. Please try again.");
      }

      const cloudJson = await cloudinaryRes.json();

      const recordRes = await fetch("/api/media/asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cloudinaryPublicId: cloudJson.public_id,
          secureUrl: cloudJson.secure_url,
          format: cloudJson.format,
          byteSize: cloudJson.bytes,
          width: cloudJson.width,
          height: cloudJson.height,
        }),
      });

      if (!recordRes.ok) {
        throw new Error("Failed to register media asset in database.");
      }

      const { asset } = await recordRes.json();
      setCoverUrl(cloudJson.secure_url);
      setCoverAssetId(asset.id);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload cover.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.trim().length < 2) {
      setError("Please provide a series title with at least 2 characters.");
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!synopsis || synopsis.trim().length < 10) {
      setError("Please provide a synopsis of at least 10 characters to introduce your story.");
      return;
    }
    setError(null);
    setCurrentStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !navigator.onLine) {
      setError("You are currently offline. Please reconnect before creating a series.");
      return;
    }

    if (!title || title.trim().length < 2) {
      setError("Series title must be at least 2 characters.");
      setCurrentStep(1);
      return;
    }

    if (!synopsis || synopsis.trim().length < 10) {
      setError("Synopsis must be at least 10 characters.");
      setCurrentStep(2);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set("title", title.trim());
      formData.set("slug", slug.trim());
      formData.set("synopsis", synopsis.trim());
      formData.set("format", format);
      formData.set("genre", genre);
      formData.set("visibility", visibility);
      formData.set("ownerType", ownerType);
      if (ownerType === "studio" && selectedStudioId) {
        formData.set("studioId", selectedStudioId);
      }
      if (coverUrl) {
        formData.set("coverUrl", coverUrl);
      }
      if (coverAssetId) {
        formData.set("coverAssetId", coverAssetId);
      }

      await createSeriesAction(formData);
    } catch (err: any) {
      setError(err?.message || "Failed to create series.");
      setIsLoading(false);
    }
  };

  const selectedStudioName =
    userStudios.find((s) => s.id === selectedStudioId)?.name || "Studio Team";

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <header className={styles.pageHeader}>
        <Link href="/studio/series" className={styles.backLink}>
          <LuArrowLeft size={16} aria-hidden="true" />
          <span>Back to My Series</span>
        </Link>
        <h1 className={styles.pageTitle}>Create New Series</h1>
        <p className={styles.pageSubtitle}>
          Launch a new serialized comic title, choose the reading format, upload artwork, and configure
          collaborative production ownership.
        </p>
      </header>

      {/* Two-Column Grid */}
      <div className={styles.twoColLayout}>
        {/* Left Column: 3-Step Wizard */}
        <div className={styles.wizardCard}>
          {/* Progress Tracker */}
          <nav className={styles.wizardTracker} aria-label="Creation Steps">
            <button
              type="button"
              className={styles.stepNode}
              onClick={() => setCurrentStep(1)}
            >
              <div
                className={`${styles.stepCircle} ${
                  currentStep === 1
                    ? styles.stepCircleActive
                    : currentStep > 1
                    ? styles.stepCircleDone
                    : ""
                }`}
              >
                {currentStep > 1 ? <LuCheck size={16} /> : "1"}
              </div>
              <div className={styles.stepMeta}>
                <span className={styles.stepTag}>Step 1</span>
                <span className={styles.stepName}>Story Identity</span>
              </div>
            </button>

            <div
              className={`${styles.stepDivider} ${
                currentStep >= 2 ? styles.stepDividerActive : ""
              }`}
            />

            <button
              type="button"
              className={styles.stepNode}
              onClick={() => {
                if (title.trim().length >= 2) setCurrentStep(2);
              }}
            >
              <div
                className={`${styles.stepCircle} ${
                  currentStep === 2
                    ? styles.stepCircleActive
                    : currentStep > 2
                    ? styles.stepCircleDone
                    : ""
                }`}
              >
                {currentStep > 2 ? <LuCheck size={16} /> : "2"}
              </div>
              <div className={styles.stepMeta}>
                <span className={styles.stepTag}>Step 2</span>
                <span className={styles.stepName}>Artwork & Story</span>
              </div>
            </button>

            <div
              className={`${styles.stepDivider} ${
                currentStep === 3 ? styles.stepDividerActive : ""
              }`}
            />

            <button
              type="button"
              className={styles.stepNode}
              onClick={() => {
                if (title.trim().length >= 2 && synopsis.trim().length >= 10) {
                  setCurrentStep(3);
                }
              }}
            >
              <div
                className={`${styles.stepCircle} ${
                  currentStep === 3 ? styles.stepCircleActive : ""
                }`}
              >
                3
              </div>
              <div className={styles.stepMeta}>
                <span className={styles.stepTag}>Step 3</span>
                <span className={styles.stepName}>Publishing</span>
              </div>
            </button>
          </nav>

          {/* Error Banner */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Story Basics */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Next} className={styles.formBody}>
              <FormField label="Series Title" htmlFor="seriesTitle" required>
                <input
                  id="seriesTitle"
                  name="title"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Chronicles of Neon Blade"
                  value={title}
                  onChange={handleTitleChange}
                  className={styles.inputField}
                  autoFocus
                />
              </FormField>

              <FormField
                label="URL Slug"
                htmlFor="slug"
                description="Unique web address parameter used in reader URLs."
              >
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  readOnly
                  value={slug || "chronicles-of-neon-blade"}
                  className={`${styles.inputField} ${styles.inputFieldReadonly}`}
                />
              </FormField>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--color-text)",
                    marginBottom: "4px",
                  }}
                >
                  Comic Format
                </label>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", margin: "0 0 10px 0" }}>
                  Determines the primary reading experience in the reader.
                </p>

                <div className={styles.formatGrid}>
                  <div
                    className={`${styles.formatCard} ${
                      format === "scroll" ? styles.formatCardSelected : ""
                    }`}
                    onClick={() => setFormat("scroll")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.formatCardHeader}>
                      <span className={styles.formatCardTitle}>
                        <LuLayers size={16} color="var(--color-primary)" />
                        <span>Vertical Scroll</span>
                      </span>
                      {format === "scroll" && <LuCheck color="var(--color-primary)" size={16} />}
                    </div>
                    <p className={styles.formatCardDesc}>
                      Continuous vertical scrolling optimized for mobile webtoons and digital long-strip comics.
                    </p>
                  </div>

                  <div
                    className={`${styles.formatCard} ${
                      format === "page" ? styles.formatCardSelected : ""
                    }`}
                    onClick={() => setFormat("page")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.formatCardHeader}>
                      <span className={styles.formatCardTitle}>
                        <LuBookOpen size={16} color="var(--color-primary)" />
                        <span>Page-by-Page</span>
                      </span>
                      {format === "page" && <LuCheck color="var(--color-primary)" size={16} />}
                    </div>
                    <p className={styles.formatCardDesc}>
                      Traditional comic book layout with left/right page flipping and keyboard navigation.
                    </p>
                  </div>
                </div>
              </div>

              <FormField label="Primary Genre" htmlFor="genre" required>
                <select
                  id="genre"
                  name="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className={styles.inputField}
                >
                  {SUPPORTED_GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className={styles.btnRow}>
                <Link href="/studio/series">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </Link>

                <Button type="submit" variant="primary">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Next: Artwork & Story</span>
                    <LuArrowRight size={16} aria-hidden="true" />
                  </span>
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Artwork & Synopsis */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Next} className={styles.formBody}>
              {/* Cover Art Upload */}
              <div className={styles.coverUploadRow}>
                <div
                  className={styles.coverDropzone}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  title="Click to select cover artwork"
                >
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt="Cover preview"
                      className={styles.coverImagePreview}
                    />
                  ) : (
                    <div className={styles.dropzonePlaceholder}>
                      <LuImage size={32} color="var(--color-text-muted)" />
                      <span className={styles.dropzoneText}>
                        Upload Cover (JPG/PNG &lt; 5MB)
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.coverActions}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--color-text)",
                    }}
                  >
                    Cover Artwork
                  </label>
                  <p className={styles.coverHint}>
                    Recommended: 3:4 portrait ratio (e.g. 600x800px). Displays in the public catalog
                    and series landing page.
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCoverFileUpload}
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: "none" }}
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    style={{ width: "fit-content", marginTop: "4px" }}
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={isUploadingCover}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <LuUpload size={14} />
                      <span>{coverUrl ? "Replace Cover Image" : "Choose Image File"}</span>
                    </span>
                  </Button>

                  {uploadError && (
                    <span style={{ fontSize: "0.75rem", color: "var(--color-danger)" }}>
                      {uploadError}
                    </span>
                  )}
                </div>
              </div>

              <FormField
                label="Synopsis / Story Summary"
                htmlFor="synopsis"
                description="Introduce the world, characters, and central conflict of your serialized comic."
                required
              >
                <textarea
                  id="synopsis"
                  name="synopsis"
                  required
                  rows={5}
                  minLength={10}
                  maxLength={2000}
                  placeholder="In a rain-slicked mega-city ruled by digital syndicates, an augmented detective uncovers an impossible mystery..."
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  className={styles.textareaField}
                />
                <div className={styles.charCount}>
                  <span>{synopsis.length} / 2000</span>
                </div>
              </FormField>

              <div className={styles.btnRow}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setCurrentStep(1)}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuArrowLeft size={16} aria-hidden="true" />
                    <span>Back</span>
                  </span>
                </Button>

                <Button type="submit" variant="primary">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Next: Publishing Entity</span>
                    <LuArrowRight size={16} aria-hidden="true" />
                  </span>
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Ownership & Publishing */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className={styles.formBody}>
              <FormField
                label="Ownership & Publishing Imprint"
                htmlFor="ownerType"
                description="Choose whether this title is published under your personal creator profile or a collaborative studio imprint."
                required
              >
                <div style={{ display: "flex", gap: "16px", margin: "8px 0" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--color-text)" }}>
                    <input
                      type="radio"
                      name="ownerType"
                      value="individual"
                      checked={ownerType === "individual"}
                      onChange={() => setOwnerType("individual")}
                    />
                    <span>Personal (Sole Creator)</span>
                  </label>

                  {userStudios.length > 0 && (
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--color-text)" }}>
                      <input
                        type="radio"
                        name="ownerType"
                        value="studio"
                        checked={ownerType === "studio"}
                        onChange={() => setOwnerType("studio")}
                      />
                      <span>Studio Workspace Imprint</span>
                    </label>
                  )}
                </div>

                {ownerType === "studio" && userStudios.length > 0 && (
                  <select
                    id="studioId"
                    name="studioId"
                    value={selectedStudioId}
                    onChange={(e) => setSelectedStudioId(e.target.value)}
                    className={styles.inputField}
                  >
                    {userStudios.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                )}
              </FormField>

              <FormField
                label="Initial Visibility"
                htmlFor="visibility"
                description="Private series are only visible to collaborators during drafting and production."
                required
              >
                <select
                  id="visibility"
                  name="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className={styles.inputField}
                >
                  <option value="private">Private (Only authorized creators and editors can view)</option>
                  <option value="public">Public (Visible in catalog once published chapters exist)</option>
                </select>
              </FormField>

              <div
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--pv-radius-md)",
                  padding: "var(--space-4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <LuShieldCheck size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "600", color: "var(--color-text)" }}>
                    Ready to Launch
                  </span>
                </div>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
                  Once created, you will be taken directly to your Series Workspace where you can create your first
                  episode, upload high-res page slices, and collaborate with your team.
                </p>
              </div>

              <div className={styles.btnRow}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setCurrentStep(2)}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuArrowLeft size={16} aria-hidden="true" />
                    <span>Back</span>
                  </span>
                </Button>

                <Button type="submit" variant="primary" isLoading={isLoading}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuCheck size={16} aria-hidden="true" />
                    <span>Create Series</span>
                  </span>
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Live Series Card Preview & Quick Tips */}
        <aside className={styles.sidebarCol} aria-label="Series Preview and Tips">
          {/* Live Comic Card Preview */}
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              {/* <span className={styles.previewTag}>
                <LuSparkles size={14} aria-hidden="true" />
                <span>Live Series Preview</span>
              </span> */}
              <span className={styles.previewBadge}>Active Preview</span>
            </div>

            <div className={styles.previewBody}>
              <div className={styles.previewCoverContainer}>
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Cover preview"
                    className={styles.previewCoverImg}
                  />
                ) : (
                  <div className={styles.previewCoverFallback}>
                    <LuImage size={32} />
                    <span>Cover Artwork Preview</span>
                  </div>
                )}
              </div>

              <div className={styles.previewInfo}>
                <h3 className={styles.previewTitle}>
                  {title.trim() || "Your Series Title"}
                </h3>

                <div className={styles.previewPillsRow}>
                  <span className={styles.genrePill}>{genre}</span>
                  <span className={styles.formatPill}>
                    {format === "scroll" ? "Vertical Scroll" : "Page-by-Page"}
                  </span>
                </div>

                <p className={styles.previewSynopsis}>
                  {synopsis.trim() ||
                    "Your story synopsis will introduce your series premise, world, and characters to readers across PageProwl."}
                </p>
              </div>

              <div className={styles.previewFooter}>
                <span>By {ownerType === "studio" ? selectedStudioName : "You (Individual Creator)"}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {visibility === "private" ? <LuLock size={12} /> : <LuEye size={12} />}
                  <span>{visibility === "private" ? "Private" : "Public"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Publishing Tips */}
          <div className={styles.tipsCard}>
            <div className={styles.tipsHeader}>
              <LuCircleHelp size={18} color="var(--color-primary)" />
              <span>Series Setup Tips</span>
            </div>

            <ul className={styles.tipsList}>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <div>
                  <strong>Format:</strong> Use Vertical Scroll for modern mobile-first webtoons; use Page-by-Page for traditional comic book spreads.
                </div>
              </li>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <div>
                  <strong>Cover Art:</strong> High-contrast, artwork-led covers attract significantly higher reader discovery in the browse catalog.
                </div>
              </li>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <div>
                  <strong>Visibility:</strong> Keep in Private mode while building buffer episodes and reviewing draft revisions with your team.
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function NewSeriesPage() {
  return (
    <div className={pageStyles.layout}>
      <CreatorSidebar />

      <main className={pageStyles.main}>
        <Suspense fallback={<div style={{ padding: "32px", color: "#9CA3AF" }}>Loading series wizard...</div>}>
          <NewSeriesWizard />
        </Suspense>
      </main>
    </div>
  );
}
