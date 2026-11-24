import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { ArrowLink, SectionHeading } from "@/components/ui/editorial";
import { photos } from "@/content/photos";
import { getDestinations, getTreks } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Destinations in Nepal — Himalayan regions, cities & national parks",
  description:
    "The Annapurna, Khumbu and Langtang trekking regions, and the Kathmandu Valley, Pokhara, Chitwan and Lumbini: what each place is like and how it fits a journey through Nepal.",
  path: "/destinations",
  image: photos.panorama.src,
});

export default async function DestinationsPage() {
  const [destinations, treks] = await Promise.all([getDestinations(), getTreks()]);
  const regions = destinations.filter((d) => d.kind === "region");
  const places = destinations.filter((d) => d.kind === "place");
  return (
    <>
      <PageHero
        photo={photos.panorama}
        crumbs={[{ label: "Destinations", href: "/destinations" }]}
        eyebrow="Destinations"
        title={
          <>
            From the high Himalaya <em>to the jungle lowlands</em>
          </>
        }
        intro="Nepal rises from subtropical plains to the highest peaks on earth in a little over a hundred and fifty kilometres. These are the places our journeys are built around."
        position="object-[45%_50%]"
      />

      {/* Himalayan regions — large alternating rows with in-page anchors */}
      <section aria-labelledby="regions-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow="Himalayan regions" id="regions-title" title="Where the trails are" />
          <div className="mt-20 space-y-24 md:space-y-36">
            {regions.map((r, i) => {
              const p = r.photo;
              return (
                <article key={r.slug} id={r.slug} aria-labelledby={`${r.slug}-title`} className="grid scroll-mt-24 items-center gap-10 md:grid-cols-12 md:gap-14">
                  <figure className={`md:col-span-7 ${i % 2 ? "md:order-2 md:col-start-6" : ""}`}>
                    <div data-fx="window" className="relative aspect-[4/3] overflow-hidden bg-night-900">
                      <Image data-fx-img src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 58vw, 100vw" placeholder="blur" className="object-cover will-change-transform" />
                    </div>
                  </figure>
                  <div className={`reveal md:col-span-5 ${i % 2 ? "md:order-1" : ""}`}>
                    <p className="eyebrow text-brand-500">Region</p>
                    <h3 id={`${r.slug}-title`} className="mt-3 font-display text-display-md">
                      {r.title}
                    </h3>
                    <p className="mt-5 max-w-md leading-relaxed text-ink-700">{r.summary}</p>
                    {r.body && (
                      <p className="mt-5">
                        <ArrowLink href={`/destinations/${r.slug}`}>More about {r.title}</ArrowLink>
                      </p>
                    )}
                    {r.treks && (
                      <ul className="mt-8 space-y-2 border-t border-ink-900/10 pt-5 text-sm">
                        {r.treks.map((slug) => {
                          const t = treks.find((x) => x.slug === slug);
                          if (!t) return null;
                          return (
                            <li key={slug} className="flex items-baseline justify-between gap-4">
                              {t.guide ? (
                                <Link href={`/treks/${slug}`} className="underline decoration-brand-500/60 underline-offset-4 hover:decoration-brand-500">
                                  {t.title}
                                </Link>
                              ) : (
                                <span>{t.title}</span>
                              )}
                              {t.guide && <span className="text-xs text-ink-500">Route guide</span>}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cities & lowlands — quieter grid on forest */}
      <section aria-labelledby="places-title" className="bg-night-950 py-24 text-cloud-50 md:py-36">
        <div className="container-x">
          <SectionHeading light eyebrow="Cities, lakes & lowlands" id="places-title" title="Beyond the mountains" />
          <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {places.map((d, i) => {
              const p = d.photo;
              return (
                <li key={d.slug} id={d.slug} className={`reveal scroll-mt-24 ${i % 2 ? "lg:mt-16" : ""}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-night-900">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" placeholder="blur" className="object-cover" />
                  </div>
                  <h3 className="mt-5 font-display text-3xl">
                    {d.body ? (
                      <Link href={`/destinations/${d.slug}`} className="hover:text-brand-300">
                        {d.title}
                      </Link>
                    ) : (
                      d.title
                    )}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cloud-100/75">{d.summary}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-16 text-sm text-cloud-100/70">
            What to do in these places:{" "}
            <Link href="/experiences" className="text-cloud-50 underline decoration-brand-300/60 underline-offset-4 hover:decoration-brand-300">
              Experiences in Nepal
            </Link>
            {" · "}
            <Link href="/tours" className="text-cloud-50 underline decoration-brand-300/60 underline-offset-4 hover:decoration-brand-300">
              Tours
            </Link>
          </p>
        </div>
      </section>

      <div className="bg-cloud-100 pt-24 md:pt-32">
        <CtaBand photo={photos.pokhara} title="Combine mountains, lakes and jungle" text="Tell us what draws you to Nepal and how long you have, and we will suggest a route that links the places you want to see." />
      </div>
    </>
  );
}
