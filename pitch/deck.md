# GridFirst — Slide Deck

10 slides, ~30s each, 6 minutes total. Slides are anchors, not scripts — read the script from `script.md`.

---

## Slide 1 — Hook

**Title:** *May 21, 2022 — 90 minutes.*

**Visual:** Full-bleed photo of derecho damage in Ottawa (downed Hydro One poles).

**On-slide text:** none beyond title.

---

## Slide 2 — Problem

**Title:** *Ontario's grid is failing feeder by feeder.*

**Visual:** Three stacked stat blocks:

| **73%** | **up to 75%** | **$10.9B** |
|---|---|---|
| of Ontario distribution cable km are **overhead** | projected demand growth by 2050 (IESO) | being allocated to distribution modernization, **with no standard prioritization tool** |

---

## Slide 3 — Why it matters

**Title:** *An outage isn't a metric.*

**Visual:** Three icons in a row — home oxygen tank | hospital generator | northern community.

**On-slide text:**
- ~1M Canadians on home medical equipment
- 21 fly-in First Nations communities north of 50
- Food spoilage in hours, not days

---

## Slide 4 — UVP

**Title:** *GridFirst*

**On-slide text (huge, centered):**
> A **30-second second opinion** on which Ontario feeders to harden first.
>
> *Tunable. Explainable. Built on real grid data.*

---

## Slide 5 — Demo Part 1 (Map + Ranking)

**No slide — live screenshare of `/studio`.**

Backup slide if demo fails:
- Screenshot 1: full studio with map + top-10 list
- Screenshot 2: slider moved, list re-ranked
- Caption: *"The planner owns the weights, not the vendor."*

---

## Slide 6 — Demo Part 2 (Copilot)

**No slide — live screenshare with copilot panel expanded.**

Backup slide:
- Screenshot of Driver/Risk/Action output
- Caption: *"Explainability the OEB asks for in every DSP filing."*

---

## Slide 7 — Tech Stack

**Title:** *How it's built.*

**Visual:** Architecture diagram (see `tech-diagram.md` — Mermaid version for the slide).

**On-slide chips:** Next.js 14 · React 18 · ArcGIS JS SDK · Tailwind · Framer Motion · Claude Sonnet 4.6 · OpenStreetMap (Overpass)

---

## Slide 8 — SWOT

**Title:** *Honest assessment.*

**Visual:** 2×2 matrix.

| **Strengths** | **Weaknesses** |
|---|---|
| Explainable Driver/Risk/Action — OEB-ready | Heuristic scoring, not yet validated vs. historical SAIDI/SAIFI |
| Real Ontario data, not synthetic | 120-feeder demo sample |
| Tunable weights = planner agency | No SCADA/ADMS integration (planning tool) |
| Built in a weekend with Claude | No utility LOI yet |
| **Opportunities** | **Threats** |
| $10.9B DSM framework deploying now | Esri Utility Network, Schneider EcoStruxure |
| IESO 75%-by-2050 demand growth | In-house utility GIS teams |
| OEB now requires climate vulnerability scoring | Feeder data is non-public — pilot needs NDA |
| Federal $2.4B SREP funding | OEB approval cycles are 18–24 months |

---

## Slide 9 — Financial & Community Benefit

**Title:** *The math.*

**Visual:** Two giant numbers stacked:

> **$1.2M – $6M**
> avoided outage cost per utility, per year
>
> **5.4M Ontarians**
> downstream of a feeder

**Footnote:** *LBNL ICE Calculator methodology · 60 LDCs in Ontario*

---

## Slide 10 — CTA

**Title:** *Move a slider. Tell us if the top feeder is right.*

**Visual:** Large QR code → `gridfirst.app/studio` (or fallback URL).

**On-slide text:**
- Try the demo on your phone
- Tell us if the top-ranked feeder matches your intuition
- Know an Ontario planner with historical outage data? Connect us — that's the validation we need next.

**Bottom:** Team names + contact.
