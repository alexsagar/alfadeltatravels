# Development plan

## Milestone 1 — Foundation ✅
Next.js/TS/Tailwind/ESLint/GSAP setup, tokens, fonts, responsive nav, homepage
section shells, trekker architecture with placeholder renderer, docs.

## Milestone 2 — Real imagery & art direction ✅ (character outstanding)
Done:
- Five licensed Wikimedia Commons photos (CC BY / CC BY-SA), credited in the
  footer and `ASSET_LICENSES.md`; served via `next/image` (AVIF/WebP, responsive
  `sizes`, blur placeholders, intrinsic dimensions so no layout shift).
- Four-scene journey (village → forest → ascent → viewpoint) with restrained
  parallax, haze transitions, foreground mist occlusion and staggered reveals.
- Route: anchors re-authored per scene in a right-hand lane; anchors can be
  breakpoint-specific (`className="hidden md:block"`; hidden anchors skipped).
- Lighting: per-anchor `light` interpolated like scale → `--light` brightness.
  Contact shadow under the figure.
- Production character adapter: `asset.ts` manifest + CSS-only sprite-sheet
  renderer (frame = round(down, cycle × frames)). Verified with a temporary
  numbered test sheet; the placeholder renders while the manifest is `null`.

Outstanding / limitations:
- **No licensed realistic trekker asset.** Free options found were either
  stylised (e.g. low-poly CC0 packs) or behind accounts/purchase (Mixamo
  requires an Adobe login; marketplace models/stock alpha footage are paid).
  Nothing was purchased or signed up for, per scope. Placeholder remains, labelled.
- Grounding is approximate: anchors are % of the section, while photos are
  `object-cover` + parallax, so exact foot-to-terrain contact shifts with
  viewport aspect ratio. Between anchors the figure interpolates in a straight
  line, not along the photographed path.
- Occlusion is a mist gradient, not cut-out foreground objects. Real cut-outs
  of BY-SA photos would be ShareAlike derivatives (see ASSET_LICENSES.md).
- Forest photo is 1920px (largest Commons served during the session; 2400px
  requests were rate-limited).
- Not tested on physical devices or Safari/iOS.

## Milestone 3 — Realistic trekker ⚠ proof of concept (not production-approved)
Done:
- Tested CC0 "Hiker" (tevy.dev): verified licence, GLB (1.6 MB, 28k tris,
  55-joint skin, KTX2 textures), clips idle / look_around / walk / wave.
  Inspected front, side, 3/4 rear. Verdict: stylised real-time game character,
  not photoreal (smooth materials, simplified face, stiff forward-held arms).
- Offline pipeline `tools/trekker-render/`: three.js harness (CDN, not shipped)
  → transparent frames → `build_sheets.py` → `public/trekker/walk.webp` (24
  frames, 85 KB) and `rest.webp` (16 frames, 49 KB). No 3D engine on the site.
- Stride calibrated from the clip (1.33 m/cycle → `cyclePx: 105`); gait phase
  now advances by distance ÷ (stride × current scale).
- Rest: idle clip loops on a timer at the final viewpoint.
- Grounding: photo-space anchors (`coverPoint`) traced on real ground, separate
  wide (lg+) and compact (tablet/mobile) routes, fade in/out through haze
  between scenes, scene-photo parallax removed, radial contact shadow.
  Village figure now walks on the field below the wall, not on roofs.

Still missing / known limits:
- **No climb clip.** Climb segments play the walk cycle (not faked). Needed:
  an uphill / steep-ascent loop on the SAME character.
- **Not photoreal.** Needs a scanned or high-detail character (realistic cloth,
  skin, hair) — e.g. a commercial scanned-human asset or a commission.
- Side-view sprites only: on the forest trail the figure walks across the
  trail rather than up it. A second, rear-3/4 render set would fix that.
- The figure is screen-fixed at the focus line while the photo scrolls under
  it, so the ground moves vertically beneath the feet during scroll. Inherent
  to scroll-driven characters; minimised by short, mostly-vertical routes.
- Figure is visible only on ground routes (~25% of journey scroll), not
  continuously as with the reference's paraglider.
- Per-scene lighting is brightness only; the forest figure still looks
  brighter than the shaded trail. Needs per-scene render lighting.
- Not tested on physical devices / Safari.

Recommendation before production approval: owner decides on a character
source (commission or licensed scanned human + Mixamo-style walk / climb /
idle retargeted in Blender), then rerun the existing pipeline. No site code
changes needed beyond `asset.ts` values.

## Milestone 3.1 — Pinned follow-camera prototype (kept as /lab/journey)
Experimental only; not the homepage direction. Status at handover: works at
1440; at 390 the closing rest pose did not trigger; storyboard doc not written.

## Milestone 4b — Bird journey lab ⏸ awaiting review
Direction change: the trekker is rejected and removed from the homepage (files
kept as history). `/lab/bird-journey` prototypes scenes 1–3 (+ scene 4
preview): a pinned GSAP timeline, a heading-based bird sprite, procedural
cloud white-out, and an arch mask that opens to full screen. Details, reference
analysis and remaining blockers: `docs/BIRD_ANIMATION_STORYBOARD.md`.
Recordings: `review/bird-journey-1440.mp4`, `review/bird-journey-390.mp4`.
Blocking production: a realistic bird asset (see storyboard §5).

