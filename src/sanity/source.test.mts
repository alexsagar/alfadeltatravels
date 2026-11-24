// Run: npm test
// Sanity is the only content source (Milestone 9.5.1): the env refuses to
// start without a project/dataset, production stays locked, and no editorial
// content module or fallback can creep back into the code.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";

const load = (env: Record<string, string>) =>
  execFileSync(process.execPath, ["--no-warnings", "--input-type=module", "-e", `const m = await import(${JSON.stringify(new URL("./env.ts", import.meta.url).href)}); console.log(m.dataset)`], {
    env: { PATH: process.env.PATH ?? "", ...env } as unknown as NodeJS.ProcessEnv,
    encoding: "utf8",
    stdio: "pipe",
  }).trim();

assert.equal(load({ NEXT_PUBLIC_SANITY_PROJECT_ID: "4qnp14bk", NEXT_PUBLIC_SANITY_DATASET: "development" }), "development");
assert.throws(() => load({ NEXT_PUBLIC_SANITY_DATASET: "development" }), /NEXT_PUBLIC_SANITY_PROJECT_ID is not set/, "no project id, no build");
assert.throws(() => load({ NEXT_PUBLIC_SANITY_PROJECT_ID: "4qnp14bk" }), /NEXT_PUBLIC_SANITY_DATASET is not set/, "no default dataset");
assert.throws(() => load({ NEXT_PUBLIC_SANITY_PROJECT_ID: "4qnp14bk", NEXT_PUBLIC_SANITY_DATASET: "production" }), /locked/, "production locked");

// Only technical modules remain in src/content; the content layer imports none of the removed editorial files.
assert.deepEqual(readdirSync(new URL("../content/", import.meta.url)).sort(), ["photo-credits.ts", "photos.ts", "site.ts", "types.ts"]);
const layer = readFileSync(new URL("../lib/content.ts", import.meta.url), "utf8");
assert.doesNotMatch(layer, /@\/content\/(home|treks|places|experiences|experience-guides)\b/);
assert.doesNotMatch(layer, /\blocal[A-Z]\w*\(/, "no local fallback helpers");

console.log("source.test: ok");
