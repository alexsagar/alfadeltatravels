// Milestone 8.2: Mardi Himal viewpoint/base camp split, Kyanjin cheese wording,
// Langtang day-hike heights, Everest Base Camp source records. Development only.
// Safe to rerun: every edit replaces by match, and inserts check for an existing entry first.
// Usage: node --no-warnings --env-file=.env.local scripts/m82-editorial-corrections.mts [--dry-run]
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

type Item = { _key: string; _type: string; [field: string]: unknown };
type Guide = { highlights: Item[]; route: Item[]; facts: Item[]; faqs: Item[]; sources: Item[] };
const CHECKED = "2026-11-22";
const newKey = () => randomUUID().replace(/-/g, "").slice(0, 12);
const edit = (items: Item[], field: string, match: string, patch: Record<string, unknown>) => {
  if (!items.some((i) => i[field] === match)) throw new Error(`Missing ${field} "${match}"`);
  return items.map((i) => (i[field] === match ? { ...i, ...patch } : i));
};
const get = async (id: string) => {
  const doc: { guide: Guide; highPoint: string } | null = await client.fetch(`*[_id == $id][0]{ guide, highPoint }`, { id });
  if (!doc) throw new Error(`Missing ${id}`);
  return doc;
};

let tx = client.transaction();

// Mardi Himal: the Upper Viewpoint (~4,200 m) and the base camp (~4,450–4,500 m) are separate points.
{
  const id = "drafts.trek.mardi-himal-trek";
  const { guide: g } = await get(id);
  let route = edit(g.route, "name", "Mardi Himal Base Camp", {
    note: "About two hours beyond the Upper Viewpoint; published figures range from about 4,450 m to 4,500 m.",
  });
  if (!route.some((r) => r.name === "Upper Viewpoint")) {
    const i = route.findIndex((r) => r.name === "High Camp");
    route = [...route.slice(0, i + 1), { _key: newKey(), _type: "routeStop", name: "Upper Viewpoint", elevationM: 4200, note: "Day climb from High Camp and the usual turnaround point.", acclimatise: false }, ...route.slice(i + 1)];
  }
  const highlights = g.highlights.map((h) =>
    h.title === "Base camp viewpoint" || h.title === "Upper Viewpoint and base camp"
      ? { ...h, title: "Upper Viewpoint and base camp", text: "An early start from High Camp leads up the ridge to the Upper Viewpoint, at about 4,200 m, with views to Annapurna South and Hiunchuli. The base camp lies about two hours further on, and many walkers turn back at the viewpoint." }
      : h,
  );
  const facts = edit(g.facts, "label", "High point", {
    value: "Mardi Himal Base Camp, about 4,450–4,500 m",
    note: "Most walkers turn back at the Upper Viewpoint, about 4,200 m.",
  });
  const faqs = edit(g.faqs, "q", "How high does the trek go?", {
    a: "High Camp, the highest overnight stop, is about 3,580 m. Day climbs reach the Upper Viewpoint at about 4,200 m and, for some walkers, the base camp at about 4,450–4,500 m. Published figures vary.",
  });
  tx = tx.patch(id, (p) => p.set({ "guide.route": route, "guide.highlights": highlights, "guide.facts": facts, "guide.faqs": faqs, highPoint: "Mardi Himal Base Camp, about 4,500 m" }));
}

// Langtang: qualify the cheese dairy; add day-hike heights with their spread.
{
  const id = "drafts.trek.langtang-valley-trek";
  const { guide: g } = await get(id);
  const highlights = edit(g.highlights, "title", "Kyanjin Gompa", {
    text: "A small monastery at the head of the valley, surrounded by peaks and glaciers. A yak-cheese dairy has operated here since Swiss advisers helped set it up in the 1950s; production varies, so ask locally. It is a common place to rest and acclimatise before day hikes.",
  });
  const facts = edit(g.facts, "label", "High point", {
    note: "Optional day hikes go higher: Kyanjin Ri about 4,770 m and Tserko Ri about 4,980 m; published figures vary.",
  });
  const sources = g.sources.some((s) => s.url === "https://www.nepalitimes.com/the-story-of-langtang-cheese")
    ? g.sources
    : [...g.sources, { _key: newKey(), _type: "sourceLink", label: "The story of Langtang cheese — Nepali Times", url: "https://www.nepalitimes.com/the-story-of-langtang-cheese", checkedAt: CHECKED }];
  tx = tx.patch(id, (p) => p.set({ "guide.highlights": highlights, "guide.facts": facts, "guide.sources": sources }));
}

// Everest Base Camp: replace the generic NTB homepage with the park page actually checked;
// point the WMS record at the 2024 guideline. UNESCO (HTTP 403) and the guideline text were not readable, so no checkedAt.
{
  const id = "drafts.trek.everest-base-camp-trek";
  const { guide: g } = await get(id);
  const sources = g.sources.map((s) => {
    if (s.url === "https://ntb.gov.np" || s.url === "https://ntb.gov.np/en/sagarmatha-national-park")
      return { ...s, label: "Sagarmatha National Park — Nepal Tourism Board", url: "https://ntb.gov.np/en/sagarmatha-national-park", checkedAt: CHECKED };
    if (s.url === "https://wms.org" || s.url === "https://doi.org/10.1016/j.wem.2023.05.013")
      return { ...s, label: "Wilderness Medical Society — Clinical Practice Guidelines for Acute Altitude Illness (2024)", url: "https://doi.org/10.1016/j.wem.2023.05.013" };
    return s;
  });
  tx = tx.patch(id, (p) => p.set({ "guide.sources": sources }));
}

// Same WMS record on the other three guides.
for (const id of ["drafts.trek.annapurna-base-camp-trek", "drafts.trek.mardi-himal-trek", "drafts.trek.langtang-valley-trek"]) {
  const key = ((await get(id)).guide.sources.find((s) => s.url === "https://wms.org") ?? {})._key;
  if (key)
    tx = tx.patch(id, (p) =>
      p.set({
        [`guide.sources[_key=="${key}"].url`]: "https://doi.org/10.1016/j.wem.2023.05.013",
        [`guide.sources[_key=="${key}"].label`]: "Wilderness Medical Society — Clinical Practice Guidelines for Acute Altitude Illness (2024)",
      }),
    );
}

if (process.argv.includes("--dry-run")) console.log(JSON.stringify({ dataset, mutations: tx.toJSON().length }));
else console.log(JSON.stringify({ dataset, transactionId: (await tx.commit()).transactionId }));
