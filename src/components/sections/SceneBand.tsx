"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Photo } from "@/content/photos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Full-bleed photographic scene the trekker walks through. Copy sits top-left;
 * `TrekAnchor`s (children) are authored in photo space (u/v) and resolved
 * through `data-photo-frame`, so feet stay on the same trail or rock at every
 * viewport size. The photo deliberately has no parallax: moving the terrain
 * under a grounded figure would make its feet slide.
 */
export function SceneBand({
  photo,
  index,
  eyebrow,
  title,
  children,
  focus = [0.5, 0.5],
  preload = false,
}: {
  photo: Photo;
  index: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
  focus?: [number, number]; // object-position as fractions; also used by anchor maths
  preload?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const id = `scene-${index}`;

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".scene-reveal", {
          y: 32,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby={id} className="relative h-[115svh] min-h-[680px] overflow-hidden bg-night-950">
      <div className="absolute inset-0">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          placeholder="blur"
          preload={preload}
          className="object-cover"
          style={{ objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%` }}
        />
      </div>
      {/* Atmospheric blend: scenes dissolve through dark haze into each other. */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-950 from-4% via-night-950/10 via-35% to-transparent" />

      <div className="container-x relative z-10 pt-[18svh] text-cloud-50">
        <div className="max-w-[62%] sm:max-w-md">
          <p className="scene-reveal eyebrow mb-5 text-brand-300">
            {index} · {eyebrow}
          </p>
          <h2 id={id} className="scene-reveal font-display text-display-md font-medium">
            {title}
          </h2>
        </div>
      </div>

      <div
        data-photo-frame
        data-iw={photo.src.width}
        data-ih={photo.src.height}
        data-fx={focus[0]}
        data-fy={focus[1]}
        className="pointer-events-none absolute inset-0"
      >
        {children}
      </div>

      {/* Foreground mist: passes in front of the trekker (occlusion layer). */}
      <div
        aria-hidden
        data-trek-foreground
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[11%] bg-gradient-to-t from-night-950 to-transparent"
      />
    </section>
  );
}
