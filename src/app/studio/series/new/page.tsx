"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "@/app/studio/page.module.css";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createClient } from "@/lib/supabase/client";
import { createSeriesAction } from "../actions";
import { SUPPORTED_GENRES } from "@/lib/constants/genres";
import { LuArrowLeft, LuUpload, LuImage, LuCheck } from "react-icons/lu";

interface StudioOption {
  id: string;
  name: string;
}

function NewSeriesForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStudioId = searchParams.get("studioId") || "";

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
    async function loadStudios() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=" + encodeURIComponent("/studio/series/new"));
        return;
      }

      const { data: memberships } = await supabase
        .from("studio_members")
        .select(`
          studio_id,
          role,
          studios:studio_id (id, name)
        `)
        .eq("user_id", user.id)
        .in("role", ["owner", "admin"]);

      if (memberships) {
        const studios = memberships
          .map((m: any) => m.studios)
          .filter(Boolean) as StudioOption[];
        setUserStudios(studios);

        if (initialStudioId && studios.some((s) => s.id === initialStudioId)) {
          setSelectedStudioId(initialStudioId);
          setOwnerType("studio");
        }
      }
    }

    loadStudios();
  }, [initialStudioId, router]);

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

    // Validate type and size (<5MB)
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Cover must be a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Cover image must be under 5MB.");
      return;
    }

    setIsUploadingCover(true);
    setUploadError(null);

    try {
      // 1. Request signature from server
      const sigRes = await fetch("/api/media/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cover" }),
      });

      if (!sigRes.ok) {
        const errJson = await sigRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to authorize upload.");
      }

      const sigData = await sigRes.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);
      formData.append("tags", "panelverse,cover");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.error?.message || "Failed to upload cover to Cloudinary.");
      }

      const uploadData = await uploadRes.json();

      // 3. Register media asset
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
        }),
      });

      if (assetRes.ok) {
        const { asset } = await assetRes.json();
        setCoverAssetId(asset.id);
      }

      setCoverUrl(uploadData.secure_url);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !navigator.onLine) {
      setError("You are currently offline. Please reconnect before creating a series.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
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

  return (
    <div
      style={{
        maxWidth: "720px",
        backgroundColor: "var(--color-surface)",
        padding: "var(--space-8)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
      }}
    >
      {error && (
        <div
          style={{
            backgroundColor: "var(--color-danger-bg)",
            color: "var(--color-danger)",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "24px",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Cover Art Preview / Upload */}
          <div style={{ width: "160px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Cover Artwork
            </label>
            <div
              style={{
                width: "160px",
                height: "220px",
                borderRadius: "var(--radius-md)",
                border: "1px dashed var(--color-border)",
                backgroundColor: "var(--color-surface-hover)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "12px" }}>
                  <LuImage size={32} color="var(--color-text-muted)" style={{ marginBottom: "8px" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    Optional Cover (JPG/PNG &lt; 5MB)
                  </span>
                </div>
              )}
            </div>

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
              style={{ width: "100%", marginTop: "8px" }}
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploadingCover}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <LuUpload size={14} />
                <span>{coverUrl ? "Change Cover" : "Upload Cover"}</span>
              </span>
            </Button>
            {uploadError && (
              <span style={{ fontSize: "0.75rem", color: "var(--color-danger)", display: "block", marginTop: "4px" }}>
                {uploadError}
              </span>
            )}
          </div>

          {/* Core Metadata Fields */}
          <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <FormField label="Series Title" htmlFor="title" required>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={100}
                placeholder="e.g. Chronicles of Neon"
                value={title}
                onChange={handleTitleChange}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-main)",
                }}
              />
            </FormField>

            <FormField label="URL Slug" htmlFor="slug" hint="Used in public web URLs">
              <input
                id="slug"
                name="slug"
                type="text"
                readOnly
                value={slug}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-surface-hover)",
                  color: "var(--color-text-muted)",
                  fontFamily: "monospace",
                }}
              />
            </FormField>
          </div>
        </div>

        <FormField label="Synopsis / Description" htmlFor="synopsis" required>
          <textarea
            id="synopsis"
            name="synopsis"
            required
            rows={4}
            minLength={10}
            maxLength={2000}
            placeholder="Introduce the world, characters, and central conflict of your story..."
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
          <FormField label="Comic Format" htmlFor="format" required>
            <select
              id="format"
              name="format"
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
              <option value="page">Page-by-Page (Traditional Print)</option>
            </select>
          </FormField>

          <FormField label="Primary Genre" htmlFor="genre" required>
            <select
              id="genre"
              name="genre"
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
        </div>

        <FormField label="Ownership &amp; Publishing Entity" htmlFor="ownerType" required>
          <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
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
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="ownerType"
                  value="studio"
                  checked={ownerType === "studio"}
                  onChange={() => setOwnerType("studio")}
                />
                <span>Studio Workspace</span>
              </label>
            )}
          </div>

          {ownerType === "studio" && userStudios.length > 0 && (
            <select
              id="studioId"
              name="studioId"
              value={selectedStudioId}
              onChange={(e) => setSelectedStudioId(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "6px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text-main)",
              }}
            >
              {userStudios.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField label="Initial Visibility" htmlFor="visibility" required>
          <select
            id="visibility"
            name="visibility"
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
            <option value="private">Private (Only authorized team members can view)</option>
            <option value="public">Public (Visible in public browse catalog once chapters publish)</option>
          </select>
        </FormField>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
          <Link href="/studio/series">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Series
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewSeriesPage() {
  return (
    <div className={styles.layout}>
      <CreatorSidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Link
                href="/studio/series"
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "0.875rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <LuArrowLeft size={14} aria-hidden="true" />
                <span>All Series</span>
              </Link>
            </div>
            <h1 className={styles.title}>Create Comic Series</h1>
            <p className={styles.subtitle}>
              Establish a new title, define metadata, upload cover artwork, and prepare for episode releases.
            </p>
          </div>
        </header>

        <Suspense fallback={<div>Loading form...</div>}>
          <NewSeriesForm />
        </Suspense>
      </main>
    </div>
  );
}
