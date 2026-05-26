"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Weights } from "@/lib/scoring";

type Props = {
  weights: Weights;
  onChange: (w: Weights) => void;
};

export function WeightSliders({ weights, onChange }: Props) {
  const set = (key: keyof Weights) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...weights, [key]: Number(e.target.value) });

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface px-5 py-5">
      <div className="flex items-center justify-between">
        <Eyebrow>Weights</Eyebrow>
        <button
          onClick={() => onChange({ hazard: 0.4, asset: 0.2, loadDelta: 0.4 })}
          className="font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle transition-colors hover:text-fg"
        >
          Reset
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <Slider label="Climate exposure" value={weights.hazard} onChange={set("hazard")} />
        <Slider label="Asset vulnerability" value={weights.asset} onChange={set("asset")} />
        <Slider label="Load growth · EV + heat pump" value={weights.loadDelta} onChange={set("loadDelta")} />
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle">
        <span>{label}</span>
        <span className="tabular-nums text-fg">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={onChange}
        className="accent-accent h-1.5 w-full appearance-none rounded-full bg-elevated"
      />
    </label>
  );
}
