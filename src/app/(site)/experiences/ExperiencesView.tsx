import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { SectionNav } from "@/components/page/SectionNav";
import { SectionHeading } from "@/components/ui/editorial";
import { photos } from "@/content/photos";
import type { Destination, ExperienceCategory, Photo } from "@/content/types";

/**
 * Experiences catalogue view (Milestone 9; extracted in 9.3 so the dev draft
 * preview renders the same template). One page, no thin per-activity pages:
 * six categories with an editorial activity listing, then the places where
 * each activity genuinely happens (hand-set per activity in content/experiences.ts).
 * Place links point only at destinations that exist on the site (in-page
 * anchors on /destinations), so draft-only destination pages are never linked.
 */
export function ExperiencesView({ categories, destinations }: { categories: ExperienceCategory<Photo>[]; destinations: Destination<Photo>[] }) {
  const place = (slug: string) => destinations.find((d) => d.slug === slug);
  const byPlace = destinations
    .map((d) => ({
      d,
      groups: categories
        .map((c) => ({
          c,
          items: c.activities.filter((a) => a.places.includes(d.slug)),
        }))
        .filter((g) => g.items.length > 0),
    }))
    .filter((x) => x.groups.length > 0);

  return (
    <>
      <PageHero
        photo={photos.paragliding}
        crumbs={[{ label: "Experiences", href: "/experiences" }]}
        eyebrow="Experiences in Nepal"
        title={
          <>
            Every side <em>of Nepal</em>
          </>
        }
        intro="Nepal is more than a destination to climb. Fly above Pokhara's lake, run a Himalayan river, walk through jungle and ancient squares, or simply slow down by the water."
        position="object-[50%_45%]"
      />

      <section
        aria-labelledby="ways-title"
        className="bg-cloud-100 py-24 md:py-36"
      >
        <div className="container-x grid gap-14 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <SectionHeading
            eyebrow="Beyond trekking"
            id="ways-title"
            title="Six ways to know Nepal"
          >
            <p>
              From the Himalaya to the Terai plains, Nepal changes height,
              climate and culture within a few days&rsquo; travel. These are the
              experiences that draw people here, besides the{" "}
              <Link
                href="/treks"
                className="underline decoration-brand-500/60 underline-offset-4 hover:decoration-brand-500"
              >
                trekking routes
              </Link>
              .
            </p>
          </SectionHeading>
          <div className="md:pt-20">
            <ol className="divide-y divide-ink-900/10 border-y border-ink-900/10">
              {categories.map((c, i) => (
                <li key={c.slug} className="reveal">
                  <a
                    href={`#${c.slug}`}
                    className="group flex items-baseline gap-5 py-5 focus-visible:outline-offset-[-2px]"
                  >
                    <span
                      aria-hidden
                      className="font-display text-sm font-semibold text-brand-500"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-brand-500 md:text-[1.75rem]">
                      {c.title}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto text-ink-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-500"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-ink-500">
              General information only. What is possible depends on the season,
              the weather and local permits; adventure activities carry real
              risk, so choose licensed operators and check that your insurance
              covers them.
            </p>
          </div>
        </div>
      </section>

      {/* The category bar sticks only while the light catalogue is on screen. */}
      <div>
        <SectionNav
          label="Experience categories"
          items={categories.map((c) => ({ id: c.slug, label: c.title }))}
        />

        <section
          aria-labelledby="catalogue-title"
          className="bg-cloud-100 pt-20 pb-24 md:pt-28 md:pb-36"
        >
          <h2 id="catalogue-title" className="sr-only">
            Experiences by category
          </h2>
          <div className="container-x space-y-28 md:space-y-40">
            {categories.map((c, i) => {
              const flip = i % 2 === 1;
              return (
                <article
                  key={c.slug}
                  id={c.slug}
                  aria-labelledby={`${c.slug}-title`}
                  className="grid scroll-mt-36 gap-10 md:grid-cols-12 md:gap-14"
                >
                  <figure
                    className={`md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}
                  >
                    <div
                      data-fx="parallax"
                      className={`relative overflow-hidden bg-night-900 ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[5/4] md:aspect-[4/5]"}`}
                    >
                      <Image
                        data-fx-img
                        src={c.photo.src}
                        alt={c.photo.alt}
                        fill
                        sizes="(min-width: 768px) 40vw, 100vw"
                        placeholder="blur"
                        className="object-cover will-change-transform"
                      />
                    </div>
                  </figure>
                  <div
                    className={`md:col-span-6 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-7"} md:self-center`}
                  >
                    <div className="reveal">
                      <p className="eyebrow text-brand-500">
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(categories.length).padStart(2, "0")}
                      </p>
                      <h3
                        id={`${c.slug}-title`}
                        className="mt-4 font-display text-display-md"
                      >
                        {c.title}
                      </h3>
                      <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-700">
                        {c.intro}
                      </p>
                    </div>
                    {/* One activity per row: name, a short description, then a quiet "Where" line. */}
                    <dl className="mt-10 border-t border-ink-900/12">
                      {c.activities.map((a) => {
                        const where = a.places
                          .map(place)
                          .filter((d) => d !== undefined);
                        return (
                          <div
                            key={a.slug}
                            id={a.slug}
                            className="reveal scroll-mt-36 border-b border-ink-900/12 py-6"
                          >
                            <dt className="font-display text-lg font-semibold tracking-[-0.01em] text-ink-900">
                              {a.guide ? (
                                <Link href={`/experiences/${a.guide}`} className="hover:text-brand-500">
                                  {a.title}
                                </Link>
                              ) : (
                                a.title
                              )}
                            </dt>
                            <dd className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-700">
                              {a.text}
                            </dd>
                            {a.guide && (
                              <dd className="mt-3">
                                <Link
                                  href={`/experiences/${a.guide}`}
                                  className="group inline-flex items-center gap-2 font-display text-sm font-semibold text-brand-500"
                                >
                                  Read the full guide
                                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                  </span>
                                </Link>
                              </dd>
                            )}
                            {where.length > 0 && (
                              <dd className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
                                <span className="eyebrow text-ink-500">
                                  Where
                                </span>
                                {where.map((d) => (
                                  <Link
                                    key={d.slug}
                                    href={`/destinations#${d.slug}`}
                                    className="font-medium text-ink-900 underline decoration-brand-500/50 underline-offset-4 hover:decoration-brand-500"
                                  >
                                    {d.title}
                                  </Link>
                                ))}
                              </dd>
                            )}
                          </div>
                        );
                      })}
                    </dl>
                    <div className="reveal mt-8 max-w-lg border-l-2 border-brand-500 bg-cloud-200/70 px-5 py-4">
                      <p className="eyebrow text-ink-900">When to go</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                        {c.season}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Dark from here to the footer: the destination panel runs straight into the closing CTA, with no light band between. */}
      <section aria-labelledby="places-title" className="bg-cloud-100">
        <div
          data-fx="panel"
          className="bg-night-950 pt-24 pb-20 text-cloud-50 md:pt-36 md:pb-28"
        >
          <div className="container-x">
            <SectionHeading
              light
              eyebrow="Where to go"
              id="places-title"
              title="Experiences by destination"
            >
              <p>
                Each place lists only the activities that actually happen there,
                grouped by kind.
              </p>
            </SectionHeading>
            <ul className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
              {byPlace.map(({ d, groups }) => (
                <li key={d.slug} className="reveal">
                  <Link
                    href={`/destinations#${d.slug}`}
                    className="group flex items-center gap-5"
                  >
                    <span className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-night-900 sm:w-28">
                      <Image
                        src={d.photo.src}
                        alt=""
                        fill
                        sizes="7rem"
                        placeholder={d.photo.src.blurDataURL ? "blur" : "empty"}
                        className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                      />
                    </span>
                    <h3 className="font-display text-2xl font-semibold tracking-tight group-hover:text-brand-300">
                      {d.title}
                    </h3>
                  </Link>
                  <dl className="mt-6 space-y-4 border-t border-cloud-50/12 pt-5">
                    {groups.map(({ c, items }) => (
                      <div key={c.slug}>
                        <dt className="eyebrow text-cloud-50/60">{c.title}</dt>
                        <dd className="mt-1.5 text-[15px] leading-relaxed text-cloud-50/90">
                          {items.map((a, j) => (
                            <span key={a.slug}>
                              {j > 0 && ", "}
                              <a
                                href={`#${a.slug}`}
                                className="underline decoration-cloud-50/25 underline-offset-4 hover:decoration-brand-300"
                              >
                                {a.title}
                              </a>
                            </span>
                          ))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand
        dark
        photo={photos.rafting}
        title="Build a journey around what you love"
        text="Note the experiences that interest you and when you hope to travel, then bring them to the planning page."
      />
    </>
  );
}
