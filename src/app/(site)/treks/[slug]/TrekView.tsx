// Trek page body, shared by the public route and the dev-only draft preview
// (app/(site)/preview/trek/page.dev.tsx).
import Image from "next/image";
import { CtaBand } from "@/components/page/CtaBand";
import { JsonLd } from "@/components/page/JsonLd";
import { OfferingBlock } from "@/components/page/OfferingBlock";
import { PageHero } from "@/components/page/PageHero";
import { SectionNav } from "@/components/page/SectionNav";
import {
  ElevationProfile,
  Faqs,
  Gallery,
  RouteStops,
  SeasonGrid,
  TrekCard,
} from "@/components/trek/TrekBlocks";
import { ArrowLink, SectionHeading } from "@/components/ui/editorial";
import { photos } from "@/content/photos";
import { absoluteUrl } from "@/lib/seo";
import type { Photo } from "@/content/photos";
import type { Trek } from "@/content/types";

export function TrekView({
  trek,
  region,
  related,
}: {
  trek: Trek<Photo> & { guide: NonNullable<Trek<Photo>["guide"]> };
  region: { slug: string; title: string };
  related: Trek<Photo>[];
}) {
  const g = trek.guide;
  const path = `/treks/${trek.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: trek.title,
          description: trek.summary,
          url: absoluteUrl(path),
          about: { "@type": "Place", name: `${region.title}, Nepal` },
          primaryImageOfPage: absoluteUrl(g.hero.src.src),
        }}
      />
      <PageHero
        photo={g.hero}
        crumbs={[
          { label: "Treks", href: "/treks" },
          { label: trek.title, href: path },
        ]}
        eyebrow={`${region.title} region · General route guide`}
        title={trek.title}
        intro={g.intro}
        position="object-[50%_35%]"
      />
      <SectionNav
        label="On this page"
        items={[
          { id: "overview", label: "Overview" },
          { id: "route", label: "Route" },
          { id: "preparation", label: "Preparation" },
          { id: "seasons", label: "Seasons" },
          { id: "gallery", label: "Gallery" },
          { id: "faqs", label: "FAQs" },
        ].filter((i) =>
          i.id === "gallery"
            ? g.gallery.length > 0
            : i.id === "faqs"
              ? g.faqs.length > 0
              : true,
        )}
      />

      {/* Overview */}
      <section
        id="overview"
        aria-labelledby="overview-title"
        className="scroll-mt-32 bg-cloud-100 py-20 md:py-32"
      >
        <div className="container-x grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <div>
            {/* What this page is — and isn't. */}
            <p className="reveal mb-12 max-w-xl border-l-2 border-night-800 py-1 pl-4 text-sm leading-relaxed text-ink-700">
              <span className="eyebrow mr-2 text-[11px] text-night-800">
                About this guide
              </span>
              General information about the trek, compiled from the public
              sources listed at the end. It is not an Alfa Delta Travels
              itinerary; the company&rsquo;s own package has not been confirmed.
            </p>
            <SectionHeading
              eyebrow="Overview"
              id="overview-title"
              title="The trek at a glance"
            />
            <div className="reveal mt-10 space-y-6 text-lg leading-relaxed text-ink-700">
              {g.overview.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <dl className="reveal self-start border-t border-ink-900/15 lg:mt-24">
            {g.facts.map((f) => (
              <div
                key={f.label}
                className="grid grid-cols-[8rem_1fr] gap-4 border-b border-ink-900/15 py-4 sm:grid-cols-[10rem_1fr]"
              >
                <dt className="eyebrow pt-1 text-[11px] text-ink-500">
                  {f.label}
                </dt>
                <dd className="text-sm text-ink-900">
                  {f.value}
                  {f.note && (
                    <span className="mt-1 block text-xs text-ink-500">
                      {f.note}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Highlights — alternating editorial rows */}
      <section
        aria-labelledby="highlights-title"
        className="bg-night-950 py-24 text-cloud-50 md:py-36"
      >
        <div className="container-x">
          <SectionHeading
            light
            eyebrow="Route highlights"
            id="highlights-title"
            title="Along the way"
          />
          {/* Text-only highlights (no photos yet) sit in columns instead of leaving half the row empty. */}
          <ul className={g.highlights.some((h) => h.photo) ? "mt-16 space-y-20 md:space-y-28" : "mt-16 grid gap-14 md:grid-cols-3 md:gap-12"}>
            {g.highlights.map((h, i) => {
              const p = h.photo ?? null;
              return (
                <li
                  key={h.title}
                  className={p ? "grid items-center gap-8 md:grid-cols-12 md:gap-12" : undefined}
                >
                  {p && (
                    <figure
                      className={`md:col-span-7 ${i % 2 ? "md:order-2 md:col-start-6" : ""}`}
                    >
                      <div
                        data-fx="parallax"
                        className="relative aspect-[3/2] overflow-hidden bg-night-900"
                      >
                        <Image
                          data-fx-img
                          src={p.src}
                          alt={p.alt}
                          fill
                          sizes="(min-width: 768px) 55vw, 100vw"
                          placeholder="blur"
                          className="object-cover will-change-transform"
                        />
                      </div>
                      <figcaption className="mt-2 text-xs text-cloud-100/70">
                        Pictured: {p.location}
                      </figcaption>
                    </figure>
                  )}
                  <div
                    className={p ? `reveal md:col-span-5 ${i % 2 ? "md:order-1" : ""}` : "reveal"}
                  >
                    <p className="font-display text-5xl text-brand-300/80">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 font-display text-display-md">
                      {h.title}
                    </h3>
                    <p className="mt-5 max-w-md leading-relaxed text-cloud-100/80">
                      {h.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Route & itinerary */}
      <div className="bg-night-950">
        <section
          id="route"
          aria-labelledby="route-title"
          data-fx="panel"
          className="scroll-mt-32 bg-cloud-100 py-24 md:py-36"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="Route information · general, not a company itinerary"
              id="route-title"
              title={g.routeTitle}
            >
              {g.routeNote}
            </SectionHeading>
            <div className="reveal mt-14">
              <ElevationProfile stops={g.route} />
            </div>
            <div className="mt-14">
              <RouteStops stops={g.route} />
            </div>

            {/* Company package — kept apart from the general route above. */}
            <div className="mt-20">
              <OfferingBlock
                offering={trek.offering}
                title="Alfa Delta Travels itinerary"
                enquireHref={`/plan-your-journey?interest=${trek.slug}`}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Difficulty & preparation */}
      <section
        id="preparation"
        aria-labelledby="prep-title"
        className="scroll-mt-32 bg-cloud-50 py-24 md:py-36"
      >
        <div className="container-x grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <SectionHeading
            eyebrow="Difficulty & preparation"
            id="prep-title"
            title="A high-altitude walk"
          />
          <div className="md:pt-16">
            <ol className="grid gap-10 sm:grid-cols-3">
              {g.preparation.map((p, i) => (
                <li key={p.title} className="reveal">
                  <span className="font-display text-5xl text-brand-500/80">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">
                    {p.text}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-12 text-xs text-ink-500">
              General information, not medical advice.
            </p>
          </div>
        </div>
      </section>

      {/* Seasons */}
      <section
        id="seasons"
        aria-labelledby="seasons-title"
        className="scroll-mt-32 bg-cloud-100 py-24 md:py-36"
      >
        <div className="container-x">
          <SectionHeading
            eyebrow="Best time to visit"
            id="seasons-title"
            title={`Seasons in ${region.title}`}
          />
          <div className="mt-14">
            <SeasonGrid seasons={g.seasons} />
          </div>
        </div>
      </section>

      {/* Considerations */}
      <section
        aria-labelledby="consider-title"
        className="bg-cloud-100 pb-24 md:pb-36"
      >
        <div className="container-x">
          <div data-fx="rule" className="h-px origin-left bg-ink-500/30" />
          <div className="mt-16 grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
            <SectionHeading
              eyebrow="Before you go"
              id="consider-title"
              title="Important considerations"
            />
            <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2 md:pt-16">
              {g.considerations.map((c) => (
                <div key={c.title} className="reveal">
                  <dt className="font-display text-2xl">{c.title}</dt>
                  <dd className="mt-3 text-sm leading-relaxed text-ink-700">
                    {c.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Gallery — omitted rather than rendered empty. */}
      {g.gallery.length > 0 && (
        <section
          id="gallery"
          aria-labelledby="gallery-title"
          className="scroll-mt-32 bg-cloud-50 py-24 md:py-36"
        >
          <div className="container-x">
            <SectionHeading
              eyebrow="Gallery"
              id="gallery-title"
              title={`${region.title} in pictures`}
            />
            <div className="mt-14">
              <Gallery items={g.gallery} />
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section
        id="faqs"
        aria-labelledby="faq-title"
        className="scroll-mt-32 bg-cloud-100 py-24 md:py-36"
      >
        <div className="container-x grid gap-12 md:grid-cols-[1fr_1.8fr] md:gap-20">
          <SectionHeading
            eyebrow="Questions"
            id="faq-title"
            title="Frequently asked"
          />
          <div className="md:pt-16">
            <Faqs items={g.faqs} />
            <div className="mt-12">
              <p className="eyebrow text-[11px] text-ink-500">
                Sources &amp; further reading
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {g.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      className="text-ink-700 underline decoration-ink-500/40 underline-offset-4 hover:decoration-brand-500"
                      rel="noopener"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section
        aria-labelledby="related-title"
        className="bg-cloud-100 pt-8 pb-24 md:pb-36"
      >
        <div className="container-x mb-16">
          <div data-fx="rule" className="h-px origin-left bg-ink-500/30" />
        </div>
        <div className="container-x">
          <SectionHeading
            eyebrow="Related routes"
            id="related-title"
            title="Other classic treks"
          />
          {related.length > 0 && (
            <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {related.map((t) => (
                <li key={t.slug} className="reveal">
                  <TrekCard
                    trek={t}
                    ratio="aspect-[3/2]"
                    sizes="(min-width: 768px) 30vw, 100vw"
                  />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
            <ArrowLink href="/treks">All treks</ArrowLink>
            <ArrowLink href={`/destinations#${region.slug}`}>
              The {region.title} region
            </ArrowLink>
          </div>
        </div>
      </section>

      <CtaBand
        photo={photos.tengboche}
        title={`Planning the ${trek.title.replace(/ Trek$/, "")} trek?`}
        text="Note your dates, experience and preferred pace on the planning page. Nothing is booked or charged through this site."
        query={trek.slug}
      />
    </>
  );
}
