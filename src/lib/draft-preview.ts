// DEV-ONLY editorial preview data (Milestone 9.3). Reads the draft fixture
// written by scripts/export-draft-preview.mts (gitignored review/preview/)
// and resolves it with the SAME mappers as the public content layer. The app
// never holds a Sanity token and never queries drafts; only `.dev.tsx` routes
// (absent from production builds) import this module.
import "server-only";
import { readFile } from "node:fs/promises";
import { getTreks, localHome, resolveExperienceCategories, resolveExperienceGuides } from "@/lib/content";
import { mapHome } from "@/sanity/map";

export async function loadDraftPreview() {
  if (process.env.NODE_ENV !== "development") throw new Error("Draft preview is available under `next dev` only.");
  const json = await readFile(`${process.cwd()}/review/preview/drafts.json`, "utf8").catch(() => null);
  if (!json) return null;
  const raw = JSON.parse(json);
  return {
    exportedAt: raw.exportedAt as string,
    home: mapHome(raw.home, await localHome(await getTreks())),
    categories: resolveExperienceCategories(raw.categories),
    guides: resolveExperienceGuides(raw.guides),
  };
}

