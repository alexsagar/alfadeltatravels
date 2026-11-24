// Migrates verified local content (src/content) into Sanity as DRAFTS.
//
// Dry run (default, read-only):
//   npx sanity exec scripts/migrate-local-content.mts --with-user-token -- --dataset=development
// Execute (only after the dry-run report is approved):
//   … -- --dataset=development --execute
// Overwriting existing documents additionally needs --approve-overwrite.
//
// Safety:
// - destination dataset must be passed explicitly; production is refused (guard.ts);
// - every document is created as a draft (`drafts.<id>`), nothing is published;
// - deterministic ids (`destination.<slug>`, `trek.<slug>`), createIfNotExists;
// - seo.index = false everywhere; no packages, prices, itineraries or company data;
// - the dry run makes no mutations of any kind and writes a report to review/.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { Rule } from "@sanity/schema";
import { getCliClient } from "sanity/cli";
import { destinations } from "../src/content/places.ts";
import { photoCredits, type PhotoKey } from "../src/content/photo-credits.ts";
import { treks } from "../src/content/treks.ts";
import { assertWritableDataset, PRODUCTION } from "../src/sanity/guard.ts";
import { mapDestination, mapTrek } from "../src/sanity/map.ts";
import { schemaTypes } from "../src/sanity/schemaTypes/index.ts";

// ── Arguments ───────────────────────────────────────────────────────────────
const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const flag = (name: string) => process.argv.includes(`--${name}`);
const dataset = assertWritableDataset(arg("dataset"));
const execute = flag("execute");
const approveOverwrite = flag("approve-overwrite");
const client = getCliClient({ apiVersion: "2026-11-01" }).withConfig({ dataset, useCdn: false, perspective: "raw" });
const prodClient = getCliClient({ apiVersion: "2026-11-01" }).withConfig({ dataset: PRODUCTION, useCdn: false, perspective: "raw" });

// ── Assets ──────────────────────────────────────────────────────────────────
const root = new URL("../", import.meta.url);
const file = (k: PhotoKey) => new URL(`src/assets/scenes/${k}.jpg`, root);

