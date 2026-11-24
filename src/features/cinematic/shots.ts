// EXPERIMENTAL (Milestone 3.1) — data for the pinned cinematic journey at /lab/journey.
//
// The interaction only reads this file. Replacing the temporary assets with
// real trekking footage means changing data here, not the scroll code:
//   - `media.type: "image"` + a stand-in `subject` (today), or
//   - (not built yet) `media.type: "frames"` — a licensed follow-cam shot exported as an image
//     sequence that already contains the trekker; set `subject: null` and the
//     camera keyframes to identity (the footage carries its own camera move).
// See docs/CINEMATIC_PROTOTYPE.md.
import type { StaticImageData } from "next/image";
import { photos } from "@/content/photos";

export type Shot = {
  id: string;
  media: { type: "image"; src: StaticImageData; alt: string; location: string };
  /** Camera push-in: zoom from → to around `origin` (photo u,v = trail vanishing point). */
  camera: { origin: [number, number]; zoomFrom: number; zoomTo: number };
  /**
   * Where the subject's feet touch the ground at the start of the shot, in
   * photo u,v. Must lie on the vertical line through `origin` so the push-in
   * keeps the feet on the same trail line.
   */
  feet: [number, number];
  /** Subject height as a fraction of the stage height (apparent scale). */
  subjectHeight: number;
  light: number; // brightness applied to the stand-in to sit in the scene's exposure
};

export const shots: Shot[] = [
  {
    id: "forest",
    media: { type: "image", src: photos.forest.src, alt: photos.forest.alt, location: photos.forest.location },
    camera: { origin: [0.585, 0.52], zoomFrom: 1, zoomTo: 1.6 },
    feet: [0.585, 0.88],
    subjectHeight: 0.4,
    light: 0.7,
  },
  {
    id: "summit",
    media: { type: "image", src: photos.viewpoint.src, alt: photos.viewpoint.alt, location: photos.viewpoint.location },
    camera: { origin: [0.42, 0.56], zoomFrom: 1.08, zoomTo: 1.3 },
    feet: [0.42, 0.9],
    subjectHeight: 0.3,
    light: 1.02,
  },
];

/** Stand-in character: CC0 "Hiker" rendered rear three-quarter (offline render pipeline, removed in Milestone 9.3). */
export const standIn = {
  walk: { src: "/trekker/walkrear.webp", frames: 24 },
  rest: { src: "/trekker/restrear.webp", frames: 16, loopSeconds: 5.03 },
  frameWidth: 200,
  frameHeight: 300,
  groundRow: 273, // sole contact row in the 300px frame
  metresPerFrame: 1.9, // frame height in metres
  cycleMetres: 1.33, // ground covered per walk cycle
  cameraElevationDeg: 10, // render camera; foreshortens ground travel on screen
};

/** Scroll beats as fractions of the pinned scroll (≈ 3.5 viewport heights). */
export const beats = {
  forestEnd: 0.42,
  mistIn: 0.34,
  mistPeak: 0.47,
  mistOut: 0.6,
  summitEnd: 0.84, // walking stops; rest from here to 1
};
