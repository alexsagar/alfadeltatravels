// Destination page body, shared by the public route and the dev-only draft
// preview (app/(site)/preview/destination/page.dev.tsx).
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { Gallery, TrekCard } from "@/components/trek/TrekBlocks";
import { SectionHeading } from "@/components/ui/editorial";
import { RichText } from "@/components/ui/RichText";
import Link from "next/link";
import type { Photo } from "@/content/photos";
import type { Destination, Trek } from "@/content/types";

export function DestinationView({ d, treks }: { d: Destination<Photo>; treks: Trek<Photo>[] }) {
  return (
    <>
      <PageHero
        photo={d.photo}
        crumbs={[
          { label: "Destinations", href: "/destinations" },
          { label: d.title, href: `/destinations/${d.slug}` },
        ]}
        eyebrow={d.kind === "region" ? "Trekking region" : "Destination"}
        title={d.title}
        intro={d.summary}
        strongScrim={d.photo.src.height > d.photo.src.width}
      />
      <section aria-labelledby="about-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="Geography & culture" id="about-title" title={`About ${d.title}`} />
            <div className="reveal mt-10">
              <RichText nested value={d.body ?? []} />
            </div>
            {d.sources && d.sources.length > 0 && (
              <div className="mt-14 border-t border-ink-900/15 pt-6">
                <h3 className="eyebrow text-[11px] text-ink-500">Sources</h3>
                <ul className="mt-3 space-y-1 text-sm">
                  {d.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} rel="noopener" className="text-ink-700 underline decoration-ink-500/40 underline-offset-4 hover:decoration-brand-500">
                        {s.label}
                      </a>
                      {s.publisher && <span className="text-ink-500"> · {s.publisher}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="reveal space-y-10 lg:pt-24">
            {d.thingsToDo && d.thingsToDo.length > 0 && (
              <div>
                <h3 className="eyebrow text-[11px] text-ink-500">Things to do</h3>
                <ul className="mt-3 space-y-2 text-ink-700">
                  {d.thingsToDo.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
            {d.nearby && d.nearby.length > 0 && (
              <div>
                <h3 className="eyebrow text-[11px] text-ink-500">Nearby</h3>
                <ul className="mt-3 space-y-2">
                  {d.nearby.map((n) => (
                    <li key={n.slug}>
                      <Link href={`/destinations/${n.slug}`} className="text-ink-700 underline decoration-brand-500/60 underline-offset-4 hover:decoration-brand-500">
                        {n.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {d.bestTime && (
              <div>
                <h3 className="eyebrow text-[11px] text-ink-500">Best time to visit</h3>
                <p className="mt-3 leading-relaxed text-ink-700">{d.bestTime}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {treks.length > 0 && (
        <section aria-labelledby="treks-title" className="bg-night-950 py-24 text-cloud-50 md:py-36">
          <div className="container-x">
            <SectionHeading light eyebrow="Treks" id="treks-title" title={`Walking in ${d.title}`} />
            {/* Layout follows the real number of treks: one wide feature card,
                a balanced pair, or the three-column grid. */}
            <ul className={`mt-16 grid gap-x-8 gap-y-14 ${treks.length === 1 ? "" : treks.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {treks.map((t, i) => (
                <li key={t.slug} className="reveal">
                  <TrekCard
                    light
                    feature={treks.length === 1}
                    index={i}
                    trek={t}
                    ratio={treks.length === 1 ? "aspect-[16/9]" : "aspect-[3/2]"}
                    sizes={treks.length === 1 ? "(min-width: 768px) 60vw, 100vw" : treks.length === 2 ? "(min-width: 768px) 45vw, 100vw" : "(min-width: 768px) 30vw, 100vw"}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {d.gallery && d.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="bg-cloud-50 py-24 md:py-36">
          <div className="container-x">
            <SectionHeading eyebrow="Gallery" id="gallery-title" title={`${d.title} in pictures`} />
            <div className="mt-14">
              <Gallery items={d.gallery} />
            </div>
          </div>
        </section>
      )}
      <div className="bg-cloud-100 pt-24 md:pt-32">
        {/* This destination's own photo only: gallery, then hero, else text-only. */}
        <CtaBand photo={d.gallery?.[0] ?? d.photo} title={`Plan a journey to ${d.title}`} text="Tell us what draws you here and how long you have." />
      </div>
    </>
  );
}
