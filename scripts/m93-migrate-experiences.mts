// Milestone 9.3: migrates the local Experiences content (6 categories, 25
// activities, 4 detail pages), the homepage copy and every licensed scene
// photo into Sanity as DRAFTS. Same safety model as migrate-local-content.mts.
//
// Dry run (default, no mutations):
//   npx sanity exec scripts/m93-migrate-experiences.mts --with-user-token -- --dataset=development
// Execute (only after a clean dry run):
//   … -- --dataset=development --execute
//
// Safety:
// - dataset passed explicitly; production refused (guard.ts) and never written;
// - drafts only (`drafts.<id>`), created with `create` (fails if the id exists)
//   and only when NO planned id exists already: any conflict aborts the run,
//   so existing editorial drafts can never be overwritten;
// - deterministic ids: experienceCategory.<slug>, experience.<slug>, homePage;
// - array keys are derived from content, so re-running the dry run is stable;
// - seo.index = false on every experience; nothing is published;
// - images are content-addressed (image-<sha1>-…): an asset that already
//   exists is reused, never re-uploaded.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { experienceGuides } from "../src/content/experience-guides.ts";
import { experienceCategories } from "../src/content/experiences.ts";
import { home } from "../src/content/home.ts";
import { photoCredits, type PhotoKey } from "../src/content/photo-credits.ts";
import { assertWritableDataset, PRODUCTION } from "../src/sanity/guard.ts";
import { mapExperienceCategory, mapExperienceGuide } from "../src/sanity/map.ts";

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const dataset = assertWritableDataset(arg("dataset"));
const execute = process.argv.includes("--execute");
const client = getCliClient({ apiVersion: "2026-11-01" }).withConfig({ dataset, useCdn: false, perspective: "raw" });
const prodClient = getCliClient({ apiVersion: "2026-11-01" }).withConfig({ dataset: PRODUCTION, useCdn: false, perspective: "raw" });
if (client.config().projectId !== "4qnp14bk") throw new Error("Unexpected Sanity project");

// ── Assets (every licensed scene photo; content-addressed ids) ─────────────
const root = new URL("../", import.meta.url);
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
const assets = (Object.keys(photoCredits) as PhotoKey[]).map((k) => {
  const buf = readFileSync(new URL(`src/assets/scenes/${k}.jpg`, root));
  const { width, height } = jpegSize(buf);
  return { key: k, buf, bytes: buf.length, width, height, id: `image-${createHash("sha1").update(buf).digest("hex")}-${width}x${height}-jpg` };
});
const assetId = (k: PhotoKey) => assets.find((a) => a.key === k)!.id;

// ── Builders ────────────────────────────────────────────────────────────────
const key = (...parts: unknown[]) => createHash("sha1").update(JSON.stringify(parts)).digest("hex").slice(0, 12);
const photo = (k: PhotoKey) => {
  const c = photoCredits[k];
  return { _type: "photo", asset: { _type: "reference", _ref: assetId(k) }, alt: c.alt, location: c.location, license: c.license, artist: c.artist, sourceUrl: c.sourceUrl };
};
const ref = (id: string, type: string) => ({ _type: "reference", _ref: id, _weak: true, _strengthenOnPublish: { type } });
const weak = (id: string) => ({ _type: "reference", _ref: id, _weak: true });
const items = <T extends object>(type: string, list: T[]) => list.map((x) => ({ _type: type, _key: key(type, x), ...x }));
const texts = (list: string[]) => list.map((t) => t); // plain text arrays need no keys? Sanity requires keys only for object items.

const guideFor = new Map(experienceGuides.map((g) => [g.slug, g]));

const categoryDocs = experienceCategories.map((c, i) => ({
  _id: `drafts.experienceCategory.${c.slug}`,
  _type: "experienceCategory",
  title: c.title,
  slug: { _type: "slug", current: c.slug },
  order: i + 1,
  intro: c.intro,
  season: c.season,
  photo: photo(c.photo),
}));

