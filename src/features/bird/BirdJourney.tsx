"use client";

// Homepage cinematic opening (Milestone 5). Approved Milestone 4.1 lab
// prototype, integrated: one pinned stage, one GSAP timeline scrubbed by
// scroll. The bird, camera, clouds and masks all read the same `cam` state,
// so they move as one shot. The bird is the approved Lottie (bird.ts), played
// unmodified: ScrollTrigger drives its flight path, the animation's own loop
// drives the wings.
// The stage ends in forest-green valley mist; FeaturedTreks overlaps the last
// stretch of the pin (negative margin) so the real section rises out of that
// mist — there is no separate hand-off screen.
// The frozen 4.1 version lives at /lab/bird-journey (BirdJourneyM41.tsx).
// See docs/BIRD_ANIMATION_STORYBOARD.md for the beat sheet.

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import { photos } from "@/content/photos";
import { birdAsset, facing } from "./bird";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Annapurna South's summit in the hero photo (fraction of the photo): the
// camera dollies toward it and the bird leads the way there.
const PEAK = { x: 0.47, y: 0.24 };
const FRAME_CLOSED = "inset(16% 33% 12% 33% round 999px 999px 18px 18px)";
// Phones: the frame box itself is a shorter landscape-ish band (see NARROW_BOX),
// so the arch only trims the sides and shows much more of the village.
const FRAME_CLOSED_NARROW = "inset(0% 5% 0% 5% round 999px 999px 18px 18px)";
const NARROW_BOX = { top: "25%", height: "62%" };
const FRAME_OPEN = "inset(0% 0% 0% 0% round 0px 0px 0px 0px)";
// Fixed canvas box (px). Apparent size comes from transform scale, so the
// canvas never re-allocates while scrolling.
const BOX = 320;

type Pose = { x: number; y: number; size: number };
// Flight path keyframes, one continuous line (no teleports): the bird flies
// right → left into the summit cloud, comes toward the camera inside it,
// settles beside the arch on the LEFT (copy sits right), then turns once and
// swoops through the opening and away over the hills.
// Phones get a separately tuned path: larger, kept in the open sky above the
// title, and parked above the arch's left shoulder below the copy.
const PATH: Record<"wide" | "narrow", Record<string, Pose>> = {
  wide: {
    start: { x: 1.02, y: 0.46, size: 0.85 }, // just inside the right edge on first paint
    lead: { x: 0.76, y: 0.36, size: 1 }, // beside the title, close to camera
    peak: { x: PEAK.x + 0.05, y: PEAK.y + 0.07, size: 0.14 }, // into the summit cloud
    cloud: { x: 0.4, y: 0.42, size: 0.75 }, // toward camera, hidden in the white-out
    station: { x: 0.27, y: 0.36, size: 0.72 }, // hovers at the arch's left shoulder
    drift: { x: 0.25, y: 0.345, size: 0.72 },
    through: { x: 0.5, y: 0.46, size: 1.05 }, // swoops into the opening
    away: { x: 0.64, y: 0.22, size: 0.06 }, // over the hills to a speck
  },
  narrow: {
    start: { x: 1.04, y: 0.3, size: 0.85 },
    lead: { x: 0.7, y: 0.2, size: 1 },
    peak: { x: PEAK.x + 0.04, y: PEAK.y + 0.04, size: 0.14 },
    cloud: { x: 0.4, y: 0.38, size: 0.8 },
    station: { x: 0.24, y: 0.25, size: 0.72 }, // under the copy, above the arch
    drift: { x: 0.22, y: 0.24, size: 0.72 },
    through: { x: 0.5, y: 0.5, size: 1 },
    away: { x: 0.66, y: 0.22, size: 0.07 },
  },
};

