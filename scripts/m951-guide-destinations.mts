// Milestone 9.5.1: restores each experience detail page's destination list
// (approved M9.2 content) into the new `guide.destinations` field. The M9.3
// migration had stored only the catalogue places. Revision-guarded.
//   npx sanity exec scripts/m951-guide-destinations.mts --with-user-token -- --dataset=development [--execute]
import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";
import { assertWritableDataset } from "../src/sanity/guard.ts";

const dataset = assertWritableDataset(process.argv.find((a) => a.startsWith("--dataset="))?.split("=")[1]);
const client = getCliClient({ apiVersion: "2026-11-01" }).withConfig({ dataset, useCdn: false, perspective: "raw" });
if (client.config().projectId !== "4qnp14bk" || client.config().dataset !== "development") throw new Error("development only");

const pages: Record<string, string[]> = {
  paragliding: ["pokhara", "annapurna"],
  "white-water-rafting": ["kathmandu", "pokhara", "chitwan"],
  "chitwan-wildlife-safari": ["chitwan"],
  "lumbini-spiritual-heritage": ["lumbini", "kathmandu"],
};
const docs: { _id: string; _rev: string; slug: string }[] = await client.fetch(`*[_type == "experience" && slug.current in $s && defined(guide.heading)]{ _id, _rev, "slug": slug.current }`, { s: Object.keys(pages) });
if (docs.length !== 4 || docs.some((d) => d._id.startsWith("drafts."))) throw new Error(`Abort: expected 4 published experience pages, got ${docs.map((d) => d._id)}`);
const tx = client.transaction();
for (const d of docs) {
  const refs = pages[d.slug].map((p) => ({ _type: "reference", _ref: `destination-${p}`, _weak: true, _key: createHash("sha1").update(d.slug + p).digest("hex").slice(0, 12) }));
  console.log(`${d._id}: guide.destinations = ${pages[d.slug].join(", ")}`);
  tx.patch(d._id, (p) => p.ifRevisionId(d._rev).set({ "guide.destinations": refs }));
}
if (process.argv.includes("--execute")) console.log(`committed ${(await tx.commit({ visibility: "sync" })).transactionId}`);
else console.log("dry run: nothing written");
