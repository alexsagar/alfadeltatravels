# Design — Alfa Delta Travels

Premium, cinematic, editorial. The landscape is the hero; UI stays quiet.

## Colour (tokens in `src/app/globals.css` `@theme`; Milestone 9.1)

Cool, neutral system. No cream, orange, gold or green.

| Token | Hex | Use |
|---|---|---|
| `night-950` | `#141c25` | Deep charcoal: dark sections, header, scrims |
| `night-900` | `#1b2631` | Raised dark panel (homepage Tours) |
| `night-800` | `#263847` | Dark slate: CTA panel on dark pages, route dots |
| `night-600` | `#3e5566` | Rarely used slate |
| `cloud-50` | `#ffffff` | Text on dark |
| `cloud-100` | `#f7f9fb` | Cool white: page and light sections |
| `cloud-200` | `#e8eef2` | Mist gray: tonal panels, rules |
| `ink-900/700/500` | `#17212b` / `#3a4754` / `#5d6b78` | Headings / body / captions on light |
| `brand-500` | `#b92332` | Logo red: primary CTA fill, accents on light |
| `brand-400` | `#a01d2b` | CTA hover |
| `brand-300` | `#e8646f` | Small red accents on dark; focus ring |

Red is an accent only: `.btn-primary`, eyebrows, active indicators, focus. Never large fills.

## Typography

- Display, headings, navigation, eyebrows: **Manrope** (variable): `font-display`, weight 600 by default, tracking -0.015em; display sizes carry their own negative tracking.
- Body, descriptions, captions: **DM Sans** (variable): `font-sans`.
- Emphasis inside headings (`<em>`) is weight 300, not italic.
- Sizes: `text-display-xl` clamp(2.75–6.25rem), `-lg` clamp(2.125–3.875rem), `-md` clamp(1.75–2.5rem). Captions at least 12px.
- Eyebrows: `.eyebrow`: Manrope, 11px, semibold, 0.2em tracking, uppercase.
- Both are self-hosted by `next/font` (no runtime Google request; size-adjusted fallbacks, CLS 0).

## Layout & motion

- `.container-x`: max 90rem, gutters 20/32/56px.
- Generous vertical rhythm: sections `py-28 md:py-40`.
- Easing: `ease-cinematic` (`cubic-bezier(0.22,1,0.36,1)`) / GSAP `expo.out`.
- Parallax: hero only (scrubbed, eases in from 1.08 scale once). Journey scene
  photos stay still so the trekker stays grounded. Never time-looped.
- Reveals: eyebrow → title → caption stagger (`expo.out`, 1.2s), once per scene.
- All motion is gated on `prefers-reduced-motion: no-preference`.

## Journey scenes (Milestone 2)

Hero → 01 Village → 02 Forest → 03 Ascent → 04 Viewpoint, each a full-bleed
`SceneBand` (115svh) using licensed Commons photography (`ASSET_LICENSES.md`).

- Copy sits top-left (max 62% wide on mobile, `max-w-md` above). Trekker routes
  are traced on walkable ground in the lower half of each photo (photo-space
  anchors, separate wide/compact sets), so the figure never covers headings,
  captions or links. Validated by script at 1440/1280/768/390.
- The figure is visible only on its ground route in each scene and fades in/out
  through the haze between scenes, rather than flying across the photos.
