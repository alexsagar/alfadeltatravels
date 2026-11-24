"use client";

// Section transitions for the homepage content (Milestone 5.1 Stage B).
// Sections stay server components and opt in with data attributes; this one
// client component wires every effect to ScrollTrigger (scrubbed, so forward,
// reverse and fast scrolling all land on the same frame). Only transforms and
// clip-path are animated. matchMedia reverts everything on breakpoint /
// reduced-motion change and on unmount.
//
//   data-fx="panel"     section enters as an inset, rounded panel that widens to full bleed
//   data-fx="parallax"  wrapper; its [data-fx-img] drifts against the scroll
//   data-fx="window"    image opens from a centred window, with parallax
//   data-fx="rule"      hairline draws across (quiet boundary)
//   data-fx="curtain"   closing CTA: photo settles, copy rises as the section above lifts away
//   (PhotoBridge and the cinematic opening have their own timelines.)

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollFx() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ narrow: "(max-width: 767px) and (prefers-reduced-motion: no-preference)", wide: "(min-width: 768px) and (prefers-reduced-motion: no-preference)" }, (ctx) => {
      const narrow = !!ctx.conditions?.narrow;
      // Visible elements only: Next keeps recently visited pages mounted but
      // hidden (display: none), and each page's own ScrollFx wires its elements.
      const all = (s: string) => gsap.utils.toArray<HTMLElement>(s).filter((el) => el.checkVisibility());
      const scrub = { scrub: 0.6 };

      for (const el of all('[data-fx="panel"]')) {
        gsap.fromTo(
          el,
          { clipPath: narrow ? "inset(0% 3% 0% 3% round 14px 14px 0px 0px)" : "inset(0% 4% 0% 4% round 22px 22px 0px 0px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", ...scrub } },
        );
      }

      for (const el of all('[data-fx="parallax"]')) {
        const img = el.querySelector("[data-fx-img]");
        gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, { yPercent: 7, scale: 1.16, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", ...scrub } });
      }

      for (const el of all('[data-fx="window"]')) {
        const img = el.querySelector("[data-fx-img]");
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top 90%", end: "top 20%", ...scrub } });
        tl.fromTo(el, { clipPath: narrow ? "inset(14% 16% 14% 16% round 6px)" : "inset(22% 30% 22% 30% round 6px)" }, { clipPath: "inset(0% 0% 0% 0% round 6px)" }, 0);
        tl.fromTo(img, { scale: 1.35, yPercent: -6 }, { scale: 1.1, yPercent: 0 }, 0);
        // Keeps drifting gently after it has opened.
        gsap.fromTo(img, { yPercent: 0 }, { yPercent: 6, ease: "none", immediateRender: false, scrollTrigger: { trigger: el, start: "top 20%", end: "bottom top", ...scrub } });
      }

      for (const el of all('[data-fx="rule"]')) {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 55%", ...scrub } });
      }

      for (const el of all('[data-fx="curtain"]')) {
        // Wrapper top sits 70svh above the end of the section it slides under.
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top 30%", end: "top -70%", ...scrub } });
        tl.fromTo(el.querySelector("[data-fx-img]"), { scale: 1.22, yPercent: 6 }, { scale: 1.04, yPercent: 0, duration: 1 }, 0);
        // Copy waits until Stories' lower edge has cleared the top third of the
        // screen (progress .7 of 1), so the lifting section never slices the heading.
        tl.fromTo(el.querySelectorAll("[data-fx-copy] > *"), { y: 48, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.18 }, 0.7);
      }
    });
  });
  return null;
}
