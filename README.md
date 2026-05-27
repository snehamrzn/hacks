# Arclight

A planning tool for Ontario's electric grid. It answers one question: out of thousands of feeders in the province, which ones should be hardened first?

## Why this exists

Ontario is looking at 65% projected demand growth by 2050, an aging distribution network, and climate volatility that doesn't care about quarterly plans. A planner with a finite capital budget has to pick maybe 30 feeders out of thousands and defend that pick to a council. Standard outage analytics give you a probability heat-map. Useful, but it doesn't tell you what to do.

Arclight returns a ranked list with reason codes and a one-sentence explainer per feeder, aimed at the person writing the capital plan.

## How the scoring works

Each feeder gets a composite risk score from 0 to 100, built from three weighted lenses:

- Climate exposure (ice-storm corridor in the east, wind/lightning band up north)
- Asset vulnerability (older distribution gear fails more per circuit-mile)
- Load growth (EV chargers within 6 km of the substation, as the electrification proxy)

Drag the sliders in the studio and the weights re-normalize on the fly. The top-10 panel re-ranks live as you drag, no perceptible lag. Scoring math lives in `lib/scoring.ts`.

## The copilot

Click a feeder and Claude Sonnet 4.6 writes a three-line explanation: the dominant driver, the specific failure mode, the specific hardening step. Each line capped at 22 words. The map and ranking still work without an API key, only the natural-language part goes dark.

## Data

There's no Hydro One feed. Everything comes from OpenStreetMap via the Overpass API, baked once into a static JSON file (`public/data/feeders.json`). 120 real Ontario substations and 523 EV chargers in the current bake.

## Stack

Next.js 14 (App Router), React 18, TypeScript, Tailwind, Framer Motion, ArcGIS Maps SDK, Anthropic SDK.

## Run it

```
npm install
cp .env.local.example .env.local   # then add ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Refresh the dataset:

```
node scripts/bake-data.mjs
```

`NEXT_PUBLIC_ARCGIS_API_KEY` is optional. Without it, a public Esri basemap is used.

See `HANDOVER.md` for a deeper walkthrough of the architecture and `DESIGN-SYSTEM.md` for visual tokens.
