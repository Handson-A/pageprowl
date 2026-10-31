"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface MotionRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  staggerChildren?: number;
}

export function MotionReveal({
  children,
  delay = 0,
  duration = 0.35,
  yOffset = 12,
  className,
  staggerChildren,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.2, 0.7, 0.2, 1],
        when: "beforeChildren",
        staggerChildren: staggerChildren || 0,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className,
  yOffset = 8,
  whileHover,
  whileTap,
}: {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  whileHover?: { y?: number; scale?: number };
  whileTap?: { scale?: number };
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.2, 0.7, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
