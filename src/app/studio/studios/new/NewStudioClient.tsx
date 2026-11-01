"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./NewStudio.module.css";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { createStudioAction } from "@/app/studio/studios/actions";
import {
  LuBuilding2,
  LuArrowLeft,
  LuArrowRight,
  LuCheck,
  LuSparkles,
  LuShieldCheck,
  LuUsers,
  LuBookOpen,
  LuLayers,
  LuCircleHelp,
} from "react-icons/lu";

export function NewStudioClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publishingFocus, setPublishingFocus] = useState<string>("Indie Manga & Webcomics");
  const [reviewMode, setReviewMode] = useState<"editorial" | "flexible">("editorial");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Compute live slug preview
  const liveSlug = name
    ? name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "your-studio-slug";

  const studioInitial = name.trim().charAt(0).toUpperCase() || "S";

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.trim().length < 2) {
      setError("Please enter a studio name with at least 2 characters.");
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !navigator.onLine) {
      setError("You are currently offline. Please reconnect before creating your studio.");
      return;
    }

    if (!name || name.trim().length < 2) {
      setError("Studio name must be at least 2 characters.");
      setCurrentStep(1);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("description", description.trim());

      await createStudioAction(formData);
    } catch (err: any) {
      setError(err?.message || "Failed to create studio workspace.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Page Header */}
      <header className={styles.pageHeader}>
        <Link href="/studio/studios" className={styles.backLink}>
          <LuArrowLeft size={16} aria-hidden="true" />
          <span>Back to Studios</span>
        </Link>
        <h1 className={styles.pageTitle}>Create Studio Workspace</h1>
        <p className={styles.pageSubtitle}>
          Form a dedicated creative organization to manage serialized comics, assemble creator teams,
          and streamline revision reviews.
        </p>
      </header>

      {/* Main Two-Column Layout Grid */}
      <div className={styles.twoColLayout}>
        {/* Left Column: Multi-Step Form Card */}
        <div className={styles.formCard}>
          {/* Wizard Progress Tracker */}
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
                    : styles.stepCircleDone
                }`}
              >
                {currentStep === 2 ? <LuCheck size={16} /> : "1"}
              </div>
              <div className={styles.stepMeta}>
                <span className={styles.stepTag}>Step 1</span>
                <span className={styles.stepName}>Studio Identity</span>
              </div>
            </button>

            <div
              className={`${styles.stepDivider} ${
                currentStep === 2 ? styles.stepDividerActive : ""
              }`}
            />

            <button
              type="button"
              className={styles.stepNode}
              onClick={() => {
                if (name.trim().length >= 2) setCurrentStep(2);
              }}
            >
              <div
                className={`${styles.stepCircle} ${
                  currentStep === 2 ? styles.stepCircleActive : ""
                }`}
              >
                2
              </div>
              <div className={styles.stepMeta}>
                <span className={styles.stepTag}>Step 2</span>
                <span className={styles.stepName}>Team & Workflow</span>
              </div>
            </button>
          </nav>

          {/* Error Banner */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Basic Identity */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className={styles.formBody}>
              <FormField
                label="Studio Workspace Name"
                htmlFor="studioName"
                description="The public imprint name of your publishing house, collective, or studio."
                required
              >
                <input
                  id="studioName"
                  name="name"
                  type="text"
                  placeholder="e.g. Ironclad Manga Collective"
                  required
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.inputField}
                  autoFocus
                />
              </FormField>

              <FormField
                label="Publishing Focus & Genre"
                description="Primary format and genres your studio specializes in producing."
              >
                <select
                  value={publishingFocus}
                  onChange={(e) => setPublishingFocus(e.target.value)}
                  className={styles.inputField}
                >
                  <option value="Indie Manga & Webcomics">Indie Manga & Webcomics</option>
                  <option value="Action & Dark Fantasy">Action & Dark Fantasy</option>
                  <option value="Sci-Fi & Cyberpunk">Sci-Fi & Cyberpunk</option>
                  <option value="Romance & Drama">Romance & Drama</option>
                  <option value="Comic Anthology">Comic Anthology</option>
                </select>
              </FormField>

              <FormField
                label="Studio Mission / Description"
                htmlFor="studioDesc"
                description="Summary of your collective's publishing vision and background."
              >
                <textarea
                  id="studioDesc"
                  name="description"
                  rows={4}
                  placeholder="Tell readers and creators about your imprint's creative mission, storytelling voice, or team goals..."
                  maxLength={400}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textareaField}
                />
                <div className={styles.charCount}>
                  <span>{description.length} / 400</span>
                </div>
              </FormField>

              <div className={styles.btnRow}>
                <Link href="/studio/studios">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </Link>

                <Button type="submit" variant="primary">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>Next: Team & Workflow</span>
                    <LuArrowRight size={16} aria-hidden="true" />
                  </span>
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Team & Workflow Mode */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmit} className={styles.formBody}>
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
                  Default Production Workflow
                </label>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", margin: "0 0 12px 0" }}>
                  Choose how episode revisions are validated before being published to readers.
                </p>

                <div className={styles.radioCardsGrid}>
                  <div
                    className={`${styles.radioCard} ${
                      reviewMode === "editorial" ? styles.radioCardSelected : ""
                    }`}
                    onClick={() => setReviewMode("editorial")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.radioCardHeader}>
                      <span className={styles.radioCardTitle}>Editorial Review</span>
                      {reviewMode === "editorial" && <LuCheck color="var(--color-primary)" size={16} />}
                    </div>
                    <p className={styles.radioCardDesc}>
                      Drafts must be submitted for review and approved by a Studio Editor before publication.
                    </p>
                  </div>

                  <div
                    className={`${styles.radioCard} ${
                      reviewMode === "flexible" ? styles.radioCardSelected : ""
                    }`}
                    onClick={() => setReviewMode("flexible")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.radioCardHeader}>
                      <span className={styles.radioCardTitle}>Flexible / Fast-Track</span>
                      {reviewMode === "flexible" && <LuCheck color="var(--color-primary)" size={16} />}
                    </div>
                    <p className={styles.radioCardDesc}>
                      Direct author publishing. Recommended for smaller teams or solo-directed projects.
                    </p>
                  </div>
                </div>
              </div>

              {/* Roles Overview */}
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
                    Ownership & Permissions
                  </span>
                </div>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>
                  You will automatically be established as the <strong>Studio Owner</strong>. You will be able to
                  invite team members (Admins, Editors, Artists) via email immediately after creation.
                </p>
              </div>

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

                <Button type="submit" variant="primary" isLoading={isLoading}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <LuBuilding2 size={16} aria-hidden="true" />
                    <span>Create Studio Workspace</span>
                  </span>
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Sleek Live Preview & Quick Tips */}
        <aside className={styles.sidebarCol} aria-label="Studio Overview and Guidance">
          {/* Live Studio Card Preview */}
          <div className={styles.previewSection}>
            <div className={styles.previewHeader}>
              <span className={styles.previewTag}>
                {/* <LuSparkles size={14} aria-hidden="true" />
                <span>Live Studio Preview</span> */}
              </span>
              <span className={styles.previewLiveBadge}>Active Preview</span>
            </div>

            <div className={styles.previewCardBody}>
              <div className={styles.studioAvatarRow}>
                <div className={styles.studioAvatar}>{studioInitial}</div>
                <div className={styles.studioIdentity}>
                  <h3 className={styles.studioPreviewName}>
                    {name.trim() || "Your Studio Name"}
                  </h3>
                  <span className={styles.studioPreviewSlug}>@{liveSlug}</span>
                  <div className={styles.studioRolePill}>
                    <LuShieldCheck size={12} aria-hidden="true" />
                    <span>Studio Owner</span>
                  </div>
                </div>
              </div>

              <p className={styles.studioPreviewDesc}>
                {description.trim() ||
                  "A brief summary of your collective's publishing vision and serialized comic titles will appear here."}
              </p>

              <div className={styles.previewCapabilities}>
                <div className={styles.capItem}>
                  <LuBookOpen size={14} color="var(--color-primary)" />
                  <span>Focus: {publishingFocus}</span>
                </div>
                <div className={styles.capItem}>
                  <LuUsers size={14} color="var(--color-primary)" />
                  <span>Team: Owner + Unlimited Collaborators</span>
                </div>
                <div className={styles.capItem}>
                  <LuLayers size={14} color="var(--color-primary)" />
                  <span>Workflow: {reviewMode === "editorial" ? "Editorial Approvals" : "Direct Publish"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips Box */}
          <div className={styles.tipsCard}>
            <div className={styles.tipsHeader}>
              <LuCircleHelp size={18} color="var(--color-primary)" />
              <span>What is a Studio Workspace?</span>
            </div>

            <ul className={styles.tipsList}>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <div>
                  <strong>Collaborative Publishing:</strong> Organize multiple writers, pencillers, colorists, and editors under one recognizable brand imprint.
                </div>
              </li>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <div>
                  <strong>Role-Based Security:</strong> Admins can manage series, Editors can review chapter revisions, and Members receive production task assignments.
                </div>
              </li>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <div>
                  <strong>Centralized Production:</strong> Share chapter upload workspaces, track progress on the production Kanban board, and streamline approvals.
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
