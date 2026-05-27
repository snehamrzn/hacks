"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { easeExpoOut } from "@/lib/motion";
import type { ScoredFeeder } from "@/lib/scoring";

type State =
  | { kind: "loading" }
  | { kind: "ok"; text: string }
  | { kind: "err"; message: string };

type Props = {
  feeder: ScoredFeeder | null;
  onClose: () => void;
};

export function CopilotPanel({ feeder, onClose }: Props) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!feeder) return;
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

  // Esc to dismiss.
  useEffect(() => {
    if (!feeder) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feeder, onClose]);

  return (
    <AnimatePresence>
      {feeder && (
        <motion.aside
          key="copilot"
          role="dialog"
          aria-label={`Why ${feeder.name} ranked high`}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.35, ease: easeExpoOut }}
          className="pointer-events-auto absolute bottom-5 right-5 z-30 w-[22rem] max-w-[calc(100%-2.5rem)] overflow-hidden rounded-lg border border-white/10 bg-black/70 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
            }}
          />
          <header className="flex items-start justify-between gap-3 px-5 pt-5">
            <div className="min-w-0">
              <Eyebrow>Why this feeder</Eyebrow>
              <div className="mt-2 truncate text-sm font-medium text-fg">
                {feeder.name}
              </div>
              <div className="mt-1 font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle">
                {feeder.region} · score {(feeder.composite * 100).toFixed(0)}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 text-subtle transition-colors duration-150 ease-standard hover:border-white/25 hover:text-fg"
            >
              <CloseIcon />
            </button>
          </header>

          <div className="max-h-[22rem] overflow-y-auto px-5 pb-5 pt-4 text-sm leading-relaxed text-muted">
            {state.kind === "loading" && (
              <ThinkingRows />
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
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 2.5l7 7m0-7l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ThinkingRows() {
  return (
    <ul className="flex flex-col gap-4" aria-busy>
      {["Driver", "Risk", "Action"].map((label) => (
        <li key={label} className="flex flex-col gap-2">
          <span className="font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle">
            {label}
          </span>
          <span className="h-2.5 w-3/4 animate-pulse rounded-full bg-white/5" />
          <span className="h-2.5 w-1/2 animate-pulse rounded-full bg-white/5" />
        </li>
      ))}
    </ul>
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
