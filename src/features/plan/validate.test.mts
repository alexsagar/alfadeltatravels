// Run: npm test
import assert from "node:assert/strict";
import { validate } from "./validate.ts";

const ok = { name: "Asha", email: "asha@mail.com", message: "Two weeks in October, keen on Everest.", consent: true };
assert.deepEqual(validate(ok), {});
assert.ok(validate({ ...ok, email: "asha@mail" }).email, "email needs a domain");
assert.ok(validate({ ...ok, name: " " }).name);
assert.ok(validate({ ...ok, message: "hi" }).message);
assert.ok(validate({ ...ok, consent: false }).consent);

console.log("validate.test: ok");
