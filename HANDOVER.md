# GridFirst — Handover

## What it is

GridFirst is a planning tool for Ontario's electric grid. It answers a single question: of the thousands of feeders in the province, which ones should be hardened first, and why?

The product is a Next.js web app with two surfaces:

1. A landing page that explains the reframe (predicting failure vs. deciding what to fix) and the method.
2. A studio page with an interactive ArcGIS map of Ontario, a top-10 ranked list, weight sliders, and a Claude-powered copilot that explains each feeder in plain English.

Branding is "Monolith / GridFirst." The framing is Hydro One × Esri, since the brief was grid resilience.

## Why this exists

Ontario's IESO 2026 Annual Planning Outlook projects 65% demand growth. There's a $10.9B federal Demand Side Management program over 12 years. EV adoption and heat pump electrification are concentrating new load by neighbourhood. At the same time, climate volatility is real (eastern Ontario sits on the 1998 ice-storm corridor, the north sees more lightning and wind), and a lot of the distribution gear is old.

A planner with a finite capital budget has to pick 30 or so feeders out of thousands and defend that pick to a council. Standard outage analytics give a probability heat-map. That's useful but it doesn't tell you what to do. GridFirst returns a ranked list with reason codes and a one-sentence explainer per feeder, designed for the person writing the capital plan.

## How the scoring works

Every feeder gets a composite risk score from 0 to 100, built from three components, each normalized 0..1:

- **Climate exposure (`hazard`)** — heuristic based on Ontario geography. Eastern corridor gets an ice-storm bonus, north of latitude 47.5 picks up a wind/lightning band, southwestern Ontario gets a small discount.
- **Asset vulnerability (`asset`)** — derived from the OSM voltage tag. Distribution voltages (≤44 kV) score high because that gear is older and fails more per circuit-mile. Bulk transmission (≥230 kV) scores low.
- **Load growth (`loadDelta`)** — count of real EV chargers within 6 km of the substation, normalized so 25+ chargers tops out at 1.0. This is the electrification proxy.

The composite is a weighted sum:

```
composite = w_hazard * hazard + w_asset * asset + w_load * loadDelta
```

Default weights are 0.4 / 0.2 / 0.4. The user can drag the sliders in the studio and weights are renormalized on the fly so they always sum to 1, which keeps the composite in 0..1 no matter where the sliders sit.

Each feeder also gets a **reason code** — `climate-driven`, `load-driven`, `asset-driven`, or `both` — based on which weighted contribution is within 85% of the top one. That's what powers the chip in the list and the badge in the map popup.

Scoring logic lives in `lib/scoring.ts`. The functions are small and pure, which is mostly why the top-10 panel re-ranks live as you drag a slider with no perceptible lag.

## Data pipeline

There is no Hydro One feed. Everything in the studio comes from public data, baked once into a static JSON file:

- **Substations** — OpenStreetMap `power=substation` for Ontario (`ISO3166-2=CA-ON`), fetched via the Overpass API. Real locations, with voltage tags where OSM has them.
- **EV chargers** — OpenStreetMap `amenity=charging_station` for the same area. 523 charger points in the current bake, indexed into a coarse lat/lon grid for fast neighbourhood counts.

The bake script (`scripts/bake-data.mjs`) does the Overpass queries, runs the hazard/asset/load heuristics, dedupes substations within 1 km (because some are mapped as both a node and a way), trims to the top ~120 by a default composite so the map stays readable, and writes `public/data/feeders.json` with provenance metadata.

To refresh:

```
node scripts/bake-data.mjs
```

That file is the only data source the studio reads. `lib/data/feeders.ts` just imports it.

## The Claude copilot

When the user selects a feeder (clicking the map dot or a row in the top-10 list), the studio calls `POST /api/copilot` with the scored feeder payload. That route lives at `app/api/copilot/route.ts` and uses the Anthropic SDK.

- **Model:** `claude-sonnet-4-6`
- **Why Sonnet 4.6:** the task is a short, structured explanation, not heavy reasoning. Sonnet gives a fast first token and a tight response, which matters for a panel that updates whenever a user clicks a new feeder. Opus would be overkill and slower.
- **Why Anthropic at all:** the copy quality on short justifications is the strongest part of the pitch. The user is going to read the three lines under "Why this feeder" and judge the whole product on whether they sound like a planner wrote them.

The system prompt is locked to a three-line format:

```
Driver: <one sentence — name the dominant lens and a concrete number>
Risk:   <one sentence — the specific failure mode>
Action: <one sentence — the specific hardening step>
```

Each line is capped at 22 words. The prompt asks for real Ontario context (IESO forecast, ice-storm corridor, northern circuits) and forbids hedging language. The system prompt is sent with `cache_control: ephemeral` so Anthropic prompt-caches it across requests, which both saves tokens and shaves latency once the cache is warm.

On the client side, `components/panel/CopilotPanel.tsx` parses the three labelled lines into rows. If the model drifts off-format (rare but possible with any LLM), the parser falls back to rendering the whole response as a single "Summary" row so the UI never breaks.

