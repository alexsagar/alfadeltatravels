// Experience detail template (Milestone 9.2). One reusable layout; editorial
// variation comes from the content (story sections choose "wide", "left" or
// "right" photo compositions, and highlights/facts vary in number).
// Motion uses the existing ScrollFx attributes only: hero parallax, a
// "window" on wide story photos, parallax in split frames, one dark "panel".
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/page/CtaBand";
import { JsonLd } from "@/components/page/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { Faqs } from "@/components/trek/TrekBlocks";
import { SectionHeading } from "@/components/ui/editorial";
import type { Destination, ExperienceActivity, ExperienceCategory, ExperienceGuide, Photo } from "@/content/types";
import { absoluteUrl } from "@/lib/seo";

type Related = { activity: ExperienceActivity; category: ExperienceCategory<Photo> };

export function ExperienceView({
  guide: g,
  category,
  destinations,
  related,
}: {
  guide: ExperienceGuide<Photo>;
  category?: ExperienceCategory<Photo>;
  destinations: Destination<Photo>[];
  related: Related[];
}) {
  const path = `/experiences/${g.slug}`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: g.title,
          description: g.seo.description,
          url: absoluteUrl(path),
          about: { "@type": "Place", name: g.place },
        }}
      />
      <PageHero
        photo={g.hero}
        crumbs={[
          { label: "Experiences", href: "/experiences" },
          { label: g.title, href: path },
        ]}
        eyebrow={g.eyebrow}
        title={
          <>
            {g.heading} <em>{g.emphasis}</em>
          </>
        }
        intro={g.intro}
        position={g.heroPosition}
      />

      {/* Overview: narrative left, key facts right. */}
      <section aria-labelledby="overview-title" className="bg-cloud-100 py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow={category?.title ?? "Experience"} id="overview-title" title={g.overviewTitle} />
            <div className="reveal mt-8 max-w-2xl space-y-5 text-[17px] leading-relaxed text-ink-700">
              {g.overview.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
          <dl className="reveal self-start border-t border-ink-900/15 lg:mt-24">
            {g.facts.map((f) => (
              <div key={f.label} className="border-b border-ink-900/15 py-5">
                <dt className="eyebrow text-ink-500">{f.label}</dt>
                <dd className="mt-2 font-display text-lg font-semibold tracking-[-0.01em] text-ink-900">{f.value}</dd>
                {f.note && <dd className="mt-1 text-sm text-ink-500">{f.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story: large photographs in alternating compositions. */}
      <section aria-label="About the experience" className="bg-cloud-100 pb-24 md:pb-32">
        <div className="container-x space-y-24 md:space-y-32">
          {g.story.map((s) =>
            s.layout === "wide" || !s.photo ? (
              <article key={s.title} aria-labelledby={slugId(s.title)}>
                {s.photo && (
                  <figure>
                    <div data-fx="window" className="relative aspect-[4/5] overflow-hidden bg-night-900 sm:aspect-[16/9] lg:aspect-[21/9]">
                      <Image data-fx-img src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 1440px) 1328px, 100vw" placeholder="blur" className="object-cover will-change-transform" />
                    </div>
                    <figcaption className="mt-2 text-xs text-ink-500">Pictured: {s.photo.location}</figcaption>
                  </figure>
                )}
                <div className="mt-12 grid gap-6 md:grid-cols-[1fr_1.4fr] md:gap-20">
                  <h2 id={slugId(s.title)} className="reveal font-display text-display-md">
                    {s.title}
                  </h2>
                  <div className="reveal max-w-2xl space-y-5 leading-relaxed text-ink-700">
                    {s.text.map((p) => (
                      <p key={p.slice(0, 32)}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            ) : (
              <article key={s.title} aria-labelledby={slugId(s.title)} className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
                <figure className={`md:col-span-7 ${s.layout === "right" ? "md:order-2 md:col-start-6" : ""}`}>
                  <div data-fx="parallax" className="relative aspect-[4/3] overflow-hidden bg-night-900">
                    <Image data-fx-img src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 768px) 58vw, 100vw" placeholder="blur" className="object-cover will-change-transform" />
                  </div>
                  <figcaption className="mt-2 text-xs text-ink-500">Pictured: {s.photo.location}</figcaption>
                </figure>
                <div className={`reveal md:col-span-5 ${s.layout === "right" ? "md:order-1" : ""}`}>
                  <h2 id={slugId(s.title)} className="font-display text-display-md">
                    {s.title}
                  </h2>
                  <div className="mt-6 space-y-5 leading-relaxed text-ink-700">
                    {s.text.map((p) => (
                      <p key={p.slice(0, 32)}>{p}</p>
                    ))}
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      {/* Highlights: the page's one dark panel. */}
      <section aria-labelledby="highlights-title" className="bg-cloud-100">
        <div data-fx="panel" className="bg-night-950 py-24 text-cloud-50 md:py-32">
          <div className="container-x">
            <SectionHeading light eyebrow="What to expect" id="highlights-title" title="Highlights" />
            <ol className="mt-14 grid gap-x-14 gap-y-10 md:grid-cols-2">
              {g.highlights.map((h, i) => (
                <li key={h.title} className="reveal flex gap-6 border-t border-cloud-50/15 pt-6">
                  <span aria-hidden className="font-display text-sm font-semibold text-brand-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">{h.title}</h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-cloud-50/80">{h.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Practical information. */}
      <section aria-labelledby="practical-title" className="bg-cloud-100 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Plan your visit" id="practical-title" title="Practical information" />
          <div className="reveal mt-12 max-w-3xl border-l-2 border-brand-500 bg-cloud-200/70 px-6 py-5">
            <h3 className="eyebrow text-ink-900">Best time to go</h3>
            <p className="mt-2 leading-relaxed text-ink-700">{g.bestTime}</p>
          </div>
          <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-20">
            {[
              { id: "preparation", title: "Preparation", items: g.preparation },
              { id: "safety", title: "Safety and responsible travel", items: g.safety },
            ].map((col) => (
              <div key={col.id}>
                <h3 id={col.id} className="font-display text-2xl font-semibold tracking-tight">
                  {col.title}
                </h3>
                <dl className="mt-6 border-t border-ink-900/12">
                  {col.items.map((it) => (
                    <div key={it.title} className="reveal border-b border-ink-900/12 py-5">
                      <dt className="font-display text-[17px] font-semibold text-ink-900">{it.title}</dt>
                      <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-700">{it.text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related places and experiences. */}
      <section aria-labelledby="related-title" className="border-t border-ink-900/10 bg-cloud-200/60 py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Keep exploring" id="related-title" title="Related places and experiences" />
          <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            {destinations.length > 0 && (
              <div>
                <h3 className="eyebrow text-ink-500">Destinations</h3>
                <ul className="mt-5 space-y-4">
                  {destinations.map((d) => (
                    <li key={d.slug}>
                      <Link href={`/destinations#${d.slug}`} className="group flex items-center gap-5">
                        <span className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-night-900">
                          <Image src={d.photo.src} alt="" fill sizes="6rem" placeholder={d.photo.src.blurDataURL ? "blur" : "empty"} className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105" />
                        </span>
                        <span className="font-display text-xl font-semibold tracking-tight group-hover:text-brand-500">{d.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="eyebrow text-ink-500">Experiences</h3>
              <ul className="mt-5 border-t border-ink-900/12">
                {related.map(({ activity: a, category: c }) => (
                  <li key={a.slug} className="border-b border-ink-900/12">
                    <Link href={a.guide ? `/experiences/${a.guide}` : `/experiences#${a.slug}`} className="group flex items-baseline justify-between gap-6 py-4">
                      <span>
                        <span className="block text-xs text-ink-500">{c.title}</span>
                        <span className="font-display text-lg font-semibold group-hover:text-brand-500">{a.title}</span>
                      </span>
                      <span aria-hidden className="text-ink-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-500">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                <Link href="/experiences" className="text-sm font-medium text-ink-900 underline decoration-brand-500/50 underline-offset-4 hover:decoration-brand-500">
                  All experiences in Nepal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-cloud-100 py-24 md:py-32">
        <div className="container-x grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <SectionHeading eyebrow="Questions" id="faq-title" title="Frequently asked" />
          <div>
            <Faqs items={g.faqs} />
            <div className="mt-14">
              <p className="eyebrow text-ink-500">Sources</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {g.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener" className="text-ink-700 underline decoration-ink-500/40 underline-offset-4 hover:decoration-brand-500">
                      {s.label}
                    </a>
                    {s.publisher && <span className="text-ink-500"> · {s.publisher}</span>}
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-ink-500">General information, not a company programme. Rules, seasons and access can change; check locally before you travel.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand photo={g.ctaPhoto} title={`Plan your visit: ${g.title}`} text="Note your dates and the experiences you are interested in on the planning page. Nothing is booked or charged through this site." />
    </>
  );
}

const slugId = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