const experienceDocs = experienceCategories.flatMap((c) =>
  c.activities.map((a, i) => {
    const g = a.guide ? guideFor.get(a.guide) : undefined;
    const pageSlug = a.guide; // detail-page slug (e.g. chitwan-wildlife-safari), may differ from the activity slug
    return {
      _id: `drafts.experience.${a.slug}`,
      _type: "experience",
      title: a.title,
      // An activity with a page keeps the page's public slug, so /experiences/<slug> URLs do not change.
      slug: { _type: "slug", current: pageSlug ?? a.slug },
      category: ref(`experienceCategory.${c.slug}`, "experienceCategory"),
      order: i + 1,
      summary: a.text,
      destinations: a.places.map((p) => ({ ...weak(`destination.${p}`), _key: key("dest", a.slug, p) })),
      featured: false,
      seo: { _type: "seo", index: false, ...(g ? { title: g.seo.title, description: g.seo.description } : {}) },
      ...(g && {
        guide: {
          pageTitle: g.title,
          eyebrow: g.eyebrow,
          heading: g.heading,
          emphasis: g.emphasis,
          intro: g.intro,
          hero: photo(g.hero),
          place: g.place,
          overviewTitle: g.overviewTitle,
          overview: texts(g.overview),
          facts: items("fact", g.facts),
          story: g.story.map((s) => ({ _type: "storySection", _key: key("story", s.title), title: s.title, text: texts(s.text), layout: s.layout ?? "left", ...(s.photo && { photo: photo(s.photo) }) })),
          highlights: items("titledText", g.highlights),
          bestTime: g.bestTime,
          preparation: items("titledText", g.preparation),
          safety: items("titledText", g.safety),
          related: g.related.map((r) => ({ ...weak(`experience.${r}`), _key: key("rel", g.slug, r) })),
          faqs: items("faq", g.faqs),
          sources: items("sourceLink", g.sources),
          ...(g.ctaPhoto && { ctaPhoto: photo(g.ctaPhoto) }),
        },
      }),
    };
  }),
);

const homeDoc = {
  _id: "drafts.homePage",
  _type: "homePage",
  heroEyebrow: home.heroEyebrow,
  heroSubline: home.heroSubline,
  treksIntro: home.treksIntro,
  featuredTreks: home.featuredTreks.map((t) => ({ ...weak(`trek.${t.slug}`), _key: key("trek", t.slug) })),
  beyondTitle: home.beyondTitle,
  beyondIntro: home.beyondIntro,
  beyondPhoto: photo(home.beyondPhoto),
  toursTitle: home.toursTitle,
  toursIntro: home.toursIntro,
  closingTitle: home.closingTitle,
  closingText: home.closingText,
  closingPhoto: photo(home.closingPhoto),
};

const docs: { _id: string; _type: string; [k: string]: unknown }[] = [...categoryDocs, ...experienceDocs, homeDoc];

// ── Validation ──────────────────────────────────────────────────────────────
const errors: string[] = [];
const ids = docs.map((d) => d._id);
if (new Set(ids).size !== ids.length) errors.push("duplicate document ids in plan");
const expSlugs = experienceDocs.map((d) => d.slug.current);
if (new Set(expSlugs).size !== expSlugs.length) errors.push("duplicate experience slugs in plan");

// Related experiences must point at planned experience ids (by activity slug).
const activityIds = new Set(experienceDocs.map((d) => d._id.replace("drafts.", "")));
for (const d of experienceDocs) for (const r of (d.guide?.related ?? []) as { _ref: string }[]) if (!activityIds.has(r._ref)) errors.push(`${d._id}: related ${r._ref} not planned`);

