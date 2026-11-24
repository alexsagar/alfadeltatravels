"use client";

// HISTORICAL (Milestone 4 trekker overlay) — rejected design, no longer mounted
// on the homepage. Kept for reference only.

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { buildLegs, poseAtScroll, type Leg } from "./choreo";
import { overlaySheets as S } from "./asset";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * Viewport-fixed trekker (Cloud View-style cross-section character).
 *
 * The figure walks on a persistent foreground ground strip at the bottom of
 * the viewport while the page scrolls behind it — it never stands on the
 * photos, whose perspectives don't form one continuous ground. Each homepage
 * section is one leg: walk across, stop, turn, walk back. Walking frames
 * advance with the figure's actual x travel over that static ground, so the
 * feet don't slide. Text, links and buttons are stacked above the figure
 * (globals.css), so it passes behind copy instead of covering it.
 */

// x (fraction of viewport width) reached at the end of each section, in DOM
// order: hero, 4 journey scenes, treks, tours, about, stories, plan.
const TARGETS = [0.26, 0.8, 0.22, 0.78, 0.3, 0.8, 0.2, 0.76, 0.3, 0.62];
const START = 0.72;
const SCALES = [1, 0.94, 1.04, 0.96, 1.02, 0.95];
const PAUSE = 0.18; // fraction of each leg spent standing + turning
const SMOOTH = 0.18; // per-frame catch-up toward the real scroll position

