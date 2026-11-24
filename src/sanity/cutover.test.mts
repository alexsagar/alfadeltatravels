// Run: npm test. Partial publishing must never switch a type without opt-in.
import assert from "node:assert/strict";
import { parseCutover } from "./cutover.ts";

assert.equal(parseCutover(undefined).size, 0, "unset keeps everything local");
assert.equal(parseCutover("").size, 0);
assert.deepEqual([...parseCutover(" Experiences , home ")], ["experiences", "home"]);
assert.throws(() => parseCutover("experience"), /unknown type/, "typos fail loudly instead of silently staying local");
console.log("cutover.test: ok");