/** JPEG width/height from the SOF marker (no image library needed). */
function jpegSize(buf: Buffer) {
  let i = 2;
  while (i < buf.length) {
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  throw new Error("not a JPEG");
}
/** Sanity image asset ids are content-addressed: image-<sha1>-<w>x<h>-<ext>. */
function assetFor(k: PhotoKey) {
  const buf = readFileSync(file(k));
  const { width, height } = jpegSize(buf);
  return { key: k, buf, bytes: buf.length, width, height, id: `image-${createHash("sha1").update(buf).digest("hex")}-${width}x${height}-jpg` };
}

// ── Document builders ───────────────────────────────────────────────────────
let n = 0;
const key = (s: string) => createHash("sha1").update(`${s}#${n++}`).digest("hex").slice(0, 12);
const used = new Set<PhotoKey>();
const photo = (k: PhotoKey) => {
  used.add(k);
  const c = photoCredits[k];
  return { _type: "photo", asset: { _type: "reference", _ref: assetFor(k).id }, alt: c.alt, location: c.location, license: c.license, artist: c.artist, sourceUrl: c.sourceUrl };
};
/** Weak ref + strengthen on publish: required when the target is itself still a draft. */
const ref = (id: string, type: string) => ({ _type: "reference", _ref: id, _weak: true, _strengthenOnPublish: { type } });
const items = <T extends object>(type: string, list: T[]) => list.map((x, i) => ({ _type: type, _key: key(`${type}${i}`), ...x }));
const seo = { _type: "seo", index: false };

const destinationDocs = destinations.map((d) => ({
  _id: `destination.${d.slug}`,
  _type: "destination",
  title: d.title,
  slug: { _type: "slug", current: d.slug },
  kind: d.kind,
  photo: photo(d.photo),
  summary: d.summary,
  seo,
}));

const trekDocs = treks.map((t) => {
  const g = t.guide;
  return {
    _id: `trek.${t.slug}`,
    _type: "trek",
    title: t.title,
    slug: { _type: "slug", current: t.slug },
    region: ref(`destination.${t.region}`, "destination"),
    photo: photo(t.photo),
    summary: t.summary,
    ...(t.highPoint ? { highPoint: t.highPoint } : {}),
    ...(g
      ? {
          guide: {
            hero: photo(g.hero),
            intro: g.intro,
            overview: g.overview,
            facts: items("fact", g.facts),
            highlights: g.highlights.map((h, i) => ({ _type: "highlight", _key: key(`h${i}`), title: h.title, text: h.text, ...(h.photo ? { photo: { ...photo(h.photo), _type: "photo" } } : {}) })),
            preparation: items("titledText", g.preparation),
            seasons: items("season", g.seasons),
            routeTitle: g.routeTitle,
            route: items("routeStop", g.route.map((s) => ({ ...s, acclimatise: !!s.acclimatise }))),
            routeNote: g.routeNote,
            considerations: items("titledText", g.considerations),
            gallery: g.gallery.map((k) => ({ ...photo(k), _key: key(`g${k}`) })),
            faqs: items("faq", g.faqs),
            sources: items("sourceLink", g.sources),
          },
        }
      : {}),
    // No company package: offering is left out entirely (never invented).
    seo,
  };
});
const docs = [...destinationDocs, ...trekDocs];
const assets = [...used].map(assetFor);

// ── Checks ──────────────────────────────────────────────────────────────────
type Finding = { doc: string; level: "error" | "missing" | "note"; text: string };
const findings: Finding[] = [];
const add = (doc: string, level: Finding["level"], text: string) => findings.push({ doc, level, text });

// 1. Schema: required fields (read from the schema's own validation rules) and unknown fields.
const types = Object.fromEntries((schemaTypes as { name: string }[]).map((t) => [t.name, t])) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const isRequired = (f: any) => !!f.validation && (f.validation(new (Rule as any)())?._required === "required"); // eslint-disable-line @typescript-eslint/no-explicit-any
function checkFields(docId: string, typeName: string, value: Record<string, unknown>, path = "") {
  const t = types[typeName];
  if (!t?.fields) return;
  const names = new Set(t.fields.map((f: { name: string }) => f.name));
  for (const k of Object.keys(value)) if (!k.startsWith("_") && k !== "asset" && !names.has(k)) add(docId, "error", `unknown field ${path}${k}`);
  for (const f of t.fields) {
    const v = value[f.name];
    const empty = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
    if (empty) {
      if (isRequired(f)) add(docId, "error", `required field missing: ${path}${f.name}`);
      else add(docId, "missing", `${path}${f.name}`);
      continue;
    }
    const sub = f.type === "object" ? f : types[f.type];
    if (sub?.fields && typeof v === "object" && !Array.isArray(v)) checkFields(docId, f.type === "object" ? `${typeName}.${f.name}` : f.type, v as Record<string, unknown>, `${path}${f.name}.`);
  }
}
// Inline object types (trek.guide) are registered under a synthetic name for the walk above.
for (const t of schemaTypes as any[]) for (const f of t.fields ?? []) if (f.type === "object" && f.fields) types[`${t.name}.${f.name}`] = f; // eslint-disable-line @typescript-eslint/no-explicit-any
for (const d of docs) checkFields(d._id, d._type, d as Record<string, unknown>);

// 2. References resolve within this migration.
const ids = new Set(docs.map((d) => d._id));
for (const t of trekDocs) if (!ids.has(t.region._ref)) add(t._id, "error", `region reference ${t.region._ref} not in migration`);
for (const t of trekDocs) {
  const region = destinationDocs.find((d) => d._id === t.region._ref);
  if (region && region.kind !== "region") add(t._id, "error", `region ${region._id} is not a trekking region`);
}

// 3. Geographic accuracy: every photo on a document must be captioned with a place in that area.
const area: Record<string, string[]> = {
  "destination.annapurna": ["Annapurna", "Ghandruk"],
  "destination.khumbu": ["Khumbu", "Sagarmatha"],
  "destination.langtang": ["Langtang"],
  "destination.kathmandu": ["Kathmandu"],
  "destination.pokhara": ["Pokhara"],
  "destination.chitwan": ["Chitwan"],
  "destination.lumbini": ["Lumbini"],
  "trek.everest-base-camp-trek": ["Khumbu", "Sagarmatha", "Everest"],
  "trek.annapurna-base-camp-trek": ["Annapurna"],
  "trek.langtang-valley-trek": ["Langtang"],
  "trek.mardi-himal-trek": ["Mardi Himal"],
};
const photosIn = (v: unknown): { location: string }[] =>
  !v || typeof v !== "object" ? [] : Array.isArray(v) ? v.flatMap(photosIn) : (v as { _type?: string })._type === "photo" ? [v as { location: string }] : Object.values(v).flatMap(photosIn);
for (const d of docs) {
  const words = area[d._id];
  if (!words) add(d._id, "error", "no geographic expectation defined");
  else for (const p of photosIn(d)) if (!words.some((w) => p.location.includes(w))) add(d._id, "error", `photo "${p.location}" is not captioned within ${words.join("/")}`);
}

// 4. Image licensing: allowed licence, matching licence URL, Commons source, ASSET_LICENSES.md row.
const ledger = readFileSync(new URL("ASSET_LICENSES.md", root), "utf8");
const allowed = types.photo.fields.find((f: { name: string }) => f.name === "license").options.list.map((o: { value: string }) => o.value);
for (const k of used) {
  const c = photoCredits[k];
  const at = `photo ${k}`;
  if (!allowed.includes(c.license)) add(at, "error", `licence "${c.license}" not in schema list`);
  const slug = c.license.replace("CC0 1.0", "publicdomain/zero/1.0").replace(/^CC (BY(?:-SA)?) ([\d.]+)$/, (_, kind: string, v: string) => `licenses/${kind.toLowerCase()}/${v}`);
  if (!c.licenseUrl.includes(slug)) add(at, "error", `licence URL ${c.licenseUrl} does not match ${c.license}`);
  if (!c.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:")) add(at, "error", `source is not a Commons file page`);
  const row = ledger.split("\n").find((l) => l.includes(`\`${k}.jpg\``));
  if (!row) add(at, "error", "no ASSET_LICENSES.md row");
  else if (!row.includes(c.license.replace(" 1.0", ""))) add(at, "error", `ASSET_LICENSES.md row licence differs: ${row.slice(0, 120)}`);
  if (!c.artist) add(at, "error", "photographer missing");
  if (c.alt.length < 10 || c.alt.length > 160) add(at, "error", "alt text length outside 10–160");
}

// 5. The site will render these documents once published (run through the real mappers).
const expand = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(expand) : v && typeof v === "object"
    ? (v as { _type?: string })._type === "photo"
      ? (() => { const a = assets.find((x) => x.id === (v as { asset: { _ref: string } }).asset._ref)!; return { ...(v as object), url: `https://cdn.sanity.io/${a.id}`, width: a.width, height: a.height }; })()
      : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, expand(x)]))
    : v;
