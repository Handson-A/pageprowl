import type { Metadata } from "next";
import React from "react";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { NetworkStatusProvider } from "@/components/providers/NetworkStatusProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PageProwl — Collaborative Comic Publishing Platform",
    template: "%s | PageProwl",
  },
  description:
    "PageProwl brings together independent creators, studios, and passionate readers. Enjoy vertical-scroll and page-by-page comics straight from the creators.",
  openGraph: {
    title: "PageProwl — Collaborative Comic Publishing Platform",
    description:
      "PageProwl brings together independent creators, studios, and passionate readers. Enjoy vertical-scroll and page-by-page comics straight from the creators.",
    siteName: "PageProwl",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/brand/pageprowl-icon.svg",
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
        <NetworkStatusProvider>
          <MotionProvider>{children}</MotionProvider>
        </NetworkStatusProvider>
      </body>
    </html>
  );
}
