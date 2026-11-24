// Read-only export of the four trek drafts for the dev-only trek preview
// (review/m8/fixtures/, gitignored). The app never holds a token.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { createClient } from "@sanity/client";
import { mapTrek } from "../src/sanity/map.ts";
import { treksQuery } from "../src/sanity/queries.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (projectId !== "4qnp14bk") throw new Error("Unexpected or missing Sanity project ID");
const { authToken: token } = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, "utf8"));
const client = createClient({ projectId, dataset: "development", apiVersion: "2026-11-01", useCdn: false, token, perspective: "drafts" });
const published = `!(_id in path("drafts.**")) && defined(slug.current)`;
const raw = await client.fetch(
  treksQuery.replace(published, `defined(slug.current)`).replace(`"region": region->slug.current`, `"region": region->slug.current, "regionTitle": region->title`),
);
const dir = new URL("../review/m8/fixtures/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const t of raw) {
  const trek = mapTrek(t);
  if (!trek?.guide) throw new Error(`Trek draft "${t.slug}" has no complete guide`);
  writeFileSync(new URL(`${trek.slug}.json`, dir), JSON.stringify({ trek, region: { slug: t.region, title: t.regionTitle } }, null, 1));
}
console.log(`Exported ${raw.map((t: { slug: string; region: string }) => `${t.slug} (${t.region})`).join(", ")}`);
