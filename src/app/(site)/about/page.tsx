import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { ArrowLink, SectionHeading } from "@/components/ui/editorial";
import type { ReactNode } from "react";
import { RichText } from "@/components/ui/RichText";
import { photos } from "@/content/photos";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About us",
  description: "The story, people and approach behind Alfa Delta Travels, a Nepal trekking and travel company.",
  path: "/about",
  image: photos.village.src,
});

// Company story chapters render only once Site settings supply them; nothing
// is invented. Until then the page describes what the company plans, using
// the same chapter layout.
const chapters = ["Our story", "The people", "How we travel", "Registration & memberships"];
const offer = [
  { title: "Treks", text: "Classic Himalayan routes in the Khumbu, Annapurna and Langtang regions, planned around sensible acclimatisation.", href: "/treks" },
  { title: "Experiences", text: "Paragliding over Pokhara, white-water rafting, wildlife in Chitwan and the pilgrimage sites of Lumbini.", href: "/experiences" },
  { title: "Tours", text: "Heritage cities, lakeside towns and lowland jungle, at a gentler pace than the trail.", href: "/tours" },
  { title: "Destinations", text: "The regions behind every journey, from the high Himalaya to the Terai.", href: "/destinations" },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const filled: Record<string, ReactNode> = {
    "Our story": settings.about?.story?.length ? <RichText value={settings.about.story} /> : null,
    "How we travel": settings.about?.approach?.length ? <RichText value={settings.about.approach} /> : null,
    "The people": settings.team.length ? (
      <ul className="space-y-6">
        {settings.team.map((m) => (
          <li key={m.name}>
            <p className="font-display text-2xl">{m.name}</p>
            <p className="eyebrow mt-1 text-[11px] text-brand-500">{m.role}</p>
            {m.bio && <p className="mt-2 text-sm leading-relaxed text-ink-700">{m.bio}</p>}
          </li>
        ))}
      </ul>
    ) : null,
    "Registration & memberships":
      settings.registration || settings.memberships.length ? (
        <ul className="space-y-1 text-ink-700">
          {settings.registration && <li>{settings.registration}</li>}
          {settings.memberships.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      ) : null,
  };
  const story = chapters.flatMap((title) => (filled[title] ? [{ title, body: filled[title] }] : []));
  return (
    <>
      <PageHero
        photo={photos.village}
        crumbs={[{ label: "About", href: "/about" }]}
        eyebrow="About us"
        title={
          <>
            Alfa Delta <em>Travels</em>
          </>
        }
        intro="A Nepal trekking and travel company planning treks, adventures and cultural journeys from the Himalaya to the lowland jungle."
        position="object-[50%_45%]"
      />

      <section aria-labelledby="story-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x grid gap-14 md:grid-cols-[1fr_1.4fr] md:gap-24">
          <div className="md:sticky md:top-28 md:self-start">
            <SectionHeading eyebrow="Who we are" id="story-title" title={story.length ? "Our story" : "What we plan"} />
            <figure className="reveal-mask mt-12 hidden md:block">
              <div className="relative aspect-[4/5] max-w-sm overflow-hidden bg-night-900">
                <Image src={photos.sarangkot.src} alt={photos.sarangkot.alt} fill sizes="24rem" placeholder="blur" className="object-cover" />
              </div>
            </figure>
          </div>
          <ol className="space-y-16 md:pt-16">
            {(story.length ? story : offer).map((c, i) => (
              <li key={c.title} className="reveal border-t border-ink-900/15 pt-8">
                <p className="font-display text-5xl text-brand-500/80">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-display text-display-md">{c.title}</h3>
                <div className="mt-6 max-w-lg">{"href" in c ? <><p className="leading-relaxed text-ink-700">{c.text}</p><span className="mt-6 block"><ArrowLink href={c.href}>{c.title}</ArrowLink></span></> : c.body}</div>
              </li>
            ))}
          </ol>
          <p className="text-sm text-ink-500 md:col-start-2">
            <Link href="/image-credits" className="underline decoration-ink-500/40 underline-offset-4 transition-colors hover:text-ink-900">
              Photography &amp; attributions
            </Link>
          </p>
        </div>
      </section>

      <CtaBand photo={photos.abc} title="Start a conversation" text="Questions about a route, a season or a first trip to Nepal are welcome." />
    </>
  );
}
