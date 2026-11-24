// Experiences content integrity: every activity's places are real destination
// slugs (no broken or inferred links) and activity slugs are unique (future detail pages).
import assert from "node:assert/strict";
import { experienceCategories } from "./experiences.ts";
import { destinations } from "./places.ts";

const known = new Set(destinations.map((d) => d.slug));
const slugs = experienceCategories.flatMap((c) => c.activities.map((a) => a.slug));
assert.equal(experienceCategories.length, 6);
assert.equal(new Set(slugs).size, slugs.length, "duplicate activity slug");
for (const c of experienceCategories) for (const a of c.activities) for (const p of a.places) assert.ok(known.has(p), `${a.slug}: unknown place ${p}`);
console.log("experiences.test: ok");

// Detail pages: every catalogue link points at an existing guide, every guide
// is linked from the catalogue, and guide places/related activities exist.
const { experienceGuides } = await import("./experience-guides.ts");
const guideSlugs = new Set(experienceGuides.map((g) => g.slug));
const linked = experienceCategories.flatMap((c) => c.activities.map((a) => a.guide).filter(Boolean));
for (const s of linked) assert.ok(guideSlugs.has(s!), `catalogue links missing guide ${s}`);
for (const g of experienceGuides) {
  assert.ok(linked.includes(g.slug), `guide ${g.slug} not linked from catalogue`);
  assert.equal(g.seo.index, false, `${g.slug} must stay noindex until approved`);
  for (const p of g.destinations) assert.ok(known.has(p), `${g.slug}: unknown place ${p}`);
  for (const r of g.related) assert.ok(slugs.includes(r), `${g.slug}: unknown related ${r}`);
  assert.ok(g.sources.length > 0 && g.faqs.length > 0, `${g.slug}: needs sources and FAQs`);
}
console.log("experience-guides.test: ok");
