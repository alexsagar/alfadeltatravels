// Writes src/generated/content-manifest.json: the detail-page slugs that exist
// in this build. Proxy (src/proxy.ts) reads it to return a real HTTP 404 for
// unknown slugs without making any network request at request time.
//
// Runs automatically before `next build` and `next dev` (npm pre-scripts).
// Uses the same source rules as src/lib/content.ts:
//   - Sanity configured  → published documents (per type, falling back to
//     local content when the CMS has no documents of that type yet);
//   - not configured     → local content only.
// Run: node scripts/content-manifest.mts
import { mkdirSync, writeFileSync } from "node:fs";
import nextEnv from "@next/env";

// Load .env / .env.local exactly as `next build` / `next dev` do, so the
// manifest and the pages always use the same content source. Must run before
// the env-reading modules below are evaluated (hence the dynamic imports).
nextEnv.loadEnvConfig(process.cwd());
const { treks: localTreks } = await import("../src/content/treks.ts");
const { experienceGuides } = await import("../src/content/experience-guides.ts");
const { apiVersion, dataset, isSanityConfigured, projectId } = await import("../src/sanity/env.ts");
const { manifestQuery } = await import("../src/sanity/queries.ts");
const { cutover } = await import("../src/sanity/cutover.ts");

type Manifest = { source: "sanity" | "local"; treks: string[]; tours: string[]; destinations: string[]; stories: string[]; experiences: string[] };

const local: Manifest = { source: "local", treks: localTreks.filter((t) => t.guide).map((t) => t.slug), tours: [], destinations: [], stories: [], experiences: experienceGuides.map((g) => g.slug) };

async function build(): Promise<Manifest> {
  if (!isSanityConfigured) return local;
  const { createClient } = await import("@sanity/client");
  const client = createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" });
  const m = await client.fetch<Omit<Manifest, "source"> & { counts: Record<string, number> }>(manifestQuery);
  return {
    source: "sanity",
    // Mirrors the content layer: a type uses the CMS only when opted in via
    // SANITY_CUTOVER and it has published documents; otherwise local content.
    treks: cutover.has("treks") && m.counts.treks ? m.treks : local.treks,
    tours: m.tours,
    destinations: cutover.has("destinations") && m.counts.destinations ? m.destinations : local.destinations,
    stories: m.counts.stories ? m.stories : local.stories,
    experiences: cutover.has("experiences") && m.counts.experiences ? m.experiences : local.experiences,
  };
}

const manifest = await build();
mkdirSync(new URL("../src/generated/", import.meta.url), { recursive: true });
writeFileSync(new URL("../src/generated/content-manifest.json", import.meta.url), JSON.stringify(manifest, null, 2) + "\n");
console.log(`content-manifest: ${manifest.source} · cutover [${[...cutover].join(",") || "none"}] · treks ${manifest.treks.length} · tours ${manifest.tours.length} · destinations ${manifest.destinations.length} · stories ${manifest.stories.length} · experiences ${manifest.experiences.length}`);
