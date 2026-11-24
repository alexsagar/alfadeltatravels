import type { Gait } from "./path";

/**
 * Production trekker asset manifest.
 *
 * One horizontal sprite sheet per gait, rendered from the SAME rigged,
 * motion-captured character (same identity, outfit, camera height and light
 * direction). Requirements are in ARCHITECTURE.md → "Trekker asset spec".
 *
 * `null` = no licensed asset yet → the labelled placeholder renders instead.
 */
export type GaitSheet = {
  src: string; // /public path to a transparent WebP/AVIF sheet
  frames: number; // frames laid out left-to-right, one full cycle
  frameWidth: number; // px per frame in the sheet
  frameHeight: number; // ground line = bottom pixel row
  loopSeconds?: number; // set for idle loops: played on a timer, not by scroll
};

export type TrekkerAsset = {
  displayHeight: number; // on-screen px height at scale 1
  cyclePx: number; // on-screen ground covered by one walk cycle at scale 1
  gaits: Record<Gait, GaitSheet>;
};

// "Hiker" by tevy.dev, CC0 1.0 (https://tevy.dev/models/hiker, v1 LOD0).
// Rendered offline (pipeline removed in Milestone 9.3; see ASSET_LICENSES.md).
// Frame = 1.85 m tall, so 146 px display => 78.9 px/m. The walk clip covers
// 1.33 m per 1.033 s cycle (measured from planted-foot travel) => 105 px.
const walk: GaitSheet = { src: "/trekker/walk.webp", frames: 24, frameWidth: 200, frameHeight: 292 };

export const trekkerAsset: TrekkerAsset | null = {
  displayHeight: 146,
  cyclePx: 105,
  gaits: {
    walk,
    // MISSING ASSET: the model ships no uphill/climb clip. Climb segments use
    // the walk cycle unchanged rather than faking a climb. See DEVELOPMENT_PLAN.md.
    climb: walk,
    rest: { src: "/trekker/rest.webp", frames: 16, frameWidth: 200, frameHeight: 292, loopSeconds: 5.03 },
  },
};

/**
 * Sheets for the viewport-fixed overlay (TrekkerOverlay). Same CC0 "Hiker" and
 * render setup; left-facing sheets are true renders at yaw -80°, not mirrors,
 * so the backpack and lighting stay correct in both directions.
 */
export const overlaySheets = {
  walkRight: "/trekker/walk.webp",
  walkLeft: "/trekker/walkleft.webp",
  restRight: "/trekker/rest.webp",
  restLeft: "/trekker/restleft.webp",
  walkFrames: 24,
  restFrames: 16,
  restLoopSeconds: 5.03,
  frameWidth: 200,
  frameHeight: 292, // ground line = bottom row
  frameMetres: 1.85,
  cycleMetres: 1.33,
};
