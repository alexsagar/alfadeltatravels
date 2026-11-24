// Run: npm test. Footer mountain helpers: deterministic, bounded, valid palette.
import assert from "node:assert/strict";
import { BAYER, dither, GLACIER_TONES, hash, hexRgb, noise, packRgb, ridgeline, smooth } from "./ridgeline.ts";

assert.deepEqual(hexRgb("#141c25"), [20, 28, 37]);
assert.deepEqual(hexRgb("#fff"), [255, 255, 255]);
assert.equal(hexRgb("red"), null);
assert.equal(packRgb([255, 0, 0]), 0xff0000ff);
assert.ok(GLACIER_TONES.every((t) => hexRgb(t)), "every tone is a valid hex colour");

assert.equal(BAYER.length, 64);
assert.ok(BAYER.every((b) => b > 0 && b < 1));
assert.equal(dither(0, 8, 0.99), 0, "paper stays paper");
assert.equal(dither(1, 8, 0.01), 7, "full tone reaches the deepest colour");
assert.equal(dither(2, 8, 0.5), 7, "clamped above");

assert.equal(hash(3, 4, 7), hash(3, 4, 7), "deterministic");
for (let i = 0; i < 200; i++) {
  const n = noise(i * 0.37, i * 0.11, 5);
  assert.ok(n >= 0 && n < 1);
}
assert.equal(smooth(0, 1, -1), 0);
assert.equal(smooth(0, 1, 2), 1);

// Ridges: same seed → same range; every crest stays inside the grid; nearer ridges sit lower on average.
const a = ridgeline(200, 100, 2, 6, 23, 8);
assert.deepEqual([...a], [...ridgeline(200, 100, 2, 6, 23, 8)]);
assert.equal(a.length, 216);
const mean = (r: Float32Array) => r.reduce((s, v) => s + v, 0) / r.length;
for (let i = 0; i < 6; i++) assert.ok(ridgeline(200, 100, i, 6, 23, 8).every((y) => y > 0 && y < 140));
assert.ok(mean(ridgeline(200, 100, 5, 6, 23, 8)) > mean(ridgeline(200, 100, 0, 6, 23, 8)));
console.log("ridgeline.test: ok");
