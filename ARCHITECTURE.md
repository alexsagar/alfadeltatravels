# Architecture

Next.js 16 (App Router, Turbopack, Cache Components) · TypeScript · Tailwind CSS 4 · GSAP 3 + ScrollTrigger (`@gsap/react`).

```
src/
  app/                 layout (fonts, metadata, skip link), page, globals.css (tokens)
  components/
    layout/            SiteHeader (client: scroll state, mobile menu), SiteFooter
    sections/          Hero, SceneBand (client: parallax/reveals), JourneyScenes, HomeSections
  content/site.ts      static content; replaced by Sanity later
  content/photos.ts    licensed photo manifest + credits
  assets/scenes/       optimised scene photography (static imports)
  features/trekker/    scroll-driven trekker system (below)
```

Server components by default; `"use client"` only where GSAP or state is needed.
The homepage prerenders fully static.

## Routes (Milestone 6A)

```
app/
  page.tsx                      homepage (cinematic; header/footer composed inline)
  (site)/layout.tsx             shell for internal pages: header, <main>, footer, ScrollFx
  (site)/treks/page.tsx         /treks listing
  (site)/treks/[slug]/page.tsx  trek detail template (generateStaticParams; slugs without a guide 404)
  (site)/tours | destinations | about | stories | plan-your-journey | contact | image-credits
  lab/…                         experiments (noindex, disallowed in robots)
  not-found.tsx, robots.ts, sitemap.ts
components/
  ui/editorial.tsx              SectionHeading, PhotoCard, ArrowLink, Pending ("Awaiting company")
  page/                         PageHero, Breadcrumbs (+BreadcrumbList JSON-LD), CtaBand, JsonLd, SectionNav
  trek/TrekBlocks.tsx           TrekCard, ElevationProfile (SVG), RouteStops, SeasonGrid, Faqs, Gallery
  sections/                     homepage sections, PhotoBridge, ScrollFx (data-fx transitions)
content/
  types.ts                      content model (mirrors docs/CMS_SCHEMAS.md)
  treks.ts, places.ts, site.ts, photos.ts
features/plan/                  EnquiryForm (client) + validate.ts (tested)
lib/seo.ts                      pageMetadata(), route index registry, absoluteUrl()
proxy.ts                        hard 404 for unknown /treks/<slug>
```

Every route is statically prerendered. Client JS on internal pages: header,
ScrollFx (GSAP), and the enquiry form on /plan-your-journey only.

### SEO
- `NEXT_PUBLIC_SITE_URL` sets the canonical origin (`content/site.ts`). Unset ⇒
  localhost origin **and** `robots.txt` disallows everything, so no build can
  be indexed under a wrong domain. Set it before the production build.
- `lib/seo.ts → routes` is the single index policy. `pageMetadata()` emits
  title, description, canonical, Open Graph and `noindex, follow` for any path
  the registry doesn't mark indexable; `sitemap.ts` lists only indexable paths.
- Structured data: `TravelAgency` (name/url/description only) on the
  homepage, `BreadcrumbList` on internal pages, `WebPage` + `about: Place` on
  trek guides. No FAQPage, ratings, reviews or offers.
- **404 status for unknown content slugs — `src/proxy.ts`** (slug list from the
  build manifest since Milestone 7; see Content & CMS). With Cache
  Components, `/treks/[slug]` sends its prerendered shell (status 200) before
  the page reads `params`, so `notFound()` for an unknown slug can only stream
  the 404 UI with status 200 + noindex (Next docs: file-conventions/loading →
  Status codes). Following the docs' recommendation, Proxy checks the slug
  against the known set (no I/O; matcher `/treks/:slug` only) and rewrites
  unknown slugs to an unmatched path, so the custom not-found page renders with
  a real 404. Valid slugs pass through to their static pages. Add new
  `[slug]` routes to the proxy matcher when they are created.
- Image credits: full attribution on `/image-credits` (from `photos.ts`);
  the footer carries a short notice and a link on every page.

### Content & CMS (Milestone 7)

```
sanity.config.ts / sanity.cli.ts   Studio + CLI config (env-driven, no secrets)
src/sanity/env.ts                  project id, dataset, pinned API version
src/sanity/client.ts               public read client, perspective "published", no token
src/sanity/schemaTypes/            objects.ts (photo, seo, faq, offering…) + documents.ts
src/sanity/structure.ts            Studio navigation
src/sanity/queries.ts              GROQ (explicit draft exclusion + consent filters)
src/sanity/map.ts                  raw CMS → site types (pure, unit-tested)
src/lib/content.ts                 the only API pages use: getTreks(), getTrek(), getDestinations(),
                                   getTours(), getStories(), getSettings(), getImageCredits()…
scripts/content-manifest.mts       prebuild: writes src/generated/content-manifest.json
src/app/studio/[[...tool]]         embedded Studio (noindex, robots-disallowed)
```