export function BirdJourney({ eyebrow, subline }: { eyebrow: string; subline: string }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  // The original Lottie looping on its own clock: the wings never stop,
  // whatever the scroll does. Not loaded at all under reduced motion.
  useEffect(() => {
    const el = canvas.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    DotLottie.setWasmUrl(birdAsset.wasm);
    const player = new DotLottie({ canvas: el, src: birdAsset.src, loop: true, autoplay: true, renderConfig: { autoResize: false } });
    // The player sizes its backing store from the on-screen (scroll-scaled) box.
    // Compensate once so it always renders at a fixed 2× of BOX, sharp at any scale.
    player.addEventListener("load", () => {
      player.setRenderConfig({ autoResize: false, devicePixelRatio: (BOX * 2) / el.getBoundingClientRect().width });
      player.resize();
    });
    return () => player.destroy();
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q(".bj-stage")[0] as HTMLElement;
      const bird = q(".bj-bird")[0] as HTMLElement;

      const mm = gsap.matchMedia();
      mm.add(
        { wide: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", narrow: "(max-width: 767px) and (prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const narrow = !!ctx.conditions?.narrow;
          const P = PATH[narrow ? "narrow" : "wide"];

          // Camera + subject state. x/y are fractions of the stage; size is the
          // bird's apparent size (1 = base size, small = far away).
          const cam = { ...P.start };
          let lastX = cam.x;
          let dir: 1 | -1 = -1;
          let face = -1; // eased toward dir, so a turn reads as a turn, not a flip

          const applyBird = () => {
            const w = stage.clientWidth;
            const h = stage.clientHeight;
            // Phones get a relatively larger bird (min side × .62 vs × .55).
            const base = Math.min(Math.max(Math.min(w, h) * (narrow ? 0.62 : 0.55), 200), 460);
            dir = facing(cam.x - lastX, dir);
            lastX = cam.x;
            face += (dir - face) * 0.15;
            // Gentle hover bob on wall-clock time, smaller when far away.
            const bob = Math.sin(performance.now() / 380) * 5 * cam.size;
            const s = (base * cam.size) / BOX;
            bird.style.transform = `translate3d(${cam.x * w - BOX / 2}px, ${cam.y * h - BOX / 2 + bob}px, 0) scale(${s * face * birdAsset.faces}, ${s})`;
            // Aerial perspective: distance flattens contrast.
            const far = 1 - gsap.utils.clamp(0, 1, cam.size);
            bird.style.filter = far > 0.05 ? `contrast(${1 - far * 0.3}) brightness(${1 + far * 0.15})` : "none";
          };
          gsap.ticker.add(applyBird);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, pin: stage, start: "top top", end: narrow ? "+=500%" : "+=540%", scrub: 1, invalidateOnRefresh: true },
          });

          // ── Scene 1 · Himalayan opening (0 → .2) ─────────────────────────
          tl.to(".bj-hero", { scale: 1.12, duration: 0.2 }, 0);
          tl.to(cam, { ...P.lead, duration: 0.06, ease: "sine.out" }, 0);
          tl.to(cam, { ...P.peak, duration: 0.2, ease: "sine.in" }, 0.06);
          tl.to(".bj-title", { y: narrow ? -30 : -50, autoAlpha: 0, duration: 0.08, ease: "sine.in" }, 0.09);
          tl.to(".bj-wisp-a", { xPercent: -14, duration: 0.2 }, 0);
          tl.to(".bj-wisp-b", { xPercent: 12, duration: 0.2 }, 0);

          // ── Scene 2 · Through the clouds (.2 → .46) ──────────────────────
          // Three depths (far bank, near bank, lens-close streaks). The bird
          // keeps flying inside the cloud — passing behind the near bank —
          // instead of being repositioned off screen.
          tl.to(".bj-hero", { scale: 1.7, duration: 0.24, ease: "sine.in" }, 0.2);
          tl.to(".bj-wisp-a", { scale: 2.6, yPercent: 40, autoAlpha: 0, duration: 0.14, ease: "sine.in" }, 0.2);
          tl.to(".bj-wisp-b", { scale: 3, yPercent: 60, autoAlpha: 0, duration: 0.14, ease: "sine.in" }, 0.2);
          tl.fromTo(".bj-bank-back", { y: 0, yPercent: 60, autoAlpha: 0 }, { y: 0, yPercent: -10, autoAlpha: 0.9, duration: 0.14, ease: "sine.out" }, 0.22);
          tl.fromTo(".bj-bank", { y: 0, yPercent: 100, scale: 1, autoAlpha: 1 }, { y: 0, yPercent: -12, scale: 1.7, duration: 0.14, ease: "sine.in" }, 0.28);
          tl.fromTo(".bj-veil", { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.08, ease: "sine.in" }, 0.33);
          tl.fromTo(".bj-streak-a", { scale: 0.6, autoAlpha: 0 }, { scale: 3.2, autoAlpha: 0.9, duration: 0.1, ease: "sine.in" }, 0.33);
          tl.to(".bj-streak-a", { autoAlpha: 0, duration: 0.04 }, 0.43);
          tl.fromTo(".bj-streak-b", { scale: 0.5, autoAlpha: 0 }, { scale: 3, autoAlpha: 0.8, duration: 0.1, ease: "sine.in" }, 0.38);
          tl.to(".bj-streak-b", { autoAlpha: 0, duration: 0.05 }, 0.48);
          tl.to(cam, { ...P.cloud, duration: 0.14, ease: "sine.inOut" }, 0.28);

          tl.fromTo(".bj-discover", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, ease: "sine.inOut" }, 0.36);
          tl.set(".bj-hero, .bj-bank-back", { autoAlpha: 0 }, 0.41);

          // ── Scene 3 · Discover Nepal (.41 → .8) ──────────────────────────
          tl.to(".bj-bank", { yPercent: -45, scale: 2.4, autoAlpha: 0, duration: 0.1, ease: "sine.out" }, 0.41);
          tl.to(".bj-veil", { scale: 1.35, autoAlpha: 0, duration: 0.09, ease: "sine.out" }, 0.42);
          tl.fromTo(".bj-discover-copy > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.012, duration: 0.05 }, 0.47);
          tl.to(cam, { ...P.station, duration: 0.1, ease: "sine.out" }, 0.42);
          tl.to(cam, { ...P.drift, duration: 0.07, ease: "sine.inOut" }, 0.52); // hover drift
          tl.to(".bj-discover-copy > *", { autoAlpha: 0, y: -16, stagger: 0.008, duration: 0.035 }, 0.58);
          // Frame opens; a light counter-zoom keeps Ghandruk's rooftops in place.
          // Portrait screens (phones, upright tablets) use the band-shaped frame.
          if (narrow || stage.clientWidth < stage.clientHeight) {
            gsap.set(".bj-frame", { ...NARROW_BOX, clipPath: FRAME_CLOSED_NARROW });
            tl.fromTo(".bj-frame", { ...NARROW_BOX, clipPath: FRAME_CLOSED_NARROW }, { top: "0%", height: "100%", clipPath: FRAME_OPEN, duration: 0.13, ease: "power3.inOut" }, 0.59);
          } else {
            gsap.set(".bj-frame", { top: "0%", height: "100%", clipPath: FRAME_CLOSED });
            tl.fromTo(".bj-frame", { clipPath: FRAME_CLOSED }, { clipPath: FRAME_OPEN, duration: 0.13, ease: "power3.inOut" }, 0.59);
            tl.fromTo(".bj-frame-img", { scale: 1.2 }, { scale: 1, duration: 0.13, ease: "power3.inOut" }, 0.59);
          }
          tl.to(cam, { ...P.through, duration: 0.07, ease: "sine.inOut" }, 0.59);
          tl.to(cam, { ...P.away, duration: 0.15, ease: "power1.in" }, 0.66);
          tl.to(".bj-bird", { autoAlpha: 0, duration: 0.03 }, 0.78);
          tl.fromTo(".bj-place-scrim", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.68);
          tl.fromTo(".bj-place > *", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.015, duration: 0.05 }, 0.7);

          // ── Scene 4 · Into the trekking routes (.8 → 1) ──────────────────
          // Camera pushes into the valley while mist rises and deepens into
          // forest green. FeaturedTreks (overlapping the pin's last stretch)
          // rises out of this mist with its heading already in view.
          tl.to(".bj-frame-img", { scale: 1.18, yPercent: -5, duration: 0.2, ease: "sine.in" }, 0.8);
          tl.to(".bj-place > *", { y: -20, autoAlpha: 0, stagger: 0.01, duration: 0.05 }, 0.8);
          tl.fromTo(".bj-mist", { y: 0, yPercent: 60, autoAlpha: 0 }, { y: 0, yPercent: -10, autoAlpha: 0.85, duration: 0.14, ease: "sine.out" }, 0.78);
          tl.fromTo(".bj-outro", { y: 0, yPercent: 100, autoAlpha: 1 }, { y: 0, yPercent: 0, autoAlpha: 1, duration: 0.16, ease: "power2.inOut" }, 0.8);

          applyBird();
          return () => gsap.ticker.remove(applyBird);
        },
      );
    },
    { scope: root },
  );

  // Reduced motion: no pin, no scrub, no bird. Every scene is laid out as
  // ordinary stacked content (motion-reduce: classes below).
  return (
    // Root reserves the pin's full scroll length (100svh + end %) before
    // hydration, so FeaturedTreks' negative-margin overlap never covers the
    // hero on first paint and there is no layout shift when the pin starts.
    <div ref={root} className="h-[640svh] max-md:h-[600svh] motion-reduce:h-auto">
      <section aria-labelledby="hero-title" className="bj-stage relative h-[100svh] overflow-hidden bg-cloud-100 text-cloud-50 motion-reduce:h-auto">
        {/* Scene 1–2: Himalayan opening. */}
        <div className="bj-hero absolute inset-0 will-change-transform motion-reduce:relative motion-reduce:h-[100svh]" style={{ transformOrigin: `${PEAK.x * 100}% ${PEAK.y * 100}%` }}>
          <Image src={photos.hero.src} alt={photos.hero.alt} fill preload sizes="100vw" placeholder="blur" className="object-cover object-[50%_30%]" />
          {/* Top scrim keeps the transparent header legible on bright sky; bottom scrim under the title. */}
          <div className="absolute inset-0 bg-gradient-to-b from-night-950/45 via-transparent via-30% to-night-950/80 max-md:to-night-950/90" />
        </div>
        <Image src="/lab/clouds/wisp.webp" alt="" width={2400} height={800} sizes="150vw" className="bj-wisp-a pointer-events-none absolute top-[38%] left-[-20%] w-[140%] max-w-none opacity-60 motion-reduce:hidden" />
        <Image src="/lab/clouds/wisp.webp" alt="" width={2400} height={800} sizes="150vw" className="bj-wisp-b pointer-events-none absolute top-[56%] left-[-30%] w-[150%] max-w-none -scale-x-100 opacity-40 motion-reduce:hidden" />

        <div className="bj-title container-x absolute inset-x-0 bottom-[14svh] z-[4] [text-shadow:0_2px_24px_rgb(10_15_22/0.55)] max-md:bottom-[10svh] motion-reduce:top-[50svh] motion-reduce:bottom-auto">
          <p className="eyebrow mb-4 text-[13px] text-cloud-50 [text-shadow:0_1px_10px_rgb(10_15_22/0.55)] sm:text-sm">{eyebrow}</p>
          <h1 id="hero-title" className="max-w-4xl font-display text-display-xl font-medium">
            Walk the roof <em>of the world</em>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-cloud-50">{subline}</p>
        </div>

        {/* Scene 3: Discover Nepal — framed village that opens to full screen. */}
        <div className="bj-discover invisible absolute inset-0 bg-cloud-100 text-ink-900 motion-reduce:visible motion-reduce:relative motion-reduce:h-[100svh]">
          <div className="bj-frame absolute inset-0 overflow-hidden max-md:motion-reduce:top-[25%]! max-md:motion-reduce:h-[54%]! max-md:motion-reduce:[clip-path:inset(0%_5%_0%_5%_round_999px_999px_18px_18px)]!" style={{ clipPath: FRAME_CLOSED }}>
            <Image src={photos.village.src} alt={photos.village.alt} fill sizes="100vw" className="bj-frame-img object-cover object-[50%_45%] will-change-transform max-md:object-[45%_55%]" />
            <div className="bj-place-scrim absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night-950/80 to-transparent opacity-0" />
          </div>
          <div className="bj-discover-copy container-x absolute inset-x-0 top-[9svh] flex max-w-[90rem] flex-col items-end text-right lg:top-1/2 lg:-translate-y-1/2">
            <p className="eyebrow mb-3 text-brand-500">Discover Nepal</p>
            <h2 className="max-w-[12ch] font-display text-display-md">Where the trail begins</h2>
            <ul className="mt-6 hidden space-y-1 text-xs tracking-wide text-ink-700 lg:block">
              <li>Annapurna</li>
              <li>Langtang</li>
              <li>Khumbu</li>
            </ul>
          </div>
          <div className="bj-place container-x absolute inset-x-0 bottom-[12svh] text-cloud-50 [text-shadow:0_2px_18px_rgb(10_15_22/0.5)] max-md:bottom-[15svh] motion-reduce:bottom-[4svh] motion-reduce:text-ink-900 motion-reduce:[text-shadow:none]">
            <p className="eyebrow mb-3 text-brand-300 motion-reduce:text-brand-500">Annapurna region</p>
            <p className="font-display text-display-md">Ghandruk</p>
          </div>
        </div>

        {/* Mid-distance cloud bank (behind the bird) for depth. */}
        <div className="bj-bank-back pointer-events-none invisible absolute bottom-[5%] left-[-35%] w-[170%] max-md:left-[-100%] max-md:w-[300%] opacity-0 blur-[2px] motion-reduce:hidden">
          <Image src="/lab/clouds/bank.webp" alt="" width={2400} height={1200} sizes="150vw" className="block w-full max-w-none -scale-x-100" />
          <div className="absolute top-[calc(100%-2px)] left-0 h-[100vh] w-full bg-[rgb(226,230,234)]" />
        </div>

        {/* The bird: original Lottie on a canvas. Scroll moves it; the animation flaps on its own. */}
        <div aria-hidden className="bj-bird pointer-events-none absolute top-0 left-0 z-[5] origin-center will-change-transform motion-reduce:hidden" style={{ width: BOX, height: BOX, transform: "translate3d(-9999px,0,0)" }}>
          <canvas ref={canvas} className="h-full w-full" />
        </div>

        {/* Foreground clouds (above the bird). */}
        <div className="bj-bank pointer-events-none invisible absolute bottom-[-10%] left-[-25%] z-[6] w-[150%] max-md:left-[-90%] max-md:w-[280%] motion-reduce:hidden">
          <Image src="/lab/clouds/bank.webp" alt="" width={2400} height={1200} sizes="150vw" className="block w-full max-w-none" />
          <div className="absolute top-[calc(100%-2px)] left-0 h-[200vh] w-full bg-[rgb(226,230,234)]" />
        </div>
        <Image src="/lab/clouds/veil.webp" alt="" fill sizes="100vw" className="bj-veil pointer-events-none invisible z-[6] object-cover opacity-0 motion-reduce:hidden" />
        <Image src="/lab/clouds/wisp.webp" alt="" width={2400} height={800} sizes="150vw" className="bj-streak-a pointer-events-none invisible absolute top-[30%] left-[-10%] z-[7] w-[120%] max-w-none opacity-0 motion-reduce:hidden" />
        <Image src="/lab/clouds/wisp.webp" alt="" width={2400} height={800} sizes="150vw" className="bj-streak-b pointer-events-none invisible absolute top-[45%] left-[-15%] z-[7] w-[130%] max-w-none -scale-x-100 opacity-0 motion-reduce:hidden" />

        {/* Scene 4: valley mist that deepens into the forest green of FeaturedTreks. */}
        <Image src="/lab/clouds/bank.webp" alt="" width={2400} height={1200} sizes="150vw" className="bj-mist pointer-events-none invisible absolute bottom-[-5%] left-[-25%] z-[7] w-[150%] max-md:left-[-90%] max-md:w-[280%] max-w-none opacity-0 brightness-[0.55] sepia-[0.25] hue-rotate-[60deg] motion-reduce:hidden" />
        <div className="bj-outro pointer-events-none invisible absolute inset-0 z-[8] bg-gradient-to-b from-transparent via-night-950/90 via-30% to-night-950 motion-reduce:hidden" />
      </section>
    </div>
  );
}
