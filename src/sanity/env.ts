// Sanity connection settings. Only public identifiers live here (project id
// and dataset are not secrets). No tokens: the site reads *published*
// content anonymously, so nothing secret can reach a client bundle.
//
// - Project id unset ⇒ the site runs on the local content in src/content
//   (development fallback) and /studio shows setup instructions.
// - Project id set ⇒ NEXT_PUBLIC_SANITY_DATASET is required. There is no
//   default and no fallback; "production" is locked (see guard.ts).
import { resolveDataset } from "./guard.ts";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const isSanityConfigured = /^[a-z0-9]+$/.test(projectId);
export const dataset = isSanityConfigured ? resolveDataset(process.env.NEXT_PUBLIC_SANITY_DATASET, process.env.SANITY_ALLOW_PRODUCTION_READ) : "";
// Pinned API date (not "today"), so query behaviour never changes underneath us.
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-11-01";
