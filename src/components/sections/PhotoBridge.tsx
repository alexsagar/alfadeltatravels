"use client";

// Photographic bridge between two sections (Milestone 5.1, Tours → Destinations).
// A framed photo sits on the outgoing section's colour; as it scrolls up it
// opens to full bleed (clip-path, scrubbed) while the image eases back from a
// slight zoom. The photo is CSS-sticky, so the next section — pulled up with a
// negative margin — slides over it as a clean panel. No pinning, no gradients.
// Reduced motion: no sticky, no clip; the photo is a plain full-width band.

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Photo } from "@/content/photos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CLOSED = { wide: "inset(14% 14% 14% 14% round 6px)", narrow: "inset(16% 7% 16% 7% round 6px)" };
const OPEN = "inset(0% 0% 0% 0% round 0px)";

export function PhotoBridge({ photo, className = "" }: { photo: Photo; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { wide: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", narrow: "(max-width: 767px) and (prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const closed = ctx.conditions?.narrow ? CLOSED.narrow : CLOSED.wide;
          // Opens while the frame travels from the lower viewport to the top,
          // i.e. fully open exactly when it becomes sticky.
          const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top 85%", end: "top top", scrub: 0.6 } });
          tl.fromTo(".pb-frame", { clipPath: closed }, { clipPath: OPEN }, 0);
          tl.fromTo(".pb-img", { scale: 1.18 }, { scale: 1 }, 0);
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className={`relative h-[160svh] motion-reduce:h-auto ${className}`}>
      <div
        className="pb-frame sticky top-0 h-[100svh] overflow-hidden motion-reduce:static motion-reduce:h-[70svh] motion-reduce:[clip-path:none]!"
        style={{ clipPath: CLOSED.wide }}
      >
        <Image src={photo.src} alt="" fill sizes="100vw" placeholder="blur" className="pb-img object-cover will-change-transform max-md:object-[26%_62%]" />
      </div>
    </div>
  );
}
