import { createClient } from "@sanity/client";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

/**
 * Public read client. `perspective: "published"` means draft documents
 * (ids under `drafts.`) are never returned — the API enforces it, not our
 * queries. No token is configured, so the dataset must be public-read; a
 * private dataset would need a server-only read token added here.
 */
export const sanityClient = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;
