// Milestone 9.5.1: Sanity treats ids containing "." (e.g. trek.everest-base-camp-trek)
// as private sub-paths, so the site's anonymous published reads cannot see them.
// Re-creates every published content document whose id contains a dot under the
// same id with "." replaced by "-", rewrites every reference to match, and
// deletes the old ids. One transaction; each source document is revision-guarded.
//
// Dry run (default):  npx sanity exec scripts/m951-public-ids.mts --with-user-token -- --dataset=development
// Execute:            … -- --dataset=development --execute
import { getCliClient } from "sanity/cli";
import { assertWritableDataset } from "../src/sanity/guard.ts";

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const dataset = assertWritableDataset(arg("dataset"));
const execute = process.argv.includes("--execute");
const client = getCliClient({ apiVersion: "2026-11-01" }).withConfig({ dataset, useCdn: false, perspective: "raw" });
if (client.config().projectId !== "4qnp14bk" || client.config().dataset !== "development") throw new Error("development dataset of project 4qnp14bk only");

const TYPES = ["homePage", "siteSettings", "trek", "tour", "tourTheme", "destination", "experienceCategory", "experience", "story"];
type Doc = Record<string, any> & { _id: string; _rev: string }; // eslint-disable-line @typescript-eslint/no-explicit-any
const docs: Doc[] = await client.fetch(`*[_type in $types]`, { types: TYPES });
if (docs.some((d) => d._id.startsWith("drafts."))) throw new Error("Abort: drafts exist; publish or discard them first");
const rename = new Map(docs.filter((d) => d._id.includes(".")).map((d) => [d._id, d._id.replaceAll(".", "-")]));
const clash = [...rename.values()].filter((id) => docs.some((d) => d._id === id));
if (clash.length) throw new Error(`Abort: target ids exist: ${clash.join(", ")}`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rewrite = (v: any): any => {
  if (Array.isArray(v)) return v.map(rewrite);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === "_ref" && rename.has(x as string) ? rename.get(x as string) : rewrite(x)]));
  return v;
};

let refs = 0;
const tx = client.transaction();
for (const d of docs) {
  const { _rev, _createdAt, _updatedAt, ...rest } = d; // eslint-disable-line @typescript-eslint/no-unused-vars
  const next = rewrite(rest);
  const changed = JSON.stringify(next) !== JSON.stringify(rest);
  if (changed) refs++;
  if (rename.has(d._id)) {
    tx.patch(d._id, (p) => p.ifRevisionId(_rev).set({}));
    tx.create({ ...next, _id: rename.get(d._id) });
  } else if (changed) {
    tx.patch(d._id, (p) => p.ifRevisionId(_rev).set(Object.fromEntries(Object.entries(next).filter(([k]) => !k.startsWith("_")))));
  }
}
// Delete old ids last, after every reference to them points at the new id.
for (const old of rename.keys()) tx.delete(old);

console.log(`dataset ${dataset} · documents ${docs.length} · renamed ${rename.size} · documents with rewritten references ${refs}`);
console.log([...rename].slice(0, 4).map(([a, b]) => `${a} -> ${b}`).join("\n"));
if (!execute) console.log("dry run: nothing written");
else console.log(`committed transaction ${(await tx.commit({ visibility: "sync" })).transactionId}`);
