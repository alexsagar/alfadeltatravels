import Image from "next/image";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { Pending, SectionHeading } from "@/components/ui/editorial";
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

// Editorial structure for the company story. Each chapter shows the
// company's own content from Site settings when supplied; otherwise a clearly
// marked "Awaiting company" note. No founding year, team, credentials or
// achievements are invented.
const chapters = [
  { title: "Our story", text: "How and why Alfa Delta Travels began, in the company's own words." },
  { title: "The people", text: "Guides, planners and the team behind each journey — names and photographs supplied with consent." },
  { title: "How we travel", text: "Our approach to safety at altitude, group size, porters' welfare and responsible travel." },
  { title: "Registration & memberships", text: "Official registration, licences and association memberships, with numbers that visitors can verify." },
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
        intro="A Nepal trekking and travel company. This page is ready for the company's own story; nothing below has been invented."
        position="object-[50%_45%]"
      />

      <section aria-labelledby="story-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x grid gap-14 md:grid-cols-[1fr_1.4fr] md:gap-24">
          <div className="md:sticky md:top-28 md:self-start">
            <SectionHeading eyebrow="Who we are" id="story-title" title="A story still to be told" />
            <figure className="reveal-mask mt-12 hidden md:block">
              <div className="relative aspect-[4/5] max-w-sm overflow-hidden bg-night-900">
                <Image src={photos.sarangkot.src} alt={photos.sarangkot.alt} fill sizes="24rem" placeholder="blur" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-xs text-ink-500">Pictured: {photos.sarangkot.location}</figcaption>
            </figure>
          </div>
          <ol className="space-y-16 md:pt-16">
            {chapters.map((c, i) => (
              <li key={c.title} className="reveal border-t border-ink-900/15 pt-8">
                <p className="font-display text-5xl text-brand-500/80">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-display text-display-md">{c.title}</h3>
                <div className="mt-6 max-w-lg">{filled[c.title] ?? <Pending>{c.text}</Pending>}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand photo={photos.abc} title="Start a conversation" text="Questions about a route, a season or a first trip to Nepal are welcome." />
    </>
  );
}
