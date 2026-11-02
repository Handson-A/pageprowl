"use client";

import React, { useState, useRef } from "react";
import styles from "./AccountProfile.module.css";
import {
  LuCamera,
  LuPencil,
  LuSave,
  LuX,
  LuCheck,
  LuCircleAlert,
  LuMail,
  LuUser,
  LuShield,
  LuBell,
  LuGlobe,
  LuLoader,
} from "react-icons/lu";
import {
  updateAvatarAction,
  updateProfileIdentityAction,
  updateAccountPreferencesAction,
} from "@/app/studio/profile/actions";

export interface AccountProfileManagerProps {
  user: {
    id: string;
    email?: string;
    createdAt?: string;
  };
  profile: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    role: string;
    createdAt?: string;
  };
  creatorProfile?: {
    penName?: string | null;
    websiteUrl?: string | null;
  } | null;
  preferences?: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
    notifyNewEpisodes: boolean;
  } | null;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function AccountProfileManager({
  user,
  profile,
  creatorProfile,
  preferences: initialPreferences,
}: AccountProfileManagerProps) {
  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatarUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Identity state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [penName, setPenName] = useState(creatorProfile?.penName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [websiteUrl, setWebsiteUrl] = useState(creatorProfile?.websiteUrl || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Edit draft state (for Cancel restoration)
  const [draftDisplayName, setDraftDisplayName] = useState(displayName);
  const [draftPenName, setDraftPenName] = useState(penName);
  const [draftBio, setDraftBio] = useState(bio);
  const [draftWebsiteUrl, setDraftWebsiteUrl] = useState(websiteUrl);

  // Preferences state
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(
    initialPreferences?.inAppNotifications ?? true
  );
  const [emailNotifications, setEmailNotifications] = useState(
    initialPreferences?.emailNotifications ?? true
  );
  const [notifyNewEpisodes, setNotifyNewEpisodes] = useState(
    initialPreferences?.notifyNewEpisodes ?? true
  );
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  // Feedback states
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearFeedback = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // Avatar file upload handler via Cloudinary
  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearFeedback();
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage(
        "Invalid file format. Please upload a JPG, PNG, WEBP, or AVIF image."
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("Avatar file exceeds the maximum 5MB size limit.");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // 1. Get signed signature
      const sigRes = await fetch("/api/media/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "avatar" }),
      });

      if (!sigRes.ok) {
        const errJson = await sigRes.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to authorize avatar upload.");
      }

      const sigData = await sigRes.json();

      // 2. Direct upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);
      if (sigData.tags) {
        formData.append("tags", sigData.tags);
      }

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) {
        const errJson = await uploadRes.json().catch(() => ({}));
        throw new Error(errJson.error?.message || "Failed to upload image to Cloudinary.");
      }

      const uploadData = await uploadRes.json();

      // 3. Register media asset
      await fetch("/api/media/asset", {
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
      }).catch(() => {
        // Non-blocking if already registered
      });

      // 4. Update avatar in database
      await updateAvatarAction(uploadData.secure_url, uploadData.public_id);

      setAvatarUrl(uploadData.secure_url);
      setSuccessMessage("Avatar successfully replaced!");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload avatar.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Profile Identity Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!draftDisplayName || draftDisplayName.trim().length < 2) {
      setErrorMessage("Display name must be at least 2 characters.");
      return;
    }

    if (draftDisplayName.trim().length > 50) {
      setErrorMessage("Display name cannot exceed 50 characters.");
      return;
    }

    if (
      draftWebsiteUrl &&
      !draftWebsiteUrl.startsWith("http://") &&
      !draftWebsiteUrl.startsWith("https://")
    ) {
      setErrorMessage("Website URL must begin with https:// or http://");
      return;
    }

    setIsSavingProfile(true);

    try {
      await updateProfileIdentityAction({
        displayName: draftDisplayName.trim(),
        penName: draftPenName.trim() || null,
        bio: draftBio.trim() || null,
        websiteUrl: draftWebsiteUrl.trim() || null,
      });

      setDisplayName(draftDisplayName.trim());
      setPenName(draftPenName.trim());
      setBio(draftBio.trim());
      setWebsiteUrl(draftWebsiteUrl.trim());
      setIsEditingProfile(false);
      setSuccessMessage("Profile details updated successfully!");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update profile details.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelProfile = () => {
    setDraftDisplayName(displayName);
    setDraftPenName(penName);
    setDraftBio(bio);
    setDraftWebsiteUrl(websiteUrl);
    setIsEditingProfile(false);
    clearFeedback();
  };

  // Preferences Save
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    setIsSavingPreferences(true);

    try {
      await updateAccountPreferencesAction({
        inAppNotifications,
        emailNotifications,
        notifyNewEpisodes,
      });

      setIsEditingPreferences(false);
      setSuccessMessage("Notification preferences saved successfully!");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save preferences.");
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleCancelPreferences = () => {
    setInAppNotifications(initialPreferences?.inAppNotifications ?? true);
    setEmailNotifications(initialPreferences?.emailNotifications ?? true);
    setNotifyNewEpisodes(initialPreferences?.notifyNewEpisodes ?? true);
    setIsEditingPreferences(false);
    clearFeedback();
  };

  const monogram = (displayName || profile.username || "P").charAt(0).toUpperCase();

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Active Member";

  return (
    <div className={styles.container}>
      {/* Feedback Alerts */}
      {successMessage && (
        <div className={styles.alertSuccess} role="status">
          <LuCheck size={18} aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className={styles.alertError} role="alert">
          <LuCircleAlert size={18} aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden file input for Avatar selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileSelect}
        accept="image/png,image/jpeg,image/webp,image/avif"
        className={styles.fileInputHidden}
        aria-label="Upload avatar image file"
      />

      {/* Hero Profile Overview Card */}
      <section className={styles.heroCard} aria-label="Profile Overview">
        <div className={styles.heroLeft}>
          <div className={styles.avatarContainer}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${displayName}'s Avatar`}
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarPlaceholder} aria-hidden="true">
                {monogram}
              </div>
            )}

            <button
              type="button"
              className={styles.avatarUploadButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              title="Upload new avatar image from device"
              aria-label="Change profile avatar"
            >
              {isUploadingAvatar ? (
                <LuLoader size={16} className="spin" />
              ) : (
                <LuCamera size={16} />
              )}
            </button>
          </div>

          <div className={styles.heroMeta}>
            <h2 className={styles.displayName}>{displayName}</h2>
            <span className={styles.username}>@{profile.username}</span>

            <div className={styles.badgeRow}>
              <span className={styles.roleBadge}>
                {profile.role || "MEMBER"}
              </span>
              <span className={styles.memberSince}>Joined {formattedDate}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Profile & Identity */}
      <section className={styles.section} aria-label="Profile and Identity Settings">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Profile & Identity</h3>
            <p className={styles.sectionSubtitle}>
              Public credentials displayed across comic reader comments, credits, and public creator pages.
            </p>
          </div>

          {!isEditingProfile && (
            <button
              type="button"
              className={styles.editButton}
              onClick={() => {
                setDraftDisplayName(displayName);
                setDraftPenName(penName);
                setDraftBio(bio);
                setDraftWebsiteUrl(websiteUrl);
                setIsEditingProfile(true);
              }}
              aria-label="Edit Profile & Identity"
            >
              <LuPencil size={15} aria-hidden="true" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {/* Display State vs Edit State */}
        {!isEditingProfile ? (
          <div className={styles.displayGrid}>
            <div className={styles.displayItem}>
              <span className={styles.itemLabel}>Display Name</span>
              <span className={styles.itemValue}>{displayName}</span>
            </div>

            <div className={styles.displayItem}>
              <span className={styles.itemLabel}>Pen Name / Publisher</span>
              <span className={penName ? styles.itemValue : styles.itemValueMuted}>
                {penName || "Not configured (using Display Name)"}
              </span>
            </div>

            <div className={styles.displayItemFull}>
              <span className={styles.itemLabel}>Biography</span>
              <span className={bio ? styles.itemValue : styles.itemValueMuted}>
                {bio || "No biography provided yet."}
              </span>
            </div>

            <div className={styles.displayItemFull}>
              <span className={styles.itemLabel}>Website / Portfolio</span>
              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.itemValue}
                  style={{ color: "var(--color-accent)", textDecoration: "underline" }}
                >
                  {websiteUrl}
                </a>
              ) : (
                <span className={styles.itemValueMuted}>None</span>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className={styles.editForm}>
            <div>
              <label htmlFor="input-displayName" className={styles.itemLabel}>
                Display Name (Required)
              </label>
              <input
                id="input-displayName"
                type="text"
                value={draftDisplayName}
                onChange={(e) => setDraftDisplayName(e.target.value)}
                required
                minLength={2}
                maxLength={50}
                className={styles.inputField}
              />
            </div>

            <div>
              <label htmlFor="input-penName" className={styles.itemLabel}>
                Pen Name / Studio Imprint
              </label>
              <input
                id="input-penName"
                type="text"
                value={draftPenName}
                onChange={(e) => setDraftPenName(e.target.value)}
                maxLength={50}
                placeholder="Optional author pseudonym"
                className={styles.inputField}
              />
            </div>

            <div>
              <label htmlFor="input-bio" className={styles.itemLabel}>
                Biography (Max 500 characters)
              </label>
              <textarea
                id="input-bio"
                value={draftBio}
                onChange={(e) => setDraftBio(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Storyteller, illustrator, manga lover..."
                className={styles.textareaField}
              />
            </div>

            <div>
              <label htmlFor="input-website" className={styles.itemLabel}>
                Website or Social Portfolio Link
              </label>
              <input
                id="input-website"
                type="url"
                value={draftWebsiteUrl}
                onChange={(e) => setDraftWebsiteUrl(e.target.value)}
                placeholder="https://yourportfolio.art"
                className={styles.inputField}
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancelProfile}
                disabled={isSavingProfile}
              >
                <LuX size={15} aria-hidden="true" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={isSavingProfile}
              >
                <LuSave size={15} aria-hidden="true" />
                <span>{isSavingProfile ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Section 2: Account & Security Information */}
      <section className={styles.section} aria-label="Account & Security Details">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Account & Security</h3>
            <p className={styles.sectionSubtitle}>
              Private account identifier and authentication credentials.
            </p>
          </div>
        </div>

        <div className={styles.displayGrid}>
          <div className={styles.displayItem}>
            <span className={styles.itemLabel}>Email Address</span>
            <span className={styles.itemValue}>{user.email || "Registered Account"}</span>
          </div>

          <div className={styles.displayItem}>
            <span className={styles.itemLabel}>Username Handle</span>
            <span className={styles.itemValue}>@{profile.username}</span>
          </div>

          <div className={styles.displayItem}>
            <span className={styles.itemLabel}>Account ID</span>
            <span
              className={styles.itemValue}
              style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
            >
              {user.id}
            </span>
          </div>

          <div className={styles.displayItem}>
            <span className={styles.itemLabel}>Role Privileges</span>
            <span className={styles.itemValue}>
              {(profile.role || "user").toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      {/* Section 3: Reader & Notification Preferences */}
      <section className={styles.section} aria-label="Notification Preferences">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h3 className={styles.sectionTitle}>Preferences</h3>
            <p className={styles.sectionSubtitle}>
              Configure release alerts and communication preferences.
            </p>
          </div>

          {!isEditingPreferences && (
            <button
              type="button"
              className={styles.editButton}
              onClick={() => setIsEditingPreferences(true)}
              aria-label="Edit Preferences"
            >
              <LuPencil size={15} aria-hidden="true" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {!isEditingPreferences ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div className={styles.preferenceRow}>
              <div className={styles.preferenceInfo}>
                <span className={styles.preferenceTitle}>In-App Notifications</span>
                <span className={styles.preferenceDescription}>
                  Activity alerts in your Creator Studio bell and reader header
                </span>
              </div>
              <span
                className={`${styles.statusIndicator} ${
                  inAppNotifications ? styles.statusActive : styles.statusInactive
                }`}
              >
                {inAppNotifications ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className={styles.preferenceRow}>
              <div className={styles.preferenceInfo}>
                <span className={styles.preferenceTitle}>Email Notifications</span>
                <span className={styles.preferenceDescription}>
                  Editorial reviews, revision requests, and task assignments
                </span>
              </div>
              <span
                className={`${styles.statusIndicator} ${
                  emailNotifications ? styles.statusActive : styles.statusInactive
                }`}
              >
                {emailNotifications ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className={styles.preferenceRow}>
              <div className={styles.preferenceInfo}>
                <span className={styles.preferenceTitle}>New Episode Alerts</span>
                <span className={styles.preferenceDescription}>
                  Automatic updates when comic series in your library release new chapters
                </span>
              </div>
              <span
                className={`${styles.statusIndicator} ${
                  notifyNewEpisodes ? styles.statusActive : styles.statusInactive
                }`}
              >
                {notifyNewEpisodes ? "Subscribed" : "Muted"}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSavePreferences} className={styles.editForm}>
            <div className={styles.preferenceRow}>
              <label
                htmlFor="toggle-inApp"
                className={styles.preferenceInfo}
                style={{ cursor: "pointer" }}
              >
                <span className={styles.preferenceTitle}>In-App Notifications</span>
                <span className={styles.preferenceDescription}>
                  Activity alerts in your Creator Studio bell and reader header
                </span>
              </label>
              <input
                id="toggle-inApp"
                type="checkbox"
                checked={inAppNotifications}
                onChange={(e) => setInAppNotifications(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
              />
            </div>

            <div className={styles.preferenceRow}>
              <label
                htmlFor="toggle-email"
                className={styles.preferenceInfo}
                style={{ cursor: "pointer" }}
              >
                <span className={styles.preferenceTitle}>Email Notifications</span>
                <span className={styles.preferenceDescription}>
                  Editorial reviews, revision requests, and task assignments
                </span>
              </label>
              <input
                id="toggle-email"
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
              />
            </div>

            <div className={styles.preferenceRow}>
              <label
                htmlFor="toggle-newEp"
                className={styles.preferenceInfo}
                style={{ cursor: "pointer" }}
              >
                <span className={styles.preferenceTitle}>New Episode Alerts</span>
                <span className={styles.preferenceDescription}>
                  Automatic updates when comic series in your library release new chapters
                </span>
              </label>
              <input
                id="toggle-newEp"
                type="checkbox"
                checked={notifyNewEpisodes}
                onChange={(e) => setNotifyNewEpisodes(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "var(--color-accent)" }}
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancelPreferences}
                disabled={isSavingPreferences}
              >
                <LuX size={15} aria-hidden="true" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={isSavingPreferences}
              >
                <LuSave size={15} aria-hidden="true" />
                <span>{isSavingPreferences ? "Saving..." : "Save Preferences"}</span>
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
