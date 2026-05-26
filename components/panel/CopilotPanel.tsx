"use client";

import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { ScoredFeeder } from "@/lib/scoring";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; text: string }
  | { kind: "err"; message: string };

export function CopilotPanel({ feeder }: { feeder: ScoredFeeder | null }) {
  const [state, setState] = useState<State>({ kind: "idle" });

  useEffect(() => {
    if (!feeder) {
      setState({ kind: "idle" });
      return;
    }
    let cancelled = false;
    setState({ kind: "loading" });
    fetch("/api/copilot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ feeder }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (cancelled) return;
        if (!r.ok || data.error) {
          setState({ kind: "err", message: data.error ?? `HTTP ${r.status}` });
        } else {
          setState({ kind: "ok", text: data.text });
        }
      })
      .catch((e) => {
        if (!cancelled) setState({ kind: "err", message: String(e) });
      });
    return () => {
      cancelled = true;
    };
  }, [feeder]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface px-5 py-5">
      <Eyebrow>Why this feeder</Eyebrow>
      <div className="min-h-[5rem] text-sm leading-relaxed text-muted">
        {state.kind === "idle" && (
          <span className="text-subtle">
            Select a feeder on the map or in the list.
          </span>
        )}
        {state.kind === "loading" && (
          <span className="text-subtle">
            <span className="inline-block animate-pulse">Thinking…</span>
          </span>
        )}
        {state.kind === "ok" && <ExplanationRows raw={state.text} />}
        {state.kind === "err" && (
          <span className="text-subtle">
            Copilot unavailable ({state.message}). Add{" "}
            <code className="font-mono text-fg">ANTHROPIC_API_KEY</code> to{" "}
            <code className="font-mono text-fg">.env.local</code>.
          </span>
        )}
      </div>
    </div>
  );
}

type Row = { label: string; text: string };

const LABELS = ["Driver", "Risk", "Action"] as const;

/**
 * Parses the copilot's three-line labeled response (Driver: / Risk: / Action:)
 * into structured rows. Falls back to a single "Summary" row if the model drifts
 * off-format — defensive because LLM output is rarely 100% format-compliant.
 */
function parseRows(raw: string): Row[] {
  const out: Row[] = [];
  for (const label of LABELS) {
    const re = new RegExp(`(?:^|\\n)\\s*${label}\\s*:\\s*(.+?)(?=\\n\\s*(?:${LABELS.join("|")})\\s*:|$)`, "is");
    const m = raw.match(re);
    if (m) out.push({ label, text: m[1].trim().replace(/\s+/g, " ") });
  }
  if (out.length === 0) return [{ label: "Summary", text: raw.trim() }];
  return out;
}

function ExplanationRows({ raw }: { raw: string }) {
  const rows = parseRows(raw);
  return (
    <ul className="flex flex-col gap-4">
      {rows.map((r) => (
        <li key={r.label} className="flex flex-col gap-1.5">
          <span className="font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle">
            {r.label}
          </span>
          <span className="text-sm leading-relaxed text-fg">{r.text}</span>
        </li>
      ))}
    </ul>
  );
}
