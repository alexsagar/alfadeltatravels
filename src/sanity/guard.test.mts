// Run: npm test
import assert from "node:assert/strict";
import { assertWritableDataset, resolveDataset } from "./guard.ts";

assert.equal(resolveDataset("development", undefined), "development");
assert.equal(resolveDataset(" development ", undefined), "development");
assert.throws(() => resolveDataset(undefined, undefined), /not set/, "no silent default");
assert.throws(() => resolveDataset("", undefined), /not set/);
assert.throws(() => resolveDataset("Prod Data", undefined), /not a valid/);
assert.throws(() => resolveDataset("production", undefined), /locked/, "production read needs opt-in");
assert.throws(() => resolveDataset("production", "1"), /locked/, "opt-in must be exactly true");
assert.equal(resolveDataset("production", "true"), "production");

assert.equal(assertWritableDataset("development"), "development");
assert.throws(() => assertWritableDataset(undefined), /explicitly/, "destination must be explicit");
assert.throws(() => assertWritableDataset("production"), /production writes are blocked/);

console.log("guard.test: ok");
