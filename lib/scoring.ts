/**
 * Composite risk = w_hazard * hazard + w_asset * asset + w_load * load_delta
 * Each component is normalized 0..1. Weights are normalized so they sum to 1
 * regardless of slider position (so the composite stays in 0..1).
 */

export type FeederScoreInputs = {
  hazard: number;
  asset: number;
  loadDelta: number;
};

export type Weights = {
  hazard: number;
  asset: number;
  loadDelta: number;
};

export type ReasonCode = "climate-driven" | "load-driven" | "asset-driven" | "both";

export type ScoredFeeder = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  hazard: number;
  asset: number;
  loadDelta: number;
  composite: number;
  reason: ReasonCode;
  voltageKv?: number;
  chargersNearby?: number;
};

export const DEFAULT_WEIGHTS: Weights = {
  hazard: 0.4,
  asset: 0.2,
  loadDelta: 0.4,
};

export function normalizeWeights(w: Weights): Weights {
  const total = w.hazard + w.asset + w.loadDelta;
  if (total <= 0) return { hazard: 1 / 3, asset: 1 / 3, loadDelta: 1 / 3 };
  return {
    hazard: w.hazard / total,
    asset: w.asset / total,
    loadDelta: w.loadDelta / total,
  };
}

export function computeComposite(s: FeederScoreInputs, w: Weights): number {
  const nw = normalizeWeights(w);
  return clamp01(nw.hazard * s.hazard + nw.asset * s.asset + nw.loadDelta * s.loadDelta);
}

export function reasonCode(s: FeederScoreInputs, w: Weights): ReasonCode {
  const nw = normalizeWeights(w);
  const contributions = {
    hazard: nw.hazard * s.hazard,
    asset: nw.asset * s.asset,
    loadDelta: nw.loadDelta * s.loadDelta,
  };
  const top = Math.max(contributions.hazard, contributions.asset, contributions.loadDelta);
  const closeToTop = (x: number) => top > 0 && x / top >= 0.85;
  const climate = closeToTop(contributions.hazard);
  const load = closeToTop(contributions.loadDelta);
  const asset = closeToTop(contributions.asset);

  if (climate && load) return "both";
  if (climate) return "climate-driven";
  if (load) return "load-driven";
  if (asset) return "asset-driven";
  return "both";
}

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

export function rankFeeders<
  T extends FeederScoreInputs & {
    id: string;
    name: string;
    region: string;
    lat: number;
    lng: number;
    voltageKv?: number;
    chargersNearby?: number;
  }
>(feeders: T[], weights: Weights): ScoredFeeder[] {
  return feeders
    .map((f) => ({
      id: f.id,
      name: f.name,
      region: f.region,
      lat: f.lat,
      lng: f.lng,
      hazard: f.hazard,
      asset: f.asset,
      loadDelta: f.loadDelta,
      voltageKv: f.voltageKv,
      chargersNearby: f.chargersNearby,
      composite: computeComposite(f, weights),
      reason: reasonCode(f, weights),
    }))
    .sort((a, b) => b.composite - a.composite);
}