// Existing documents: destination/trek targets must exist (as drafts); planned ids must NOT exist.
const existing: { _id: string; _type: string; _updatedAt: string }[] = await client.fetch(`*[_id in $ids]{_id,_type,_updatedAt}`, { ids: ids.flatMap((id) => [id, id.replace("drafts.", "")]) });
const targets: string[] = [...new Set(docs.flatMap((d) => JSON.stringify(d).match(/"_ref":"(destination|trek)\.[^"]+"/g) ?? []).map((m) => m.slice(8, -1)))];
const presentTargets: string[] = await client.fetch(`*[_id in $ids]._id`, { ids: targets.flatMap((t) => [t, `drafts.${t}`]) });
for (const t of targets) if (!presentTargets.some((p) => p === t || p === `drafts.${t}`)) errors.push(`reference target ${t} does not exist in ${dataset}`);
const slugClash: { _id: string; slug: string }[] = await client.fetch(`*[_type in ["experience","experienceCategory"] && slug.current in $slugs && !(_id in $ids)]{_id,"slug":slug.current}`, { slugs: [...expSlugs, ...categoryDocs.map((c) => c.slug.current)], ids: ids.flatMap((id) => [id, id.replace("drafts.", "")]) });
for (const c of slugClash) errors.push(`slug ${c.slug} already used by ${c._id}`);

// Licences: every uploaded photo needs credit, Commons source and an ASSET_LICENSES.md row.
const ledger = readFileSync(new URL("ASSET_LICENSES.md", root), "utf8");
for (const a of assets) {
  const c = photoCredits[a.key];
  if (!c.artist || !c.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:")) errors.push(`photo ${a.key}: missing credit or Commons source`);
  if (!ledger.includes(`\`${a.key}.jpg\``)) errors.push(`photo ${a.key}: no ASSET_LICENSES.md row`);
}

// Rendering: run planned documents through the site's own mappers.
const expand = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(expand) : v && typeof v === "object"
    ? (v as { _type?: string })._type === "photo"
      ? (() => { const a = assets.find((x) => x.id === (v as { asset: { _ref: string } }).asset._ref)!; return { ...(v as object), url: `https://cdn.sanity.io/${a.id}`, width: a.width, height: a.height }; })()
      : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, expand(x)]))
    : v;
for (const c of categoryDocs) {
  const acts = experienceDocs.filter((e) => e.category._ref === c._id.replace("drafts.", "")).map((e) => ({ slug: e.slug.current, title: e.title, summary: e.summary, places: [], hasGuide: !!e.guide }));
  const m = mapExperienceCategory({ ...(expand(c) as object), slug: c.slug.current, activities: acts });
  if (!m || m.activities.length !== acts.length) errors.push(`${c._id}: mapper would drop the category or activities`);
}
for (const e of experienceDocs.filter((x) => x.guide)) {
  const m = mapExperienceGuide({ ...(expand(e) as object), slug: e.slug.current, places: [], guide: { ...(expand(e.guide) as object), related: [] } });
  if (!m) errors.push(`${e._id}: detail page would not render`);
  else if (m.seo.index) errors.push(`${e._id}: would be indexable`);
}
for (const d of experienceDocs) if ((d.seo as { index: boolean }).index !== false) errors.push(`${d._id}: seo.index not false`);

// ── Plan & report ───────────────────────────────────────────────────────────
const existingAssets: string[] = await client.fetch(`*[_id in $ids]._id`, { ids: assets.map((a) => a.id) });
const toUpload = assets.filter((a) => !existingAssets.includes(a.id));
const count = (c: typeof client) => c.fetch<number>(`count(*[!(_id in path("_.**")) && !(_type match "system.*")])`);
const [devBefore, prodBefore] = await Promise.all([count(client), count(prodClient)]);
const report = {
  generated: new Date().toISOString(),
  mode: execute ? "execute" : "dry-run",
  dataset,
  counts: { devContentDocsBefore: devBefore, productionContentDocs: prodBefore },
  documents: { categories: categoryDocs.length, experiences: experienceDocs.length, withDetailPage: experienceDocs.filter((d) => d.guide).length, homePage: 1, total: docs.length },
  conflicts: existing.map((e) => `${e._id} (${e._type}, ${e._updatedAt})`),
  assets: { total: assets.length, reused: existingAssets.length, toUpload: toUpload.map((a) => `${a.key}.jpg (${(a.bytes / 1024).toFixed(0)} KB)`) },
  errors,
  plan: docs.map((d) => ({ id: d._id, type: d._type, title: (d as { title?: string }).title ?? "Homepage", slug: (d as { slug?: { current: string } }).slug?.current })),
};
mkdirSync(new URL("review/m93/", root), { recursive: true });
writeFileSync(new URL(`review/m93/migration-${execute ? "execute" : "dry-run"}.json`, root), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, plan: `${report.plan.length} documents (see review/m93)` }, null, 2));

if (errors.length || existing.length) {
  console.error(`\nSTOP: ${errors.length} validation error(s), ${existing.length} conflicting id(s). Nothing written.`);
  process.exit(1);
}
if (!execute) process.exit(0);

// ── Execute ─────────────────────────────────────────────────────────────────
for (const a of toUpload) {
  const c = photoCredits[a.key];
  const doc = await client.assets.upload("image", a.buf, { filename: `${a.key}.jpg`, title: c.location, description: c.alt, creditLine: `${c.artist}, ${c.license}`, source: { name: "Wikimedia Commons", id: c.sourceUrl, url: c.sourceUrl } });
  if (doc._id !== a.id) throw new Error(`asset id mismatch for ${a.key}: ${doc._id} ≠ ${a.id}`);
}
let tx = client.transaction();
for (const d of docs) tx = tx.create(d);
const res = await tx.commit();
const devAfter = await count(client);
console.log(JSON.stringify({ transaction: res.transactionId, created: docs.length, uploaded: toUpload.length, devContentDocsAfter: devAfter }));