- **Source selection:** Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set,
  otherwise local `src/content/*` (documented dev fallback). Per type, an
  empty CMS falls back to local content, so pages never go blank. Tour
  packages and story articles exist only in the CMS (nothing invented locally).
- **Types:** `src/content/types.ts` is generic over the image type — local
  files hold `PhotoKey` strings, pages receive resolved `Photo` objects
  (StaticImageData-shaped, so `next/image` works for both static files and
  `cdn.sanity.io`).
- **Publication safety:** client uses the `published` perspective, queries
  also exclude `drafts.**`, packages (`offering`) render only when
  "Confirmed", journals need consent, team members need consent, indexing
  needs an explicit "Show in search engines" (`seo.index`, default off).
  Sitemap lists only indexable, existing pages.
- **Caching & publishing:** readers are `"use cache"` + `cacheLife("max")` +
  `cacheTag("content")`: all data is fetched at build; no runtime CMS calls,
  no tokens at runtime. New content goes live by **rebuild on publish**
  (Sanity webhook → host deploy hook; docs/SANITY_SETUP.md §5). Chosen over
  runtime revalidation because Proxy's slug manifest, listings, sitemap and
  pages must change together, and because tag revalidation on Cloudflare
  needs extra cache infrastructure. (`cacheTag("content")` is in place if
  on-demand revalidation is added later, together with a manifest strategy.)
- **Proxy & slugs:** `src/proxy.ts` 404s `/treks|tours|destinations|stories/<slug>`
  not in the build manifest; the manifest is written by the prebuild script
  from the same source and rules as the pages, so a trek published in Sanity
  is valid exactly when its page exists. No network calls in Proxy.
- **Empty dynamic routes:** Cache Components requires ≥1 prerendered param,
  so `lib/params.ts` prerenders a `__none` sentinel that resolves to 404.
- **Preview:** not implemented. When needed: Next draft mode enabled via
  `next-sanity/draft-mode` with a server-only `SANITY_API_READ_TOKEN`, a
  separate draft-perspective client used only when draft mode is on, and
  `noindex` on previewed responses. Nothing in the current bundle reads drafts.

### Content migration (local → Sanity) — plan, not yet run
Target: **`development` only**, via a script that calls
`assertWritableDataset("development")` (explicit `--dataset`), creating
documents as **drafts** (`drafts.` ids) so nothing is published by the
migration itself. Editors review in Studio and publish individually.
1. **Destinations + photos:** 3 regions and 4 places from `places.ts`; upload
   each image once with alt / location / photographer / licence / source from
   `photos.ts` (must match ASSET_LICENSES.md). Draft.
2. **Everest Base Camp guide:** all guide fields 1:1 from `treks.ts`, region
   reference → Khumbu, `offering.confirmed = false`, `seo.index = false`
   until reviewed. Draft.
3. **ABC, Langtang, Mardi Himal:** card fields only (title, region, photo,
   summary, high point), no guide, no package. Draft.
4. **Tours:** none migrated — none exist. Created by the company later.
5. **Company & contact:** not migrated — no verified data. Filled by the
   company in Studio.
Idempotent (fixed `_id`s, `createIfNotExists`), dry-run mode printing the
plan first, no deletes. Promotion to `production` is a separate, explicitly
authorised milestone (export from `development` → review → import).

### Transitions on internal pages
`ScrollFx` (mounted by the (site) layout) wires `data-fx="parallax | window |
panel | rule"`; heroes use `parallax`, CtaBand uses `window`, one `panel` per
page at most. Text reveals are CSS (`.reveal`, `.hero-rise`). All gated on
reduced motion.

## Homepage trekker (Milestone 4 — viewport overlay)

`TrekkerOverlay.tsx` replaces the anchor-based journey on the homepage
(Cloud View-style cross-section character):

- Fixed to the viewport; the page scrolls behind it. It walks on its own
  foreground ground strip (back band behind the figure, grass lip in front of
  the boots), never on the photos.
- `choreo.ts` (tested): one leg per `main section`; walk to `TARGETS[i]`,
  stand and turn for the last 18% of the leg. Slight scale change per leg.
- A GSAP ticker eases toward the real scroll and applies one transform; walk
  frames advance with |Δx| over the static ground ÷ stride, so feet don't slide.
