import React from "react";
import styles from "./EmptyState.module.css";
import { LuBookOpen } from "react-icons/lu";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon = <LuBookOpen size={40} color="var(--color-text-muted)" />,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
