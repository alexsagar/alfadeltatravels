// Pure geometry for the trekker journey. No DOM, no GSAP — unit-testable.
//
// The route is a list of anchors measured from `[data-trek-anchor]` elements
// placed on terrain inside each section. Anchors are sorted by document Y, so
// the route is monotonic in Y and we can look up the trekker pose by Y alone.

export type Gait = "walk" | "climb" | "rest";

export type Anchor = {
  x: number; // px, relative to the journey container
  y: number; // px, relative to the journey container (feet / ground contact)
  scale: number; // perspective: smaller = further away
  gait: Gait; // gait used on the segment *leaving* this anchor
  light: number; // brightness multiplier matching the scene's exposure (1 = neutral)
  opacity: number; // 0 = hidden; used to fade in/out through scene haze
};

export type Pose = Anchor & {
  facing: 1 | -1;
  distance: number; // cumulative path length in px, drives the gait cycle
};

export function sortAnchors(anchors: Anchor[]): Anchor[] {
  return [...anchors].sort((a, b) => a.y - b.y);
}

/** Cumulative path length at each anchor. */
export function cumulativeLengths(anchors: Anchor[]): number[] {
  const out = [0];
  for (let i = 1; i < anchors.length; i++) {
    const a = anchors[i - 1];
    const b = anchors[i];
    out.push(out[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
  }
  return out;
}

/** Trekker pose at document-relative Y. Clamps to the first/last anchor. */
export function poseAtY(anchors: Anchor[], lengths: number[], y: number): Pose | null {
  if (anchors.length === 0) return null;
  const last = anchors.length - 1;
  if (anchors.length === 1 || y <= anchors[0].y) {
    return { ...anchors[0], facing: facingOf(anchors, 0), distance: 0 };
  }
  if (y >= anchors[last].y) {
    return { ...anchors[last], facing: facingOf(anchors, last - 1), distance: lengths[last] };
  }
  // ponytail: linear scan, fine for <50 anchors; binary search if routes grow.
  let i = 0;
  while (anchors[i + 1].y < y) i++;
  const a = anchors[i];
  const b = anchors[i + 1];
  const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
  return {
    x: a.x + (b.x - a.x) * t,
    y,
    scale: a.scale + (b.scale - a.scale) * t,
    light: a.light + (b.light - a.light) * t,
    opacity: a.opacity + (b.opacity - a.opacity) * t,
    gait: a.gait,
    facing: facingOf(anchors, i),
    distance: lengths[i] + (lengths[i + 1] - lengths[i]) * t,
  };
}

function facingOf(anchors: Anchor[], i: number): 1 | -1 {
  const a = anchors[i];
  const b = anchors[i + 1];
  return b && b.x < a.x ? -1 : 1;
}

/**
 * Where image point (u, v) — fractions of the photo — lands inside a frame that
 * renders the photo with `object-fit: cover` and `object-position: fx fy`.
 * Lets anchors be authored on the photo itself, so feet stay on the same rock
 * or trail at every viewport size.
 */
export function coverPoint(
  frameW: number,
  frameH: number,
  imageW: number,
  imageH: number,
  fx: number,
  fy: number,
  u: number,
  v: number,
): { x: number; y: number } {
  const s = Math.max(frameW / imageW, frameH / imageH);
  return {
    x: (frameW - imageW * s) * fx + u * imageW * s,
    y: (frameH - imageH * s) * fy + v * imageH * s,
  };
}
