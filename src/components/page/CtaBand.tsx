import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/content/photos";
import { planHref } from "@/content/site";

/**
 * Closing "Plan your journey" band for internal pages. The photo opens from a
 * centred window as it enters (data-fx="window"), echoing the homepage About
 * reveal at a smaller scale; copy sits on a solid forest panel, not on the photo.
 * Without a photo it renders as a text-only panel — callers pass only a photo
 * of the place the band is about, never a stand-in from elsewhere.
 */
/** `dark`: follows a dark section directly (the band continues it instead of opening a light gap). */
export function CtaBand({ photo, title, text, query, dark }: { photo?: Photo; title: string; text: string; query?: string; dark?: boolean }) {
  return (
    <section data-page-cta aria-labelledby="cta-title" className={dark ? "bg-night-950 pb-24 md:pb-32" : "bg-cloud-100 pb-24 md:pb-32"}>
      <div className={`container-x grid overflow-hidden text-cloud-50 ${dark ? "bg-night-800" : "bg-night-950"} ${photo ? "md:grid-cols-[1.1fr_1fr]" : ""}`}>
        {photo && (
          <div data-fx="window" className="relative min-h-72 md:min-h-[520px]">
            <Image data-fx-img src={photo.src} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" placeholder="blur" className="object-cover will-change-transform" />
          </div>
        )}
        <div className={`flex flex-col justify-center px-6 py-14 sm:px-10 md:px-14 ${photo ? "" : "md:items-center md:py-24 md:text-center"}`}>
          <p className="eyebrow mb-5 text-brand-300">Plan your journey</p>
          <h2 id="cta-title" className="font-display text-display-md font-medium">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-cloud-100/80">{text}</p>
          <div className="mt-10">
            <Link href={query ? `${planHref}?interest=${encodeURIComponent(query)}` : planHref} className="btn-primary">
              Start planning
            </Link>
          </div>
          {photo && <p className="mt-8 text-xs text-cloud-100/70">Pictured: {photo.location}</p>}
        </div>
      </div>
    </section>
  );
}
