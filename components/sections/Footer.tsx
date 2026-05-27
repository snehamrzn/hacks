import { Container } from "@/components/ui/Container";

const groups = [
  {
    title: "Tool",
    items: ["Studio", "Climate lens", "Asset lens", "Load lens"],
  },
  {
    title: "Data",
    items: [
      "OpenStreetMap substations",
      "OpenStreetMap EV chargers",
      "IESO 2026 Outlook",
      "ECCC climate corridors",
    ],
  },
  {
    title: "Pitch",
    items: [
      "Hydro One / Esri",
      "Decision intelligence",
      "Prescriptive risk",
      "Ontario electrification",
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <div className="font-mono text-sm font-medium">◆ ARCLIGHT</div>
          <p className="mt-3 max-w-xs text-sm text-subtle">
            A geospatial decision engine that ranks Ontario&apos;s grid feeders by
            where hardening pays off most — fusing climate exposure, asset
            vulnerability, and electrification load growth into one prescriptive
            score.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <div className="font-mono text-eyebrow uppercase text-subtle">
              {g.title}
            </div>
            <ul className="mt-4 space-y-3">
              {g.items.map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex flex-col items-start justify-between gap-4 border-t border-border py-6 text-eyebrow text-subtle md:flex-row md:items-center">
        <span className="font-mono uppercase">Arclight · Prototype</span>
        <span className="font-mono uppercase">
          Real OSM data · climate / asset scores are heuristics
        </span>
      </Container>
    </footer>
  );
}
