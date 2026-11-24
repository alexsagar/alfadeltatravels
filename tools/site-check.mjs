// Representative regression check against `next start` on :3000 (and, if
// running, `next dev` on :3001 for the draft preview). Read-only.
// Usage: PLAYWRIGHT_PATH=… CHROME_PATH=… node tools/site-check.mjs [outDir]
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH ?? "playwright");
const out = process.argv[2] ?? "review/site-check";
mkdirSync(out, { recursive: true });
const base = "http://localhost:3000";
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const results = { status: {}, pages: [], links: {}, robots: {}, preview: {} };
const statuses = ["/", "/treks", "/treks/everest-base-camp-trek", "/treks/nope", "/destinations", "/experiences", "/experiences/paragliding", "/experiences/white-water-rafting", "/experiences/chitwan-wildlife-safari", "/experiences/lumbini-spiritual-heritage", "/experiences/nope", "/tours", "/about", "/contact", "/plan-your-journey", "/stories", "/image-credits", "/brand/alfa-delta-logo.svg", "/lab/hummingbird/hummingbird.lottie", "/preview-home", "/sitemap.xml", "/robots.txt"];
for (const p of statuses) results.status[p] = (await fetch(base + p)).status;
const pages = ["/", "/treks", "/destinations", "/experiences", "/experiences/paragliding", "/experiences/white-water-rafting", "/experiences/chitwan-wildlife-safari", "/experiences/lumbini-spiritual-heritage", "/tours", "/about", "/contact"];
for (const reduced of [false, true]) for (const w of [1440, 1280, 768, 390, 320]) {
  if (reduced && w !== 390) continue;
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, reducedMotion: reduced ? "reduce" : "no-preference" });
  for (const path of pages) {
    const p = await ctx.newPage();
    const errors = [];
    p.on("console", (x) => x.type() === "error" && errors.push(x.text().slice(0, 140)));
    p.on("pageerror", (e) => errors.push(String(e).slice(0, 140)));
    await p.goto(base + path, { waitUntil: "load" });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
    await p.waitForTimeout(400);
    const a = await p.evaluate(() => {
      const h = [...document.querySelectorAll("h1,h2,h3,h4")].map((e) => +e.tagName[1]);
      const logo = document.querySelector('header img[alt="Alfa Delta Travels"]');
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        h1: document.querySelectorAll("h1").length,
        skips: h.filter((n, i) => i > 0 && n - h[i - 1] > 1).length,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
        logo: !!logo && logo.naturalWidth > 0,
        footer: !!document.querySelector("footer"),
        robots: document.querySelector('meta[name="robots"]')?.content ?? null,
        links: [...new Set([...document.querySelectorAll("a[href^='/']")].map((x) => x.getAttribute("href").split("#")[0]))],
      };
    });
    for (const l of a.links) results.links[l || "/"] ??= null;
    if (w === 1440 && !reduced) results.robots[path] = a.robots;
    delete a.links;
    delete a.robots;
    results.pages.push({ path, w, reduced, ...a, errors });
    if (w === 1440 && !reduced && path === "/") await p.screenshot({ path: `${out}/home-1440.jpg`, quality: 60 });
    if (w === 390 && !reduced && path === "/experiences") await p.screenshot({ path: `${out}/experiences-390.jpg`, quality: 60 });
    await p.close();
  }
  await ctx.close();
}
for (const l of Object.keys(results.links)) results.links[l] = (await fetch(base + l)).status;
// Draft preview (dev server), if running.
for (const p of ["/preview-home", "/preview/experiences", "/preview/experience?slug=paragliding"]) {
  try { results.preview[p] = (await fetch("http://localhost:3001" + p, { signal: AbortSignal.timeout(180000) })).status; } catch { results.preview[p] = "dev server not running"; }
}
await b.close();
writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
const bad = results.pages.filter((x) => x.overflow > 0 || x.h1 !== 1 || x.skips || x.broken || !x.logo || !x.footer || x.errors.length);
console.log(JSON.stringify({ status: results.status, robots: results.robots, preview: results.preview, badLinks: Object.entries(results.links).filter(([, s]) => s !== 200), checked: results.pages.length, bad }, null, 1));
