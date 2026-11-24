// Read-only consolidated export for destination editorial/SEO audits.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (projectId !== "4qnp14bk") throw new Error("Unexpected or missing Sanity project ID");
const cliConfig = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, "utf8"));
const base = { projectId, apiVersion: "2026-11-01", useCdn: false, token: cliConfig.authToken };
const development = createClient({ ...base, dataset: "development", perspective: "raw" });
const production = createClient({ ...base, dataset: "production", perspective: "raw" });
const projection = `{
  _id, _rev, _createdAt, _updatedAt, title, "slug": slug.current, kind, summary,
  body[]{ ..., _type == "photo" => { ..., asset->{ _id, url, metadata { dimensions, lqip } } } },
  thingsToDo, bestTime, sources, seo,
  nearby[]->{ _id, title, "slug": slug.current, "isDraft": _id in path("drafts.**"), "hasBody": count(body) > 0 },
  photo { ..., asset->{ _id, url, metadata { dimensions, lqip } } },
  gallery[]{ ..., asset->{ _id, url, metadata { dimensions, lqip } } },
  "treks": *[_type == "trek" && references(^._id)]{ _id, title, "slug": slug.current, seo }
}`;
const [destinations, developmentCounts, productionInventory] = await Promise.all([
  development.fetch(`*[_type == "destination" && _id in path("drafts.**") && count(body) > 0] | order(title asc) ${projection}`),
  development.fetch(`{"allDrafts": count(*[_id in path("drafts.**")]), "destinationDrafts": count(*[_type == "destination" && _id in path("drafts.**")]), "destinationDraftsWithBody": count(*[_type == "destination" && _id in path("drafts.**") && count(body) > 0]), "publishedDocuments": count(*[!(_id in path("drafts.**")) && !(_id in path("_.**"))])}`),
  production.fetch(`*[] | order(_id asc){ _id, _rev, _updatedAt }`),
]);
const out = { exportedAt: new Date().toISOString(), developmentCounts, destinations, productionInventory };
mkdirSync(new URL("../review/m79/", import.meta.url), { recursive: true });
writeFileSync(new URL("../review/m79/audit-export.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify({ developmentCounts, destinationTitles: destinations.map((d: { title: string }) => d.title), productionDocuments: productionInventory.length }, null, 2));
