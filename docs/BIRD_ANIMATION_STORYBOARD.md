# Bird animation storyboard — Milestone 4 lab

> **Milestone 4.1 refinement (2026-11-19).** Separate wide/narrow flight paths
> (`PATH` in `BirdJourney.tsx`, chosen with `gsap.matchMedia`). The bird is on
> screen from first paint and travels one way (right to left) through every
> scene. Beats: opening push-in and lead to the summit (0–.2); a three-depth
> cloud passage with lens streaks and a crossfade under the cloud instead of
> a cut (.2–.46); the bird re-enters, hovers at the arch, and swoops through
> as it opens (.41–.8); the camera pushes into Ghandruk while valley mist
> deepens into forest green, and "Signature routes" arrives in the mist (.8–1).
> Portrait screens get the wide, low arch. Reduced motion shows every scene as
> stacked static content.

> **Revision 2026-11-19 (approved bird).** The crow stand-in is replaced by the
> approved Lottie "Hummingbird no Background" by Michael Mills (LottieFiles,
> Lottie Simple License; see ASSET_LICENSES.md), played unmodified via
> `@lottiefiles/dotlottie-web` on a canvas. Scroll (GSAP ScrollTrigger) drives
> only position/scale/facing; the wings run on the animation's own loop. The
> ridgeline silhouettes (scene 4 preview) were removed. Choreography now follows
> the bee reference more closely: the bird starts as a speck at the summit and
> flies toward camera; near cloud wisps sweep past the lens over a mid-depth
> bank; clouds drift off and thin out; the bird hovers at the arch, then swoops
> through it as it opens (drawn above the mask) and flies away to a speck while
> the photo keeps a slow push-in. Tables below describe the earlier pass where
> they differ.

Prototype: `/lab/bird-journey` (`src/features/bird/BirdJourney.tsx`).
Recordings for review: `review/bird-journey-1440.mp4`, `review/bird-journey-390.mp4`.

## 1. Reference analysis

Both videos were analysed frame by frame (OpenCV, 0.25–1 s sampling) for
design study only. No footage or assets from them are used in the project.

### `bird flying.mp4` — subject reference (7.3 s, 1762×974, 30 fps)
A nature site with a rendered hummingbird composited over illustrated forest
parallax scenes.

- **Subject:** one consistent, realistically shaded 3D bird with an alpha
  edge. Wings are motion-blurred, and the beat never stops: the bird hovers
  while sections change.
- **Orientation:** profile, three-quarter front, wings-up and wings-down
  poses. The heading changes between sections, and the bird turns toward the
  next content card.
- **Placement:** left-centre, beside a glass content card. It does not sit on
  top of the copy.
- **Transitions:** horizontal section slides. The background crossfades
  through a colour story (green → dark green → ember orange → violet → night)
  while the bird persists across slides.
- **Takeaway:** the realism comes from a high-quality render with wing blur
  and continuous hovering, not from the motion path.

### `bee flying.mp4` — principal transition reference (23 s, 1788×902, 30 fps)

| Time | Beat | Technique |
|---|---|---|
| 0–3 s | Pinned hero: dark rock arch, gold serif title centred, a tiny bee deep in the opening | Static pinned layer stack; the subject starts deep in z |
| 3–4.5 s | Camera dollies into the arch; rock walls scale past the frame edges; the bee flies toward camera and grows from a speck to large | Scroll-scrubbed scale on a cut-out foreground; subject scale used as depth |
| 4.5–5 s | The bee breaks into a black void; a flower and copy rise in from below | Background removed so the subject composites cleanly |
| 5–11 s | The bee travels between "stations" (sunflower → bluebell → lily), landing and hovering with its orientation changing | Subject anchored per section; heading-specific renders; wings always moving |
| 11–14 s | Top-down bee over a horizontally scrolling product row | Orientation change plus horizontal scroll |
| 14–15.5 s | Hexagon cluster appears; the bee approaches; hexagons scale up | Graphic mask cluster |
| 15.5–16.4 s | The centre hexagon expands to full screen, revealing a cinematic flower-field scene; the bee flies through the opening | Clip-path or mask expansion; the subject crosses the mask edge (drawn above it) |
| 16.4–20.4 s | Full-bleed scene with the camera moving forward through flowers; the bee flies away toward the mountain and shrinks | Scrubbed pre-rendered video; depth shown by subject scale |
| 20.4–21 s | The scene scrolls up into ordinary content (testimonials) | Unpin; normal flow resumes |

**Choreography rules observed:**
- One subject per scene.
- The subject's scale encodes depth.
- Every environment change is masked: by a cave mouth, a void, a mask
  expansion, or a dolly. Nothing hard-cuts.
- Copy reveals happen *after* the transition settles.
- Ordinary content sections run without animation.

## 2. Storyboard — Alfa Delta Travels bird journey

Pinned stage, 600% scroll (about 6 viewports), one GSAP timeline scrubbed
(`scrub: 1`). The bird, camera, clouds and masks all read the same timeline,
so they move as one shot.

