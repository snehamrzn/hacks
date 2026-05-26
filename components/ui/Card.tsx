import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group rounded-lg border border-border bg-surface p-6",
        "transition-colors duration-250 ease-standard",
        "hover:border-border-strong hover:bg-elevated",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-h3 font-medium text-fg">{children}</h3>;
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>;
}
