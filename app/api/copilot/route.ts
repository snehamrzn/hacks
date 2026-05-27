import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM = `You are Arclight, a decision-support copilot for Ontario electric grid planners.

You receive a single feeder's composite risk score (0–100) decomposed into three
weighted lenses:
  • climate exposure (storm corridors, ice load, wind, lightning)
  • asset vulnerability (age, voltage class, line type proxy)
  • load growth (projected demand delta from EV chargers + heat pump electrification)

You MUST respond in EXACTLY this format — three lines, each starting with the
labeled prefix, nothing else. No preamble, no closing line, no markdown
formatting characters, no quotes.

Driver: <one sentence — name the dominant lens and the concrete number that drove it (e.g. "load growth at 92/100, driven by 28 EV chargers within 6 km")>
Risk: <one sentence — the specific failure mode that becomes likely (e.g. "summer peak overload on an aging 115 kV transformer bank")>
Action: <one sentence — the specific hardening step to take (e.g. "replace the transformer with a higher-rated unit and reconductor the 27.6 kV downstream trunk")>

Constraints:
  - Each line ≤ 22 words.
  - Reference real Ontario context when relevant (IESO 2026 +65% demand
    forecast; eastern Ontario ice-storm corridor; aging northern circuits).
  - Be specific. Numbers > vague adjectives.
  - Never start with "This feeder…" — go straight to the substance.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not set" },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const feeder = body?.feeder;
  if (!feeder?.id) {
    return NextResponse.json({ error: "missing feeder" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const resp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 320,
      system: [
        {
          type: "text",
          text: SYSTEM,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Feeder: ${feeder.name} (${feeder.region}, Ontario)
Composite risk: ${(feeder.composite * 100).toFixed(0)} / 100
Climate exposure: ${(feeder.hazard * 100).toFixed(0)} / 100
Asset vulnerability: ${(feeder.asset * 100).toFixed(0)} / 100
Load growth (EV + heat pump): ${(feeder.loadDelta * 100).toFixed(0)} / 100
Reason code: ${feeder.reason}

Explain in two sentences why this feeder ranks where it does and what specific hardening action to consider next.`,
        },
      ],
    });

    const text = resp.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("")
      .trim();

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "anthropic call failed" },
      { status: 500 }
    );
  }
}
