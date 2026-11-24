// Run: npm test
// Covers the CMS → site boundary without a live Sanity project:
// schema validity, publication/draft safety, confirmed-only packages,
// opt-in indexing and image credit mapping.
import assert from "node:assert/strict";
import { groupProblems, validateSchema } from "@sanity/schema/_internal";
import { schemaTypes } from "./schemaTypes/index.ts";
import { mapDestination, mapExperienceCategory, mapExperienceGuide, mapHome, mapOffering, mapPhoto, mapSeo, mapSettings, mapStory, mapTrek } from "./map.ts";
import { manifestQuery, settingsQuery, storiesQuery, toursQuery, treksQuery, destinationsQuery } from "./queries.ts";

// 1. Schemas compile with no errors (warnings allowed) — the same check Studio runs.
const problems = (types: unknown[]) => groupProblems(validateSchema(types as never).getTypes());
assert.ok(problems([{ name: "bad", type: "document", fields: [{ name: "x", type: "nope" }] }]).length, "validator catches a broken schema");
const errors = problems(schemaTypes).flatMap((g) => g.problems.filter((p) => p.severity === "error").map((p) => `${g.path.map((s) => s.name).join(".")}: ${p.message}`));
assert.deepEqual(errors, [], `schema errors:\n${errors.join("\n")}`);

// 2. Every public query excludes drafts explicitly (the client also uses the published perspective).
for (const q of [treksQuery, toursQuery, destinationsQuery, storiesQuery, manifestQuery]) assert.match(q, /!\(_id in path\("drafts\.\*\*"\)\)/);
assert.match(storiesQuery, /consent == true/, "journals need consent");
assert.match(settingsQuery, /team\[consent == true\]/, "only consenting team members");

// 3. Photos: credit fields carried, incomplete images dropped, own photos credited to the company.
const img = { url: "https://cdn.sanity.io/images/p/d/abc-4000x3000.jpg", width: 4000, height: 3000, lqip: "data:x", alt: "Tengboche monastery gate", location: "Tengboche" };
const cc = mapPhoto({ ...img, license: "CC BY-SA 4.0", artist: "A. Person", sourceUrl: "https://commons.wikimedia.org/x" })!;
assert.equal(cc.licenseUrl, "https://creativecommons.org/licenses/by-sa/4.0/");
assert.equal(cc.src.width, 2400);
assert.equal(cc.src.height, 1800);
assert.ok(cc.src.src.includes("w=2400"));
assert.equal(mapPhoto({ ...img, alt: undefined }), null, "no alt → not shown");
assert.equal(mapPhoto({ ...img, location: undefined }), null, "no location → not shown");
assert.equal(mapPhoto({ ...img, license: "own" })!.artist, "Alfa Delta Travels");

// 4. Commercial packages appear only when confirmed and complete.
const pkg = { durationDays: 14, itinerary: [{ day: 1, title: "Kathmandu" }], inclusions: ["Permits"], price: { amount: 1000, currency: "USD", basis: "pp" } };
assert.equal(mapOffering({ ...pkg, confirmed: false }), null);
assert.equal(mapOffering({ ...pkg, confirmed: true, itinerary: [] }), null);
assert.equal(mapOffering({ ...pkg, confirmed: true })!.price!.amount, 1000);
assert.equal(mapOffering(undefined), null);

// 5. Indexing is opt-in.
assert.equal(mapSeo(undefined).index, false);
assert.equal(mapSeo({ index: "yes" }).index, false);
assert.equal(mapSeo({ index: true }).index, true);

// 6. Treks: a guide needs a hero and a route, otherwise the trek is listed without a page.
const trek = { slug: "x", title: "X", region: "khumbu", photo: { ...img, license: "own" }, summary: "s", offering: { ...pkg, confirmed: false } };
assert.equal(mapTrek(trek)!.guide, undefined);
assert.equal(mapTrek(trek)!.offering, null);
assert.equal(mapTrek({ ...trek, guide: { hero: { ...img, license: "own" }, route: [{ name: "a", elevationM: 1 }] } })!.guide, undefined, "one stop is not a route");
assert.ok(mapTrek({ ...trek, guide: { hero: { ...img, license: "own" }, route: [{ name: "a", elevationM: 1 }, { name: "b", elevationM: 2 }] } })!.guide);
assert.equal(mapTrek({ ...trek, photo: null }), null);

// 7. Stories without body are not pages; settings never invent details.
assert.equal(mapStory({ slug: "a", title: "A", body: [] }), null);
const blank = mapSettings(null, { name: "Alfa Delta Travels", description: "d" });
assert.equal(blank.contact.email, undefined);
assert.deepEqual(blank.team, []);

// Nearby links only to destinations with a published page (draft-only refs resolve to null).
const near = mapDestination({ slug: "pokhara", title: "Pokhara", photo: { ...img, license: "own" }, nearby: [null, { slug: "a", title: "A", hasPage: false }, { slug: "b", title: "B", hasPage: true }] })!;
assert.deepEqual(near.nearby, [{ slug: "b", title: "B" }]);

// Experiences (Milestone 9.3): incomplete activities dropped, page links only with a guide, draft-only places dropped.
const cat = mapExperienceCategory({ slug: "sky", title: "Sky", photo: img, activities: [{ slug: "p", title: "P", summary: "S", places: ["pokhara", null], hasGuide: true }, { slug: "x", title: "X", summary: "" }, { slug: "q", title: "Q", summary: "S", places: null }] })!;
assert.deepEqual(cat.activities.map((a) => [a.slug, a.guide, a.places]), [["p", "p", ["pokhara"]], ["q", undefined, []]]);
assert.equal(mapExperienceCategory({ slug: "sky", title: "Sky" }), null);
const guideRaw = { slug: "p", title: "P", category: "sky", places: ["pokhara"], guide: { heading: "H", hero: img, overview: ["o"], sources: [{ label: "s", url: "https://x" }], related: [null, "q"] } };
const guide = mapExperienceGuide(guideRaw)!;
assert.equal(guide.seo.index, false, "experience pages are noindex unless explicitly approved");
assert.deepEqual(guide.related, ["q"]);
assert.equal(mapExperienceGuide({ ...guideRaw, guide: { ...guideRaw.guide, sources: [] } }), null, "a page needs sources");
// Homepage: blank CMS fields keep the local copy; no CMS document = local.
const localHomeContent = { heroEyebrow: "E", heroSubline: "S", treksIntro: "T", featuredTreks: [], beyondTitle: "B", beyondIntro: "I", beyondPhoto: mapPhoto(img)!, toursTitle: "TT", toursIntro: "TI", closingTitle: "C", closingText: "CT", closingPhoto: mapPhoto(img)! };
assert.equal(mapHome(null, localHomeContent), localHomeContent);
const h = mapHome({ heroEyebrow: "New", heroSubline: "  ", featuredTreks: [{ slug: "t", title: "T", photo: img, hasGuide: false }] }, localHomeContent);
assert.deepEqual([h.heroEyebrow, h.heroSubline, h.featuredTreks[0].href], ["New", "S", undefined]);

console.log("map.test: ok");
