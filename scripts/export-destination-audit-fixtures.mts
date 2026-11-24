// Read-only export of every substantive destination draft for local review.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { createClient } from "@sanity/client";
import { mapDestination, mapTrek } from "../src/sanity/map.ts";
import { destinationsQuery, treksQuery } from "../src/sanity/queries.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (projectId !== "4qnp14bk") throw new Error("Unexpected or missing Sanity project ID");
const { authToken: token } = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, "utf8"));
const client = createClient({ projectId, dataset: "development", apiVersion: "2026-11-01", useCdn: false, token, perspective: "drafts" });
const published = `!(_id in path("drafts.**")) && defined(slug.current)`;
const raw = await client.fetch(destinationsQuery.replace(published, `count(body) > 0`).replace(`${published} && references(^._id)`, `references(^._id)`));
const destinations = raw.map(mapDestination).filter(Boolean);
if (destinations.length !== 7) throw new Error(`Expected 7 destinations; found ${destinations.length}`);
const dir = new URL("../review/m79/fixtures/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const d of destinations) {
  const rawTreks = await client.fetch(treksQuery.replace(published, `slug.current in $treks`), { treks: d.treks ?? [] });
  const treks = rawTreks.map((t: Record<string, unknown>) => mapTrek({ ...t, region: t.region ?? d.slug })).filter(Boolean);
  // Related destination drafts have no public route until publication.
  writeFileSync(new URL(`${d.slug}.json`, dir), JSON.stringify({ d: { ...d, nearby: [] }, treks }, null, 1));
}
console.log(`Exported ${destinations.map((d: { slug: string }) => d.slug).join(", ")}`);
