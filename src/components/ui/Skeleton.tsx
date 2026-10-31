import React from "react";
import styles from "./Skeleton.module.css";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rect" | "card";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "rect",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  if (variant === "card") {
    return (
      <div
        className={`${styles.card} ${className || ""}`}
        role="status"
        aria-label="Loading content..."
        style={{ width, ...style }}
        {...props}
      >
        <div className={`${styles.skeleton} ${styles.cardCover}`} />
        <div className={styles.cardBody}>
          <div className={`${styles.skeleton} ${styles.text}`} style={{ width: "35%", height: "14px" }} />
          <div className={`${styles.skeleton} ${styles.text}`} style={{ width: "85%", height: "20px" }} />
          <div className={`${styles.skeleton} ${styles.text}`} style={{ width: "50%", height: "14px" }} />
          <div className={`${styles.skeleton} ${styles.text}`} style={{ width: "100%", height: "12px", marginTop: "4px" }} />
          <div className={`${styles.skeleton} ${styles.text}`} style={{ width: "70%", height: "12px" }} />
        </div>
      </div>
    );
  }

  const shapeClass =
    variant === "circle"
      ? styles.circle
      : variant === "text"
      ? styles.text
      : styles.rect;

  return (
    <div
      className={`${styles.skeleton} ${shapeClass} ${className || ""}`}
      role="status"
      aria-label="Loading..."
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}
