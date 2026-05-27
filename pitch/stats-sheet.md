# GridFirst — Stats Sheet (Verify Before Stage)

Rule: any number you cannot pin to a source URL by the morning of the pitch gets cut or hedged. "Industry estimates put this near…" is better than confidently citing a number a judge can disprove.

---

## Status legend

- ✅ **Verified** — citation in hand, screenshot saved
- ⚠️ **Verify** — user-supplied or training-data-derived, must be confirmed against primary source
- 🟢 **Own data** — comes from our `feeders.json`, 100% reliable

---

## Stats table

| # | Stat | Source claim | Status | Action before stage |
|---|---|---|---|---|
| 1 | 80%+ of consumer service disruptions originate at distribution layer | "ScienceDirect" (user-supplied) | ⚠️ | Likely Billinton & Allan, *Reliability Evaluation of Power Systems*, or EPRI — not a single ScienceDirect paper. Find the real cite or rephrase as "industry-cited". |
| 2 | 73% of Ontario distribution cable km are overhead | *Fall 2023 Vulnerability Assessment for Ontario's Electricity Distribution Sector* | ⚠️ | Google exact report title. Save PDF + screenshot to phone. |
| 3 | IESO projected demand growth | User said **65%**; pitch research surfaced **75% by 2050** from IESO Annual Planning Outlook (Dec 2023) | ⚠️ | Pick one. Recommend: *"up to 75% by 2050 per IESO's latest Annual Planning Outlook"*. |
| 4 | $10.9B DSM fund | User-supplied | ⚠️ | Likely IESO Conservation & DSM framework or Hydro One capex envelope. Verify exact program name and timeframe. |
| 5 | May 2022 Derecho: 10 deaths, ~1.1M customers without power, ~$1B insured loss, 13-day restoration | Insurance Bureau of Canada / CatIQ | ⚠️ | Cross-check IBC website for exact figures. |
| 6 | 1998 Ice Storm: up to 35 days without power, $5.4B damages | IBC | ⚠️ | Backup hook only. |
| 7 | Ontario SAIDI ~3.2 hrs/customer-year | OEB Electricity Distributors Scorecard | ⚠️ | Confirm latest year. |
| 8 | Cost of customer interruption: ~$15–20/hr residential, $200–400/hr commercial | LBNL ICE Calculator methodology | ⚠️ | Industry-standard, defensible. URL: icecalculator.com |
| 9 | ~1M Canadians on home medical equipment | Statistics Canada | ⚠️ | Find StatsCan source. |
| 10 | 21 fly-in First Nations communities served by Hydro One Remote Communities | Hydro One Remote Communities | ⚠️ | Verify on hydrooneremotecommunities.com |
| 11 | 60 LDCs in Ontario | OEB | ⚠️ | Verify on OEB website. |
| 12 | 5.4M electricity customers in Ontario | OEB / IESO | ⚠️ | Verify. |
| 13 | 120 substations + 523 EV chargers in our dataset | `public/data/feeders.json` | 🟢 | Confident. |
| 14 | Sub-second copilot response via prompt caching | Our own measurement | 🟢 | Confident. |

---

## Pre-stage checklist (morning of pitch)

- [ ] Every ⚠️ above is either verified with a saved screenshot OR rephrased to hedge
- [ ] Derecho stats cross-checked on IBC site
- [ ] IESO APO percentage and year locked
- [ ] DSM funding figure traced to a real program with a year range
- [ ] OEB SAIDI latest year confirmed
- [ ] All source URLs in a single note on phone, ordered by slide
- [ ] Demo running on `localhost:3000`, pre-loaded in browser tab
- [ ] Public URL deployed and tested on phone (Vercel)
- [ ] QR code on Slide 10 actually resolves to the live demo
- [ ] Two laptops charged, HDMI dongle in bag
- [ ] Backup screenshots of demo saved in case Wi-Fi fails

---

## If a judge fact-checks you live

- Stay calm. *"That's the number our research surfaced — happy to share the source after."*
- Never argue. If they push, *"Fair — let me get back to you with the exact citation."*
- Don't escalate. The pitch is six minutes; one disputed stat is not a loss unless you make it one.
