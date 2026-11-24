"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { photos } from "@/content/photos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-reveal", { y: 40, autoAlpha: 0, duration: 1.4, ease: "expo.out", stagger: 0.12, delay: 0.15 });
        gsap.fromTo(".hero-photo", { scale: 1.08 }, { scale: 1, duration: 2.4, ease: "power2.out" });
        gsap.to(".hero-photo", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-night-950">
      <div className="hero-photo absolute inset-0">
        <Image
          src={photos.hero.src}
          alt={photos.hero.alt}
          fill
          preload
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-[50%_30%]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-night-950/55 via-night-950/10 to-night-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-night-950/60 via-night-950/15 via-50% to-transparent" />

      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-[22svh] text-cloud-50">
        <p className="hero-reveal eyebrow mb-6 text-brand-300">Himalayan journeys · Nepal</p>
        <h1 id="hero-title" className="hero-reveal max-w-4xl font-display text-display-xl font-medium">
          Walk the roof <em>of the world</em>
        </h1>
        <p className="hero-reveal mt-8 max-w-md text-base leading-relaxed text-cloud-100/85">
          Treks and journeys through Nepal&rsquo;s high valleys, villages and ridgelines.
        </p>
      </div>

      <p className="absolute bottom-5 left-5 z-10 text-xs sm:left-8 lg:left-14 tracking-wide text-cloud-100/60 sm:right-8">
        Pictured: {photos.hero.location}
      </p>
    </section>
  );
}
