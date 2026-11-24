import Link from "next/link";
import Image from "next/image";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { TrekCard, SeasonGrid } from "@/components/trek/TrekBlocks";
import { ArrowLink, SectionHeading } from "@/components/ui/editorial";
import { photos } from "@/content/photos";
import { getDestinations, getStories, getTreks } from "@/lib/content";
import type { Season } from "@/content/types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Trekking in Nepal — Everest, Annapurna & Langtang routes",
  description:
    "Plan a trek in Nepal: the Everest Base Camp, Annapurna Base Camp, Langtang Valley and Mardi Himal routes, trekking regions, seasons, altitude and preparation.",
  path: "/treks",
  image: photos.kalapatthar.src,
});

const seasons: Season[] = [
  { name: "Autumn", months: "Late Sep – Nov", tone: "best", text: "Clear, settled weather after the monsoon and the sharpest mountain views. Popular routes are busiest now." },
  { name: "Spring", months: "Mar – May", tone: "best", text: "Warmer days and rhododendrons in flower at mid altitudes; cloud and haze increase towards May." },
  { name: "Winter", months: "Dec – Feb", tone: "good", text: "Cold nights and quieter trails. Lower routes stay pleasant; high passes can be closed by snow." },
  { name: "Monsoon", months: "Jun – mid Sep", tone: "quiet", text: "Rain, cloud and leeches in lower forests, with frequent disruption to mountain flights." },
];

const preparation = [
  {
    title: "Altitude",
    text: "Most classic routes climb above 4,000 m. Acute mountain sickness is unrelated to fitness; a gradual ascent with rest days, and descending if symptoms worsen, is what keeps trekkers safe.",
  },
  {
    title: "Fitness & terrain",
    text: "Teahouse treks involve several hours of walking a day on stone steps and uneven trail. Steady training on hills or stairs in the months before makes the days far more enjoyable.",
  },
  {
    title: "Permits & insurance",
    text: "Each region has its own park or conservation-area permits, and rules change. Insurance should cover trekking at altitude and helicopter evacuation.",
  },
];

export default async function TreksPage() {
  const [treks, destinations, stories] = await Promise.all([getTreks(), getDestinations(), getStories()]);
  const regions = destinations.filter((d) => d.kind === "region");
  return (
    <>
      <PageHero
        photo={photos.kalapatthar}
        crumbs={[{ label: "Treks", href: "/treks" }]}
        eyebrow="Trekking in Nepal"
        title={
          <>
            Walk among the <em>highest mountains</em> on earth
          </>
        }
        intro="Teahouse trails through Sherpa, Gurung and Tamang country, from forested foothills to glacial moraine. Start here to compare routes, regions and seasons."
      />

      {/* Introduction */}
      <section aria-labelledby="intro-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-24">
          <SectionHeading eyebrow="An introduction" id="intro-title" title="Trekking, the Nepal way" />
          <div className="reveal space-y-6 text-lg leading-relaxed text-ink-700 md:pt-16">
            <p>
              Most Himalayan treks in Nepal follow old trading and village paths rather than wilderness tracks. Each night is spent in a family-run teahouse lodge, so you carry
              only a day pack and the route connects real villages, monasteries and farmland.
            </p>
            <p>
              Routes range from a few days on foothill ridges to long walks into the high valleys beneath Everest and Annapurna. The right choice depends on the time you have,
              the season, and how high you want to go.
            </p>
          </div>
        </div>
      </section>

      {/* Featured routes */}
      <section aria-labelledby="routes-title" className="bg-night-950 py-24 text-cloud-50 md:py-36">
        <div className="container-x">
          <SectionHeading light eyebrow="Featured routes" id="routes-title" title="Four classic treks">
            Four routes of different lengths and altitudes, from the moraine below Everest to the grassy ridges beneath Machapuchare.
          </SectionHeading>
          <ul className="mt-14 grid gap-x-8 gap-y-12 md:mt-16 md:grid-cols-2 md:gap-y-16 xl:grid-cols-4">
            {treks.map((t, i) => (
              <li key={t.slug} className={`reveal ${i % 2 ? "xl:mt-20" : ""}`}>
                <TrekCard light index={i} trek={t} sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Regions — ivory panel widens over the forest section (same panel as homepage Tours). */}
      <div className="bg-night-950">
      <section aria-labelledby="regions-title" data-fx="panel" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow="Trekking regions" id="regions-title" title="Three great valleys" />
          <ul className="mt-16 divide-y divide-ink-900/10 border-y border-ink-900/10">
            {regions.map((r) => {
              const p = r.photo;
              const routes = treks.filter((t) => t.region === r.slug);
              return (
                <li key={r.slug} className="reveal grid gap-6 py-10 md:grid-cols-[14rem_1fr_auto] md:items-center md:gap-12">
                  <div className="relative aspect-[4/3] overflow-hidden bg-night-900">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 14rem, 100vw" placeholder="blur" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-display-md">{r.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-700">{r.summary}</p>
                    <p className="mt-3 text-xs text-ink-500">Routes: {routes.map((t) => t.title).join(" · ")}</p>
                  </div>
                  <ArrowLink href={`/destinations#${r.slug}`}>About {r.title}</ArrowLink>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      </div>

      {/* Difficulty & preparation */}
      <section aria-labelledby="prep-title" className="bg-cloud-50 py-24 md:py-36">
        <div className="container-x">
          <div data-fx="rule" className="h-px origin-left bg-ink-500/30" />
          <div className="mt-16 grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
            <SectionHeading eyebrow="Difficulty & preparation" id="prep-title" title="Ready for altitude" />
            <ol className="grid gap-10 sm:grid-cols-3 md:pt-16">
              {preparation.map((p, i) => (
                <li key={p.title} className="reveal">
                  <span className="font-display text-5xl text-brand-500/80">{i + 1}</span>
                  <h3 className="mt-4 font-display text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-14 max-w-2xl text-xs leading-relaxed text-ink-500">General information, not medical advice. Speak to a doctor before travelling to high altitude.</p>
        </div>
      </section>

      {/* Seasons */}
      <section aria-labelledby="seasons-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow="Best trekking seasons" id="seasons-title" title="When to go" />
          <div className="mt-14">
            <SeasonGrid seasons={seasons} />
          </div>
        </div>
      </section>

      {/* Guides */}
      <section aria-labelledby="guides-title" className="bg-cloud-100 pb-24 md:pb-36">
        <div className="container-x grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <SectionHeading eyebrow="Travel guides" id="guides-title" title="Before you go" />
          <div className="md:pt-16">
            <ul className="divide-y divide-ink-900/10 border-y border-ink-900/10">
              {stories
                .filter((s) => s.category === "Guide")
                .slice(0, 5)
                .map((s) => (
                  <li key={s.slug} className="reveal flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                    {s.status === "published" ? (
                      <Link href={`/stories/${s.slug}`} className="font-display text-2xl underline decoration-brand-500/50 underline-offset-4 hover:decoration-brand-500">
                        {s.title}
                      </Link>
                    ) : (
                      <span className="font-display text-2xl">{s.title}</span>
                    )}
                    <span className="eyebrow text-[11px] text-ink-500">Guide</span>
                  </li>
                ))}
            </ul>
            <div className="mt-8">
              <ArrowLink href="/stories">All stories &amp; guides</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        photo={photos.mardi}
        title="A trek shaped around you"
        text="Tell us the time you have, the season and the kind of trail you are after. We will come back with suggestions — no booking or payment is taken on this site."
      />
    </>
  );
}
