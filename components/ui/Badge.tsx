import { cn } from "@/lib/cn";

/** Pill badge. Use `accent` for the highlighted variant. */
export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: "default" | "accent";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-eyebrow uppercase",
        variant === "default" && "border-border text-muted",
        variant === "accent" && "border-accent/40 bg-accent/10 text-accent-hover",
        className
      )}
    >
      {children}
    </span>
  );
}
