/**
 * Converts world-atlas topojson into a lean GeoJSON ring list for the hero globe.
 * Run: node scripts/build-globe-data.mjs  →  public/globe-land.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";

const topo = JSON.parse(
  readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"),
);
const geo = feature(topo, topo.objects.countries);

// Flatten to plain rings and round to 2dp — plenty at globe scale, ~halves the file.
const round = (n) => Math.round(n * 100) / 100;
const rings = [];
for (const f of geo.features) {
  const { type, coordinates } = f.geometry;
  const polys = type === "Polygon" ? [coordinates] : coordinates;
  for (const poly of polys) {
    for (const ring of poly) {
      if (ring.length < 4) continue;
      rings.push(ring.map(([lon, lat]) => [round(lon), round(lat)]));
    }
  }
}

writeFileSync("public/globe-land.json", JSON.stringify({ rings }));
console.log(`wrote ${rings.length} rings`);
