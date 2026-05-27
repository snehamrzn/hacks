"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ONTARIO_FEEDERS, DATASET_META } from "@/lib/data/feeders";
import { DEFAULT_WEIGHTS, rankFeeders, type Weights } from "@/lib/scoring";
import { PriorityPanel } from "@/components/panel/PriorityPanel";
import { WeightSliders } from "@/components/panel/WeightSliders";
import { CopilotPanel } from "@/components/panel/CopilotPanel";
import { Eyebrow } from "@/components/ui/Eyebrow";

const ArcGISMap = dynamic(
  () => import("@/components/map/ArcGISMap").then((m) => m.ArcGISMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

export default function Home() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scored = useMemo(() => rankFeeders(ONTARIO_FEEDERS, weights), [weights]);
  const selected = useMemo(
    () => scored.find((f) => f.id === selectedId) ?? null,
    [scored, selectedId]
  );

  return (
    <main className="flex h-dvh flex-col bg-bg text-fg">
      <Header />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 px-5 pb-5 lg:grid-cols-[1fr_25rem] xl:grid-cols-[1fr_27rem]">
        <section className="relative min-h-0">
          <ArcGISMap
            feeders={scored}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <CopilotPanel
            feeder={selected}
            onClose={() => setSelectedId(null)}
          />
        </section>
        <section className="flex min-h-0 flex-col gap-4 overflow-hidden">
          <WeightSliders weights={weights} onChange={setWeights} />
          <div className="min-h-0 flex-1">
            <PriorityPanel
              feeders={scored}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-4">
      <div className="flex items-baseline gap-3">
        <a
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-fg transition-colors hover:text-muted"
        >
          ◆ GRIDFIRST
        </a>
        <span className="hidden text-sm text-muted md:inline">
          Ontario grid hardening — ranked by climate, asset, and electrification load.
        </span>
      </div>
      <Eyebrow>
        {DATASET_META.count} substations · OSM + EV chargers
      </Eyebrow>
    </header>
  );
}

function MapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-border bg-surface">
      <span className="font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle">
        Loading map…
      </span>
    </div>
  );
}
