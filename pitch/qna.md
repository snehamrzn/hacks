# GridFirst — Anticipated Q&A

Default to **one-sentence answers**. If a judge wants more, they will follow up. Long answers in a 5-minute Q&A burn the next questioner's time.

---

## Likely product questions

**Q: Is the scoring validated?**
> Not yet — heuristic by design. Next milestone is replaying against three years of OEB outage records.

**Q: Why not just use Esri Utility Network?**
> Utility Network is a system of record. GridFirst is a decision tool. They sit on top of the same data — we are the layer a planner actually opens at 8 AM.

**Q: How does this scale beyond 120 feeders?**
> The scoring is O(n) and runs in the browser. Hydro One has roughly thirty thousand circuits — we tested at 120 for UI readability, not for compute limits.

**Q: Where does the AI come in?**
> Two places. Claude writes the Driver/Risk/Action explanation per feeder, prompt-cached for sub-second response. The scoring itself is deterministic — we did not want a black box ranking critical infrastructure.

**Q: How accurate can a vulnerability score be without real outage history?**
> Honest answer: it is a starting point, not a verdict. The value is forcing a planner to articulate weights — climate vs. asset vs. load — explicitly. Today that conversation happens in a six-month consulting study.

**Q: What about underground infrastructure?**
> Our scoring assumes overhead by default — which covers 73% of Ontario distribution km. Underground feeders score lower on climate exposure and higher on asset-age cost. Same model, different inputs.

---

## Likely tech questions

**Q: Why ArcGIS over Mapbox or Leaflet?**
> Utilities already run Esri. Dropping into their existing GIS stack is the difference between a pilot and a pitch deck.

**Q: Is the data live or static?**
> Static for the demo — baked from OpenStreetMap Overpass into `feeders.json`. In production this would be a server-side fetch from the utility's GIS system of record.

**Q: How does prompt caching work?**
> System prompt + format template are marked `cache_control: ephemeral` on the first call. Subsequent calls in the 5-minute window reuse the cache — about 80% cheaper and sub-second.

**Q: Why Claude over a fine-tuned model?**
> Speed-to-build. We had a weekend, not a training pipeline. Claude with a locked format gave us the explainability and reliability of a fine-tune without the cost.

---

## Likely business questions

**Q: What's the business model?**
> Pilot with one LDC at a tenth of a typical consulting engagement. Long term: SaaS per utility planner seat.

**Q: Who is the buyer?**
> Distribution system planning leads at Ontario LDCs — the people accountable for the Distribution System Plan the OEB requires every five years.

**Q: How do you get utility data when feeder topology is non-public?**
> Pilot under NDA. Our hack demo uses OSM substations as a proxy — proves the workflow without needing the regulated data first.

**Q: Why Ontario specifically?**
> The OEB's filing requirements and the $10.9B in DSM funding being deployed now make this market timing-perfect. Same model would work for any province or state with regulated distribution and a climate-driven hardening mandate.

**Q: Competitors?**
> Esri Utility Network and Schneider EcoStruxure own the GIS stack but cost more than a planner's annual budget to configure. We are not replacing them — we are the decision-support layer on top.

---

## Likely "hard" questions

**Q: What stops Hydro One from building this in-house?**
> Nothing. But their last in-house planning tool took eighteen months and a million dollars. We did the demo in a weekend. The question is whether they want to build or buy a decision tool — they already have to build the system of record.

**Q: How is this defensible long-term?**
> The scoring math is not the moat — the planner workflow, the OEB-ready explanation format, and the integration with utility GIS are. Plus the validation data set we build over the first pilot.

**Q: What if the OEB doesn't accept AI-generated rationale in a DSP filing?**
> The AI explains a *deterministic* score. The score and weights are auditable. The Driver/Risk/Action language is the planner's, not the model's — we just draft it.

**Q: Why should a judge believe a weekend project can ship?**
> Because it is shipped. The demo runs. The data is real. The math is in the repo. We are not pitching an idea — we are pitching what you just saw work.

---

## If asked something we don't know

> *"That's a great question — I don't want to make up an answer. Can I follow up with you after?"*

Better than bullshit. Judges respect "I don't know."
