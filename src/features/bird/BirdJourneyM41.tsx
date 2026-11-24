"use client";

// FROZEN Milestone 4.1 lab snapshot (/lab/bird-journey), kept for comparison.
// The homepage uses BirdJourney.tsx.
// One pinned stage, one GSAP timeline scrubbed by scroll. The bird, camera,
// clouds and masks all read the same `cam` state, so they move as one shot.
// The bird is the approved Lottie (bird.ts), played unmodified: ScrollTrigger
// drives its flight path, the animation's own loop drives the wings.
// The bird travels one way (right → left) through every scene so it leads
// the viewer instead of shuttling back and forth.
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
// Phones: a wider, lower arch so copy can sit above it.
const FRAME_CLOSED_NARROW = "inset(30% 9% 9% 9% round 999px 999px 18px 18px)";
const FRAME_OPEN = "inset(0% 0% 0% 0% round 0px 0px 0px 0px)";
// Fixed canvas box (px). Apparent size comes from transform scale, so the
// canvas never re-allocates while scrolling.
const BOX = 320;

type Pose = { x: number; y: number; size: number };
// Flight path keyframes. Phones get their own composition: the bird stays in
// the upper sky (title and copy live low / high respectively) and smaller.
const PATH: Record<"wide" | "narrow", Record<string, Pose>> = {
  wide: {
    start: { x: 1.02, y: 0.46, size: 0.85 }, // just inside the right edge on first paint
    lead: { x: 0.76, y: 0.36, size: 1 }, // beside the title, close to camera
    peak: { x: PEAK.x + 0.05, y: PEAK.y + 0.07, size: 0.14 }, // into the summit cloud
    emerge: { x: 1.1, y: 0.5, size: 0.55 }, // out of the cloud, right side
    station: { x: 0.74, y: 0.34, size: 0.72 }, // hovers by the arch
    through: { x: 0.5, y: 0.44, size: 1.05 }, // swoops through the opening
    away: { x: 0.36, y: 0.2, size: 0.06 }, // over the hills to a speck
  },
  narrow: {
    start: { x: 1.05, y: 0.28, size: 0.7 },
    lead: { x: 0.72, y: 0.24, size: 0.8 },
    peak: { x: PEAK.x + 0.04, y: PEAK.y + 0.04, size: 0.12 },
    emerge: { x: 1.15, y: 0.22, size: 0.45 },
    station: { x: 0.72, y: 0.27, size: 0.55 }, // above the arch, below the copy
    through: { x: 0.48, y: 0.5, size: 0.85 },
    away: { x: 0.4, y: 0.2, size: 0.06 },
  },
};

