import React from "react";

export interface PageProwlLogoProps {
  variant?: "full" | "monogram" | "icon";
  theme?: "dark" | "light" | "red";
  size?: "sm" | "md" | "lg" | number;
  showTagline?: boolean;
  className?: string;
}

export function PageProwlLogo({
  variant = "full",
  theme = "light",
  size = "md",
  showTagline = false,
  className,
}: PageProwlLogoProps) {
  // Height in pixels
  let height = 36;
  if (typeof size === "number") {
    height = size;
  } else if (size === "sm") {
    height = 26;
  } else if (size === "lg") {
    height = 48;
  }

  // Approved palette
  const textColor =
    theme === "dark" ? "#F7F0E3" : theme === "red" ? "#FFFFFF" : "#171717";
  const strokeColor =
    theme === "dark" ? "#F7F0E3" : theme === "red" ? "#FFFFFF" : "#171717";
  const taglineColor =
    theme === "dark"
      ? "#A3A3A3"
      : theme === "red"
      ? "#F7F0E3"
      : "#625D55";

  // Monogram aspect ratio (90 x 114 => ~0.79)
  const monogramWidth = Math.round(height * (90 / 114));

  // The PageProwl geometric panel initial 'P' symbol
  const MonogramMark = () => (
    <svg
      width={monogramWidth}
      height={height}
      viewBox="0 0 90 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
      aria-hidden="true"
    >
      <g stroke={strokeColor} strokeWidth="4" strokeLinejoin="miter">
        {/* Top-Left Paper Panel */}
        <path d="M4 8H40V42H4Z" fill="#F7F0E3" />
        {/* Top-Right Comic Red Bowl */}
        <path d="M44 8H55C75 8 85 21 85 38C85 55 75 65 55 65H44Z" fill="#E44735" />
        {/* Bottom-Left Golden Yellow Stem */}
        <path d="M4 47H40V99L4 106Z" fill="#F2C14E" />
        {/* Bottom-Right Comic Red Accent */}
        <path d="M44 70H58V99L44 102Z" fill="#E44735" />
      </g>
    </svg>
  );

  if (variant === "monogram") {
    return (
      <div
        className={className}
        style={{ display: "inline-flex", alignItems: "center" }}
        aria-label="PageProwl"
      >
        <MonogramMark />
      </div>
    );
  }

  if (variant === "icon") {
    // Compact App Icon with dark squircle container
    return (
      <div
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-label="PageProwl Icon"
      >
        <svg
          width={height}
          height={height}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="128" height="128" rx="24" fill="#171717" />
          <g stroke="#171717" strokeWidth="5" strokeLinejoin="miter">
            <path d="M27 22H66V55H27Z" fill="#F7F0E3" />
            <path d="M70 22H82C101 22 111 35 111 52C111 69 101 79 82 79H70Z" fill="#E44735" />
            <path d="M27 60H66V105L27 113Z" fill="#F2C14E" />
            <path d="M70 84H84V105L70 108Z" fill="#E44735" />
          </g>
        </svg>
      </div>
    );
  }

  // Full Horizontal Logo
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.max(8, Math.round(height * 0.28)),
        textDecoration: "none",
        lineHeight: 1,
      }}
    >
      <MonogramMark />
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: `${Math.round(height * 0.62)}px`,
            fontWeight: 800,
            letterSpacing: "0.04em",
            color: textColor,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          PAGEPROWL
        </span>
        {showTagline && (
          <span
            style={{
              fontFamily: "var(--font-family-body)",
              fontSize: `${Math.max(9, Math.round(height * 0.22))}px`,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: taglineColor,
              textTransform: "uppercase",
              marginTop: "2px",
            }}
          >
            COMICS / CREATORS / TOGETHER
          </span>
        )}
      </div>
    </div>
  );
}

// Alias for backwards compatibility
export const PanelverseLogo = PageProwlLogo;
export type PanelverseLogoProps = PageProwlLogoProps;
