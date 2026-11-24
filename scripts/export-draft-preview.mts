// Exports DRAFT homepage and Experiences content from `development` to local
// fixtures for the dev-only editorial preview (Milestone 9.3). The token is
// the Sanity CLI user token and lives only in this process; the app never
// holds one. Output is gitignored (review/preview/).
//
// Runs the site's own public queries with the "drafts" perspective (drafts
// overlaid on published), so the preview uses exactly the same mapping as
// the live site will after publishing.
//   npx sanity exec scripts/export-draft-preview.mts --with-user-token
import { mkdirSync, writeFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { experienceCategoriesQuery, experienceGuidesQuery, homeQuery } from "../src/sanity/queries.ts";

const client = getCliClient({ apiVersion: "2026-11-01" }).withConfig({ dataset: "development", useCdn: false, perspective: "drafts" });
if (client.config().dataset !== "development" || client.config().projectId !== "4qnp14bk") throw new Error("development only");

const [home, categories, guides] = await Promise.all([client.fetch(homeQuery), client.fetch(experienceCategoriesQuery), client.fetch(experienceGuidesQuery)]);
const dir = new URL("../review/preview/", import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL("drafts.json", dir), JSON.stringify({ exportedAt: new Date().toISOString(), home, categories, guides }, null, 2));
console.log(`draft preview: home ${home ? "yes" : "no"} · categories ${categories.length} · activities ${categories.reduce((n: number, c: { activities: unknown[] }) => n + c.activities.length, 0)} · detail pages ${guides.items.length}`);
