// Writes src/generated/content-manifest.json: the detail-page slugs that exist
// in this build. Proxy (src/proxy.ts) reads it to return a real HTTP 404 for
// unknown slugs without making any network request at request time.
//
// Runs automatically before `next build` and `next dev` (npm pre-scripts).
// Reads published documents from the same Sanity dataset as the site
// (src/sanity/env.ts); a missing configuration or an unreachable API fails
// the build here with a clear message.
// Run: node scripts/content-manifest.mts
import { mkdirSync, writeFileSync } from "node:fs";
import nextEnv from "@next/env";

// Load .env / .env.local exactly as `next build` / `next dev` do, so the
// manifest and the pages always use the same dataset. Must run before the
// env-reading modules below are evaluated (hence the dynamic imports).
nextEnv.loadEnvConfig(process.cwd());
const { apiVersion, dataset, projectId } = await import("../src/sanity/env.ts");
const { manifestQuery } = await import("../src/sanity/queries.ts");
const { createClient } = await import("@sanity/client");

type Manifest = { dataset: string; treks: string[]; tours: string[]; destinations: string[]; stories: string[]; experiences: string[] };

const client = createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" });
let m: Omit<Manifest, "dataset">;
try {
  m = await client.fetch(manifestQuery);
} catch (e) {
  throw new Error(`content-manifest: could not read Sanity ${projectId}/${dataset}: ${(e as Error).message}`, { cause: e });
}
const manifest: Manifest = { dataset, treks: m.treks, tours: m.tours, destinations: m.destinations, stories: m.stories, experiences: m.experiences };
mkdirSync(new URL("../src/generated/", import.meta.url), { recursive: true });
writeFileSync(new URL("../src/generated/content-manifest.json", import.meta.url), JSON.stringify(manifest, null, 2) + "\n");
console.log(`content-manifest: sanity ${dataset} · treks ${m.treks.length} · tours ${m.tours.length} · destinations ${m.destinations.length} · stories ${m.stories.length} · experiences ${m.experiences.length}`);
