"use client";

import { useEffect, useRef, useState } from "react";
import type { ScoredFeeder } from "@/lib/scoring";

type Hover = {
  name: string;
  region: string;
  rank: number;
  score: number;
  voltageKv: number | string;
  chargersNearby: number | string;
  x: number;
  y: number;
};

type Props = {
  feeders: ScoredFeeder[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/**
 * ArcGIS Maps SDK for JavaScript map. Renders Ontario with a dark basemap,
 * one point graphic per feeder, sized + colored by composite risk score.
 *
 * No API key required for the OSM basemap fallback. If
 * NEXT_PUBLIC_ARCGIS_API_KEY is set, swaps to the Esri dark-gray-vector basemap
 * for a more polished demo look.
 */
export function ArcGISMap({ feeders, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [hover, setHover] = useState<Hover | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map once.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current) return;

      const [
        { default: esriConfig },
        { default: Map },
        { default: MapView },
        { default: GraphicsLayer },
        { default: Basemap },
      ] = await Promise.all([
        import("@arcgis/core/config"),
        import("@arcgis/core/Map"),
        import("@arcgis/core/views/MapView"),
        import("@arcgis/core/layers/GraphicsLayer"),
        import("@arcgis/core/Basemap"),
      ]);

      const apiKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY;
      if (apiKey) {
        esriConfig.apiKey = apiKey;
      }

      const basemap = apiKey
        ? "dark-gray-vector"
        : await buildOsmDarkBasemap(Basemap);

      const layer = new GraphicsLayer({ id: "feeders" });
      layerRef.current = layer;

      const map = new Map({ basemap, layers: [layer] });

      const view = new MapView({
        container: containerRef.current,
        map,
        center: [-79.6, 44.5],
        zoom: 6,
        constraints: { snapToZoom: false, minZoom: 5, maxZoom: 14 },
        padding: { top: 16, right: 16, bottom: 16, left: 16 },
        ui: { components: ["zoom", "attribution"] },
        popup: {
          dockEnabled: false,
          collapseEnabled: false,
          visibleElements: { closeButton: true, featureNavigation: false },
        } as any,
      });

      viewRef.current = view;

      view.on("click", async (event) => {
        const response = await view.hitTest(event);
        const hit = response.results.find(
          (r: any) => r.graphic?.attributes?.id
        );
        if (hit) {
          onSelectRef.current((hit as any).graphic.attributes.id);
        }
      });

      // Hover tooltip: hitTest on pointer-move, throttled by an in-flight flag
      // to avoid overlapping async calls.
      let hitInFlight = false;
      view.on("pointer-move", async (event) => {
        if (hitInFlight) return;
        hitInFlight = true;
        try {
          const response = await view.hitTest(event);
          const hit = response.results.find(
            (r: any) => r.graphic?.attributes?.id
          );
          if (containerRef.current) {
            containerRef.current.style.cursor = hit ? "pointer" : "";
          }
          if (hit) {
            const a = (hit as any).graphic.attributes;
            setHover({
              name: a.name,
              region: a.region,
              rank: a.rank,
              score: a.score,
              voltageKv: a.voltageKv,
              chargersNearby: a.chargersNearby,
              x: event.x,
              y: event.y,
            });
          } else {
            setHover(null);
          }
        } finally {
          hitInFlight = false;
        }
      });

      view.on("pointer-leave", () => setHover(null));

      if (cancelled) {
        view.destroy();
        return;
      }

      // Signal that the layer is ready so the render effect can paint
      // graphics immediately, rather than waiting for the next prop change.
      setMapReady(true);
    }

    init();

    return () => {
      cancelled = true;
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  // Re-render graphics whenever scored feeders change OR the map becomes ready.
  useEffect(() => {
    if (!mapReady) return;
    let cancelled = false;
    async function render() {
      if (!layerRef.current) return;
      const [{ default: Graphic }, { default: Point }] = await Promise.all([
        import("@arcgis/core/Graphic"),
        import("@arcgis/core/geometry/Point"),
      ]);
      if (cancelled) return;
      layerRef.current.removeAll();

      const TOP_LABEL_COUNT = 5;

      for (let i = 0; i < feeders.length; i++) {
        const f = feeders[i];
        const isSelected = f.id === selectedId;
        const isTop = i < TOP_LABEL_COUNT;
        const score100 = Math.round(f.composite * 100);
        const reasonLabel = REASON_LABEL[f.reason] ?? f.reason;

        const tier = tierForScore(f.composite);

        const dot = new Graphic({
          geometry: new Point({ longitude: f.lng, latitude: f.lat }),
          attributes: {
            id: f.id,
            name: f.name,
            region: f.region,
            score: score100,
            voltageKv: f.voltageKv ?? "—",
            chargersNearby: f.chargersNearby ?? "—",
            reason: reasonLabel,
            rank: i + 1,
          },
          symbol: {
            type: "simple-marker",
            color: [...tier.rgb, 0.92] as any,
            size: 10 + f.composite * 22,
            outline: {
              color: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.5)",
              width: isSelected ? 2.5 : 1,
            },
          } as any,
          popupTemplate: {
            title: "#{rank} · {name}",
            content: `
              <div style="font-family: var(--font-sans, Inter), sans-serif; color: #FFFFFF;">
                <div style="font-family: var(--font-mono, 'JetBrains Mono'), monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #71717A; margin-bottom: 8px;">
                  {region} · {voltageKv} kV · {chargersNearby} EV chargers within 6 km
                </div>
                <div style="display:flex; align-items:baseline; gap: 8px; margin-bottom: 6px;">
                  <div style="font-family: var(--font-mono, monospace); font-size: 28px; font-weight: 600; color: #FFFFFF;">{score}</div>
                  <div style="font-family: var(--font-mono, monospace); font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717A;">/ 100 composite risk</div>
                </div>
                <div style="display:inline-flex; align-items:center; padding: 2px 10px; border-radius: 9999px; border: 1px solid rgba(45,127,249,0.4); background: rgba(45,127,249,0.1); color: #5499FB; font-family: var(--font-mono, monospace); font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em;">{reason}</div>
              </div>
            `,
          },
        } as any);
        layerRef.current.add(dot);

        if (isTop) {
          const yOff = -(20 + f.composite * 14);
          const rankBadge = new Graphic({
            geometry: new Point({ longitude: f.lng, latitude: f.lat }),
            symbol: {
              type: "text",
              text: `#${String(i + 1).padStart(2, "0")}`,
              color: "#FFFFFF",
              haloColor: "#000000",
              haloSize: 3,
              font: { family: "JetBrains Mono", size: 13, weight: "700" },
              yoffset: yOff + 14,
            } as any,
          });
          const nameLabel = new Graphic({
            geometry: new Point({ longitude: f.lng, latitude: f.lat }),
            symbol: {
              type: "text",
              text: f.name,
              color: "#FFFFFF",
              haloColor: "#000000",
              haloSize: 2,
              font: { family: "Inter", size: 11, weight: "600" },
              yoffset: -(16 + f.composite * 14),
            } as any,
          });
          layerRef.current.add(rankBadge);
          layerRef.current.add(nameLabel);
        }
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [feeders, selectedId, mapReady]);

  // Pan to selected feeder.
  useEffect(() => {
    if (!viewRef.current || !selectedId) return;
    const f = feeders.find((x) => x.id === selectedId);
    if (!f) return;
    viewRef.current
      .goTo(
        { center: [f.lng, f.lat], zoom: Math.max(viewRef.current.zoom, 9) },
        { duration: 700, easing: "ease-in-out" }
      )
      .catch(() => {});
  }, [selectedId, feeders]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-surface">
      <div ref={containerRef} className="absolute inset-0" />
      <Legend />
      <HoverTooltip hover={hover} />
    </div>
  );
}

function HoverTooltip({ hover }: { hover: Hover | null }) {
  if (!hover) return null;
  // Flip the tooltip horizontally if it would go off the right edge.
  const flipX = hover.x > 280;
  return (
    <div
      className="pointer-events-none absolute z-20 min-w-[14rem] rounded-lg border border-border bg-surface/95 px-3 py-2 backdrop-blur"
      style={{
        left: flipX ? undefined : hover.x + 16,
        right: flipX ? `calc(100% - ${hover.x - 16}px)` : undefined,
        top: Math.max(8, hover.y - 8),
        transform: "translateY(-100%)",
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-sm font-medium text-fg">{hover.name}</div>
        <div className="font-mono text-sm font-semibold tabular-nums text-fg">
          {hover.score}
        </div>
      </div>
      <div className="mt-0.5 font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle">
        #{String(hover.rank).padStart(2, "0")} · {hover.region}
      </div>
      <div className="mt-1 font-mono text-eyebrow uppercase tracking-[0.15em] text-subtle">
        {typeof hover.voltageKv === "number" && hover.voltageKv > 0
          ? `${hover.voltageKv} kV`
          : "voltage —"}{" "}
        ·{" "}
        {typeof hover.chargersNearby === "number"
          ? `${hover.chargersNearby} EV within 6 km`
          : "no charger data"}
      </div>
    </div>
  );
}

const REASON_LABEL: Record<string, string> = {
  "climate-driven": "Climate-driven",
  "load-driven": "Load-driven",
  "asset-driven": "Asset-driven",
  both: "Climate + Load",
};

type Tier = {
  label: string;
  range: string;
  rgb: [number, number, number];
  hex: string;
};

const TIERS: Tier[] = [
  { label: "Critical", range: "≥ 75", rgb: [220, 38, 38], hex: "#DC2626" },
  { label: "High", range: "60 – 75", rgb: [249, 115, 22], hex: "#F97316" },
  { label: "Elevated", range: "45 – 60", rgb: [245, 158, 11], hex: "#F59E0B" },
  { label: "Moderate", range: "30 – 45", rgb: [132, 204, 22], hex: "#84CC16" },
  { label: "Low", range: "< 30", rgb: [34, 197, 94], hex: "#22C55E" },
];

function tierForScore(s: number): Tier {
  if (s >= 0.75) return TIERS[0];
  if (s >= 0.6) return TIERS[1];
  if (s >= 0.45) return TIERS[2];
  if (s >= 0.3) return TIERS[3];
  return TIERS[4];
}

async function buildOsmDarkBasemap(Basemap: any) {
  const { default: VectorTileLayer } = await import(
    "@arcgis/core/layers/VectorTileLayer"
  );
  // Esri's dark-gray-vector style URL is public but rate-limited; fine for hackathon demo.
  const layer = new VectorTileLayer({
    portalItem: { id: "850db44b9eb845d3bd42b19e8aa7a024" },
  });
  return new Basemap({ baseLayers: [layer], title: "Dark Gray Vector", id: "dark-gray-osm" });
}

function Legend() {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-lg border border-border bg-surface/90 px-3 py-2.5 font-mono backdrop-blur">
      <div className="mb-2 text-eyebrow uppercase tracking-[0.15em] text-subtle">
        Composite Risk
      </div>
      <ul className="flex flex-col gap-1.5">
        {TIERS.map((t) => (
          <li key={t.label} className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-full ring-1 ring-white/40"
              style={{ backgroundColor: t.hex }}
            />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-fg">
              {t.label}
            </span>
            <span className="ml-auto pl-3 text-eyebrow uppercase tracking-[0.15em] text-subtle">
              {t.range}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
