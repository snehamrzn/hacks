"use client";

import { motion } from "framer-motion";
import { easeStandard } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg hover:bg-muted border border-transparent",
  secondary:
    "bg-transparent text-fg border border-border hover:border-border-strong hover:bg-elevated",
  ghost:
    "bg-transparent text-muted border border-transparent hover:text-fg hover:bg-elevated",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: easeStandard }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded font-medium",
        "transition-colors duration-200 ease-standard",
        "focus-visible:shadow-focus-ring outline-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