export function BirdJourneyM41() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  // The original Lottie looping on its own clock: the wings never stop, whatever the scroll does.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
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
            const base = Math.min(Math.max(Math.min(w, h) * 0.55, 200), 460);
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
            scrollTrigger: { trigger: root.current, pin: stage, start: "top top", end: narrow ? "+=520%" : "+=560%", scrub: 1 },
          });

          // ── Scene 1 · Himalayan opening (0 → .2) ─────────────────────────
          // No static hold: the camera starts pushing in on the first scroll
          // and the bird is already on screen, leading toward the summit.
          tl.to(".bj-hero", { scale: 1.12, duration: 0.2 }, 0);
          tl.to(cam, { ...P.lead, duration: 0.06, ease: "sine.out" }, 0);
          tl.to(cam, { ...P.peak, duration: 0.2, ease: "sine.in" }, 0.06);
          tl.to(".bj-title", { y: narrow ? -30 : -50, autoAlpha: 0, duration: 0.08, ease: "sine.in" }, 0.09);
          tl.to(".bj-wisp-a", { xPercent: -14, duration: 0.2 }, 0);
          tl.to(".bj-wisp-b", { xPercent: 12, duration: 0.2 }, 0);

          // ── Scene 2 · Through the clouds (.2 → .46) ──────────────────────
          // The camera follows the bird into the summit cloud. Layers at three
          // depths (far bank, near bank, lens-close wisps) move at different
          // rates; the full white-out lasts only a moment, and something is
          // always moving across it, so it reads as flying through, not a cut.
          tl.to(".bj-hero", { scale: 1.7, duration: 0.24, ease: "sine.in" }, 0.2);
          tl.to(".bj-wisp-a", { scale: 2.6, yPercent: 40, autoAlpha: 0, duration: 0.14, ease: "sine.in" }, 0.2);
          tl.to(".bj-wisp-b", { scale: 3, yPercent: 60, autoAlpha: 0, duration: 0.14, ease: "sine.in" }, 0.2);
          tl.fromTo(".bj-bank-back", { y: 0, yPercent: 60, autoAlpha: 0 }, { y: 0, yPercent: -10, autoAlpha: 0.9, duration: 0.14, ease: "sine.out" }, 0.22);
          tl.fromTo(".bj-bank", { y: 0, yPercent: 100, scale: 1, autoAlpha: 1 }, { y: 0, yPercent: -12, scale: 1.7, duration: 0.14, ease: "sine.in" }, 0.28);
          tl.fromTo(".bj-veil", { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.08, ease: "sine.in" }, 0.33);
          // Lens-close streaks: pass the camera from small/centre to huge/off-frame.
          tl.fromTo(".bj-streak-a", { scale: 0.6, autoAlpha: 0 }, { scale: 3.2, autoAlpha: 0.9, duration: 0.1, ease: "sine.in" }, 0.33);
          tl.to(".bj-streak-a", { autoAlpha: 0, duration: 0.04 }, 0.43);
          tl.fromTo(".bj-streak-b", { scale: 0.5, autoAlpha: 0 }, { scale: 3, autoAlpha: 0.8, duration: 0.1, ease: "sine.in" }, 0.38);
          tl.to(".bj-streak-b", { autoAlpha: 0, duration: 0.05 }, 0.48);

          // Under full cloud (.41): swap environments; the bird is still ahead, out of frame.
          // Crossfade (not a cut) to the next environment while the cloud is thickest.
          tl.fromTo(".bj-discover", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, ease: "sine.inOut" }, 0.36);
          tl.set(".bj-hero, .bj-bank-back", { autoAlpha: 0 }, 0.41);
          tl.set(cam, { ...P.emerge }, 0.41);

          // ── Scene 3 · Discover Nepal (.41 → .8) ──────────────────────────
          // Clouds stream past and thin out; the bird re-enters from the right
          // still heading left, hovers at the arch like the bee at a flower,
          // then swoops through as the frame opens. Bird is drawn above the mask.
          tl.to(".bj-bank", { yPercent: -45, scale: 2.4, autoAlpha: 0, duration: 0.1, ease: "sine.out" }, 0.41);
          tl.to(".bj-veil", { scale: 1.35, autoAlpha: 0, duration: 0.09, ease: "sine.out" }, 0.42);
          tl.fromTo(".bj-discover-copy > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.012, duration: 0.05 }, 0.47);
          tl.to(cam, { ...P.station, duration: 0.09, ease: "sine.out" }, 0.43);
          tl.to(cam, { x: P.station.x - 0.03, y: P.station.y - 0.015, duration: 0.07, ease: "sine.inOut" }, 0.52); // hover drift
          tl.to(".bj-discover-copy > *", { autoAlpha: 0, y: -16, stagger: 0.008, duration: 0.035 }, 0.58);
          // Portrait screens (phones, tablets upright) get the wide, low arch.
          const closed = stage.clientWidth < stage.clientHeight ? FRAME_CLOSED_NARROW : FRAME_CLOSED;
          gsap.set(".bj-frame", { clipPath: closed });
          // Frame opens; a light counter-zoom keeps Ghandruk's rooftops in place (less on phones).
          tl.fromTo(".bj-frame", { clipPath: closed }, { clipPath: FRAME_OPEN, duration: 0.13, ease: "power3.inOut" }, 0.59);
          tl.fromTo(".bj-frame-img", { scale: narrow ? 1.08 : 1.2 }, { scale: 1, duration: 0.13, ease: "power3.inOut" }, 0.59);
          tl.to(cam, { ...P.through, duration: 0.07, ease: "sine.inOut" }, 0.59);
          tl.to(cam, { ...P.away, duration: 0.15, ease: "power1.in" }, 0.66);
          tl.to(".bj-bird", { autoAlpha: 0, duration: 0.03 }, 0.79);
          tl.fromTo(".bj-place-scrim", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.68);
          tl.fromTo(".bj-place > *", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.015, duration: 0.05 }, 0.7);

          // ── Scene 4 · Into the trekking routes (.8 → 1) ──────────────────
          // The camera keeps pushing into the photo and tilts down the valley
          // while valley mist rises and deepens into forest green; the next
          // section's heading arrives inside that mist, so the page below
          // continues in the same colour with no visible seam.
          tl.to(".bj-frame-img", { scale: 1.22, yPercent: -6, duration: 0.2, ease: "sine.in" }, 0.8);
          tl.to(".bj-place > *", { y: -20, autoAlpha: 0, stagger: 0.01, duration: 0.05 }, 0.82);
          tl.fromTo(".bj-mist", { y: 0, yPercent: 60, autoAlpha: 0 }, { y: 0, yPercent: -10, autoAlpha: 0.85, duration: 0.14, ease: "sine.out" }, 0.8);
          tl.fromTo(".bj-outro", { y: 0, yPercent: 100, autoAlpha: 1 }, { y: 0, yPercent: 0, autoAlpha: 1, duration: 0.14, ease: "power2.inOut" }, 0.84);
          tl.fromTo(".bj-outro-copy > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.015, duration: 0.05 }, 0.93);

          applyBird();
          return () => gsap.ticker.remove(applyBird);
        },
      );
    },
    { scope: root },
  );

  // Reduced motion: no pin, no scrub, no bird flight. Every scene is laid out
  // as ordinary stacked content (motion-reduce: classes below).
  return (
    <div ref={root}>
      <section aria-label="A flight across Nepal" className="bj-stage relative h-[100svh] overflow-hidden bg-cloud-100 text-cloud-50 motion-reduce:h-auto">
        {/* Scene 1–2: Himalayan opening. */}
        <div className="bj-hero absolute inset-0 will-change-transform motion-reduce:relative motion-reduce:h-[100svh]" style={{ transformOrigin: `${PEAK.x * 100}% ${PEAK.y * 100}%` }}>
          <Image src={photos.hero.src} alt={photos.hero.alt} fill preload sizes="100vw" placeholder="blur" className="object-cover object-[50%_30%]" />
          {/* Readability scrim under the title (stronger on phones, where the title sits on trees and haze). */}
          <div className="absolute inset-0 bg-gradient-to-b from-night-950/25 via-transparent via-40% to-night-950/80 max-md:to-night-950/90" />
        </div>
        <Image src="/lab/clouds/wisp.webp" alt="" width={2400} height={800} sizes="150vw" className="bj-wisp-a pointer-events-none absolute top-[38%] left-[-20%] w-[140%] max-w-none opacity-60 motion-reduce:hidden" />
        <Image src="/lab/clouds/wisp.webp" alt="" width={2400} height={800} sizes="150vw" className="bj-wisp-b pointer-events-none absolute top-[56%] left-[-30%] w-[150%] max-w-none -scale-x-100 opacity-40 motion-reduce:hidden" />

        <div className="bj-title container-x absolute inset-x-0 bottom-[14svh] z-[4] [text-shadow:0_2px_24px_rgb(10_15_22/0.55)] max-md:bottom-[10svh] motion-reduce:top-[55svh] motion-reduce:bottom-auto">
          <p className="eyebrow mb-4 text-brand-300">Nepal · Himalaya</p>
          <h1 className="max-w-4xl font-display text-display-xl font-medium">Alfa Delta Travels</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-cloud-50">Follow the flight from the high peaks into the valleys below.</p>
        </div>

        {/* Scene 3: Discover Nepal — framed destination that opens to full screen. */}
        <div className="bj-discover invisible absolute inset-0 bg-cloud-100 text-ink-900 motion-reduce:visible motion-reduce:relative motion-reduce:h-[100svh]">
          <div className="bj-frame absolute inset-0 overflow-hidden max-md:motion-reduce:[clip-path:inset(28%_9%_26%_9%_round_999px_999px_18px_18px)]!" style={{ clipPath: FRAME_CLOSED }}>
            <Image src={photos.village.src} alt={photos.village.alt} fill sizes="100vw" className="bj-frame-img object-cover object-[50%_45%] will-change-transform max-md:object-[42%_50%]" />
            <div className="bj-place-scrim absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night-950/80 to-transparent opacity-0" />
          </div>
          <div className="bj-discover-copy container-x absolute inset-x-0 top-[9svh] flex max-w-[90rem] flex-col items-start lg:top-1/2 lg:-translate-y-1/2">
            <p className="eyebrow mb-3 text-brand-500">02 · Discover Nepal</p>
            <h2 className="max-w-[16ch] font-display text-display-md">Where the trail begins</h2>
            <ul className="mt-6 hidden space-y-1 text-xs tracking-wide text-ink-700 lg:block">
              <li>Annapurna</li>
              <li>Langtang</li>
              <li>Khumbu</li>
            </ul>
          </div>
          <div className="bj-place container-x absolute inset-x-0 bottom-[12svh] text-cloud-50 [text-shadow:0_2px_18px_rgb(10_15_22/0.5)] max-md:bottom-[13svh] motion-reduce:text-ink-900 motion-reduce:[text-shadow:none]">
            <p className="eyebrow mb-3 text-brand-300 motion-reduce:text-brand-500">Annapurna region</p>
            <p className="font-display text-display-md">Ghandruk</p>
            <p className="mt-2 text-xs text-cloud-100 motion-reduce:text-ink-700">Pictured: {photos.village.location}</p>
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
          {/* Solid cloud body below the bank so the white-out has no bottom edge. */}
          <div className="absolute top-[calc(100%-2px)] left-0 h-[200vh] w-full bg-[rgb(226,230,234)]" />
        </div>
        <Image src="/lab/clouds/veil.webp" alt="" fill sizes="100vw" className="bj-veil pointer-events-none invisible z-[6] object-cover opacity-0 motion-reduce:hidden" />
        {/* Lens-close cloud streaks that sweep past the camera inside the cloud. */}
        <Image src="/lab/clouds/wisp.webp" alt="" width={2400} height={800} sizes="150vw" className="bj-streak-a pointer-events-none invisible absolute top-[30%] left-[-10%] z-[7] w-[120%] max-w-none opacity-0 motion-reduce:hidden" />
        <Image src="/lab/clouds/wisp.webp" alt="" width={2400} height={800} sizes="150vw" className="bj-streak-b pointer-events-none invisible absolute top-[45%] left-[-15%] z-[7] w-[130%] max-w-none -scale-x-100 opacity-0 motion-reduce:hidden" />

        {/* Scene 4: valley mist that thickens into the forest-green routes section. */}
        <Image src="/lab/clouds/bank.webp" alt="" width={2400} height={1200} sizes="150vw" className="bj-mist pointer-events-none invisible absolute bottom-[-5%] left-[-25%] z-[7] w-[150%] max-md:left-[-90%] max-md:w-[280%] max-w-none opacity-0 brightness-[0.55] sepia-[0.25] hue-rotate-[60deg] motion-reduce:hidden" />
        <div className="bj-outro absolute inset-0 z-[8] invisible bg-gradient-to-b from-transparent via-night-950/90 via-30% to-night-950 motion-reduce:visible motion-reduce:relative motion-reduce:bg-night-950">
          <div className="bj-outro-copy container-x absolute inset-x-0 bottom-[14svh] motion-reduce:static motion-reduce:py-24">
            <p className="eyebrow mb-4 text-brand-300">03 · Trekking</p>
            <h2 className="font-display text-display-lg">Signature routes</h2>
          </div>
        </div>

        <p className="absolute right-3 bottom-3 z-10 max-w-[70%] rounded-sm bg-black/55 px-2 py-1 text-right text-[11px] tracking-wide text-white/85 uppercase">
          Lab prototype · Hummingbird animation by Michael Mills (LottieFiles)
        </p>
      </section>

      {/* Continues in the outro's colour, so the hand-off has no seam. */}
      <section className="bg-night-950 pt-8 pb-32 text-cloud-50">
        <div className="container-x">
          <p className="max-w-md text-sm text-cloud-100/80">
            Scene 4 hand-off point: the regular trekking content would continue here.
          </p>
        </div>
      </section>
    </div>
  );
}