for (const d of destinationDocs) if (!mapDestination({ ...(expand(d) as object), slug: d.slug.current })) add(d._id, "error", "site mapper would drop this destination");
for (const t of trekDocs) {
  const m = mapTrek({ ...(expand(t) as object), slug: t.slug.current, region: t.region._ref.replace("destination.", "") });
  if (!m) add(t._id, "error", "site mapper would drop this trek");
  else if (t.guide && !m.guide) add(t._id, "error", "guide would not render");
  else if (m.seo?.index) add(t._id, "error", "would be indexable");
}

// 6. Safety invariants.
for (const d of docs) {
  if ("offering" in d) add(d._id, "error", "contains a company package");
  if ((d as { seo?: { index?: boolean } }).seo?.index !== false) add(d._id, "error", "seo.index is not false");
}
for (const t of trekDocs) if (!t.guide) add(t._id, "note", "incomplete draft: card only — general route guide not written yet");

// ── Existing data (read-only queries) ───────────────────────────────────────
const allIds = docs.flatMap((d) => [d._id, `drafts.${d._id}`]);
const existing: { _id: string; _type: string; _updatedAt: string }[] = await client.fetch(`*[_id in $ids]{_id,_type,_updatedAt}`, { ids: allIds });
const slugClash: { _id: string; slug: string }[] = await client.fetch(`*[_type in ["trek","destination"] && slug.current in $slugs && !(_id in $ids)]{_id,"slug":slug.current}`, { slugs: docs.map((d) => d.slug.current), ids: allIds });
const existingAssets: string[] = await client.fetch(`*[_id in $ids]._id`, { ids: assets.map((a) => a.id) });
const contentCount = (c: typeof client) => c.fetch<number>(`count(*[!(_id in path("_.**")) && !(_type match "system.*")])`);
const [devCount, prodCount] = await Promise.all([contentCount(client), contentCount(prodClient)]);

// ── Plan ────────────────────────────────────────────────────────────────────
const plan = docs.map((d) => {
  const hit = existing.filter((e) => e._id === d._id || e._id === `drafts.${d._id}`);
  return { id: `drafts.${d._id}`, type: d._type, title: (d as { title: string }).title, action: hit.length ? (approveOverwrite ? "overwrite (approved)" : "skip — exists") : "create draft", existing: hit.map((h) => `${h._id} (${h._updatedAt})`) };
});
const errors = findings.filter((f) => f.level === "error");

