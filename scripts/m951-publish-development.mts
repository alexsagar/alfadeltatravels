// Milestone 9.5.1: makes Sanity `development` the only content source.
// 1. Completes the homepage singleton (approved M9.5 beyondIntro, featured
//    card titles/photos, Tours and Destinations section cards).
// 2. Keeps the Everest Base Camp guide indexable (its approved M6A policy).
// 3. Creates the content that existed only in code: 4 tour themes and the
//    Company & contact singleton (name, description, footer tagline only;
//    no contact details are invented).
// 4. Publishes every existing draft the way Studio does (weak draft
//    references marked _strengthenOnPublish become strong). Each publish is
//    guarded by the draft's revision (ifRevisionID), so a draft edited after
//    the dry run aborts the whole transaction instead of being overwritten.
//
// Dry run (default):  npx sanity exec scripts/m951-publish-development.mts --with-user-token -- --dataset=development
// Execute:            … -- --dataset=development --execute
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { photoCredits, type PhotoKey } from "../src/content/photo-credits.ts";
import { assertWritableDataset } from "../src/sanity/guard.ts";

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const dataset = assertWritableDataset(arg("dataset"));
const execute = process.argv.includes("--execute");
const client = getCliClient({ apiVersion: "2026-11-01" }).withConfig({ dataset, useCdn: false, perspective: "raw" });
if (client.config().projectId !== "4qnp14bk" || client.config().dataset !== "development") throw new Error("development dataset of project 4qnp14bk only");

// Content-addressed asset ids (same scheme as m93): reuse uploaded assets.
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
const assetId = (k: PhotoKey) => {
  const buf = readFileSync(new URL(`../src/assets/scenes/${k}.jpg`, import.meta.url));
  const { width, height } = jpegSize(buf);
  return `image-${createHash("sha1").update(buf).digest("hex")}-${width}x${height}-jpg`;
};
const photo = (k: PhotoKey) => {
  const c = photoCredits[k];
  return { _type: "photo", asset: { _type: "reference", _ref: assetId(k) }, alt: c.alt, location: c.location, license: c.license, artist: c.artist, sourceUrl: c.sourceUrl };
};
const key = (...p: unknown[]) => createHash("sha1").update(JSON.stringify(p)).digest("hex").slice(0, 12);
const ref = (id: string) => ({ _type: "reference", _ref: id });

// ── Approved copy (moved verbatim from src/content in this milestone) ──────
const homePatch = {
  beyondIntro: "Nepal is more than its mountains: open sky above Pokhara, rivers fed by Himalayan snow, ancient cities, lowland jungle and the quiet gardens of Lumbini.",
  featuredTreks: (
    [
      ["everest-base-camp-trek", "Everest Base Camp", "amadablam"],
      ["annapurna-base-camp-trek", "Annapurna Base Camp", "abc"],
      ["langtang-valley-trek", "Langtang Valley", "forest"],
    ] as const
  ).map(([slug, title, p]) => ({ _type: "featuredTrek", _key: key("ft", slug), trek: { ...ref(`trek.${slug}`), _weak: true }, title, photo: photo(p) })),
  tourCards: (
    [
      ["Kathmandu Valley", "Heritage", "kathmandu"],
      ["Pokhara", "Lakes & hills", "pokhara"],
      ["Chitwan", "Jungle & wildlife", "chitwan"],
      ["Lumbini", "Pilgrimage", "lumbini"],
    ] as const
  ).map(([title, theme, p]) => ({ _type: "tourCard", _key: key("tc", title), title, theme, photo: photo(p) })),
  regions: (
    [
      ["Annapurna", "Stone villages, terraced hillsides and high passes.", "village"],
      ["Khumbu", "Moraine, cairns and glacial lakes beneath the highest peaks on earth.", "alpine"],
      ["Langtang", "Forest trails into a valley north of Kathmandu.", "forest"],
    ] as const
  ).map(([title, note, p]) => ({ _type: "homeRegion", _key: key("rg", title), title, note, photo: photo(p) })),
};

