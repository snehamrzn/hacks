#!/usr/bin/env node
/**
 * Bake real Ontario grid data into public/data/feeders.json.
 *
 * Data sources (all public, no API keys required):
 *   - OpenStreetMap "power=substation" via Overpass API — real substation locations
 *     and voltage tags. Used as feeder origin points.
 *   - OpenStreetMap "amenity=charging_station" via Overpass API — real EV charger
 *     density used as the load-growth signal (electrification proxy).
 *
 * Risk components (all 0..1):
 *   - hazard   : ice-storm corridor bonus (eastern Ontario) + northern lightning/wind
 *                heuristic by latitude. Documented Ontario climate patterns.
 *   - asset    : distribution-voltage substations (<= 44 kV) score higher (older,
 *                more failure-prone). Transmission (>= 230 kV) scores lower.
 *   - loadDelta: count of EV chargers within 6 km of the substation, normalized.
 *                Proxy for electrification load growth pressure.
 *
 * Run:  node scripts/bake-data.mjs
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "..", "public", "data", "feeders.json");

const OVERPASS = "https://overpass-api.de/api/interpreter";

// Ontario administrative area in OSM (ISO 3166-2 = CA-ON).
const SUBSTATIONS_QUERY = `
[out:json][timeout:120];
area["ISO3166-2"="CA-ON"]->.on;
(
  node["power"="substation"]["voltage"](area.on);
  way["power"="substation"]["voltage"](area.on);
);
out center tags;
`;

const CHARGERS_QUERY = `
[out:json][timeout:120];
area["ISO3166-2"="CA-ON"]->.on;
(
  node["amenity"="charging_station"](area.on);
);
out;
`;

async function overpass(query) {
  console.log("→ overpass query (" + query.trim().split("\n")[1].trim() + " …)");
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": "GridFirst-Hackathon/1.0 (Ontario grid resilience demo)",
      accept: "application/json",
    },
    body: "data=" + encodeURIComponent(query),
  });
  if (!res.ok) throw new Error(`overpass ${res.status}: ${await res.text()}`);
  const data = await res.json();
  console.log(`  ← ${data.elements?.length ?? 0} elements`);
  return data.elements ?? [];
}

function pickCoord(el) {
  if (el.type === "node") return [el.lat, el.lon];
  if (el.center) return [el.center.lat, el.center.lon];
  return null;
}

/** Parse a voltage tag like "230000" or "120000;44000" → max kV. */
function maxVoltageKv(tag) {
  if (!tag) return 0;
  const parts = String(tag).split(/[;,]/).map((s) => parseInt(s.trim(), 10)).filter(Number.isFinite);
  if (!parts.length) return 0;
  const max = Math.max(...parts);
  // Heuristic: values >= 1000 are in volts; smaller numbers are already in kV.
  return max >= 1000 ? max / 1000 : max;
}

function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Climate hazard heuristic for Ontario.
 *   - Eastern corridor (Ottawa Valley, St. Lawrence) sits on the documented 1998
 *     ice-storm path and still experiences elevated freezing-rain frequency.
 *   - North (lat > 47.5) sees more lightning, wind, and forest-fire-driven outages.
 *   - Southwestern Ontario is the lowest hazard band.
 */
function hazardScore(lat, lon) {
  let s = 0.35;
  // Eastern Ontario ice-storm corridor: roughly east of Kingston/Belleville,
  // i.e. lon > -78 between lat 44–46.
  if (lon > -78 && lat > 44 && lat < 46.5) s += 0.4;
  // Far east (Cornwall area).
  if (lon > -76) s += 0.1;
  // Northern Ontario hazard band.
  if (lat > 47.5) s += 0.35;
  if (lat > 49) s += 0.1;
  // Southwestern Ontario discount.
  if (lat < 43.5 && lon < -80) s -= 0.05;
  return clamp01(s);
}

/**
 * Asset vulnerability from voltage class.
 *   - Distribution feeders (<= 44 kV) score highest — older, exposed,
 *     statistically more failures per circuit-mile.
 *   - Sub-transmission (~115 kV) is mid.
 *   - Bulk transmission (>= 230 kV) is lowest — newer hardened gear.
 */
function assetScore(kv) {
  if (!kv) return 0.55;
  if (kv <= 27.6) return 0.85;
  if (kv <= 44) return 0.75;
  if (kv <= 115) return 0.55;
  if (kv <= 230) return 0.35;
  return 0.2;
}

