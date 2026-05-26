const items = [
  "GRID RESILIENCE",
  "CLIMATE EXPOSURE",
  "ELECTRIFICATION LOAD",
  "ONTARIO FEEDERS",
  "EV CHARGERS",
  "HEAT PUMPS",
  "ICE-STORM CORRIDOR",
  "PRESCRIPTIVE",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-border py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
      <div className="flex w-max animate-marquee">
        {[0, 1].map((dup) => (
          <ul
            key={dup}
            className="flex shrink-0 items-center"
            aria-hidden={dup === 1}
          >
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-12 px-6 font-mono text-eyebrow uppercase text-subtle"
              >
                {item}
                <span className="text-border-strong">/</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
