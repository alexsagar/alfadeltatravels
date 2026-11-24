// Homepage content sections that follow the cinematic opening (BirdJourney).
// Server components; reveals are CSS scroll-driven (`.reveal`, globals.css),
// so there is no extra JS.
import Image from "next/image";
import Link from "next/link";
import { ArrowLink, PhotoCard, SectionHeading } from "@/components/ui/editorial";
import { photos } from "@/content/photos";
import type { ExperienceCategory, HomeContent, Photo } from "@/content/types";

/**
 * First section after the cinematic stage. It is pulled up over the last
 * 110svh of the pinned stage and starts transparent, so it rises out of the
 * stage's forest-green mist with its heading visible before the pin ends.
 */
export function FeaturedTreks({ intro, treks }: { intro: string; treks: HomeContent<Photo>["featuredTreks"] }) {
  return (
    <section
      aria-labelledby="treks-title"
      className="relative z-10 -mt-[110svh] bg-[linear-gradient(to_bottom,transparent_10svh,var(--color-night-950)_75svh)] pt-[22svh] pb-28 text-cloud-50 md:pb-40 motion-reduce:mt-0 motion-reduce:bg-night-950 motion-reduce:pt-28"
    >
      <div id="treks" className="container-x scroll-mt-24">
        <SectionHeading light eyebrow="Featured treks" id="treks-title" title="Signature routes" />
        <p className="reveal mt-6 max-w-md text-sm leading-relaxed text-cloud-100/75">
          {intro}
        </p>
        <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {treks.map((trek, i) => (
            <li key={trek.slug} className={`reveal group relative ${i === 1 ? "md:mt-16" : ""}`}>
              <PhotoCard photo={trek.photo} ratio="aspect-[4/5]" sizes="(min-width: 768px) 30vw, 100vw" />
              <p className="eyebrow mt-6 text-brand-300">{trek.region}</p>
              <h3 className="mt-2 font-display text-3xl">
                {trek.href ? (
                  <Link href={trek.href} className="after:absolute after:inset-0 hover:text-brand-300">
                    {trek.title}
                  </Link>
                ) : (
                  trek.title
                )}
              </h3>
              {trek.highPoint && <p className="mt-2 text-sm text-cloud-100/65">High point: {trek.highPoint}</p>}
            </li>
          ))}
        </ul>
        <div className="reveal mt-14">
          <ArrowLink light href="/treks">
            Explore all treks
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}

/**
 * Beyond the Mountains (Milestone 9). Continues FeaturedTreks' night-950, so
 * the boundary is photographic, not a colour band: a wide paragliding photo
 * opens from a centred window (data-fx="window", as About) while Treks'
 * link scrolls away. Six categories follow in an asymmetric editorial mosaic
 * (varied widths, ratios and offsets; CSS reveals only). Its bottom padding is
 * what the Tours panel widens over, exactly as it did over FeaturedTreks.
 */
const beyondLayout = [
  { item: "md:col-span-4", ratio: "aspect-[4/5]", sizes: "(min-width: 768px) 30vw, 100vw" },
  { item: "md:col-span-8 md:mt-16", ratio: "aspect-[16/10]", sizes: "(min-width: 768px) 60vw, 100vw" },
  { item: "md:col-span-5 md:col-start-2", ratio: "aspect-[5/4]", sizes: "(min-width: 768px) 38vw, 100vw" },
  { item: "md:col-span-5 md:col-start-8 md:mt-20", ratio: "aspect-[4/3]", sizes: "(min-width: 768px) 38vw, 100vw" },
  { item: "md:col-span-7", ratio: "aspect-[3/2]", sizes: "(min-width: 768px) 52vw, 100vw" },
  { item: "md:col-span-4 md:col-start-9 md:mt-16", ratio: "aspect-[4/5]", sizes: "(min-width: 768px) 30vw, 100vw" },
];

export function BeyondMountains({ title, intro, photo, categories }: { title: string; intro: string; photo: Photo; categories: ExperienceCategory<Photo>[] }) {
  return (
    <section id="experiences" aria-labelledby="beyond-title" className="relative z-10 -mt-12 bg-night-950 pb-28 text-cloud-50 md:-mt-24 motion-reduce:mt-0 md:pb-40">
      <div className="container-x">
        <figure>
          <div data-fx="window" className="relative aspect-[4/5] overflow-hidden bg-night-900 sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image data-fx-img src={photo.src} alt={photo.alt} fill sizes="(min-width: 1440px) 1328px, 100vw" placeholder="blur" className="object-cover object-[50%_40%] will-change-transform" />
          </div>
        </figure>
        <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-2 md:gap-20">
          <SectionHeading light eyebrow="Experiences" id="beyond-title" title={title} />
          <div className="reveal max-w-md md:pt-12">
            <p className="leading-relaxed text-cloud-100/80">{intro}</p>
            <div className="mt-8">
              <ArrowLink light href="/experiences">
                Explore experiences in Nepal
              </ArrowLink>
            </div>
          </div>
        </div>
        <ul className="mt-16 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-12 md:gap-y-14">
          {categories.map((c, i) => {
            const l = beyondLayout[i % beyondLayout.length];
            return (
              <li key={c.slug} className={`group relative ${l.item} ${i % 2 ? "max-md:ml-[10%]" : "max-md:mr-[10%]"}`}>
                <div className="reveal-mask">
                  <PhotoCard photo={c.photo} ratio={l.ratio} sizes={l.sizes} />
                </div>
                <div className="reveal mt-5 flex gap-5">
                  <p aria-hidden className="font-display text-2xl text-brand-300/80">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl">
                      <Link href={`/experiences#${c.slug}`} className="after:absolute after:inset-0 hover:text-brand-300">
                        {c.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cloud-100/65">{c.activities.map((a) => a.title).join(" · ")}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * Tours (organised programmes). Enters as an inset, rounded night-900 panel over the
 * last of BeyondMountains' padding and widens to full bleed (data-fx="panel");
 * a tall Boudhanath photo drifts against the scroll for depth.
 * Hands over to Destinations via PhotoBridge.
 */
export function Tours({ title, intro, cards }: { title: string; intro: string; cards: HomeContent<Photo>["tourCards"] }) {
  return (
    <section
      id="tours"
      aria-labelledby="tours-title"
      className="relative z-10 -mt-16 bg-night-950 text-cloud-50 md:-mt-24 motion-reduce:mt-0"
    >
      {/* The panel is clipped, not the section, so its inset margins show the night-950 above. */}
      <div data-fx="panel" className="bg-night-800 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="container-x grid gap-14 md:grid-cols-[1fr_1.3fr] md:gap-20">
        <div>
          <SectionHeading light eyebrow="Tours" id="tours-title" title={title} />
          <p className="reveal mt-6 max-w-sm text-sm leading-relaxed text-cloud-100/75">
            {intro}
          </p>
          <div className="reveal mt-8">
            <ArrowLink light href="/tours">
              View tours
            </ArrowLink>
          </div>
          <figure className="mt-12 hidden md:block">
            <div data-fx="parallax" className="relative aspect-[4/5] max-w-sm overflow-hidden bg-night-950">
              <Image data-fx-img src={photos.kathmandu.src} alt={photos.kathmandu.alt} fill sizes="24rem" placeholder="blur" className="object-cover will-change-transform" />
            </div>
          </figure>
        </div>
        <ul className="divide-y divide-cloud-50/15 border-y border-cloud-50/15 md:self-end">
          {cards.map((t) => {
            const photo = t.photo;
            return (
              <li key={t.title} className="reveal grid grid-cols-[5.5rem_1fr] items-center gap-5 py-6 sm:grid-cols-[8rem_1fr] sm:gap-8">
                <div className="relative aspect-[4/3] overflow-hidden bg-night-950">
                  <Image src={photo.src} alt={photo.alt} fill sizes="8rem" placeholder="blur" className="object-cover" />
                </div>
                <div>
                  <p className="eyebrow text-[11px] text-brand-300">{t.theme}</p>
                  <h3 className="mt-1 font-display text-3xl sm:text-display-md">{t.title}</h3>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      </div>
    </section>
  );
}

export function Destinations({ regions }: { regions: HomeContent<Photo>["regions"] }) {
  const [lead, ...rest] = regions;
  if (!lead) return null;
  return (
    <section id="destinations" aria-labelledby="destinations-title" className="relative z-10 -mt-[60svh] bg-cloud-100 py-28 shadow-[0_-24px_48px_rgb(10_15_22/0.18)] md:py-40 motion-reduce:mt-0">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading eyebrow="Popular destinations" id="destinations-title" title="Regions of the high Himalaya" />
          <div className="reveal">
            <ArrowLink href="/destinations">All destinations</ArrowLink>
          </div>
        </div>
        <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-12">
          <figure className="group md:col-span-7">
            <div className="reveal-mask"><PhotoCard photo={lead.photo} ratio="aspect-[4/3]" sizes="(min-width: 768px) 55vw, 100vw" /></div>
            <figcaption className="reveal mt-5">
              <h3 className="font-display text-4xl">{lead.title}</h3>
              <p className="mt-2 max-w-sm text-sm text-ink-500">{lead.note}</p>
            </figcaption>
          </figure>
          <div className="grid gap-14 md:col-span-5 md:pt-24">
            {rest.map((r) => (
              <figure key={r.title} className="reveal group">
                <PhotoCard photo={r.photo} ratio="aspect-[3/2]" sizes="(min-width: 768px) 38vw, 100vw" />
                <figcaption className="mt-5">
                  <h3 className="font-display text-3xl">{r.title}</h3>
                  <p className="mt-2 max-w-sm text-sm text-ink-500">{r.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** About — the Sarangkot panorama opens from a centred window (data-fx="window"). */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative z-10 bg-cloud-100 pb-28 md:pb-40">
      <div className="container-x">
        <figure>
          <div data-fx="window" className="relative aspect-[4/5] overflow-hidden bg-night-900 sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image data-fx-img src={photos.sarangkot.src} alt={photos.sarangkot.alt} fill sizes="(min-width: 1440px) 1328px, 100vw" placeholder="blur" className="object-cover object-[50%_40%] will-change-transform" />
          </div>
        </figure>
        <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-2 md:gap-20">
          <SectionHeading eyebrow="About us" id="about-title" title="Alfa Delta Travels" />
          <p className="reveal max-w-md leading-relaxed text-ink-700 md:pt-12">
            Treks, river and sky adventures and cultural journeys across Nepal, from the Khumbu and the Annapurna Sanctuary to the old cities of the Kathmandu Valley and the Chitwan lowlands.
            <span className="mt-6 block">
              <ArrowLink href="/about">About Alfa Delta Travels</ArrowLink>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Stories — the quiet boundary: same ivory, a hairline that draws across and
 * typography only. It sits above the closing CTA, which is uncovered beneath it.
 */
export function Stories() {
  return (
    <section
      id="stories"
      aria-labelledby="stories-title"
      className="relative z-10 bg-cloud-100 pb-24 shadow-[0_24px_48px_rgb(10_15_22/0.22)] md:pb-32"
    >
      <div className="container-x">
        <div data-fx="rule" className="h-px origin-left bg-ink-500/30" />
        <div className="mt-20 grid gap-10 md:mt-28 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <SectionHeading eyebrow="Stories &amp; guides" id="stories-title" title="Notes from the trail" />
          <p className="reveal max-w-md leading-relaxed text-ink-700 md:mt-14">
            Practical notes on altitude, permits, seasons and preparation for walking in Nepal.
          </p>
          <div className="reveal md:col-start-2">
            <ArrowLink href="/stories">Stories &amp; guides</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Closing CTA. The wrapper starts 70svh under Stories and its photo is
 * sticky, so Stories lifts away like a curtain while the Annapurna panorama
 * settles and the copy rises (data-fx="curtain"). No pin, no extra scroll.
 */
export function PlanCta({ title, text, photo }: { title: string; text: string; photo: Photo }) {
  return (
    <section
      aria-labelledby="plan-title"
      data-fx="curtain"
      className="relative z-0 -mt-[70svh] h-[170svh] bg-night-950 text-cloud-50 motion-reduce:mt-0 motion-reduce:h-auto"
    >
      {/* Anchor target: the point where the photo is fully uncovered. */}
      <div id="plan" aria-hidden className="absolute top-[70svh] motion-reduce:top-0" />
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden motion-reduce:relative">
        <Image data-fx-img src={photo.src} alt="" fill sizes="100vw" className="object-cover object-[45%_50%] will-change-transform max-md:object-[58%_35%]" />
        <div className="absolute inset-0 bg-night-950/45" />
        <div data-fx-copy className="container-x relative z-10 text-center">
          <p className="eyebrow mb-6 text-brand-300">Plan your journey</p>
          <h2 id="plan-title" className="mx-auto max-w-4xl font-display text-display-lg font-medium [text-shadow:0_2px_24px_rgb(10_15_22/0.45)]">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-cloud-50/85 [text-shadow:0_1px_12px_rgb(10_15_22/0.5)]">
            {text}
          </p>
          <div>
            
            <Link href="/plan-your-journey" className="btn-primary mt-10">
              Start planning
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
