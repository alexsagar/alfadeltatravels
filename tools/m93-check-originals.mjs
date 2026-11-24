import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const { createClient } = createRequire(import.meta.url)("@sanity/client");
const token = JSON.parse(readFileSync(join(homedir(), ".config/sanity/config.json"), "utf8")).authToken;
const c = createClient({ projectId: "4qnp14bk", dataset: "development", apiVersion: "2026-11-01", useCdn: false, token, perspective: "raw" });
const r = await c.fetch(`*[_type in ["trek","destination"]] | order(_id){ _id, _updatedAt }`);
console.log(JSON.stringify({ count: r.length, latest: r.map((d) => d._updatedAt).sort().at(-1) }));