export function TrekkerOverlay() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const fig = el.querySelector<HTMLElement>(".to-fig")!;
      const walk = { 1: el.querySelector<HTMLElement>('[data-sheet="walkR"]')!, [-1]: el.querySelector<HTMLElement>('[data-sheet="walkL"]')! };
      const footer = document.querySelector("footer");
      let legs: Leg[] = [];
      let height = 0;
      let feetY = 0;

      const layout = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const mobile = vw < 768;
        height = vh * (mobile ? 0.22 : vw < 1024 ? 0.3 : 0.36); // phone / tablet / desktop
        const ground = mobile ? 44 : 64;
        el.style.setProperty("--ground", `${ground}px`);
        feetY = vh - ground * 0.55;
        const sections = [...document.querySelectorAll<HTMLElement>("main section")];
        const starts = sections.map((s, i) => (i === 0 ? 0 : Math.max(0, s.getBoundingClientRect().top + window.scrollY - vh * 0.5)));
        const end = footer ? footer.getBoundingClientRect().top + window.scrollY - vh : ScrollTrigger.maxScroll(window);
        // Keep the figure inside the frame on narrow screens.
        const targets = TARGETS.map((t) => (mobile ? 0.2 + (t - 0.2) * 0.9 : t));
        legs = buildLegs(starts, end, targets, START, vw, SCALES);
      };

      let target = window.scrollY;
      let current = target;
      let lastX: number | null = null;
      let phase = 0;
      let state = "";

      const tick = () => {
        current += (target - current) * SMOOTH;
        if (Math.abs(target - current) < 0.5) current = target;
        const pose = poseAtScroll(legs, current, PAUSE);
        if (!pose) return;

        const k = (height * pose.scale) / S.frameHeight;
        fig.style.transform = `translate3d(${pose.x - (S.frameWidth * k) / 2}px, ${feetY - S.frameHeight * k}px, 0) scale(${k})`;

        if (pose.moving && lastX !== null) {
          // One cycle covers cycleMetres; the frame is frameMetres tall.
          const stridePx = (S.cycleMetres * S.frameHeight * k) / S.frameMetres;
          phase += Math.abs(pose.x - lastX) / stridePx;
          const frame = Math.floor((phase - Math.floor(phase)) * S.walkFrames);
          walk[pose.dir].style.backgroundPosition = `${(frame / (S.walkFrames - 1)) * 100}% 0`;
        }
        lastX = pose.x;

        const next = `${pose.moving ? "walk" : "rest"}${pose.dir > 0 ? "R" : "L"}`;
        if (next !== state) fig.dataset.state = state = next;

        // At the end the ground rides up on the footer's top edge.
        const lift = footer ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top) : 0;
        el.style.transform = lift ? `translate3d(0, ${-lift}px, 0)` : "";
      };

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        layout();
        ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => (target = self.scroll()) });
        const onRefresh = () => {
          layout();
          lastX = null;
        };
        ScrollTrigger.addEventListener("refresh", onRefresh);
        gsap.ticker.add(tick);
        el.style.visibility = "visible";
        return () => {
          gsap.ticker.remove(tick);
          ScrollTrigger.removeEventListener("refresh", onRefresh);
        };
      });
    },
    { scope: root },
  );

  const sheet = (src: string, frames: number) => ({ backgroundImage: `url(${src})`, backgroundSize: `${frames * 100}% 100%` });

  return (
    // Decorative and click-through. Hidden for reduced motion (never made visible).
    <div ref={root} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[38] overflow-hidden">
      {/* Ground: back band (behind the figure). */}
      <svg className="absolute inset-x-0 bottom-0 h-[var(--ground)] w-full" viewBox="0 0 1000 64" preserveAspectRatio="none">
        <defs>
          <linearGradient id="to-earth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b4a35" />
            <stop offset="0.45" stopColor="#24342a" />
            <stop offset="1" stopColor="#0f1d17" />
          </linearGradient>
        </defs>
        <path
          d="M0 22 C60 18 110 26 170 21 S300 14 360 20 S470 27 540 21 S660 15 730 20 S850 26 910 20 S980 17 1000 21 L1000 64 L0 64 Z"
          fill="url(#to-earth)"
        />
      </svg>

      <div className="to-fig absolute top-0 left-0 origin-top-left will-change-transform" style={{ width: S.frameWidth, height: S.frameHeight }}>
        <span
          className="absolute left-1/2 h-[16px] w-[130px] -translate-x-1/2"
          style={{ top: S.frameHeight - 8, background: "radial-gradient(closest-side, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.2) 60%, transparent)" }}
        />
        <span data-sheet="walkR" className="to-sheet" style={sheet(S.walkRight, S.walkFrames)} />
        <span data-sheet="walkL" className="to-sheet" style={sheet(S.walkLeft, S.walkFrames)} />
        <span data-sheet="restR" className="to-sheet to-idle" style={sheet(S.restRight, S.restFrames)} />
        <span data-sheet="restL" className="to-sheet to-idle" style={sheet(S.restLeft, S.restFrames)} />
      </div>

      {/* Ground: front grass lip, in front of the boots for believable contact. */}
      <svg className="absolute inset-x-0 bottom-0 h-[calc(var(--ground)*0.5)] w-full" viewBox="0 0 1000 32" preserveAspectRatio="none">
        <path
          d="M0 10 L14 4 L22 9 L35 2 L44 9 L60 5 L75 10 L90 3 L101 9 L120 6 L140 10 L152 3 L163 9 L185 5 L200 10 L215 4 L228 9 L250 6 L270 10 L282 2 L294 9 L315 5 L335 10 L350 4 L362 9 L385 6 L405 10 L418 3 L430 9 L452 5 L470 10 L485 4 L497 9 L520 6 L540 10 L553 2 L565 9 L588 5 L605 10 L620 4 L632 9 L655 6 L675 10 L688 3 L700 9 L722 5 L740 10 L755 4 L767 9 L790 6 L810 10 L823 2 L835 9 L858 5 L875 10 L890 4 L902 9 L925 6 L945 10 L958 3 L970 9 L990 5 L1000 8 L1000 32 L0 32 Z"
          fill="#14261e"
          opacity="0.92"
        />
      </svg>

      <p className="absolute right-3 bottom-1 text-[9px] tracking-widest text-cloud-100/60 uppercase">Placeholder character</p>

      <style>{`
        .to-sheet { position: absolute; inset: 0; background-repeat: no-repeat; opacity: 0; }
        .to-idle { animation: to-idle ${S.restLoopSeconds}s steps(${S.restFrames}, jump-none) infinite; }
        @keyframes to-idle { from { background-position: 0% 0; } to { background-position: 100% 0; } }
        /* Reduced motion: figure never shown, so don't download its sheets. */
        @media (prefers-reduced-motion: reduce) { .to-sheet { background-image: none !important; } }
        .to-fig[data-state="walkR"] [data-sheet="walkR"],
        .to-fig[data-state="walkL"] [data-sheet="walkL"],
        .to-fig[data-state="restR"] [data-sheet="restR"],
        .to-fig[data-state="restL"] [data-sheet="restL"] { opacity: 1; }
      `}</style>
    </div>
  );
}
