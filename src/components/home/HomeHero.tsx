"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion, Transition } from "framer-motion";
import { LuZap, LuArrowRight } from "react-icons/lu";
import { Button } from "@/components/ui/Button";
import styles from "@/app/page.module.css";

const STANDARD_EASE = [0.2, 0.7, 0.2, 1] as const;

export function HomeHero() {
  const shouldReduceMotion = useReducedMotion();

  const transitionConfig: Transition = {
    duration: shouldReduceMotion ? 0 : 0.28,
    ease: STANDARD_EASE,
  };

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.heroInner}
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitionConfig}
      >
        <motion.div
          className={styles.badge}
          initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transitionConfig, delay: shouldReduceMotion ? 0 : 0.05 }}
        >
          <LuZap size={14} color="var(--color-primary)" aria-hidden="true" />
          <span>A Publishing Platform for Comic Creators</span>
        </motion.div>

        <motion.h1
          className={styles.heroTitle}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionConfig, delay: shouldReduceMotion ? 0 : 0.1 }}
        >
          Where great stories are created, collaborated on, and published.
        </motion.h1>

        <motion.p
          className={styles.heroLead}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionConfig, delay: shouldReduceMotion ? 0 : 0.15 }}
        >
          Panelverse brings together independent creators, studios, and passionate
          readers. Enjoy vertical-scroll and page-by-page comics straight from
          the creators.
        </motion.p>

        <motion.div
          className={styles.heroActions}
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionConfig, delay: shouldReduceMotion ? 0 : 0.2 }}
        >
          <Link href="/browse">
            <Button variant="primary" size="lg">
              <span>Explore Comics</span>
              <LuArrowRight size={18} aria-hidden="true" style={{ marginLeft: "6px" }} />
            </Button>
          </Link>
          <Link href="/studio">
            <Button variant="secondary" size="lg">
              <span>Creator Studio</span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
