// Run: npm test
import assert from "node:assert/strict";
import { buildLegs, poseAtScroll } from "./choreo.ts";

// Two sections: walk right 100->900 over scroll 0..1000, then left 900->200.
const legs = buildLegs([0, 1000], 2000, [0.9, 0.2], 0.1, 1000, [1, 0.9]);
assert.equal(legs.length, 2);
assert.deepEqual([legs[0].x0, legs[0].x1, legs[1].x1], [100, 900, 200]);
assert.deepEqual([legs[0].k0, legs[0].k1, legs[1].k1], [1, 0.9, 1]);

// Walking: pause 0.2 => walk spans the first 800px of the leg.
const mid = poseAtScroll(legs, 400, 0.2)!;
assert.equal(mid.x, 500);
assert.equal(mid.dir, 1);
assert.equal(mid.moving, true);

// Standing at the end, still facing right, then turned to face the next leg.
assert.deepEqual(poseAtScroll(legs, 850, 0.2), { x: 900, scale: 0.9, dir: 1, moving: false });
assert.equal(poseAtScroll(legs, 950, 0.2)!.dir, -1);
assert.equal(poseAtScroll(legs, 1400, 0.2)!.dir, -1);

// Clamps before and after the journey.
assert.equal(poseAtScroll(legs, -10)!.x, 100);
assert.deepEqual(poseAtScroll(legs, 5000), { x: 200, scale: 1, dir: -1, moving: false });
assert.equal(poseAtScroll([], 0), null);

console.log("choreo.test: ok");