| Progress | Scene | Camera | Bird | Environment / type |
|---|---|---|---|---|
| 0–0.14 | **1 · Himalayan opening** | Locked on Annapurna South (Poon Hill photo) | Enters from the right edge flying left (left profile), crossing the sky above the peak | Wisps drift in opposite directions; "Alfa Delta Travels" title |
| 0.12–0.46 | **2 · Through the clouds** | Dolly toward the summit (photo scale 1 → 1.42, origin on the peak) | Turns away (heading 270 → 190°), flies to the summit and shrinks to 26% (depth); contrast and blur drop with distance | Title lifts away; a cloud bank rises from below over the bird, a veil thickens, and by 0.46 the frame is a white-out |
| 0.46 | Swap under full cloud | — | Repositioned low-left inside the cloud | Hero hidden, Discover scene shown |
| 0.46–0.66 | **3 · Discover Nepal** | Static | Emerges from the dissolving cloud, flying right and away toward the arch top, kept over light sky so it stays legible | The cloud bank thins and drifts up, revealing an ivory page and an arch-framed Ghandruk photo; "Where the trail begins" plus regions reveal after the clouds clear |
| 0.66–0.80 | Frame opens | Photo counter-zooms (1.18 → 1) while the clip-path opens to full screen | Flies into the photo, over the ridge haze, shrinking to a speck | Copy exits before the opening |
| 0.80–0.90 | Immersive destination | Static | A speck over the hills, then gone | "Ghandruk · Annapurna region" caption |
| 0.90–1.0 | **4 (preview) · Into trekking** | — | Gone into the distance | Three ridgeline silhouettes rise and hand off to the "Signature routes" section |

**Mobile:**
- The bird's size scales with the shortest viewport side (34%, clamped to
  150–300 px).
- The arch is wider and lower (copy sits above it).
- Same timeline.

**Reduced motion:**
- No pin and no scrub; the opening composition shows as a still.
- Clouds are hidden and the wings don't animate.

## 3. Techniques used

- **Pinned GSAP timeline:** one `ScrollTrigger` with `pin`, `scrub: 1`, `end: +=600%`.
- **Camera:** CSS `transform: scale()` with `transform-origin` on the subject
  of interest (dolly). No WebGL at runtime.
- **Bird:**
  - Offline-rendered transparent WebP sheets, one per heading (90/135/180/225/270°).
  - `sheetForHeading()` (tested) picks the nearest sheet as the heading
    interpolates.
  - Wing beats run on a timer (`steps(12)`, 0.433 s), so the bird never
    freezes mid-air when scrolling stops.
  - Position, size, heading and bank are scroll-scrubbed.
- **Depth:** apparent size, plus aerial perspective (lower contrast, slight
  blur and brightening when far).
- **Clouds:** original procedural cloud textures (`tools/clouds/make_clouds.py`):
  - A bank with a solid body below it for full white-outs.
  - Wisps for parallax.
  - A veil for haze.
- **Mask expansion:** `clip-path: inset(... round ...)` tweened from an arch to
  full screen, with the image counter-zooming so the view doesn't jump.

## 4. Assets

| Asset | Source | Licence | Status |
|---|---|---|---|
| Bird sheets `public/lab/bird/*.webp` (6 × ~15 KB) | Rendered from "Hooded crow" by tevy.dev v1 LOD0 | CC0 1.0 | **Technical stand-in only** |
| Cloud layers `public/lab/clouds/*.webp` (~580 KB) | Generated procedurally in this repo | Original | Usable; could be replaced with filmed cloud plates |
| Annapurna South, Ghandruk photos | Wikimedia Commons (see `ASSET_LICENSES.md`) | CC BY-SA 4.0 | Credited in the site footer |

**Investigated but not used:**
- **"Griffon vulture flight" (Wikimedia Commons, CC BY 4.0, 1080p):** a real
  bird, and the species occurs in Nepal. The download was refused by
  Wikimedia's rate limit (HTTP 429) on every attempt during the session. Its
  description says it was filmed over a valley, not against open sky, so a
  clean alpha key would be unlikely anyway.
- **tevy.dev's other animals:** none of the others are birds in flight (the
  bat is the only flying model).

## 5. What blocks production-level realism

1. **The bird itself.** The crow is a game-quality model: flat feather
   shading, no motion blur, a single flapping cycle and no glide. It is also
   not a Himalayan species.
2. **No glide or soar clip.** Large Himalayan birds (lammergeier, Himalayan
   griffon, steppe eagle) mostly soar. Continuous flapping reads as a small
   bird.
3. **Lighting match.** The bird is lit once. It is not relit per scene
   (golden light on the peak vs. overcast in the village).
4. **Cloud plates.** The procedural clouds are convincing as haze but lack the
   volumetric detail of filmed or simulated clouds at full-screen size.
5. **Scene geography.** Annapurna South (Poon Hill) → Ghandruk is a credible
   Annapurna route, but the scenes are still separate photographs.

### Asset requirements for the final version
- **Subject:** one realistic Himalayan raptor or vulture, rendered with
  feather detail and motion blur, as transparent image sequences:
  - flap cycle and glide/soar cycle;
  - headings 90/135/180/225/270° and a toward-camera view;
  - 512 px frames at 2× for desktop;
  - two lighting setups (warm low sun, soft overcast).
  - Source: a commissioned render, or a licensed rigged model rendered
    offline.
- **Environment:**
  - Optional filmed or simulated cloud plates with alpha (or long-exposure
    cloud photography).
  - One cinematic "flight" background plate (pre-rendered video or a frame
    sequence) for an immersive beat like the bee's flower field.
- The interaction needs no rewrite to adopt these: swap the sheet URLs in
  `bird.ts`, add a glide sheet, and replace cloud images.

## 6. Recommendation for homepage integration (after review)
- **Hero replacement:** replace the current hero and first journey scene with
  scenes 1–3 as one pinned block at the top of the homepage. Keep the rest of
  the page as ordinary, non-animated content, as the bee site does after its
  transitions.
- **Scene 4 hand-off:** use the ridgeline rise as the hand-off into "Signature
  routes".
- **Gate:** integrate only after a production bird asset is approved. Until
  then, keep it in `/lab`.
- **Reduced motion:** before shipping, add a reduced-motion version that shows
  the three scenes as static stacked panels, not just the opening still.
