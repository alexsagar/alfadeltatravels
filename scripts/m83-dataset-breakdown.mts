// Read-only breakdown of both datasets by document type (Milestone 8.3). Fetches only; never writes to Sanity.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (projectId !== "4qnp14bk") throw new Error("Unexpected or missing Sanity project ID");
const cliConfig = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, "utf8"));
const base = { projectId, apiVersion: "2026-11-01", useCdn: false, token: cliConfig.authToken, perspective: "raw" as const };

type Doc = { _id: string; _type: string; _rev: string; _updatedAt: string };
const kind = (d: Doc) =>
  d._type.startsWith("system.") || d._type.startsWith("sanity.") || d._id.startsWith("_.") ? "system" : d._id.startsWith("drafts.") ? "draft" : "published";

for (const dataset of ["production", "development"]) {
  const client = createClient({ ...base, dataset });
  const docs: Doc[] = await client.fetch(`*[] | order(_id asc){ _id, _type, _rev, _updatedAt }`);
  const rows: Record<string, number> = {};
  for (const d of docs) rows[`${kind(d)}\t${d._type}`] = (rows[`${kind(d)}\t${d._type}`] ?? 0) + 1;
  console.log(`\n## ${dataset}: ${docs.length} documents`);
  for (const [k, n] of Object.entries(rows).sort()) console.log(`${k}\t${n}`);
  if (dataset === "production") {
    // Same projection and hash as scripts/audit-treks.mts, so the result is comparable with the M8 baseline.
    const prod = docs.map(({ _id, _rev, _updatedAt }) => ({ _id, _rev, _updatedAt }));
    console.log("fingerprint", createHash("sha256").update(JSON.stringify(prod)).digest("hex"));
    for (const d of docs) console.log(`  ${kind(d)}\t${d._type}\t${d._id}\t${d._updatedAt}`);
  }
}
