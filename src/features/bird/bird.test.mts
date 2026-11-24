// Run: npm test
import assert from "node:assert/strict";
import { facing } from "./bird.ts";

assert.equal(facing(0.01, -1), 1);
assert.equal(facing(-0.01, 1), -1);
assert.equal(facing(0.0001, -1), -1, "hover jitter keeps facing");
assert.equal(facing(0, 1), 1);

console.log("bird.test: ok");
