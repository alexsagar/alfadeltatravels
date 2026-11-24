// Milestone 7.9: narrow editorial corrections to the seven destination drafts.
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { createClient } from "@sanity/client";
import { assertWritableDataset } from "../src/sanity/guard.ts";

const dataset = assertWritableDataset("development");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (projectId !== "4qnp14bk") throw new Error("Unexpected or missing Sanity project ID");
const { authToken: token } = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, "utf8"));
const client = createClient({ projectId, dataset, apiVersion: "2026-11-01", useCdn: false, token, perspective: "raw" });
const ids = ["annapurna", "chitwan", "kathmandu", "khumbu", "langtang", "lumbini", "pokhara"].map((slug) => `drafts.destination.${slug}`);
const docs = await client.fetch(`*[_id in $ids]{ _id, _rev, body, bestTime, sources }`, { ids });
if (docs.length !== 7) throw new Error(`Expected 7 destination drafts; found ${docs.length}`);
type RawChild = { text?: string; [key: string]: unknown };
type RawBlock = { _type?: string; children?: RawChild[]; [key: string]: unknown };
type RawSource = { label?: string; publisher?: string; url?: string; checkedAt?: string; [key: string]: unknown };

const replacements = new Map<string, string>([
  [
    "Chitwan National Park now covers about 952.63 square kilometres across Chitwan, Nawalpur, Makwanpur and Parsa districts. It adjoins Parsa National Park to the east and India's Valmiki Tiger Reserve to the south, forming part of a larger protected landscape.",
    "The Chitwan National Park Office gives the park's current administrative area as about 952.63 square kilometres across Chitwan, Nawalpur, Makwanpur and Parsa districts. UNESCO's inscribed World Heritage property retains the earlier figure of 93,200 hectares (932 square kilometres); the two figures describe different boundary records rather than the same measurement. The park adjoins Parsa National Park to the east and India's Valmiki Tiger Reserve to the south, forming part of a larger protected landscape.",
  ],
  [
    "The park office records about 75 mammal species, 643 bird species, 120 fish and 422 plant species. Its best-known animals are the greater one-horned rhinoceros, the Bengal tiger and the Asian elephant; the rivers hold gharial and mugger crocodiles and the endangered Gangetic dolphin, and the grasslands support rare birds such as the Bengal florican and great hornbill.",
    "The park office's undated overview, checked on 22 November 2026, lists about 75 mammal species, 643 bird species, 120 fish species and 422 plant species. These are overview totals rather than results from one named survey, so counts may differ between sources and revisions. The park's best-known animals are the greater one-horned rhinoceros, the Bengal tiger and the Asian elephant; the rivers hold gharial and mugger crocodiles and the endangered Gangetic dolphin, and the grasslands support rare birds such as the Bengal florican and great hornbill.",
  ],
]);

const seasonLead: Record<string, string> = {
  "drafts.destination.annapurna": "As general guidance rather than a guarantee of conditions, ",
  "drafts.destination.chitwan": "As general guidance rather than a guarantee of access or wildlife sightings, ",
  "drafts.destination.kathmandu": "As general guidance rather than a guarantee of weather, ",
  "drafts.destination.khumbu": "As general guidance rather than a guarantee of mountain weather or flights, ",
  "drafts.destination.langtang": "As general guidance rather than a guarantee of trail or weather conditions, ",
  "drafts.destination.lumbini": "As general guidance rather than a guarantee of weather, ",
  "drafts.destination.pokhara": "As general guidance rather than a guarantee of mountain views, ",
};

let tx = client.transaction();
for (const doc of docs) {
  let changed = false;
  const body = (doc.body ?? []).map((block: RawBlock) => {
    if (block._type !== "block") return block;
    const children = (block.children ?? []).map((child: RawChild) => {
      let text = replacements.get(child.text ?? "") ?? child.text ?? "";
      if (doc._id === "drafts.destination.khumbu") text = text.replace("Every visitor needs a Sagarmatha National Park entry permit", "Visitors entering Sagarmatha National Park need a park entry permit");
      if (text !== child.text) changed = true;
      return { ...child, text };
    });
    return { ...block, children };
  });
  const bestTime = doc.bestTime?.startsWith("As general guidance") ? doc.bestTime : `${seasonLead[doc._id]}${doc.bestTime.charAt(0).toLowerCase()}${doc.bestTime.slice(1)}`;
  if (bestTime !== doc.bestTime) changed = true;
  const sources = (doc.sources ?? []).map((source: RawSource) => {
    if (source.label === "Trekking permits (restricted areas)") {
      changed = true;
      return { ...source, label: "Trekking routes and permit fees", publisher: "Department of Immigration, Nepal", url: "https://immigration.gov.np/trekking-route-and-permit-fee", checkedAt: "2026-11-22" };
    }
    if (!source.checkedAt && /^(https:\/\/whc\.unesco\.org|https:\/\/rsis\.ramsar\.org)/.test(source.url ?? "")) {
      changed = true;
      return { ...source, checkedAt: "2026-11-22" };
    }
    return source;
  });
  if (!changed) throw new Error(`No correction produced for ${doc._id}`);
  tx = tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set({ body, bestTime, sources }));
}
const result = await tx.commit({ visibility: "sync" });
console.log(`Corrected ${result.documentIds.length} destination drafts in ${dataset}; production was not writable or addressed.`);
