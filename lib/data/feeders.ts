/**
 * Real Ontario feeder dataset, baked from public OpenStreetMap data by
 * scripts/bake-data.mjs. Re-run that script to refresh.
 *
 * Each feeder is a real Ontario substation (location + voltage class from OSM
 * power=substation), with two real signals attached:
 *   - chargersNearby: count of OSM amenity=charging_station within 6 km
 *   - loadDelta: that count normalized into 0..1 as the electrification proxy
 *
 * Hazard and asset components are documented heuristics — see bake-data.mjs.
 */

import baked from "@/public/data/feeders.json";

export type FeederSeed = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  voltageKv: number;
  chargersNearby: number;
  hazard: number;
  asset: number;
  loadDelta: number;
};

export type FeederDataset = {
  generatedAt: string;
  sources: Record<string, string>;
  count: number;
  feeders: FeederSeed[];
};

export const ONTARIO_FEEDERS: FeederSeed[] = (baked as FeederDataset).feeders;
export const DATASET_META = {
  generatedAt: (baked as FeederDataset).generatedAt,
  sources: (baked as FeederDataset).sources,
  count: (baked as FeederDataset).count,
};