const tourThemes = [
  { slug: "culture", title: "Culture & heritage", photo: "lumbini", text: "Temples, stupas and royal squares in the Kathmandu Valley, and the pilgrimage gardens of Lumbini.", places: ["kathmandu", "lumbini"] },
  { slug: "wildlife", title: "Wildlife", photo: "chitwan", text: "Jungle walks, canoe and jeep safaris in the lowland national parks, home to rhinoceros, gharial and many bird species.", places: ["chitwan"] },
  { slug: "leisure", title: "Leisure", photo: "pokhara", text: "Slower days by Phewa Lake, sunrise viewpoints over the Annapurnas and easy walks through the foothills.", places: ["pokhara"] },
  { slug: "adventure", title: "Adventure", photo: "sarangkot", text: "Paragliding from Sarangkot above Pokhara, river rafting and mountain biking — and, of course, trekking.", places: ["pokhara", "annapurna"] },
] as const;
const newDocs = [
  ...tourThemes.map((t, i) => ({
    _id: `tourTheme.${t.slug}`,
    _type: "tourTheme",
    title: t.title,
    slug: { _type: "slug", current: t.slug },
    order: i + 1,
    text: t.text,
    photo: photo(t.photo),
    places: t.places.map((p) => ({ ...ref(`destination.${p}`), _weak: true, _key: key("pl", t.slug, p) })),
  })),
  {
    _id: "siteSettings",
    _type: "siteSettings",
    name: "Alfa Delta Travels",
    description: "Treks, adventures and cultural journeys across Nepal, from the Himalaya to the lowland jungle, planned by Alfa Delta Travels.",
    footerTagline: "Journeys across Nepal, from Himalayan trails and white-water gorges to jungle lowlands and the old cities of the Kathmandu Valley.",
  },
];

/** What Studio's Publish does to references: `_strengthenOnPublish` weak refs become strong. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const strengthen = (v: any): any => {
  if (Array.isArray(v)) return v.map(strengthen);
  if (v && typeof v === "object") {
    if (v._strengthenOnPublish) {
      const { _strengthenOnPublish, _weak, ...rest } = v; // eslint-disable-line @typescript-eslint/no-unused-vars
      return rest;
    }
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, strengthen(x)]));
  }
  return v;
};

// ── Plan ────────────────────────────────────────────────────────────────────
type Doc = Record<string, any> & { _id: string; _rev: string }; // eslint-disable-line @typescript-eslint/no-explicit-any
const drafts: Doc[] = await client.fetch(`*[_id in path("drafts.**") && _type in ["homePage","trek","destination","experienceCategory","experience"]]`);
const published: string[] = await client.fetch(`*[!(_id in path("drafts.**")) && _type in ["homePage","trek","destination","experienceCategory","experience","tourTheme","siteSettings"]]._id`);
const existingNew: string[] = await client.fetch(`*[_id in $ids]._id`, { ids: newDocs.flatMap((d) => [d._id, `drafts.${d._id}`]) });
const assets: string[] = await client.fetch(`*[_type == "sanity.imageAsset"]._id`);
const missingAssets = [...new Set(JSON.stringify([homePatch, newDocs]).match(/image-[a-f0-9]{40}-\d+x\d+-jpg/g))].filter((a) => !assets.includes(a));

console.log(`dataset ${dataset} · drafts ${drafts.length} · already published ${published.length} · new docs present ${existingNew.length} · missing assets ${missingAssets.length}`);
if (published.length || existingNew.length || missingAssets.length) throw new Error(`Abort: unexpected state ${JSON.stringify({ published, existingNew, missingAssets })}`);
const home = drafts.find((d) => d._id === "drafts.homePage");
const ebc = drafts.find((d) => d._id === "drafts.trek.everest-base-camp-trek");
if (!home || !ebc || drafts.length !== 43) throw new Error("Abort: expected 43 drafts incl. homePage and EBC");
console.log(`homePage.beyondIntro: ${JSON.stringify(home.beyondIntro)}\n  -> ${JSON.stringify(homePatch.beyondIntro)}`);
console.log(`homePage.featuredTreks: ${home.featuredTreks.length} references -> ${homePatch.featuredTreks.length} cards; + ${homePatch.tourCards.length} tour cards, ${homePatch.regions.length} regions`);
console.log(`trek.everest-base-camp-trek seo.index: ${ebc.seo?.index} -> true`);
console.log(`create + publish: ${newDocs.map((d) => d._id).join(", ")}`);
console.log(`publish: ${drafts.map((d) => d._id.slice(7)).join(", ")}`);

const tx = client.transaction();
for (const d of drafts) {
  const { _rev, _createdAt, _updatedAt, ...rest } = d; // eslint-disable-line @typescript-eslint/no-unused-vars
  let doc = { ...strengthen(rest), _id: d._id.slice("drafts.".length) };
  if (d._id === home._id) doc = { ...doc, ...homePatch };
  if (d._id === ebc._id) doc = { ...doc, seo: { ...(doc.seo ?? {}), _type: doc.seo?._type ?? "seo", index: true } };
  tx.patch(d._id, (p) => p.ifRevisionId(_rev).set({}));
  tx.create(doc);
  tx.delete(d._id);
}
for (const d of newDocs) tx.create(d as { _id: string; _type: string });

if (!execute) {
  console.log(`dry run: ${drafts.length + newDocs.length} documents would be published; nothing written`);
} else {
  const r = await tx.commit({ visibility: "sync" });
  console.log(`committed transaction ${r.transactionId}`);
}
