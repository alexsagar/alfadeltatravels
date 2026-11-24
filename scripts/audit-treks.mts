// Read-only export of trek drafts (development) and production fingerprint for Milestone 8.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (projectId !== "4qnp14bk") throw new Error("Unexpected or missing Sanity project ID");
const cliConfig = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, "utf8"));
const base = { projectId, apiVersion: "2026-11-01", useCdn: false, token: cliConfig.authToken };
const development = createClient({ ...base, dataset: "development", perspective: "raw" });
const production = createClient({ ...base, dataset: "production", perspective: "raw" });
const [treks, counts, prod] = await Promise.all([
  development.fetch(`*[_type == "trek" && _id in path("drafts.**")] | order(title asc){ ..., "slug": slug.current, region->{ _id, title, "slug": slug.current } }`),
  development.fetch(`{"allDrafts": count(*[_id in path("drafts.**")]), "trekDrafts": count(*[_type == "trek" && _id in path("drafts.**")]), "destinationDrafts": count(*[_type == "destination" && _id in path("drafts.**")]), "published": count(*[!(_id in path("drafts.**")) && !(_id in path("_.**"))]), "indexed": *[_id in path("drafts.**") && seo.index == true]._id}`),
  production.fetch(`*[] | order(_id asc){ _id, _rev, _updatedAt }`),
]);
const fingerprint = createHash("sha256").update(JSON.stringify(prod)).digest("hex");
mkdirSync(new URL("../review/m8/", import.meta.url), { recursive: true });
writeFileSync(new URL(`../review/m8/treks-export-${process.argv[2] ?? "before"}.json`, import.meta.url), JSON.stringify({ exportedAt: new Date().toISOString(), counts, treks, productionDocuments: prod.length, fingerprint }, null, 2));
console.log(JSON.stringify({ counts, treks: treks.map((t: { _id: string; title: string; slug: string }) => [t._id, t.title, t.slug]), productionDocuments: prod.length, fingerprint }, null, 2));
