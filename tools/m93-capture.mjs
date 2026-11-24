// Milestone 9.3: (1) Sanity draft-preview vs public rendering screenshots
// (dev server :3001); (2) regression checks on the production build (:3000).
// Usage: node tools/m93-capture.mjs review/m93
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH ?? "playwright");
const out = process.argv[2] ?? "review/m93";
mkdirSync(`${out}/shots`, { recursive: true });
const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const sweep = (p) => p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
const to = (p, sel, f) => p.evaluate(([s, f]) => { const el = document.querySelector(s); if (el) scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * f); }, [sel, f]);
const results = { preview: [], pages: [], status: {}, links: {} };

// 1. Preview vs public (desktop + one mobile).
const pairs = [
  ["home", "http://localhost:3001/preview-home", "http://localhost:3000/", [["beyond", "#beyond-title", 0.3], ["closing", "#plan", 0]]],
  ["experiences", "http://localhost:3001/preview/experiences", "http://localhost:3000/experiences", [["sky", "#sky", 0.1], ["by-destination", "#places-title", 0.2]]],
  ["paragliding", "http://localhost:3001/preview/experience?slug=paragliding", "http://localhost:3000/experiences/paragliding", [["overview", "#overview-title", 0.2], ["related", "#related-title", 0.15]]],
  ["trek", "http://localhost:3001/preview/trek?slug=annapurna-base-camp-trek", null, [["route", "#route", 0.1]]],
  ["destination", "http://localhost:3001/preview/destination?slug=pokhara", null, []],
];
for (const [m, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp });
  const errors = [];
  p.on("console", (x) => x.type() === "error" && errors.push(x.text().slice(0, 140)));
  for (const [name, prev, pub, shots] of pairs) {
    if (m === "mobile" && name !== "experiences" && name !== "paragliding") continue;
    for (const [src, url] of [["preview", prev], ["public", pub]]) {
      if (!url) continue;
      const r = await p.goto(url, { waitUntil: "load", timeout: 120000 });
      await sweep(p);
      await p.waitForTimeout(1200);
      const info = await p.evaluate(() => ({ h1: document.querySelector("h1")?.textContent?.trim().slice(0, 60), cdn: [...document.images].filter((i) => i.currentSrc.includes("cdn.sanity.io")).length, local: [...document.images].filter((i) => i.currentSrc.includes("/_next/static/media") || i.currentSrc.includes("_next/image?url=%2F_next")).length, broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length, overflow: document.documentElement.scrollWidth - innerWidth, robots: document.querySelector('meta[name="robots"]')?.content ?? null }));
      results.preview.push({ name, src, m, status: r.status(), ...info });
      await p.screenshot({ path: `${out}/shots/${name}-${src}-${m}-top.jpg`, quality: 70 });
      for (const [s, sel, f] of shots) {
        await to(p, sel, f);
        await p.waitForTimeout(1200);
        await p.screenshot({ path: `${out}/shots/${name}-${src}-${m}-${s}.jpg`, quality: 70 });
      }
    }
  }
  results.previewErrors = (results.previewErrors ?? []).concat(errors.filter((e) => !/AbortError|hummingbird/i.test(e)));
  await p.close();
}

// 2. Regression on the production build.
for (const path of ["/", "/experiences", "/experiences/paragliding", "/experiences/nope", "/treks", "/treks/everest-base-camp-trek", "/treks/nope", "/tours", "/destinations", "/about", "/stories", "/plan-your-journey", "/contact", "/image-credits", "/preview/experiences", "/preview-home", "/sitemap.xml", "/robots.txt"]) {
  results.status[path] = (await fetch("http://localhost:3000" + path)).status;
}
const paths = ["/", "/experiences", "/experiences/chitwan-wildlife-safari", "/treks/everest-base-camp-trek", "/destinations", "/image-credits"];
for (const reduced of [false, true]) for (const w of [1440, 1280, 768, 390, 320]) {
  if (reduced && w !== 390) continue;
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, reducedMotion: reduced ? "reduce" : "no-preference" });
  for (const path of paths) {
    const p = await ctx.newPage();
    const errors = [];
    p.on("console", (x) => x.type() === "error" && errors.push(x.text().slice(0, 140)));
    p.on("pageerror", (e) => errors.push(String(e).slice(0, 140)));
    await p.goto("http://localhost:3000" + path, { waitUntil: "load" });
    await sweep(p);
    await p.waitForTimeout(400);
    const a = await p.evaluate(() => {
      const h = [...document.querySelectorAll("h1,h2,h3,h4")].map((e) => +e.tagName[1]);
      return { overflow: document.documentElement.scrollWidth - innerWidth, h1: document.querySelectorAll("h1").length, skips: h.filter((n, i) => i > 0 && n - h[i - 1] > 1).length, noAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length, broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length, links: [...new Set([...document.querySelectorAll("a[href^='/']")].map((x) => x.getAttribute("href").split("#")[0]))], credits: location.pathname === "/image-credits" ? [...document.querySelectorAll("main li, main tr, main figure")].length : undefined };
    });
    for (const l of a.links) results.links[l || "/"] ??= null;
    delete a.links;
    results.pages.push({ path, w, reduced, ...a, errors });
    await p.close();
  }
  await ctx.close();
}
for (const l of Object.keys(results.links)) results.links[l] = (await fetch("http://localhost:3000" + l)).status;
await b.close();
writeFileSync(`${out}/browser-results.json`, JSON.stringify(results, null, 2));
const bad = results.pages.filter((p) => p.overflow > 0 || p.h1 !== 1 || p.skips || p.noAlt || p.broken || p.errors.length);
console.log(JSON.stringify({ preview: results.preview, previewErrors: results.previewErrors, status: results.status, badLinks: Object.entries(results.links).filter(([, s]) => s !== 200), checked: results.pages.length, bad }, null, 1));
