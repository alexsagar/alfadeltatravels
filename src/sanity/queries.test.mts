// Run: npm test
// Executes the real GROQ queries with groq-js (Sanity's reference
// implementation) against a fixture dataset that contains drafts, a journal
// without consent and an unconsenting team member — then pushes the results
// through the mappers, as the site does.
import assert from "node:assert/strict";
import { evaluate, parse } from "groq-js";
import { mapHome, mapStory, mapTourTheme, mapTrek } from "./map.ts";
import { homeQuery, manifestQuery, settingsQuery, storiesQuery, tourThemesQuery, treksQuery } from "./queries.ts";

const asset = { _id: "image-a", _type: "sanity.imageAsset", url: "https://cdn.sanity.io/images/p/d/a.jpg", metadata: { dimensions: { width: 3000, height: 2000 }, lqip: "data:x" } };
const photo = { _type: "photo", asset: { _ref: "image-a" }, alt: "Ama Dablam above the trail", location: "Pangboche", license: "own" };
const route = [{ name: "Lukla", elevationM: 2860, note: "a" }, { name: "Namche", elevationM: 3440, note: "b" }];
const dataset = [
  asset,
  { _id: "khumbu", _type: "destination", title: "Khumbu", kind: "region", slug: { current: "khumbu" }, photo, summary: "s" },
  { _id: "t1", _type: "trek", title: "Published trek", slug: { current: "published-trek" }, region: { _ref: "khumbu" }, photo, summary: "s", guide: { hero: photo, route, routeTitle: "r" }, offering: { confirmed: false, durationDays: 12, itinerary: [{ day: 1, title: "x" }] } },
  { _id: "drafts.t1", _type: "trek", title: "Draft edit of published trek", slug: { current: "published-trek" }, region: { _ref: "khumbu" }, photo, summary: "DRAFT", guide: { hero: photo, route } },
  { _id: "drafts.t2", _type: "trek", title: "Never published", slug: { current: "draft-only" }, region: { _ref: "khumbu" }, photo, summary: "s", guide: { hero: photo, route } },
  { _id: "t3", _type: "trek", title: "Listed, no guide", slug: { current: "no-guide" }, region: { _ref: "khumbu" }, photo, summary: "s" },
  { _id: "s1", _type: "story", title: "Guide", category: "Guide", slug: { current: "guide" }, summary: "s", body: [{ _type: "block", children: [] }] },
  { _id: "s2", _type: "story", title: "Journal without consent", category: "Journal", consent: false, slug: { current: "journal" }, summary: "s", body: [{ _type: "block" }] },
  { _id: "siteSettings", _type: "siteSettings", team: [{ name: "Yes", role: "Guide", consent: true }, { name: "No", role: "Guide", consent: false }] },
  { _id: "homePage", _type: "homePage", heroEyebrow: "E", heroSubline: "S", treksIntro: "T", beyondTitle: "B", beyondIntro: "I", beyondPhoto: photo, toursTitle: "TT", toursIntro: "TI", closingTitle: "C", closingText: "CT", closingPhoto: photo,
    featuredTreks: [{ _key: "a", title: "Card", trek: { _ref: "t1" } }, { _key: "b", trek: { _ref: "t2" } }], tourCards: [{ _key: "c", title: "Pokhara", theme: "Lakes", photo }], regions: [{ _key: "d", title: "Khumbu", note: "n", photo }] },
  { _id: "theme-b", _type: "tourTheme", title: "Second", order: 2, slug: { current: "b" }, text: "t", photo, places: [{ _ref: "khumbu" }] },
  { _id: "theme-a", _type: "tourTheme", title: "First", order: 1, slug: { current: "a" }, text: "t", photo },
  { _id: "drafts.theme-c", _type: "tourTheme", title: "Draft", order: 0, slug: { current: "c" }, text: "t", photo },
];
const run = async (q: string) => (await evaluate(parse(q), { dataset })).get();

const treks = await run(treksQuery);
assert.deepEqual(treks.map((t: { slug: string }) => t.slug).sort(), ["no-guide", "published-trek"], "drafts excluded");
const mapped = treks.map(mapTrek);
const pub = mapped.find((t: { slug: string }) => t.slug === "published-trek");
assert.equal(pub.summary, "s", "published version, not the draft edit");
assert.equal(pub.region, "khumbu");
assert.ok(pub.guide, "guide with hero + route");
assert.equal(pub.offering, null, "unconfirmed package hidden");
assert.equal(pub.seo.index, false, "noindex unless opted in");
assert.equal(pub.photo.src.width, 2400);

const stories = (await run(storiesQuery)).map(mapStory).filter(Boolean);
assert.deepEqual(stories.map((s: { slug: string }) => s.slug), ["guide"], "journal without consent excluded");

const m = await run(manifestQuery);
assert.deepEqual(m.treks, ["published-trek"], "manifest: only published treks with a guide");
assert.deepEqual(m.stories, ["guide"]);

// Homepage: featured card overrides; a trek that is only a draft is dropped.
const home = mapHome(await run(homeQuery));
assert.deepEqual(home.featuredTreks.map((f) => [f.slug, f.title, f.href]), [["published-trek", "Card", "/treks/published-trek"]]);
assert.deepEqual([home.tourCards[0].title, home.regions[0].note], ["Pokhara", "n"]);

// Tour themes: published only, editor order, place slugs resolved.
const themes = (await run(tourThemesQuery)).map(mapTourTheme);
assert.deepEqual(themes.map((t: { slug: string; places: string[] }) => [t.slug, t.places]), [["a", []], ["b", ["khumbu"]]]);

const settings = await run(settingsQuery);
assert.deepEqual(settings.team.map((t: { name: string }) => t.name), ["Yes"], "team needs consent");

console.log("queries.test: ok");
