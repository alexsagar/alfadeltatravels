import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

/**
 * Public read client. `perspective: "published"` means draft documents
 * (ids under `drafts.`) are never returned — the API enforces it, not our
 * queries. No token is configured, so the dataset must be public-read and
 * document ids must not contain "." (dotted ids are private sub-paths).
 *
 * useCdn: false — content is read only at build time, and the API CDN can
 * lag a fresh publish, so a rebuild right after publishing could miss it.
 */
export const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" });
