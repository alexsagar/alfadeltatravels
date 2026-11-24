// Milestone 9.3 read-only audit: (1) the Sanity CLI token must not appear in
// the build output, source or public files; (2) sizes of tracked/untracked
// project files (excluding node_modules, .git, .next) for the cleanup plan.
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const token = JSON.parse(readFileSync(join(homedir(), ".config/sanity/config.json"), "utf8")).authToken;
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};
const hits = ["src", "public", ".next/static", ".next/server", "scripts", "tools"].flatMap((d) => walk(d)).filter((f) => statSync(f).size < 20e6 && readFileSync(f).includes(token));
const envHits = [".env.local", ".env.example"].filter((f) => { try { return readFileSync(f, "utf8").includes(token); } catch { return false; } });

const tracked = new Set(execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean));
const size = (p) => { const s = statSync(p); return s.isDirectory() ? readdirSync(p).reduce((n, c) => n + size(join(p, c)), 0) : s.size; };
const top = readdirSync(".").filter((n) => !["node_modules", ".git", ".next"].includes(n));
const rows = top.map((n) => ({ path: n, mb: +(size(n) / 1048576).toFixed(2), tracked: [...tracked].some((t) => t === n || t.startsWith(n + "/")) }));
const review = readdirSync("review").map((n) => ({ path: `review/${n}`, mb: +(size(join("review", n)) / 1048576).toFixed(2) }));
const heavy = ["node_modules", ".next", ".git"].map((n) => ({ path: n, mb: +(size(n) / 1048576).toFixed(0) }));
console.log(JSON.stringify({ tokenInBuildOrSource: hits.length, tokenInEnvFiles: envHits, heavy, top: rows.sort((a, b) => b.mb - a.mb), review: review.sort((a, b) => b.mb - a.mb) }, null, 1));
