import { PageHero } from "@/components/page/PageHero";
import { CtaBand } from "@/components/page/CtaBand";
import { Pending, SectionHeading } from "@/components/ui/editorial";
import Link from "next/link";
import { getStories } from "@/lib/content";
import { photos } from "@/content/photos";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Stories & travel guides",
  description: "Travel guides and traveler journals about trekking and touring in Nepal.",
  path: "/stories",
  image: photos.forest.src,
});

// Listing for CMS articles. Published stories link to /stories/<slug>;
// locally only planned titles exist, shown without links.
export default async function StoriesPage() {
  const stories = await getStories();
  const published = stories.some((s) => s.status === "published");
  const [lead, ...rest] = stories;
  const label = (s: (typeof stories)[number]) => `${s.category} · ${s.status === "published" ? (s.publishedAt ?? "") : "Planned"}`;
  const title = (s: (typeof stories)[number], cls: string) =>
    s.status === "published" ? (
      <Link href={`/stories/${s.slug}`} className={`${cls} underline decoration-brand-500/0 underline-offset-4 transition-colors hover:decoration-brand-500`}>
        {s.title}
      </Link>
    ) : (
      s.title
    );
  return (
    <>
      <PageHero
        photo={photos.forest}
        crumbs={[{ label: "Stories", href: "/stories" }]}
        eyebrow="Stories & guides"
        title={
          <>
            Notes from <em>the trail</em>
          </>
        }
        intro="Practical guides for planning a trek, and — with their permission — accounts from travelers who have walked these paths."
      />

      <section aria-labelledby="list-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow={published ? "Latest" : "In preparation"} id="list-title" title={published ? "Stories & guides" : "Coming soon"} />
          {!published && (
            <div className="mt-10 max-w-xl">
              <Pending>No articles are published yet. Traveler stories will appear only with the traveler&rsquo;s consent.</Pending>
            </div>
          )}

          <article className="reveal mt-20 grid gap-8 border-t border-ink-900/15 pt-10 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <p className="eyebrow text-brand-500">{label(lead)}</p>
            <div>
              <h3 className="font-display text-display-md">{title(lead, "")}</h3>
              <p className="mt-4 max-w-lg leading-relaxed text-ink-700">{lead.summary}</p>
            </div>
          </article>

          <ul className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2">
            {rest.map((s) => (
              <li key={s.slug} className="reveal border-t border-ink-900/15 pt-8">
                <p className="eyebrow text-[11px] text-ink-500">{label(s)}</p>
                <h3 className="mt-3 font-display text-3xl leading-tight">{title(s, "")}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{s.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand photo={photos.namche} title="Have a question before you go?" text="Until the guides are published, ask us directly about seasons, permits or preparation." />
    </>
  );
}
