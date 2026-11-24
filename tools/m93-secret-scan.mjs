// Scans the files listed in argv[2] (one path per line) for the local Sanity
// CLI token and for the email in .env-style assignments. Prints hits only.
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
const token = JSON.parse(readFileSync(join(homedir(), ".config/sanity/config.json"), "utf8")).authToken;
if (!token || token.length < 20) throw new Error("token not loaded");
const files = readFileSync(process.argv[2], "utf8").split(/\r?\n/).filter((f) => f && existsSync(f));
const env = readFileSync(".env.local", "utf8").split(/\r?\n/).map((l) => l.split("=")[1]?.trim()).filter((v) => v && v.length > 12 && !/^(development|production|4qnp14bk|https?:)/.test(v));
let hits = 0;
for (const f of files) {
  const buf = readFileSync(f);
  for (const s of [token, ...env]) if (buf.includes(s)) { hits++; console.log(`HIT ${f}`); }
}
console.log(`scanned ${files.length} files, ${env.length} env secret values + CLI token, hits: ${hits}`);
