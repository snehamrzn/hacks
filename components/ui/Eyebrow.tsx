import { cn } from "@/lib/cn";

/** Monospace, uppercase, wide-tracked label — a signature of the aesthetic. */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-eyebrow uppercase text-subtle",
        className
      )}
    >
      <span className="h-px w-6 bg-border-strong" aria-hidden />
      {children}
    </span>
  );
}
