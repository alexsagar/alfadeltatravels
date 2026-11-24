"use client";

// EXPERIMENTAL (Milestone 3.1). Pinned, scroll-scrubbed follow-camera journey.
// One stage, one subject, a camera that pushes along the route, and a mist
// transition between shots. Data lives in ./shots.ts.

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { coverPoint } from "@/features/trekker/path";
import { beats, shots, standIn } from "./shots";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const [forest, summit] = shots;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Placed = { feetX: number; feetY: number; flowPerZoom: number };

export function CinematicJourney() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const stage = q(".cj-stage")[0] as HTMLElement;
      const shotEls = shots.map((s) => q(`[data-shot="${s.id}"]`)[0] as HTMLElement);
      const subject = q(".cj-subject")[0] as HTMLElement;
      const walkSprite = q(".cj-walk")[0] as HTMLElement;
      const placed: Placed[] = [];

      // Camera state driven by the scrubbed timeline.
      const cam = { zoomA: forest.camera.zoomFrom, zoomB: summit.camera.zoomFrom, showB: 0, mist: 0, blend: 0, rest: 0 };
      let phase = 0;
      let last = { a: cam.zoomA, b: cam.zoomB };

      /** Fit each photo so the route sits mid-frame, then derive camera origin + feet. */
      const layout = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        shots.forEach((shot, i) => {
          const { width: iw, height: ih } = shot.media.src;
          const s = Math.max(w / iw, h / ih);
          const spare = w - iw * s;
          const fx = spare === 0 ? 0.5 : gsap.utils.clamp(0, 1, (w * 0.55 - shot.feet[0] * iw * s) / spare);
          const img = shotEls[i].querySelector("img")!;
          img.style.objectPosition = `${fx * 100}% 50%`;
          const o = coverPoint(w, h, iw, ih, fx, 0.5, ...shot.camera.origin);
          const f = coverPoint(w, h, iw, ih, fx, 0.5, ...shot.feet);
          shotEls[i].style.transformOrigin = `${o.x}px ${o.y}px`;
          const z = shot.camera.zoomFrom;
          placed[i] = {
            // Subject stays where the start-of-shot feet point lands on screen;
            // pushing in then slides the trail under it, like a follow camera.
            feetX: o.x + (f.x - o.x) * z,
            feetY: o.y + (f.y - o.y) * z,
            flowPerZoom: f.y - o.y,
          };
        });
      };

      const apply = () => {
        const h = stage.clientHeight;
        shotEls[0].style.transform = `scale(${cam.zoomA})`;
        shotEls[1].style.transform = `scale(${cam.zoomB})`;
        shotEls[1].style.opacity = String(cam.showB);
        q(".cj-mist").forEach((m, i) => {
          (m as HTMLElement).style.opacity = String(cam.mist * (i === 0 ? 0.95 : 0.7));
          (m as HTMLElement).style.transform = `translateY(${(1 - cam.mist) * (i === 0 ? 30 : -20)}%)`;
        });

        const t = cam.blend;
        const heightPx = lerp(forest.subjectHeight, summit.subjectHeight, t) * h;
        const k = heightPx / standIn.frameHeight;
        const x = lerp(placed[0].feetX, placed[1].feetX, t);
        const y = lerp(placed[0].feetY, placed[1].feetY, t);
        subject.style.transform =
          `translate(${x - (standIn.frameWidth * k) / 2}px, ${y - standIn.groundRow * k}px) scale(${k})`;
        subject.style.filter = `brightness(${lerp(forest.light, summit.light, t)}) saturate(${lerp(0.8, 0.95, t)})`;

        // Stride sync: ground under the feet flows by Δzoom × distance from the
        // camera origin. One cycle covers cycleMetres, foreshortened by the
        // render camera's elevation, at the subject's current px-per-metre.
        if (!cam.rest) {
          const flow =
            (1 - t) * (cam.zoomA - last.a) * placed[0].flowPerZoom +
            t * (cam.zoomB - last.b) * placed[1].flowPerZoom;
          const pxPerMetre = heightPx / standIn.metresPerFrame;
          const stridePx = standIn.cycleMetres * Math.sin((standIn.cameraElevationDeg * Math.PI) / 180) * pxPerMetre;
          phase += flow / stridePx;
          const frame = Math.floor((phase - Math.floor(phase)) * standIn.walk.frames);
          walkSprite.style.backgroundPosition = `${(frame / (standIn.walk.frames - 1)) * 100}% 0`;
        }
        last = { a: cam.zoomA, b: cam.zoomB };
        subject.dataset.rest = cam.rest ? "true" : "false";
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        layout();
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: apply,
          scrollTrigger: {
            trigger: root.current,
            pin: stage,
            start: "top top",
            end: "+=350%",
            scrub: 0.8,
          },
        });
        // Re-layout after ScrollTrigger finishes refreshing. (Its per-trigger
        // onRefresh runs while the timeline is temporarily rendered at its
        // end, which painted the closing shot mid-sequence.)
        const onRefresh = () => {
          layout();
          last = { a: cam.zoomA, b: cam.zoomB };
          apply();
        };
        ScrollTrigger.addEventListener("refresh", onRefresh);
        // Shot A: push along the forest trail, continuing under the mist.
        tl.to(cam, { zoomA: forest.camera.zoomTo, duration: beats.mistPeak + 0.05 }, 0);
        // Mist rolls in, peaks while the shots swap, then clears.
        tl.to(cam, { mist: 1, duration: beats.mistPeak - beats.mistIn, ease: "sine.inOut" }, beats.mistIn);
        tl.to(cam, { showB: 1, blend: 1, duration: 0.08, ease: "sine.inOut" }, beats.mistPeak - 0.03);
        tl.to(cam, { mist: 0, duration: beats.mistOut - beats.mistPeak, ease: "sine.inOut" }, beats.mistPeak);
        // Shot B: push across the summit rocks towards the view, then stop.
        tl.to(cam, { zoomB: summit.camera.zoomTo, duration: beats.summitEnd - (beats.mistPeak - 0.03) }, beats.mistPeak - 0.03);
        tl.set(cam, { rest: 1 }, beats.summitEnd);
        tl.to(cam, { zoomB: summit.camera.zoomTo + 0.02, duration: 1 - beats.summitEnd, ease: "power2.out" }, beats.summitEnd);
        // Captions.
        tl.fromTo(".cj-cap-1", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.06 }, beats.mistIn - 0.04);
        tl.fromTo(".cj-cap-2", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.06 }, beats.mistOut);
        tl.to(".cj-cap-2", { autoAlpha: 0, duration: 0.05 }, beats.summitEnd - 0.06);
        tl.fromTo(".cj-cap-3", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.08 }, beats.summitEnd + 0.02);
        apply();
        return () => ScrollTrigger.removeEventListener("refresh", onRefresh);
      });

      // Reduced motion: no pin, no scrub — the closing composition as a still.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        layout();
        Object.assign(cam, { zoomA: forest.camera.zoomTo, zoomB: summit.camera.zoomTo, showB: 1, mist: 0, blend: 1, rest: 1 });
        apply();
        gsap.set([".cj-cap-1", ".cj-cap-2"], { autoAlpha: 0 });
        gsap.set(".cj-cap-3", { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  const sheetStyle = (src: string, frames: number) => ({
    backgroundImage: `url(${src})`,
    backgroundSize: `${frames * 100}% 100%`,
  });

  return (
    <div ref={root}>
      <section aria-labelledby="cj-title" className="cj-stage relative h-[100svh] overflow-hidden bg-night-950 text-cloud-50">
        <h2 id="cj-title" className="sr-only">
          A trek from forest trail to a high viewpoint
        </h2>

        {shots.map((shot, i) => (
          <div
            key={shot.id}
            data-shot={shot.id}
            className="absolute inset-0 will-change-transform"
            style={i > 0 ? { opacity: 0 } : undefined}
          >
            <Image src={shot.media.src} alt={shot.media.alt} fill sizes="100vw" preload={i === 0} className="object-cover" />
          </div>
        ))}

        {/* Vignette + haze for depth. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_40%,rgb(20_28_37/0.55))]" />

        {/* Subject: feet on the route, rear three-quarter, scaled per shot. */}
        <div aria-hidden className="cj-subject absolute top-0 left-0 origin-top-left will-change-transform" style={{ width: standIn.frameWidth, height: standIn.frameHeight }}>
          <span
            className="absolute left-1/2 h-[14px] w-[120px] -translate-x-1/2"
            style={{ top: standIn.groundRow - 7, background: "radial-gradient(closest-side, rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.2) 60%, transparent)" }}
          />
          <span className="cj-walk absolute inset-0 bg-no-repeat" style={sheetStyle(standIn.walk.src, standIn.walk.frames)} />
          <span className="cj-rest absolute inset-0 bg-no-repeat" style={sheetStyle(standIn.rest.src, standIn.rest.frames)} />
        </div>

        {/* Mist: one bank rising from below (in front of the legs), one drifting down. */}
        <div className="cj-mist pointer-events-none absolute inset-x-[-10%] bottom-[-10%] h-[90%] opacity-0 blur-2xl" style={{ background: "radial-gradient(ellipse at 50% 80%, rgb(233 236 232) 0%, rgb(220 226 222 / 0.9) 40%, transparent 72%)" }} />
        <div className="cj-mist pointer-events-none absolute inset-x-[-10%] top-[-10%] h-[80%] opacity-0 blur-2xl" style={{ background: "radial-gradient(ellipse at 50% 20%, rgb(240 242 238) 0%, rgb(225 230 226 / 0.85) 45%, transparent 75%)" }} />

        <div className="container-x relative z-10 pt-[16svh]">
          <div className="cj-cap-1 absolute max-w-xs sm:max-w-md">
            <p className="eyebrow mb-4 text-brand-300">01 · The trail</p>
            <p className="font-display text-display-md">Into the high forest</p>
            <p className="mt-3 text-xs text-cloud-100/70">Pictured: {forest.media.location}</p>
          </div>
          <div className="cj-cap-2 invisible absolute max-w-xs sm:max-w-md">
            <p className="eyebrow mb-4 text-brand-300">02 · Above the treeline</p>
            <p className="font-display text-display-md">Onto the summit rocks</p>
            <p className="mt-3 text-xs text-cloud-100/70">Pictured: {summit.media.location}</p>
          </div>
          <div className="cj-cap-3 invisible absolute max-w-xs sm:max-w-md">
            <p className="eyebrow mb-4 text-brand-300">03 · The viewpoint</p>
            <p className="font-display text-display-md">Stop. Look out.</p>
            <p className="mt-3 text-xs text-cloud-100/70">Pictured: {summit.media.location}</p>
          </div>
        </div>

        <p className="absolute right-3 bottom-3 z-10 max-w-[70%] rounded-sm bg-black/55 px-2 py-1 text-right text-[11px] tracking-wide text-white/85 uppercase">
          Prototype · stand-in character (CC0 game model) — not photorealistic
        </p>

        <style>{`
          .cj-rest { display: none; animation: cj-idle ${standIn.rest.loopSeconds}s steps(${standIn.rest.frames}, jump-none) infinite; }
          .cj-subject[data-rest="true"] .cj-walk { display: none; }
          .cj-subject[data-rest="true"] .cj-rest { display: block; }
          @keyframes cj-idle { from { background-position: 0% 0; } to { background-position: 100% 0; } }
          @media (prefers-reduced-motion: reduce) { .cj-rest { animation: none; } }
        `}</style>
      </section>
    </div>
  );
}
