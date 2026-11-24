// Exports one DRAFT destination (and treks linked to it) from the development
// dataset to review/preview/destination.json for the dev-only preview page.
// Read-only. Usage:
//   npx sanity exec scripts/export-preview-fixture.mts --with-user-token -- --slug=khumbu
import { mkdirSync, writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { mapDestination, mapTrek } from "../src/sanity/map.ts";
import { destinationsQuery, treksQuery } from "../src/sanity/queries.ts";

const slug = process.argv.find((a) => a.startsWith("--slug="))?.slice(7);
if (!slug) throw new Error("Pass --slug=<destination slug>");
const c = getCliClient({ apiVersion: "2025-01-01" }).withConfig({ dataset: "development", perspective: "drafts" });
if (c.config().dataset !== "development") throw new Error("development only");

// Same projections as the site, with the published-only filter swapped for this draft.
const published = `!(_id in path("drafts.**")) && defined(slug.current)`;
const raw = await c.fetch(destinationsQuery.replace(published, `slug.current == $slug`).replace(`${published} && references(^._id)`, `references(^._id)`), { slug });
const d = raw[0] && mapDestination(raw[0]);
if (!d?.body) throw new Error(`No draft destination "${slug}" with body text`);
const rawTreks = await c.fetch(treksQuery.replace(published, `slug.current in $treks`), { treks: d.treks });
const treks = rawTreks.map((t: Record<string, unknown>) => mapTrek({ ...t, region: t.region ?? slug })).filter(Boolean);

mkdirSync(new URL("../review/preview/", import.meta.url), { recursive: true });
writeFileSync(new URL("../review/preview/destination.json", import.meta.url), JSON.stringify({ d, treks }, null, 1));
console.log(`Wrote ${d.title}: ${d.body.length} blocks, ${treks.length} treks, seo.index=${d.seo.index}`);
