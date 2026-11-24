// Pure scroll choreography for the viewport-fixed trekker. No DOM — tested by
// choreo.test.mts.
//
// The page scroll is split into legs (one per homepage section). On each leg
// the trekker walks from x0 to x1, then stands for the last `pause` fraction
// of the leg and turns to face the next leg's direction.

export type Leg = {
  s0: number; // scroll position (px) where the leg starts
  s1: number; // scroll position (px) where the leg ends
  x0: number; // feet x (px) at the start
  x1: number; // feet x (px) at the end
  k0: number; // scale at the start (slight perspective / depth change)
  k1: number;
};

export type OverlayPose = {
  x: number;
  scale: number;
  dir: 1 | -1; // 1 = facing right
  moving: boolean;
};

const sign = (v: number, fallback: 1 | -1): 1 | -1 => (v > 0 ? 1 : v < 0 ? -1 : fallback);

export function poseAtScroll(legs: Leg[], s: number, pause = 0.2): OverlayPose | null {
  if (legs.length === 0) return null;
  const first = legs[0];
  if (s <= first.s0) return { x: first.x0, scale: first.k0, dir: sign(first.x1 - first.x0, 1), moving: false };
  const i = legs.findIndex((l) => s < l.s1);
  if (i === -1) {
    const last = legs[legs.length - 1];
    return { x: last.x1, scale: last.k1, dir: sign(last.x1 - last.x0, 1), moving: false };
  }
  const leg = legs[i];
  const dir = sign(leg.x1 - leg.x0, 1);
  const t = (s - leg.s0) / (leg.s1 - leg.s0);
  const walkEnd = 1 - pause;
  if (t < walkEnd) {
    const w = t / walkEnd;
    return { x: leg.x0 + (leg.x1 - leg.x0) * w, scale: leg.k0 + (leg.k1 - leg.k0) * w, dir, moving: true };
  }
  // Standing at the end of the leg; turn halfway through the pause.
  const next = legs[i + 1];
  const nextDir = next ? sign(next.x1 - next.x0, dir) : dir;
  const turned = (t - walkEnd) / pause >= 0.5;
  return { x: leg.x1, scale: leg.k1, dir: turned ? nextDir : dir, moving: false };
}

/**
 * Legs from section scroll positions. `targets[i]` is the x (fraction of
 * viewport width) the trekker reaches at the end of section i; it starts at
 * `start`. Scale alternates slightly so crossings read as depth, not a slide.
 */
export function buildLegs(
  sectionStarts: number[], // scroll px at which each section's leg starts (ascending)
  end: number, // scroll px where the journey ends
  targets: number[],
  start: number,
  viewportWidth: number,
  scales: number[],
): Leg[] {
  const legs: Leg[] = [];
  let x = start * viewportWidth;
  let k = scales[0] ?? 1;
  sectionStarts.forEach((s0, i) => {
    const s1 = sectionStarts[i + 1] ?? end;
    if (s1 <= s0) return;
    const x1 = (targets[i] ?? targets[targets.length - 1]) * viewportWidth;
    const k1 = scales[(i + 1) % scales.length] ?? 1;
    legs.push({ s0, s1, x0: x, x1, k0: k, k1 });
    x = x1;
    k = k1;
  });
  return legs;
}