The API key (`ANTHROPIC_API_KEY`) is read from `.env.local`. If it's missing the route returns a 500 and the panel shows a friendly "Copilot unavailable" hint pointing at the env file. The map and ranking still work without the key — only the natural-language explainer goes dark.

## The map

`components/map/ArcGISMap.tsx` uses the **ArcGIS Maps SDK for JavaScript** (`@arcgis/core`). Loaded as a dynamic import with SSR disabled, since the SDK touches `window` on init.

- If `NEXT_PUBLIC_ARCGIS_API_KEY` is set, it uses Esri's `dark-gray-vector` basemap.
- If not, it falls back to a public Esri vector-tile portal item so the demo works without any key at all.

Each feeder is a `simple-marker` graphic, sized from 8 to 30 px by composite score, coloured along a ramp from a neutral grey (low risk) to the accent blue (high risk). The top 5 get text labels with white-on-black halo. Selection is wired both ways: clicking a dot calls `onSelect` with the feeder ID, and changing `selectedId` from the list pans/zooms the view to that feeder.

Hover behaviour uses `hitTest` on `pointer-move`, gated by an in-flight flag to avoid overlapping async calls. The tooltip flips horizontally if it would clip the right edge of the panel.

There's also a click-popup using ArcGIS's built-in `popupTemplate`, styled to match the rest of the dark UI.

## Pages and components

- **`app/page.tsx`** — landing. Hero, reframe (standard analytics vs. GridFirst), three-lens explainer, method/data callouts, CTA. Built from the design system in `components/ui/*` and `components/sections/*`.
- **`app/studio/page.tsx`** — the working tool. Two-column layout on desktop: map on the left, sliders + top-10 + copilot stacked on the right. The whole thing is client-side; weights are React state and the ranked list is a `useMemo` over `rankFeeders`.
- **`components/panel/WeightSliders.tsx`** — three native range inputs with a Reset button. Renormalization happens in `scoring.ts`, not here.
- **`components/panel/PriorityPanel.tsx`** — top-10 list. Uses Framer Motion's `layout` prop so rows animate to their new positions when the ranking changes from a slider drag.
- **`components/panel/CopilotPanel.tsx`** — fetches and renders the Claude explanation.

## Design system

Documented separately in `DESIGN-SYSTEM.md`. Short version: monochrome (black background, white text, one blue accent), Inter for UI, JetBrains Mono for eyebrow labels and metadata, hairline borders instead of drop shadows, expo-out easing on entrances. Tokens are wired into `tailwind.config.ts` so nothing is hard-coded.

## What's implemented (and what isn't)

Implemented:

- Full landing page with hero, marquee, reframe section, three-lens cards, method grid, CTA.
- Working studio: map, weight sliders with live re-ranking, top-10 panel, copilot panel, click and hover interactions.
- Real data bake script pulling from Overpass.
- Claude copilot wired to Sonnet 4.6 with prompt caching.
- Dark ArcGIS basemap (with API-key upgrade path).
- 120 real Ontario substations in the current bake.

Not implemented (left as obvious next steps if someone keeps going):

- Real Hydro One feed. The architecture would swap `feeders.json` for a server-side fetch, scoring stays the same.
- Persisted scenarios (saving a weight configuration as a named view).
- Asset-vulnerability signal beyond voltage class. Age, line-type, recent outage history would all slot in.
- Hazard scoring beyond the latitude/longitude heuristic. Environment Canada or NRCan datasets would replace the rules.
- Tests. There are none.

## Running it

```
npm install
cp .env.local.example .env.local   # then add ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Optional, to refresh the dataset:

```
node scripts/bake-data.mjs
```

`NEXT_PUBLIC_ARCGIS_API_KEY` is optional. Without it the OSM dark basemap is used.

## File map

```
app/
  page.tsx              landing
  studio/page.tsx       the tool
  api/copilot/route.ts  Claude endpoint
lib/
  scoring.ts            composite math, ranking, reason codes
  data/feeders.ts       imports baked JSON
  motion.ts, cn.ts      helpers
components/
  map/ArcGISMap.tsx     ArcGIS map + hover tooltip + legend
  panel/                WeightSliders, PriorityPanel, CopilotPanel
  ui/                   Button, Card, Container, Eyebrow, Badge, Reveal
  sections/             Nav, Marquee, Footer
scripts/
  bake-data.mjs         Overpass fetch + scoring + write JSON
public/data/
  feeders.json          baked dataset
DESIGN-SYSTEM.md        design tokens and motion spec
```

## Stack at a glance

- Next.js 14 (App Router)
- React 18, TypeScript
- Tailwind for styling, Framer Motion for the list reorder animation
- ArcGIS Maps SDK for JavaScript (`@arcgis/core`)
- Anthropic SDK (`@anthropic-ai/sdk`) talking to Claude Sonnet 4.6
- OpenStreetMap via Overpass API for the underlying data