## Milestone 4a — Viewport cross-section trekker ✖ rejected (not mounted)
Done: TrekkerOverlay on the homepage (see ARCHITECTURE.md), left/right sheets,
ground strip, copy stacking, footer ending, reduced-motion handling.
Recordings for review: `review/trekker-scroll-1440.mp4`, `review/trekker-scroll-390.mp4`
(gitignored).
Open: character is still the CC0 placeholder (not approved); the ground strip
is a design proposal to be judged in review; tablet uses 30% height.

## Milestone 5 — Cinematic homepage ⏸ awaiting review
The approved 4.1 bird journey is the homepage opening (`features/bird/BirdJourney.tsx`);
`/lab/bird-journey` keeps the frozen 4.1 copy (`BirdJourneyM41.tsx`).
- Hero copy moved into the stage (single h1, no duplicate hero/header).
- Bird path is continuous (no reposition under cloud); one intentional turn at the swoop.
- Separate phone path (larger bird, parked under the copy). Phones/portrait use a
  shorter band-shaped arch so more of Ghandruk shows.
- No hand-off screen: FeaturedTreks overlaps the pin's last 110svh with a
  transparent→forest gradient, so "Signature routes" rises out of the mist.
- Sections: Treks → Tours → Destinations → About → Stories → Plan → Footer, CSS
  scroll-driven reveals (no JS). Desktop nav from lg (tablet uses the menu).
Recordings/screens: `review/m5-*`.
Known: changing orientation without crossing 768px keeps the arch shape chosen at load.

## Milestone 5.1 — Section transitions ⏸ Stage B awaiting review
Blurred Tours→Destinations gradient removed. Transitions (`ScrollFx.tsx`
data-fx hooks + `PhotoBridge.tsx`), transforms/clip-path only, no pinning:
- Treks → Tours: inset rounded panel widens to full bleed; Boudhanath parallax.
- Tours → Destinations: PhotoBridge (Gokyo Lake) — approved Stage A.
- Destinations → About: Sarangkot panorama opens from a centred window.
- About → Stories: quiet hairline rule, typography only.
- Stories → Plan: curtain — Stories lifts off a sticky Annapurna panorama.
Eight new Commons photos (ASSET_LICENSES.md). Recordings: `review/m51-stageB-*`.

## Milestone 6A — Internal pages, navigation & SEO ⏸ awaiting review
- Homepage: closing CTA copy now appears only after the Stories edge clears it
  (no slicing). Homepage animation system frozen.
- Routes: /treks, /treks/everest-base-camp-trek (template), /tours,
  /destinations, /about, /stories, /plan-your-journey, /contact, 404.
- Header/mobile menu/footer link to routes (aria-current); homepage sections
  link to their pages; homepage CTA → /plan-your-journey.
- SEO system (lib/seo.ts, robots, sitemap, breadcrumbs, JSON-LD). Indexable:
  /, /treks, EBC guide, /destinations. Noindex until approved: tours, about,
  stories, plan, contact.
- Content model + proposed CMS schemas (docs/CMS_SCHEMAS.md).
- 7 more Commons photos for the Khumbu, ABC and Mardi Himal.
Review: `review/m6a-*`.

## Milestone 6B — Refinement, SEO validation ⏸ awaiting review
- Real HTTP 404 for unknown trek slugs (proxy.ts; see ARCHITECTURE.md → SEO).
- Treks cards, EBC section nav, readable elevation profile, hero contrast,
  general-vs-company labelling.
- /image-credits page; slim footer notice.
- SEO audit clean (unique titles/descriptions, one H1, no heading skips,
  canonicals, noindex policy, alt text). 404 page has its own title.
- The list of content the company must supply is kept internally (docs/internal/, not in the repository).
Review: `review/m6b-*`.

## Milestone 6C — Remaining trek guides & company content
ABC, Langtang, Mardi Himal guides (same template); company copy, contact
details and approved offerings; enquiry delivery (email/CRM).
Trek/tour detail routes, about, contact/enquiry form, real copy from the company.

## Milestone 7 — Sanity CMS foundation ⏸ awaiting review (not connected)
- sanity 6 + next-sanity 13; embedded Studio at /studio (noindex).
- Schemas: trek (general guide vs company package), tour, destination,
  story, siteSettings singleton; photo/seo/faq/source/offering objects.
- Typed content layer (src/lib/content.ts) with local fallback; all
  internal pages read through it. New detail templates for tours,
  destinations and stories (render only published CMS content).
- Build-time slug manifest feeds Proxy 404s; rebuild-on-publish strategy.
- Tests: schema validation, GROQ executed against a fixture dataset with
  drafts (groq-js), mapper safety rules.
- Fixes: section-nav scroll cue on mobile; 320px overflow in route list.
Owner actions: docs/SANITY_SETUP.md.

## Milestone 7.1–7.2 — Sanity connected, development dataset ✅
Project 4qnp14bk; `development` dataset (public) for all CMS work;
`production` locked by src/sanity/guard.ts. See docs/SANITY_SETUP.md.

## Milestone 8 — Draft content migration into `development`
Schemas for treks, tours, destinations, stories; replace `src/content/site.ts`.

## Milestone 9 — Launch
SEO (sitemap, JSON-LD, OG images), performance/accessibility audit, Cloudflare deployment.

## Commands
`npm run dev` · `npm run lint` · `npm run typecheck` · `npm test` · `npm run build`
