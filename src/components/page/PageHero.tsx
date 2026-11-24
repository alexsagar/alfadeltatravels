import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/content/photos";
import { ScrollFx } from "@/components/sections/ScrollFx";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Internal-page hero: full-bleed photograph with slow parallax (data-fx),
 * breadcrumbs, eyebrow, oversized H1 and a short intro. The photo is the
 * LCP element, so it is preloaded; the parallax wrapper is oversized so its
 * drift never reveals an edge.
 */
export function PageHero({
  photo,
  eyebrow,
  title,
  intro,
  crumbs,
  position = "object-center",
  strongScrim,
  children,
}: {
  photo: Photo;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: Crumb[];
  position?: string;
  /** Extra shade for busy photos (e.g. portrait shots cropped to landscape), strongest on mobile where copy spans the full width. */
  strongScrim?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="relative flex min-h-[640px] items-end overflow-hidden bg-night-950 pt-32 pb-16 text-cloud-50 md:h-[88svh] md:pb-20">
      <div data-fx="parallax" className="absolute inset-0">
        <Image data-fx-img src={photo.src} alt={photo.alt} fill preload sizes="100vw" placeholder="blur" className={`object-cover will-change-transform ${position}`} />
      </div>
      {/* Top band keeps header + breadcrumbs legible on snow; lower band carries the copy. */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-950/70 via-night-950/15 via-30% to-night-950/90" />
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-night-950/45 to-transparent to-70%" />
      {strongScrim && <div className="absolute inset-0 bg-night-950/40 md:bg-night-950/20" />}
      <div className="container-x relative [text-shadow:0_1px_12px_rgb(10_15_22/0.55)]">
        <Breadcrumbs items={crumbs} />
        <p className="hero-rise eyebrow mt-10 mb-5 text-brand-300">{eyebrow}</p>
        <h1 className="hero-rise max-w-5xl font-display text-display-xl font-medium [text-shadow:0_2px_30px_rgb(10_15_22/0.45)]">{title}</h1>
        {intro && <p className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-cloud-50">{intro}</p>}
        {children}
        <p className="mt-8 text-xs text-cloud-100/85">Pictured: {photo.location}</p>
      </div>
      {/* Mounted with the page, not the (site) layout: the page segment
          hydrates after the layout, and GSAP must not style its data-fx
          elements before React has hydrated them. Remounting per page also
          re-wires the effects after client-side navigation. */}
      <ScrollFx />
    </section>
  );
}