function deriveName(el, lat, lon) {
  const t = el.tags || {};
  if (t.name) return t.name;
  if (t["name:en"]) return t["name:en"];
  if (t.operator && t.ref) return `${t.operator} ${t.ref}`;
  if (t.ref) return `Substation ${t.ref}`;
  // Fallback: rounded coordinate label.
  return `Substation ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}

function deriveRegion(lat, lon) {
  // Coarse region buckets mapped to Ontario zones.
  if (lat > 49) return "Far North";
  if (lat > 47) return "Northern Ontario";
  if (lon > -77) return "Eastern Ontario";
  if (lat > 45) return "Eastern Ontario";
  if (lat > 44.6) return "Central Ontario";
  if (lon < -82) return "Southwest";
  if (lon < -80) return "Southwest";
  if (lon < -79.5 && lat < 44.5) return "GTA West";
  if (lon < -79 && lat < 44.3) return "GTA";
  if (lon < -78.6 && lat < 44.5) return "GTA East";
  return "Central Ontario";
}

function reasonCode(hazard, asset, loadDelta) {
  const top = Math.max(hazard, asset, loadDelta);
  const closeTo = (x) => top > 0 && x / top >= 0.85;
  const climate = closeTo(hazard);
  const load = closeTo(loadDelta);
  const aging = closeTo(asset);
  if (climate && load) return "both";
  if (climate) return "climate-driven";
  if (load) return "load-driven";
  if (aging) return "asset-driven";
  return "both";
}

async function main() {
  const [substations, chargers] = await Promise.all([
    overpass(SUBSTATIONS_QUERY),
    overpass(CHARGERS_QUERY),
  ]);

  // Index chargers by coarse lat/lon grid for fast neighborhood lookup.
  const chargerPoints = chargers
    .map((c) => pickCoord(c))
    .filter(Boolean);
  console.log(`  charger points: ${chargerPoints.length}`);

  const grid = new Map();
  const CELL = 0.1; // ~11 km lat, ~7 km lon at Ontario latitudes
  for (const [lat, lon] of chargerPoints) {
    const key = `${Math.floor(lat / CELL)}:${Math.floor(lon / CELL)}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push([lat, lon]);
  }

  function chargerCountWithin(lat, lon, km) {
    const cellLat = Math.floor(lat / CELL);
    const cellLon = Math.floor(lon / CELL);
    let n = 0;
    for (let dLa = -1; dLa <= 1; dLa++) {
      for (let dLo = -1; dLo <= 1; dLo++) {
        const bucket = grid.get(`${cellLat + dLa}:${cellLon + dLo}`);
        if (!bucket) continue;
        for (const p of bucket) {
          if (haversineKm([lat, lon], p) <= km) n++;
        }
      }
    }
    return n;
  }

  // Build feeder records, dedupe near-duplicates (within 1 km).
  const out = [];
  const seen = [];
  let dupes = 0;
  for (const el of substations) {
    const coord = pickCoord(el);
    if (!coord) continue;
    const [lat, lon] = coord;
    if (lat < 41.5 || lat > 57 || lon < -95.5 || lon > -74) continue;

    // dedupe nearby substations (some are mapped as both node and way)
    const tooClose = seen.some((s) => haversineKm(s, coord) < 1);
    if (tooClose) { dupes++; continue; }
    seen.push(coord);

    const kv = maxVoltageKv(el.tags?.voltage);
    if (kv && kv < 25) continue; // skip tiny distribution junctions

    const chargers6km = chargerCountWithin(lat, lon, 6);
    const loadDelta = clamp01(chargers6km / 25); // 25+ chargers → max

    const hazard = hazardScore(lat, lon);
    const asset = assetScore(kv);

    out.push({
      id: `S-${el.type[0].toUpperCase()}${el.id}`,
      name: deriveName(el, lat, lon),
      region: deriveRegion(lat, lon),
      lat,
      lng: lon,
      voltageKv: kv,
      chargersNearby: chargers6km,
      hazard,
      asset,
      loadDelta,
      reason: reasonCode(hazard, asset, loadDelta),
    });
  }

  // Keep top ~120 by a quick composite so the map stays readable.
  out.sort((a, b) => {
    const sa = 0.4 * a.hazard + 0.2 * a.asset + 0.4 * a.loadDelta;
    const sb = 0.4 * b.hazard + 0.2 * b.asset + 0.4 * b.loadDelta;
    return sb - sa;
  });
  const trimmed = out.slice(0, 120);

  await writeFile(
    OUTPUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sources: {
          substations: "OpenStreetMap power=substation via Overpass",
          chargers: "OpenStreetMap amenity=charging_station via Overpass",
          hazard: "heuristic from Ontario climate patterns (ice-storm corridor, northern wind/lightning)",
          asset: "heuristic from OSM voltage tag (lower voltage → older distribution gear)",
          loadDelta: "EV charger density within 6 km of each substation, normalized",
        },
        count: trimmed.length,
        feeders: trimmed,
      },
      null,
      2
    )
  );

  console.log(`\n✓ wrote ${trimmed.length} feeders to ${OUTPUT}`);
  console.log(`  (filtered from ${substations.length} substations; deduped ${dupes}; total chargers indexed ${chargerPoints.length})`);
}

main().catch((e) => {
  console.error("✗ bake failed:", e);
  process.exit(1);
});