- Separate right- and left-facing renders (`asset.ts → overlaySheets`).
- Copy stacking: `globals.css` puts `h1–h3, p, a, button, figcaption` in
  `main` at z-41, above the figure (z-38..40); the overlay is
  `pointer-events: none`. Header z-50.
- At the end the overlay rides up on the footer's top edge.
- Reduced motion: overlay stays hidden and its sheets are not downloaded.

The anchor system below (TrekkerJourney, TrekAnchor, coverPoint) is no
longer mounted on the homepage; `/lab/journey` uses `coverPoint`.

## Trekker journey (Milestones 1–3, superseded on the homepage)

Goal: one persistent trekker that walks/climbs continuously through every section,
grounded on terrain, with perspective, gait and occlusion.

**1. Anchors (authoring).** Sections place `<TrekAnchor x y scale gait />` where the
feet touch the terrain in that section's art. Positions are CSS (%), so they follow
responsive layout. `scale` encodes perspective depth; `gait` = `walk | climb | rest`
for the segment leaving that anchor.

**2. Route (pure logic, `path.ts`).** `TrekkerJourney` measures anchors on
ScrollTrigger refresh (load/resize/font swap), sorts by Y and computes cumulative
path length. `poseAtY()` interpolates x, scale, gait, facing and distance for any Y.
Tested by `npm test`.

**3. Driver (`TrekkerJourney.tsx`).** On scroll, the pose at
`viewport × VIEWPORT_FOCUS` is applied with `gsap.quickTo` (smoothed transforms
only — no layout writes). The gait phase `--cycle = distance / STRIDE_PX` is
derived from distance travelled, not time, so feet don't slide and stop when
scrolling stops.

**4. Renderer (`TrekkerFigure.tsx`).** Reads `--cycle`, `--facing`, `--light`,
`[data-gait]`. If `asset.ts` exports a manifest, a CSS-only sprite-sheet renderer
picks the frame with `round(down, cycle × frames)`; otherwise the labelled
placeholder SVG renders. Both sit on a contact shadow. The production renderer must keep the same contract:
feet at bottom-centre. Candidate assets, in order of preference:
- Alpha frame sequence (WebP/AVIF sprite per gait) rendered from a mocapped,
  photoreal character in Unreal/Blender; frame = `round(cycle × frames)`.
- Rigged glTF in a small Three.js canvas (`AnimationMixer.setTime(cycle × clip)`),
  enables real relighting per section.
- Alpha video (HEVC/VP9) scrubbed by `currentTime` — simplest, weakest on Safari/iOS.

**5. Occlusion.** Trekker layer is `z-20`; anything with `data-trek-foreground`
(`z-30`) passes in front of it. Real photos need a foreground cut-out layer per scene.

**6. Lighting.** Per-anchor `light` (brightness multiplier) interpolated like
scale, applied as `filter: brightness(var(--light))`. Shadow direction/tint is not
modelled yet.

**7. Per-breakpoint routes.** `TrekAnchor className="hidden lg:block"` — anchors
with `display:none` are skipped at measure time.

**8. Photo-space anchors.** Inside a `SceneBand`, anchors take `u`/`v`
(fractions of the photo). `SceneBand` exposes the photo's size and
object-position on `[data-photo-frame]`; `coverPoint()` (path.ts, tested)
maps them through object-fit: cover, so feet land on the same rock at every
viewport. Per-anchor `opacity` fades the figure through scene haze.

**9. Character asset.** `asset.ts` holds the sprite manifest (CC0 "Hiker",
rendered by `tools/trekker-render`). `cyclePx` = on-screen ground per walk
cycle at scale 1; the driver advances phase by Δdistance ÷ (cyclePx × scale).

Reduced motion: trekker stays hidden, parallax off.

## Experiences (Milestone 9)

- **Route:** `/experiences` (single catalogue page, indexable per `lib/seo.ts`). No `[slug]` detail route yet, so `/experiences/<x>` is a plain 404 and needs no Proxy entry. When detail pages are added: create `experiences/[slug]`, add the slugs to `scripts/content-manifest.mts` and `src/proxy.ts`, and list only `seo.index` pages in `sitemap.ts`.
- **Content source:** `src/content/experiences.ts` (local, documented), read through `getExperienceCategories()` in `lib/content.ts`. Six categories, each with activities; every activity carries hand-set `places` (destination slugs), checked by `src/content/experiences.test.mts`. Place links go to in-page anchors on `/destinations`, never to draft-only destination pages.
- **CMS:** `experience` document type in `schemaTypes/documents.ts` (category, summary, body, destinations as weak references, bestTime, preparation, safety, FAQs, sources, photo, gallery, featured + homeOrder, seo). Not queried yet; no documents created. Kept separate from `tour` because Tour carries the commercial `offering`.
- **Homepage:** `BeyondMountains` sits between FeaturedTreks and Tours on the same night-950, opened by a `data-fx="window"` photo (existing ScrollFx, no new timeline). Tours' `data-fx="panel"` now widens over its bottom padding.

