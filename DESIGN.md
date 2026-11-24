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

**Invitation band (charcoal)**
- "Your Nepal story starts here." with the red Start planning button.
- Shown only on pages without their own planning CTA. Page CTAs carry `data-page-cta` (CtaBand, the homepage closing panel and the planning form). A CSS `:has()` rule then hides the band, so two CTAs never follow each other. No JavaScript is involved.

**Main footer (mist grey, so the transparent logo keeps its contrast)**
- Logo and brand line. The line can be set in Sanity: Company & contact → Footer tagline.
- Two link groups: Explore Nepal, and Alfa Delta Travels.
- A planning block: one "Plan your journey" link.
- Verified contact details and social links appear here only when they are published in Sanity. Until then nothing is shown: no placeholders and no `#` links.

**Signature and legal line**
- An oversized wordmark at 7% ink, decorative and `aria-hidden`. It is sized at 11.4vw so it never overflows, even at 320px.
- Copyright, the CC attribution notice and Image credits.

**Link hover:** an underline that draws in from the left (`.footer-link`). No transition under reduced motion.
