import React from "react";
import styles from "./StatusBadge.module.css";
import type { RevisionStatus } from "@/types/database";

export interface StatusBadgeProps {
  status: RevisionStatus | "restricted" | "scheduled";
  label?: string;
  className?: string;
}

const statusDisplayMap: Record<
  RevisionStatus | "restricted" | "scheduled",
  { label: string; styleKey: string }
> = {
  draft: { label: "Draft", styleKey: "draft" },
  in_review: { label: "In Review", styleKey: "inReview" },
  ready_to_publish: { label: "Ready to Publish", styleKey: "readyToPublish" },
  published: { label: "Published", styleKey: "published" },
  unpublished: { label: "Unpublished", styleKey: "draft" },
  archived: { label: "Archived", styleKey: "draft" },
  restricted: { label: "Restricted", styleKey: "restricted" },
  scheduled: { label: "Scheduled", styleKey: "readyToPublish" },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusDisplayMap[status] || { label: status, styleKey: "draft" };
  const badgeClass = `${styles.badge} ${styles[config.styleKey]} ${className || ""}`.trim();

  return <span className={badgeClass}>{label || config.label}</span>;
}
