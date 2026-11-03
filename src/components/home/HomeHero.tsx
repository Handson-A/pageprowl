"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { LuArrowRight, LuSparkles, LuLayers } from "react-icons/lu";
import { Button } from "@/components/ui/Button";
import styles from "./HomeHero.module.css";

const STANDARD_EASE = [0.2, 0.7, 0.2, 1] as const;

export function HomeHero() {
  const shouldReduceMotion = useReducedMotion();

  const transitionConfig: Transition = {
    duration: shouldReduceMotion ? 0 : 0.35,
    ease: STANDARD_EASE,
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        {/* Left Column: Story-First Typography & Actions */}
        <motion.div
          className={styles.heroCopy}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitionConfig}
        >
          <div className={styles.badge}>
            {/* <LuSparkles size={13} className={styles.badgeIcon} aria-hidden="true" /> */}
            <span>Independent Comic Publishing Platform</span>
          </div>

          <h1 className={styles.headline}>
            Great stories <br />
            find their <br />
            people here.
          </h1>

          <p className={styles.lead}>
            Discover, read, and support independent comics. <br className={styles.leadBreak} />
            Built for creators, studios, and passionate readers.
          </p>

          <div className={styles.actions}>
            <Link href="/browse">
              <Button variant="primary" size="lg">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <span>Explore Comics</span>
                  <LuArrowRight size={18} aria-hidden="true" />
                </span>
              </Button>
            </Link>

            <Link href="/studio">
              <Button variant="secondary" size="lg" className={styles.secondaryBtn}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <LuLayers size={18} aria-hidden="true" />
                  <span>Creator Studio</span>
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Dynamic Comic Artwork Composition */}
        <motion.div
          className={styles.heroArt}
          initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transitionConfig, delay: shouldReduceMotion ? 0 : 0.1 }}
          aria-hidden="true"
        >
          <div className={styles.artFrame}>
            {/* Cinematic Comic Panel Montage */}
            <svg
              viewBox="0 0 600 520"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.artSvg}
            >
              <defs>
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E1C1A" />
                  <stop offset="60%" stopColor="#2D211F" />
                  <stop offset="100%" stopColor="#E44735" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="warmSun" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F2C14E" />
                  <stop offset="100%" stopColor="#E44735" />
                </linearGradient>
                <linearGradient id="panelRim" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F2C14E" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#E44735" stopOpacity="0.2" />
                </linearGradient>
                <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E44735" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#171717" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Glow */}
              <circle cx="360" cy="240" r="260" fill="url(#haloGlow)" />

              {/* Main Angular Comic Panel */}
              <g stroke="#171717" strokeWidth="6" strokeLinejoin="round">
                {/* Back Panel: Distant Sci-Fi City Skyline */}
                <path
                  d="M40 30H540C555 30 565 42 565 58V450C565 466 552 480 536 480H64C48 480 35 466 35 450V60C35 43 45 30 40 30Z"
                  fill="url(#skyGrad)"
                />

                {/* Horizon & Sun Disc */}
                <circle cx="410" cy="220" r="76" fill="url(#warmSun)" opacity="0.85" />

                {/* Futuristic Comic Skyline Silhouettes */}
                <path
                  d="M60 480V340L90 310V480H120V260L160 220L190 260V480H230V290L260 270V480H310V330L340 300V480H390V280L430 240L460 280V480H500V360L540 320V480H60Z"
                  fill="#171717"
                  opacity="0.95"
                />

                {/* Foreground Hero Character Silhouette Silhouette with Comic Inking */}
                {/* Hood / Cape flowing */}
                <path
                  d="M170 480C165 410 180 340 210 290C230 255 270 230 310 235C350 240 380 270 395 315C410 360 415 420 420 480H170Z"
                  fill="#171717"
                />

                {/* Comic Rim Highlights on Hero Silhouette */}
                <path
                  d="M210 290C230 255 270 230 310 235C330 238 350 250 365 270"
                  stroke="#F2C14E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M395 315C410 360 415 420 420 480"
                  stroke="#E44735"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Dynamic Overlapping Panels (Signature Comic Aesthetic) */}
                {/* Secondary Inset Panel (Top Left) */}
                <rect
                  x="20"
                  y="70"
                  width="130"
                  height="160"
                  rx="8"
                  fill="#1E1C1A"
                  stroke="#E44735"
                  strokeWidth="3"
                />
                <path d="M35 150L65 110L95 140L135 90" stroke="#F2C14E" strokeWidth="3" strokeLinecap="round" fill="none" />
                <circle cx="95" cy="115" r="8" fill="#E44735" />

                {/* Third Inset Panel (Bottom Right Action Callout) */}
                <rect
                  x="420"
                  y="340"
                  width="150"
                  height="110"
                  rx="8"
                  fill="#171717"
                  stroke="#F2C14E"
                  strokeWidth="3"
                />
                <path
                  d="M440 410L470 370L500 400L540 360"
                  stroke="#E44735"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="500" cy="380" r="6" fill="#F7F0E3" />
              </g>

              {/* Floating Comic Panel Lines */}
              <line x1="30" y1="40" x2="570" y2="40" stroke="url(#panelRim)" strokeWidth="2" />
            </svg>

            {/* Floating Live Badge */}
            <div className={styles.artPill}>
              <span className={styles.artPillDot} />
              <span>Original Creator Stories</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Organic Bottom Curve Transition into warm page background */}
      <div className={styles.heroCurve} aria-hidden="true">
        <svg
          viewBox="0 0 1440 36"
          fill="none"
          preserveAspectRatio="none"
          className={styles.curveSvg}
        >
          <path
            d="M0,0 C360,28 820,36 1140,16 C1280,8 1380,2 1440,0 L1440,36 L0,36 Z"
            fill="var(--color-bg)"
          />
        </svg>
      </div>
    </section>
  );
}
