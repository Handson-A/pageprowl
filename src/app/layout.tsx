import type { Metadata } from "next";
import React from "react";
import { MotionProvider } from "@/components/providers/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Panelverse — Collaborative Comic Publishing Platform",
    template: "%s | Panelverse",
  },
  description:
    "Panelverse brings together independent creators, studios, and passionate readers. Enjoy vertical-scroll and page-by-page comics straight from the creators.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/brand/panelverse-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
