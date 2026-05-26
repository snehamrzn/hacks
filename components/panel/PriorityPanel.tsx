"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import { easeExpoOut } from "@/lib/motion";
import type { ReasonCode, ScoredFeeder } from "@/lib/scoring";

type Props = {
  feeders: ScoredFeeder[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function PriorityPanel({ feeders, selectedId, onSelect }: Props) {
  const top = feeders.slice(0, 10);
  return (
    <aside className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
      <header className="flex items-baseline justify-between gap-4 px-1">
        <Eyebrow>Top 10 Priorities</Eyebrow>
        <span className="font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle">
          {feeders.length} ranked
        </span>
      </header>

      <div className="-mx-1 flex-1 overflow-y-auto pr-1">
        <motion.ul layout className="flex flex-col gap-3 px-1 pb-3">
          <AnimatePresence initial={false}>
            {top.map((f, i) => (
              <motion.li
                key={f.id}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: easeExpoOut }}
              >
                <FeederRow
                  rank={i + 1}
                  feeder={f}
                  selected={f.id === selectedId}
                  onClick={() => onSelect(f.id)}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </aside>
  );
}

function FeederRow({
  rank,
  feeder,
  selected,
  onClick,
}: {
  rank: number;
  feeder: ScoredFeeder;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group block w-full rounded-lg border bg-surface px-5 py-4 text-left",
        "transition-colors duration-200 ease-standard",
        selected
          ? "border-accent/60 bg-elevated"
          : "border-border hover:border-border-strong hover:bg-elevated"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-1 font-mono text-eyebrow tracking-[0.15em] text-subtle">
            #{String(rank).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-fg">{feeder.name}</div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle">
              <span>{feeder.region}</span>
              {typeof feeder.voltageKv === "number" && feeder.voltageKv > 0 && (
                <>
                  <span aria-hidden className="text-border-strong">·</span>
                  <span>{feeder.voltageKv} kV</span>
                </>
              )}
              {typeof feeder.chargersNearby === "number" && (
                <>
                  <span aria-hidden className="text-border-strong">·</span>
                  <span>{feeder.chargersNearby} EV</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-lg font-semibold leading-none tabular-nums text-fg">
            {(feeder.composite * 100).toFixed(0)}
          </div>
          <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-subtle">
            score
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <ScoreBar label="Climate exposure" value={feeder.hazard} />
        <ScoreBar label="Asset vulnerability" value={feeder.asset} />
        <ScoreBar label="Load growth" value={feeder.loadDelta} />
      </div>

      <div className="mt-5">
        <ReasonChip reason={feeder.reason} />
      </div>
    </button>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-[0.65rem] uppercase tracking-[0.15em] text-subtle">
        <span>{label}</span>
        <span className="tabular-nums text-muted">{(value * 100).toFixed(0)}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full bg-accent/80"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

const REASON_LABEL: Record<ReasonCode, string> = {
  "climate-driven": "Climate-driven",
  "load-driven": "Load-driven",
  "asset-driven": "Asset-driven",
  both: "Climate + Load",
};

function ReasonChip({ reason }: { reason: ReasonCode }) {
  const variant = reason === "both" || reason === "climate-driven" || reason === "load-driven" ? "accent" : "default";
  return <Badge variant={variant as any}>{REASON_LABEL[reason]}</Badge>;
}