### Experience detail pages (Milestone 9.2)

- **Route:** `/experiences/[slug]` (`ExperienceView.tsx` template), statically prerendered for the slugs in `src/content/experience-guides.ts` (paragliding, white-water-rafting, chitwan-wildlife-safari, lumbini-spiritual-heritage). The manifest lists them under `experiences`; Proxy (`/experiences/:slug`) 404s any other slug, including catalogue activities without a guide.
- **Indexing:** every guide has `seo.index: false` (noindex, follow) and the sitemap does not list them; `experiences.test.mts` fails if one is flipped without a review.
- **Catalogue links:** an activity links to a detail page only through its explicit `guide` field.
- **Future CMS migration** (not run): one `experience` draft per guide in `development` via a script using `assertWritableDataset("development")` and fixed `drafts.experience-<slug>` ids. Mapping: `summary` = intro, `body` = overview + story (Portable Text), `bestTime`, `preparation`, `safety`, `faqs`, `sources`, `photo` = hero, `gallery` = story photos, `destinations` = weak refs, `seo` (index false). Then add `getExperienceGuides()` CMS reading with the same per-type local fallback as treks, and include CMS slugs in the manifest. The 21 remaining catalogue activities would migrate as card-only documents (no detail page) when needed.

## Sanity-first content (Milestone 9.3)

| Content | Local source (fallback) | Sanity | Reader |
|---|---|---|---|
| Homepage copy and picks | `content/home.ts` | `homePage` singleton | `getHome()`; blank CMS fields keep local copy |
| Experience categories and catalogue | `content/experiences.ts` | `experienceCategory`, `experience` | `getExperienceCategories()` |
| Experience detail pages | `content/experience-guides.ts` | `experience.guide` | `getExperienceGuides()` |
| Treks, destinations, tours, stories, settings | `content/*` | existing types | unchanged |
| Photos | `src/assets/scenes` + `photo-credits.ts` | all 30 uploaded to `development` (content-addressed ids) | `mapPhoto` → Sanity CDN `?auto=format&w=2400`, resized by next/image |

- **One mapping path:** every reader runs a pure `resolve*` / `map*` step (`lib/content.ts`, `sanity/map.ts`, unit-tested). Public pages give it published data at build time; the dev draft preview gives it exported draft fixtures. Preview and live therefore render identically.
- **Source switch:** per type, by explicit opt-in only: `SANITY_CUTOVER` (`src/sanity/cutover.ts`, tested). A listed type with published documents uses Sanity, and so does the matching manifest entry. There is no cross-dataset fallback; `guard.ts` still forbids reading production during development.
- **Drafts:** never read by public routes. The public client uses the `published` perspective, and queries also exclude `drafts.**`. Drafts reach the app only through gitignored fixtures exported by CLI scripts, so no token ever reaches the app. Verified by `tools/m93-audit.mjs`: 0 occurrences of the token in `.next`, `src` or `public`.
- **Cutover blockers:** content approval and publishing; repointing tours and destination detail pages; a decision on keeping local images for the cinematic sequence (hero, journey scenes, PhotoBridge, closing panorama stay local by design).

## Branches, CI and promotion

| Branch | Purpose |
|---|---|
| `dev` | Active development; feature branches merge here. Direct commits allowed (no force-push or deletion). |
| `staging` | Changes promoted from `dev` for integration testing and review. Pull requests only. |
| `main` | Approved releases only. Pull requests from `staging` only. |

**Promotion path:** feature branch, then `dev`, then `staging`, then `main`, each step through a pull request. Before each merge, check the changed files, the CI result, assets, secrets and any UI changes.

**How CI works**
- `.github/workflows/ci.yml` runs on every push and pull request to these branches: `npm ci`, lint, `next typegen`, typecheck, unit tests, then the production build.
- It uses Node 22, read-only permissions and no secrets.
- With no Sanity project id set, the build uses local content.
- Once the CI check is required, a failed check blocks merging into `staging` and `main`.

**What CI does not do**
- Deployment (Vercel) is a separate, future step.
- Publishing content in Sanity and deploying the application are separate operations.
