import { defineCliConfig } from "sanity/cli";
import { resolveDataset } from "./src/sanity/guard.ts";

// For `npx sanity …` commands. Same env as the site, same rules: no default
// dataset, and "production" is refused here (no production-read opt-in for
// the CLI), so CLI imports, deletes or schema deploys can't target it while
// development is under way. Commands that take an explicit dataset argument
// (e.g. `dataset create <name>`) still need care — see docs/SANITY_SETUP.md.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: resolveDataset(process.env.NEXT_PUBLIC_SANITY_DATASET, undefined),
  },
});
