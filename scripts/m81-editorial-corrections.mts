// Milestone 8.1: narrow factual corrections to three trek drafts. Development only.
// Usage: node --no-warnings --env-file=.env.local scripts/m81-editorial-corrections.mts [--dry-run]
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { createClient } from "@sanity/client";
import { assertWritableDataset } from "../src/sanity/guard.ts";

const dataset = assertWritableDataset("development");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (projectId !== "4qnp14bk") throw new Error("Unexpected or missing Sanity project ID");
const { authToken: token } = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, "utf8"));
const client = createClient({ projectId, dataset, apiVersion: "2026-11-01", useCdn: false, token, perspective: "raw" });
if (client.config().dataset !== "development") throw new Error("development only");

type Item = { _key?: string; _type?: string; title?: string; name?: string; text?: string; note?: string; label?: string; url?: string };
type Guide = { highlights: Item[]; route: Item[]; facts: Item[]; sources: Item[] };
const docs: { _id: string; guide: Guide }[] = await client.fetch(`*[_id in $ids]{ _id, guide }`, {
  ids: ["drafts.trek.annapurna-base-camp-trek", "drafts.trek.langtang-valley-trek", "drafts.trek.mardi-himal-trek"],
});
if (docs.length !== 3) throw new Error(`Expected 3 trek drafts; found ${docs.length}`);
const CHECKED = "2026-11-22";
const newKey = () => randomUUID().replace(/-/g, "").slice(0, 12);
// Milestone 8 wrote facts and highlights without _key/_type; Studio needs both.
const keyed = (items: Item[], type: string) => items.map((i) => ({ ...i, _key: i._key ?? newKey(), _type: i._type ?? type }));
const withText = (items: Item[], field: "title" | "name" | "label", match: string, patch: Partial<Item>) => {
  if (!items.some((i) => i[field] === match)) throw new Error(`Missing ${field} "${match}"`);
  return items.map((i) => (i[field] === match ? { ...i, ...patch } : i));
};
const addSources = (items: Item[], extra: { label: string; url: string }[]) => [
  ...items,
  ...extra.filter((e) => !items.some((i) => i.url === e.url)).map((e) => ({ _key: newKey(), _type: "sourceLink", ...e, checkedAt: CHECKED })),
];

let tx = client.transaction();
for (const { _id, guide: g } of docs) {
  let highlights: Item[] = keyed(g.highlights, "highlight");
  let facts: Item[] = keyed(g.facts, "fact");
  let route = g.route;
  let sources = g.sources;
  if (_id.endsWith("annapurna-base-camp-trek")) {
    highlights = withText(highlights, "title", "Machapuchare Base Camp", {
      text: "A cluster of lodges at the mouth of the sanctuary, below the fishtail peak of Machapuchare. The peak is held sacred locally and is not open to climbing expeditions.",
    });
    if (!route.some((r) => r.name === "Himalaya")) {
      const i = route.findIndex((r) => r.name === "Bamboo");
      if (i < 0) throw new Error("Missing Bamboo stop");
      route = [...route.slice(0, i + 1), { _key: newKey(), _type: "routeStop", name: "Himalaya", elevationM: 2920, note: "Small lodge stop that breaks the climb from Bamboo to Deurali.", acclimatise: false } as Item, ...route.slice(i + 1)];
    }
    sources = addSources(sources, [{ label: "Machapuchare — climbing closure and local significance (Nepali Times)", url: "https://nepalitimes.com/to-open-machapuchre-for-mountaineering-or-not" }]);
  }
  if (_id.endsWith("langtang-valley-trek")) {
    highlights = withText(highlights, "title", "Langtang village", {
      text: "On 25 April 2015 the Gorkha earthquake set off a huge avalanche of ice, snow and rock above the village. The debris buried much of old Langtang, and the air blast that came with it destroyed most of what remained and flattened forest across the valley. The village has since been rebuilt.",
    });
    route = withText(route, "name", "Langtang village", { note: "Village rebuilt after the 2015 earthquake disaster." });
    sources = addSources(sources, [
      { label: "Landslide in Langtang Valley — NASA Earth Observatory", url: "https://earthobservatory.nasa.gov/images/85812/landslide-in-langtang-valley" },
      { label: "Villages in Langtang Valley destroyed by landslides and pressure waves — ICIMOD", url: "https://www.icimod.org/wp-content/uploads/2015/05/Villages-in-Langtang-Valley-destroyed-by-landslides-and-pressure-waves-during-the-25-April-2015-earthquake-PDF-789KB.pdf" },
      { label: "Fujita et al. (2017), Natural Hazards and Earth System Sciences — the 2015 Langtang avalanche", url: "https://doaj.org/article/078b58b14dba43b49a7b943a654c96dd" },
    ]);
  }
  if (_id.endsWith("mardi-himal-trek")) {
    facts = withText(facts, "label", "High point", { note: "Published figures range from about 4,450 m to 4,500 m." });
  }
  tx = tx.patch(_id, (p) => p.set({ "guide.highlights": highlights, "guide.facts": facts, "guide.route": route, "guide.sources": sources }));
}

if (process.argv.includes("--dry-run")) console.log(JSON.stringify({ dataset, mutations: tx.toJSON().length }));
else console.log(JSON.stringify({ dataset, transactionId: (await tx.commit()).transactionId }));
