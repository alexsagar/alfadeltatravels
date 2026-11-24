// Sanity connection settings. Only public identifiers live here (project id
// and dataset are not secrets). No tokens: the site reads *published*
// content anonymously, so nothing secret can reach a client bundle.
//
// Both variables are required: Sanity is the only content source, so a build
// without them fails immediately with a clear message. There is no default
// dataset and no fallback; "production" is locked (see guard.ts).
import { resolveDataset } from "./guard.ts";

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";
if (!/^[a-z0-9]+$/.test(rawProjectId))
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Sanity is the only content source; use NEXT_PUBLIC_SANITY_PROJECT_ID=4qnp14bk (see .env.example).");
export const projectId = rawProjectId;
export const dataset = resolveDataset(process.env.NEXT_PUBLIC_SANITY_DATASET, process.env.SANITY_ALLOW_PRODUCTION_READ);
// Pinned API date (not "today"), so query behaviour never changes underneath us.
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-11-01";
