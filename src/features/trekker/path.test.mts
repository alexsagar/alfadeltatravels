// Run: npm test  (Node 22+ native TypeScript stripping, no test framework)
import assert from "node:assert/strict";
import { coverPoint, cumulativeLengths, poseAtY, sortAnchors, type Anchor } from "./path.ts";

const a = (x: number, y: number, scale = 1): Anchor => ({ x, y, scale, gait: "walk", light: scale, opacity: scale });
// Unsorted on purpose: (0,0) -> (300,400) -> (0,800), each leg 500px long.
const route = sortAnchors([a(300, 400, 0.5), a(0, 800), a(0, 0)]);
const lengths = cumulativeLengths(route);

assert.deepEqual(lengths, [0, 500, 1000]);
assert.equal(poseAtY(route, lengths, -50)?.x, 0, "clamps before start");
assert.equal(poseAtY(route, lengths, 9999)?.y, 800, "clamps after end");

const mid = poseAtY(route, lengths, 200)!;
assert.equal(mid.x, 150);
assert.equal(mid.scale, 0.75);
assert.equal(mid.light, 0.75, "light interpolates like scale");
assert.equal(mid.distance, 250);
assert.equal(mid.facing, 1);
assert.equal(poseAtY(route, lengths, 600)!.facing, -1, "faces left when heading left");
assert.equal(poseAtY([], [], 0), null);

// cover: 3:2 photo in a tall 390x970 frame is scaled by height and centred.
const s = 970 / 1600;
assert.deepEqual(coverPoint(390, 970, 2400, 1600, 0.5, 0.5, 0.5, 0.5), { x: 195, y: 485 });
assert.equal(coverPoint(390, 970, 2400, 1600, 0.5, 0.5, 0, 1).x, (390 - 2400 * s) / 2);
assert.equal(coverPoint(390, 970, 2400, 1600, 0.5, 0.5, 0, 1).y, 970);
// cover: wide frame is scaled by width; object-position 0 pins the top edge.
assert.deepEqual(coverPoint(1600, 400, 1600, 1200, 0.5, 0, 0.25, 0.5), { x: 400, y: 600 });

console.log("path.test: ok");
