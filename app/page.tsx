import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { Marquee } from "@/components/sections/Marquee";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardBody } from "@/components/ui/Card";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { DATASET_META } from "@/lib/data/feeders";

const lenses = [
  {
    tag: "01 · Climate",
    title: "Where will the storms hit hardest?",
    body:
      "Eastern Ontario sits on a documented ice-storm corridor; northern circuits face elevated wind and lightning. Each feeder gets a climate-exposure score, not a guess.",
  },
  {
    tag: "02 · Asset",
    title: "Which gear is most likely to fail?",
    body:
      "Distribution voltages (≤44 kV) carry older, more exposed equipment with a higher per-mile failure rate. Voltage class becomes a vulnerability signal.",
  },
  {
    tag: "03 · Load",
    title: "Where is demand about to surge?",
    body:
      "EV chargers and heat-pump rebates concentrate by neighbourhood. We count real chargers within 6 km of every substation as a live electrification signal.",
  },
];

const method = [
  { k: "Substations", v: `${DATASET_META.count}`, s: "real, OpenStreetMap" },
  { k: "EV chargers indexed", v: "523", s: "OSM amenity=charging_station" },
  { k: "Demand growth", v: "+65%", s: "IESO 2026 Outlook" },
  { k: "DSM program", v: "$10.9B", s: "12-yr electrification fund" },
  { k: "Neighbourhood radius", v: "6 km", s: "charger lookup window" },
  { k: "Score weights", v: "40 / 20 / 40", s: "climate / asset / load" },
];

const primaryCta =
  "inline-flex h-13 items-center justify-center rounded bg-fg px-8 text-base font-medium text-bg outline-none transition-colors duration-200 ease-standard hover:bg-muted focus-visible:shadow-focus-ring";
const secondaryCta =
  "inline-flex h-13 items-center justify-center rounded border border-border px-8 text-base font-medium text-fg outline-none transition-colors duration-200 ease-standard hover:border-border-strong hover:bg-elevated focus-visible:shadow-focus-ring";

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-grid pt-40 pb-section">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
          <Container>
            <Reveal>
              <Badge variant="accent">
                Hydro One × Esri · Grid Resilience
              </Badge>
            </Reveal>
            <Reveal className="mt-6 max-w-4xl">
              <h1 className="text-display font-semibold">
                Which feeder do we{" "}
                <span className="bg-gradient-to-r from-fg via-muted to-fg bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-sweep">
                  fix first
                </span>
                ?
              </h1>
            </Reveal>
            <Reveal className="mt-6 max-w-2xl">
              <p className="text-lg leading-relaxed text-muted">
                Ontario&apos;s grid is bracing for{" "}
                <span className="text-fg">65% demand growth</span>, climate
                volatility, and aging infrastructure — all at once. GridFirst
                ranks every feeder by where hardening pays off most: climate{" "}
                <span className="text-fg">×</span> asset{" "}
                <span className="text-fg">×</span> electrification load — then
                explains the why in plain English.
              </p>
            </Reveal>
            <Reveal className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/studio" className={primaryCta}>
                Launch the map →
              </Link>
              <a href="#how" className={secondaryCta}>
                How it works
              </a>
            </Reveal>
            <Reveal className="mt-12">
              <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-eyebrow uppercase text-subtle">
                <span>{DATASET_META.count} real substations</span>
                <span>523 real EV chargers</span>
                <span>3 prescriptive lenses</span>
                <span>Claude copilot</span>
              </div>
            </Reveal>
          </Container>
        </section>

        <Marquee />

        {/* The reframe */}
        <section id="reframe" className="py-section">
          <Container>
            <Reveal>
              <Eyebrow>The reframe</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-h1 font-semibold">
                Predicting failure isn&apos;t the same as deciding what to fix.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-lg border border-border bg-surface p-6">
                  <div className="font-mono text-eyebrow uppercase text-subtle">
                    Standard outage analytics
                  </div>
                  <p className="mt-3 text-h3 font-medium text-muted">
                    &ldquo;Where might it fail?&rdquo;
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-subtle">
                    Returns a probability heat-map. Useful, but a planner with a
                    $50M capital budget still has to pick 30 feeders out of
                    thousands — and defend the choice to a council.
                  </p>
                </div>
              </Reveal>
              <Reveal>
                <div className="h-full rounded-lg border border-accent/30 bg-accent/5 p-6 shadow-accent-glow">
                  <div className="font-mono text-eyebrow uppercase text-accent-hover">
                    GridFirst
                  </div>
                  <p className="mt-3 text-h3 font-medium text-fg">
                    &ldquo;Which do we harden first, and why?&rdquo;
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Returns a ranked list with reason codes, a defensible score,
                    and a one-sentence explainer per feeder. Designed for the
                    person who has to write the capital plan, not just read the
                    chart.
                  </p>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-border py-section">
          <Container>
            <Reveal>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-h1 font-semibold">
                Three lenses, one priority score.
              </h2>
            </Reveal>
            <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
              {lenses.map((l) => (
                <StaggerItem key={l.tag}>
                  <Card className="h-full">
                    <div className="font-mono text-eyebrow uppercase text-subtle">
                      {l.tag}
                    </div>
                    <CardTitle>{l.title}</CardTitle>
                    <CardBody>{l.body}</CardBody>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-4">
              <div className="rounded-lg border border-border bg-surface p-6 text-center font-mono text-sm text-muted">
                composite = <span className="text-fg">0.4</span>·climate +{" "}
                <span className="text-fg">0.2</span>·asset +{" "}
                <span className="text-fg">0.4</span>·load
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Method */}
        <section id="method" className="border-t border-border py-section">
          <Container>
            <Reveal>
              <Eyebrow>Method &amp; data</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-h1 font-semibold">
                Real public data, no Hydro One feed required.
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                The studio runs on <span className="text-fg">real Ontario substations</span>{" "}
                fetched from OpenStreetMap, each annotated with{" "}
                <span className="text-fg">voltage class</span> from OSM tags and{" "}
                <span className="text-fg">EV-charger density within 6 km</span>{" "}
                as a live electrification signal. Climate exposure follows the
                documented Ontario hazard map (eastern ice-storm corridor,
                northern wind/lightning band). Constants are sourced from the{" "}
                <span className="text-fg">IESO 2026 Annual Planning Outlook</span>{" "}
                and the federal{" "}
                <span className="text-fg">$10.9B Demand Side Management</span>{" "}
                framework. Re-bake any time with{" "}
                <code className="font-mono text-fg">
                  node scripts/bake-data.mjs
                </code>
                .
              </p>
            </Reveal>
            <Stagger className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {method.map((m) => (
                <StaggerItem key={m.k}>
                  <div className="h-full bg-surface p-6">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                      {m.k}
                    </div>
                    <div className="mt-2 text-h3 font-semibold text-fg">
                      {m.v}
                    </div>
                    <div className="mt-1 text-[12px] text-subtle">{m.s}</div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-section">
          <Container>
            <Reveal>
              <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-surface p-8 md:flex-row md:items-center">
                <div>
                  <h3 className="text-h2 font-semibold">Open the studio.</h3>
                  <p className="mt-2 max-w-md text-muted">
                    Drag the weights, watch the top-10 re-rank live, click a
                    feeder, and ask the copilot why it&apos;s on the list.
                  </p>
                </div>
                <Link
                  href="/studio"
                  className={`${primaryCta} shadow-accent-glow`}
                >
                  Launch the map →
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