// ── Report ──────────────────────────────────────────────────────────────────
const lines: string[] = [];
const L = (s = "") => lines.push(s);
L(`# Content migration — ${execute ? "EXECUTION" : "dry run"} report`);
L();
L(`- Generated: ${new Date().toISOString()}`);
L(`- Project 4qnp14bk · target dataset: **${dataset}** · mode: **${execute ? "execute" : "dry run (no mutations)"}**`);
L(`- Content documents now: ${dataset} = ${devCount}, production = ${prodCount} (production is never written by this script)`);
L(`- Documents planned: ${docs.length} (${destinationDocs.length} destinations, ${trekDocs.length} treks), all as drafts, all seo.index=false, no company packages`);
L(`- Image assets: ${assets.length} (${(assets.reduce((s, a) => s + a.bytes, 0) / 1048576).toFixed(1)} MB), ${existingAssets.length} already in ${dataset}`);
L(`- Existing documents with these ids: ${existing.length} · slug clashes with other documents: ${slugClash.length}`);
L(`- Validation errors: **${errors.length}**`);
L();
L("## Documents");
L();
L("| Draft id | Type | Title | Action | Missing optional fields |");
L("|---|---|---|---|---|");
for (const p of plan) {
  const miss = findings.filter((f) => f.doc === p.id.replace("drafts.", "") && f.level === "missing").map((f) => f.text);
  L(`| \`${p.id}\` | ${p.type} | ${p.title} | ${p.action}${p.existing.length ? ` (${p.existing.join(", ")})` : ""} | ${miss.join(", ") || "—"} |`);
}
L();
L("## Image assets");
L();
L("| File | Size | Pixels | Asset id (content hash) | Status | Used for (location) | Licence |");
L("|---|---|---|---|---|---|---|");
for (const a of assets) {
  const c = photoCredits[a.key];
  L(`| \`${a.key}.jpg\` | ${(a.bytes / 1024).toFixed(0)} KB | ${a.width}×${a.height} | \`${a.id.slice(0, 22)}…\` | ${existingAssets.includes(a.id) ? "exists" : "upload"} | ${c.location} | ${c.license} — ${c.artist} |`);
}
L();
L("## Validation");
L();
L(errors.length ? errors.map((e) => `- ❌ ${e.doc}: ${e.text}`).join("\n") : "- ✅ Schema: every required field present, no unknown fields.\n- ✅ References: every trek's region resolves to a migrated trekking region (weak draft references, strengthened on publish).\n- ✅ Geography: every photo is captioned with a place inside its document's area.\n- ✅ Licensing: every photo has an allowed licence, matching licence URL, Commons source page, photographer, and a matching ASSET_LICENSES.md row.\n- ✅ Rendering: every document passes the site's own mappers; the EBC guide renders; nothing is indexable.\n- ✅ No company package, price, itinerary or contact detail is included.");
L();
L("## Notes");
L();
for (const f of findings.filter((f) => f.level === "note")) L(`- ${f.doc}: ${f.text}`);
if (slugClash.length) for (const s of slugClash) L(`- ⚠ slug \`${s.slug}\` already used by ${s._id}`);
L("- Not migrated (no verified data): company & contact settings, tour packages, stories, team, difficulty grades.");
L("- Planned local stories and tour themes stay in code; they are not CMS documents.");

const report = lines.join("\n") + "\n";
const out = new URL(`review/m73-migration-${execute ? "execution" : "dry-run"}.md`, root);
writeFileSync(out, report);
console.log(report);

// ── Execute (only with --execute, only with no validation errors) ───────────
if (execute) {
  if (errors.length) throw new Error(`Refusing to execute: ${errors.length} validation errors.`);
  for (const a of assets) if (!existingAssets.includes(a.id)) await client.assets.upload("image", a.buf, { filename: `${a.key}.jpg` });
  const tx = client.transaction();
  for (const d of docs) {
    const draft: { _id: string; _type: string } = { ...d, _id: `drafts.${d._id}` };
    const exists = plan.find((p) => p.id === draft._id)!.existing.length > 0;
    if (!exists) tx.createIfNotExists(draft);
    else if (approveOverwrite) tx.createOrReplace(draft);
  }
  const res = await tx.commit();
  console.log(`Committed ${res.results.length} draft mutations to ${dataset}.`);
}
const prodAfter = await contentCount(prodClient);
console.log(`production content documents: before ${prodCount}, after ${prodAfter}${prodAfter === prodCount ? " (unchanged)" : " — CHANGED"}`);
