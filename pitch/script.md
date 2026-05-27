# GridFirst — Spoken Script

**Total budget: 360s (6:00).** Every line is timed. Read aloud — every sentence should land in under 3 seconds of breath.

---

## 00:00 → 00:30 — Slide 1 (Hook)

> On May 21st, 2022, a derecho — a thousand-kilometre wall of straight-line wind — hit Ontario in ninety minutes.
>
> Ten people died. One-point-one million customers lost power. Crews worked thirteen days straight to restore the last feeder.
>
> Here is the uncomfortable part: the feeders that failed were not the ones the utility had prioritized to harden that year. They did not have a good way to rank them.

*Pause 1 sec before clicking to Slide 2.*

---

## 00:30 → 01:15 — Slide 2 (Problem)

> Ontario's distribution grid is failing not all at once — but feeder by feeder, storm by storm.
>
> The Fall 2023 Vulnerability Assessment for Ontario's Electricity Distribution Sector found that **seventy-three percent** of distribution cable kilometres in this province are overhead. Aging. Weather-exposed. Increasingly stressed.
>
> Over **eighty percent** of consumer service disruptions happen at the distribution layer. IESO projects demand growth of up to **seventy-five percent** by 2050 from EVs and heat pumps.
>
> And **ten-point-nine billion dollars** of distribution modernization funding is being allocated right now — with no standardized way to decide which feeder to spend it on first.

---

## 01:15 → 01:45 — Slide 3 (Why it matters)

> A power outage is not a dashboard number.
>
> About one million Canadians rely on home medical equipment. Twenty-one fly-in First Nations communities Hydro One serves north of fifty have food spoiling within hours of an outage.
>
> Every year a utility spends in the wrong place is a year the most exposed corridors stay exposed.

---

## 01:45 → 02:15 — Slide 4 (UVP)

> We built GridFirst.
>
> It is a **thirty-second second opinion** on which Ontario feeders to harden first — tunable, explainable, and built on real grid data.
>
> Not a six-month consulting deck. A decision a planner makes during their morning coffee.

*Switch to live screen.*

---

## 02:15 → 03:30 — Slide 5 (Demo: Map + Ranking)

> Here is the studio. **[show map]**
>
> One hundred and twenty real Ontario substations, pulled from OpenStreetMap. Each dot is sized and coloured by composite vulnerability score.
>
> On the right, the top-ten ranked feeders. **[point at #1]** This feeder ranks first today with a composite score of eighty-eight out of one hundred. The badge tells you why — it is *climate-driven* and *load-driven*, both at once.
>
> **[move climate slider]**
>
> Now watch this. I am a planner who just got a new climate risk report — I weight climate higher.
>
> The list re-ranks live. Number four moves to number one. That is the planner owning the weights, not the vendor.

---

## 03:30 → 04:15 — Slide 6 (Demo: Copilot)

> **[click feeder]**
>
> When I click a feeder, GridFirst calls Claude with the feeder's scored profile. It returns three lines — locked format.
>
> **Driver** — what is pushing this up the list.
> **Risk** — what fails first.
> **Action** — what to actually do about it.
>
> *"Load growth at ninety-two, driven by twenty-eight EV chargers within six kilometres."*
> *"Summer peak overload on an aging transformer bank."*
> *"Replace transformer, reconductor the trunk."*
>
> That is a sentence a planner can paste into a board deck. That is the explainability the OEB asks for in every Distribution System Plan filing.

*Switch back to slides.*

---

## 04:15 → 04:45 — Slide 7 (Tech Stack)

> Tech stack — Next.js fourteen on the front. ArcGIS JavaScript SDK for the map. Tailwind for the dark, planner-friendly UI.
>
> The hundred and twenty substations and five hundred twenty-three EV chargers are baked from OpenStreetMap once — fast cold start, no API key needed for the demo.
>
> Scoring is client-side, so sliders feel instant. The copilot is Claude Sonnet 4.6 through a cached prompt — sub-second explanations.

---

## 04:45 → 05:15 — Slide 8 (SWOT)

> Quickly — strengths: real data, explainable output, planner-tunable, built on tools utilities already use.
>
> Weakness we own: our scoring is heuristic. Validating against historical outage records is the next milestone.
>
> Opportunity is the eleven billion dollars being allocated right now. Threat is the incumbents — Esri, Schneider — who own the GIS stack but cost more than a planner's annual budget to configure.

---

## 05:15 → 05:40 — Slide 9 (Financial + Community)

> The math.
>
> A typical Ontario feeder serves two thousand customers. One avoided eight-hour outage is worth roughly two hundred forty thousand to one-point-two million dollars in avoided societal cost — that is the LBNL methodology the OEB already uses.
>
> If GridFirst helps a utility prioritize five feeders correctly per year, that is one-point-two to six million dollars in avoided harm. Per utility. Per year. There are sixty LDCs in Ontario.

---

## 05:40 → 06:00 — Slide 10 (CTA)

> GridFirst is not a research project. It is a decision tool — for planners, engineers, executives who have limited budgets and unlimited pressure to keep Ontario's lights on.
>
> Open the studio on your phone right now. Move the climate slider. Tell us if the top-ranked feeder matches what you would expect.
>
> And if any of you know an Ontario planner with historical outage data — that is the validation we need next.
>
> Thank you.

---

## Delivery notes

- **Pacing**: 360s for ~900 words = 150 WPM. That is conversational, not rushed. If your run-through goes over 6:30, cut Slide 8 (SWOT) to one sentence.
- **The Derecho hook is 70% of the pitch.** Practice it five times before any other slide. Cold, no notes, eye contact.
- **The slider drag in Slide 5 is the moneyshot.** Rehearse exactly which slider to drag and which feeder will jump. Pick a dramatic re-rank.
- **Pause before the UVP line** ("It is a thirty-second second opinion…"). Land it. Do not rush past it.
- **Never read a slide aloud.** If the script repeats slide text, the slide gets cut.
- **Q&A**: see `qna.md`. Default to one-sentence answers. Offer to follow up offline if a question goes deep.
