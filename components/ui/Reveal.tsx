"use client";

import { motion } from "framer-motion";
import { reveal, staggerParent, staggerItem, inViewOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Fades + slides its content up once it scrolls into view. */
export function Reveal({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Wrap a list; direct <Stagger.Item> children animate in sequence. */
export function Stagger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={staggerItem} className={cn(className)}>
      {children}
    </motion.div>
  );
}

// Convenience alias (works within client components).
Stagger.Item = StaggerItem;
