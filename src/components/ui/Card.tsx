import React from "react";
import styles from "./Card.module.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted";
  clickable?: boolean;
}

export function Card({
  variant = "default",
  clickable = false,
  className,
  children,
  ...props
}: CardProps) {
  const cardClass = [
    styles.card,
    styles[variant],
    clickable ? styles.clickable : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
}
