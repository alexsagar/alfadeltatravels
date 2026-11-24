// Explicit CMS cutover (Milestone 9.3 finalization). Content types that have
// a complete local set (treks, destinations, experiences, homepage) switch
// to Sanity ONLY when listed in SANITY_CUTOVER, e.g.
//   SANITY_CUTOVER=experiences,home
// so publishing a few documents can never replace a complete local set with
// an incomplete CMS one. Unset = every such type stays local. Tours, stories
// and settings exist only in the CMS and are not gated. Pure; tested in
// cutover.test.mts. The content layer and the route manifest both use it.
export const CUTOVER_TYPES = ["treks", "destinations", "experiences", "home"] as const;
export type CutoverType = (typeof CUTOVER_TYPES)[number];

export function parseCutover(raw: string | undefined): Set<CutoverType> {
  const out = new Set<CutoverType>();
  for (const part of (raw ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)) {
    if (!(CUTOVER_TYPES as readonly string[]).includes(part)) throw new Error(`SANITY_CUTOVER: unknown type "${part}". Allowed: ${CUTOVER_TYPES.join(", ")}.`);
    out.add(part as CutoverType);
  }
  return out;
}

export const cutover = parseCutover(process.env.SANITY_CUTOVER);
