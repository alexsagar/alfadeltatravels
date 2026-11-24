// Pure helpers for the footer's dithered mountain range (Milestone 9.4),
// adapted from the supplied RidgelineDitherFooter reference. No DOM: unit
// tested in ridgeline.test.mts.

/** Hex → [r, g, b] in 0–255, or null for anything that isn't #rgb / #rrggbb. */
export function hexRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** [r, g, b] → one opaque pixel for a little-endian Uint32 view of ImageData. */
export const packRgb = (rgb: [number, number, number]) => ((255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]) >>> 0;

/** The classic 8×8 Bayer matrix, as thresholds in (0, 1). */
export const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49,
  17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

/** Palette index for a tone in [0, 1] across `n` colours at Bayer threshold `b`. */
export function dither(tone: number, n: number, b: number) {
  const t = tone < 0 ? 0 : tone > 1 ? 1 : tone;
  const v = Math.floor(t * (n - 1) + b);
  return v > n - 1 ? n - 1 : v;
}

/** Integer lattice hash → [0, 1). */
export function hash(x: number, y: number, seed: number) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth value noise in [0, 1). */
export function noise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Fractal value noise, normalised back into [0, 1). */
export function fbm(x: number, y: number, seed: number, octaves: number) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise(x, y, seed + o * 31) * amp;
    norm += amp;
    x *= 2.03;
    y *= 2.03;
    amp *= 0.5;
  }
  return norm > 0 ? sum / norm : 0;
}

/** Hermite step from e0 to e1, clamped. */
export function smooth(e0: number, e1: number, x: number) {
  const t = e1 === e0 ? (x < e0 ? 0 : 1) : Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/** Ease-out cubic over a progress that may run outside [0, 1]. */
export const easeOut = (t: number) => 1 - Math.pow(1 - (t < 0 ? 0 : t > 1 ? 1 : t), 3);

/**
 * Crest row of ridge `i` of `layers` (0 = farthest) for each column of a
 * `cols` × `rows` grid, with `margin` extra columns either side for parallax.
 * Farther ridges sit higher with more, smaller peaks; nearer ones are lower,
 * broader and taller, and climb toward the edges so the range opens into a valley.
 */
export function ridgeline(cols: number, rows: number, i: number, layers: number, seed: number, margin: number) {
  const k = layers > 1 ? i / (layers - 1) : 1;
  const n = cols + margin * 2;
  const out = new Float32Array(n);
  const base = rows * (0.38 + 0.66 * Math.pow(k, 1.4));
  const amp = rows * (0.2 + 0.24 * k);
  const freq = 6 - 3.8 * k;
  const flankL = rows * 0.5 * k * k * k * (0.55 + 0.6 * hash(i, 11, seed));
  const flankR = rows * 0.5 * k * k * k * (0.55 + 0.6 * hash(i, 13, seed));
  const ceil = rows * 0.17;
  const tilt = (hash(i, 7, seed) - 0.5) * rows * 0.34 * (0.4 + k);
  const s = (seed | 0) * 13 + i * 101;
  for (let x = 0; x < n; x++) {
    const u = (x - margin) / cols;
    const r1 = 1 - Math.abs(noise(u * freq + i * 3.7, 0.5, s) * 2 - 1);
    const r2 = 1 - Math.abs(noise(u * freq * 2.3, 3.5, s + 1) * 2 - 1);
    const f = fbm(u * freq * 4.1, 9.5, s + 2, 3);
    const h = r1 * r1 * 0.62 + r2 * 0.24 + f * 0.14;
    const e = Math.min(1.2, Math.abs(u * 2 - 1));
    const y = base - h * amp + tilt * (u - 0.5) * 2 - (u < 0.5 ? flankL : flankR) * e * e * Math.sqrt(e);
    out[x] = y < ceil ? ceil - (ceil - y) * 0.25 : y;
  }
  return out;
}

/**
 * Glacier tones from paper to deepest ridge, built on the brand palette
 * (cool white #F7F9FB → slate #263847 → charcoal #141C25).
 */
export const GLACIER_TONES = ["#f7f9fb", "#e2eaf1", "#c3d2df", "#93abc0", "#64809a", "#3f5a72", "#263847", "#141c25"];