- Scene photos have no parallax (it slid terrain under the figure's feet); the
  hero keeps its parallax.
- Every photo carries a small "Pictured: <real location>" caption. Scene titles
  are narrative and never claim a photo shows a specific trek route.
- Atmosphere: each scene opens out of solid night-950 haze and closes into a
  foreground mist (`data-trek-foreground`, in front of the trekker), so scenes
  dissolve into each other rather than cutting.
- The trekker inherits scene exposure via per-anchor `light` and stands on a
  radial contact shadow under the boots.
- Sections after the journey (treks, tours, about, stories, plan) use the same
  photos with location captions; the footer lists required CC attributions.

## Placeholders still on screen

- Trekker: CC0 "Hiker" 3D model rendered to sprite sheets (Milestone 3 proof of
  concept). Stylised game-quality character, not photoreal; no climb animation.
- `[Placeholder]` About and Stories copy; trek cards have no itinerary data.
No invented statistics, prices, durations or testimonials.

## Internal pages (Milestone 6A)

- **Hero:** full-bleed photo (88svh desktop, min 640px), slow parallax,
  breadcrumbs → eyebrow → display-xl H1 with one lighter-weight phrase → short intro
  → "Pictured:" caption. Copy settles in once (`.hero-rise`).
- **Rhythm:** alternate light and dark sections; headings left in a narrow
  column, body offset right on a 1 : 1.4–2 grid; numbered editorial lists
  (red display numerals) instead of icon cards.
- **One signature motion per page:** a light `panel` widening over a dark
  section (Treks, trek detail). Otherwise parallax inside photo frames and
  a `window` opening on the closing CtaBand. No gradients between sections.
- **Honesty markers:** `Pending` ("Awaiting company") for any company fact;
  "Route guide in preparation" on cards without a page; "Not sent" on the form.
- **Homepage animations are frozen** after the Milestone 6A CTA timing fix.

## Milestone 6B refinements
- Captions on internal pages: 12px (`text-xs`), white at 70% on dark.
- Hero scrims: stronger top band + left-to-right shade so breadcrumbs and
  small text stay legible on snow; text shadow on hero copy.
- Trek cards: status tag on the photo ("Route guide" red / "Guide in
  preparation" charcoal), numbered region line, high point above the summary.
- Long guides get a sticky `SectionNav` under the header; sections use
  `scroll-mt-32`.
- Elevation profile: stretched SVG line, HTML labels (never scale down),
  stop numbers matching the route list.
- General guide vs company package: "About this guide" note, "general, not a
  company itinerary" eyebrow on the route, "Company package · Not yet
  confirmed" block.

## Footer (Milestone 9.4)

The footer follows the supplied Ridgeline Dither Footer reference, adapted to the brand.

**Layout**
- Upper section: logo and brand line, with two link groups (Explore Nepal; Alfa Delta Travels, which includes Plan your journey).
- Middle: a hairline copyright row with "Back to top".
- Lower section: a full-width procedural mountain range, about 190–330 px tall.
- Cool-white paper (`#F7F9FB`), so the transparent logo keeps its contrast, and fine vertical frame hairlines on wide screens.
- Link hover: an underline that draws in from the left and turns brand red (`.footer-link`). No transition under reduced motion.

**Content rules**
- The brand line can be set in Sanity: Company & contact → Footer tagline.
- Verified contact details and social links appear only once they are published in Sanity. No placeholders.
- No CTA band and no large wordmark: each page's own closing CTA remains the only one.
- Photo and animation credits are not shown in the footer. `/image-credits` and `ASSET_LICENSES.md` keep the records.

**The range** (`features/footer/RidgelineScene.tsx`, with pure helpers in `ridgeline.ts`, unit-tested)
- Six ridges built from ridged noise, printed in 8×8 ordered dither in glacier tones (`GLACIER_TONES`, from the paper colour to slate `#263847` and charcoal `#141C25`).
- When the footer comes into view, the ridges develop back to front and the mist lifts. The mist then drifts slowly.
- The pointer adds a gentle parallax and parts the mist around it.
- The reference's altitude readout is left out because its numbers are invented, not real elevations.

**Performance** (measured at 1440 px, as a share of one CPU core)

| State | CPU |
|---|---|
| Footer off-screen | 0.6% |
| Reveal (3.4 s) | about 37% |
| Pointer moving | about 44% |
| Idle drift | about 11% |
| At rest (20 s after the last activity) | 0, last frame held |
| Reduced motion | 0.6%, drawn once and static |

How the cost is kept down:
- Reveal and pointer motion are capped at about 30 fps; the idle drift runs at about 8 fps.
- The mist is computed at quarter resolution, and the grain texture is precomputed once.
- One dither cell is 2 CSS px (3 px below 640 px), whatever the screen's pixel density.
- The loop stops when the footer is off-screen or the tab is hidden.
- Before the first draw, the scene shows plain paper at a fixed CSS height, so there is no layout shift.
