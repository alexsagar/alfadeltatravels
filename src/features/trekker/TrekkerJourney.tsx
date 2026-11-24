"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { coverPoint, cumulativeLengths, poseAtY, sortAnchors, type Anchor, type Gait } from "./path";
import { trekkerAsset } from "./asset";
import { TrekkerFigure } from "./TrekkerFigure";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Where the trekker sits in the viewport while travelling (0 = top, 1 = bottom).
const VIEWPORT_FOCUS = 0.62;
// On-screen path length (px, at scale 1) of one full stride cycle. Comes from
// the asset so the stride matches the rendered legs; 140 for the placeholder.
const STRIDE_PX = trekkerAsset?.cyclePx ?? 140;

/**
 * Wraps the homepage sections the trekker travels through. Sections mark
 * ground-contact points with `<TrekAnchor />`; this component measures them,
 * builds a route and moves one persistent trekker along it as the user scrolls.
 *
 * Occlusion: anything with `data-trek-foreground` (z-30) renders above the
 * trekker layer (z-20), so ridgelines/rocks can pass in front of it.
 */
export function TrekkerJourney({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const trekker = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = trekker.current!;
      const container = root.current!;
      let anchors: Anchor[] = [];
      let lengths: number[] = [];

      const measure = () => {
        const box = container.getBoundingClientRect();
        anchors = sortAnchors(
          // Anchors hidden at this breakpoint (display:none) are skipped, so
          // routes can be authored per breakpoint via `className`.
          [...container.querySelectorAll<HTMLElement>("[data-trek-anchor]")]
            .filter((n) => n.offsetParent)
            .map((n) => ({
              ...anchorPoint(n, box),
              scale: Number(n.dataset.scale ?? 1),
              gait: (n.dataset.gait ?? "walk") as Gait,
              light: Number(n.dataset.light ?? 1),
              opacity: Number(n.dataset.opacity ?? 1),
            })),
        );
        lengths = cumulativeLengths(anchors);
      };

      const setX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const setY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      // quickTo needs individual properties; "scale" is a shorthand.
      const setScaleX = gsap.quickTo(el, "scaleX", { duration: 0.6, ease: "power2.out" });
      const setScaleY = gsap.quickTo(el, "scaleY", { duration: 0.6, ease: "power2.out" });

      // Gait phase advances by distance travelled divided by the stride at the
      // current scale (a smaller, further figure takes shorter on-screen steps).
      // Scroll stops -> stride stops; scroll back -> the cycle runs backwards.
      let phase = 0;
      let lastDistance: number | null = null;

      const update = () => {
        const box = container.getBoundingClientRect();
        const pose = poseAtY(anchors, lengths, window.innerHeight * VIEWPORT_FOCUS - box.top);
        if (!pose) return;
        setX(pose.x);
        setY(pose.y);
        setScaleX(pose.scale);
        setScaleY(pose.scale);
        if (lastDistance !== null) phase += (pose.distance - lastDistance) / (STRIDE_PX * pose.scale);
        lastDistance = pose.distance;
        el.dataset.gait = pose.gait;
        el.style.setProperty("--facing", String(pose.facing));
        el.style.setProperty("--light", pose.light.toFixed(3));
        el.style.setProperty("--fade", pose.opacity.toFixed(3));
        el.style.setProperty("--cycle", String(phase - Math.floor(phase)));
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        measure();
        ScrollTrigger.create({
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          onUpdate: update,
          onRefresh: () => {
            measure();
            lastDistance = null;
            update();
          },
        });
        gsap.set(el, { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    // overflow-x-clip: a figure near the right edge must never widen the page.
    <div ref={root} className="relative overflow-x-clip">
      {children}
      {/* Decorative: the journey is conveyed by section content, not this figure. */}
      <div
        ref={trekker}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 z-20 origin-bottom opacity-0 will-change-transform"
      >
        <TrekkerFigure />
      </div>
    </div>
  );
}

/**
 * Anchor position relative to the journey container. Photo-space anchors
 * (`data-u/v`) are resolved through the enclosing `[data-photo-frame]`'s
 * object-fit: cover geometry; others use their CSS position.
 */
function anchorPoint(n: HTMLElement, box: DOMRect) {
  const frame = n.dataset.u ? n.closest<HTMLElement>("[data-photo-frame]") : null;
  if (frame) {
    const r = frame.getBoundingClientRect();
    const f = frame.dataset;
    const p = coverPoint(
      r.width, r.height,
      Number(f.iw), Number(f.ih), Number(f.fx), Number(f.fy),
      Number(n.dataset.u), Number(n.dataset.v),
    );
    return { x: r.left - box.left + p.x, y: r.top - box.top + p.y };
  }
  const r = n.getBoundingClientRect();
  return { x: r.left - box.left, y: r.top - box.top };
}

/**
 * Ground-contact marker. Either `u`/`v` (fractions of the scene photo — use
 * inside a SceneBand) or CSS `x`/`y` inside the nearest positioned parent.
 */
export function TrekAnchor({
  x,
  y,
  u,
  v,
  scale = 1,
  gait = "walk",
  light = 1,
  opacity = 1,
  className = "",
}: {
  x?: string;
  y?: string;
  u?: number;
  v?: number;
  scale?: number;
  gait?: Gait;
  light?: number; // brightness multiplier for this scene's exposure
  opacity?: number; // 0 fades the figure out (scene transitions)
  className?: string; // e.g. "hidden md:block" for a desktop-only anchor
}) {
  return (
    <span
      aria-hidden
      data-trek-anchor
      data-u={u}
      data-v={v}
      data-scale={scale}
      data-gait={gait}
      data-light={light}
      data-opacity={opacity}
      className={`pointer-events-none absolute size-0 ${className}`}
      style={x !== undefined ? { left: x, top: y } : undefined}
    />
  );
}
