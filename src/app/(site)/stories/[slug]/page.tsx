// Story / guide article template. Published CMS stories only.
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { ArrowLink } from "@/components/ui/editorial";
import { RichText } from "@/components/ui/RichText";
import { getDestinations, getStories, getStory } from "@/lib/content";
import { staticSlugs } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return staticSlugs((await getStories()).filter((s) => s.status === "published").map((s) => s.slug));
}

export async function generateMetadata({ params }: PageProps<"/stories/[slug]">) {
  const s = await getStory((await params).slug);
  if (!s) return {};
  return pageMetadata({
    title: s.seo?.title ?? s.title,
    description: s.seo?.description ?? s.summary,
    path: `/stories/${s.slug}`,
    image: s.photo?.src,
    index: s.seo?.index ?? false,
  });
}

export default async function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  const s = await getStory((await params).slug);
  if (!s) notFound();
  const related = (await getDestinations()).filter((d) => s.destinations?.includes(d.slug));
  const path = `/stories/${s.slug}`;
  return (
    <article className="bg-cloud-100 pt-36 pb-24 md:pt-44 md:pb-36">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: s.title,
          author: s.author ? { "@type": "Person", name: s.author } : undefined,
          datePublished: s.publishedAt,
          url: absoluteUrl(path),
        }}
      />
      <div className="container-x max-w-4xl">
        <Breadcrumbs
          light={false}
          items={[
            { label: "Stories", href: "/stories" },
            { label: s.title, href: path },
          ]}
        />
        <p className="eyebrow mt-10 text-brand-500">
          {s.category}
          {s.publishedAt && ` · ${s.publishedAt}`}
        </p>
        <h1 className="mt-5 font-display text-display-lg font-medium">{s.title}</h1>
        {s.author && <p className="mt-5 text-sm text-ink-500">By {s.author}</p>}
      </div>
      {s.photo && (
        <figure className="container-x mt-14">
          <div className="relative aspect-[16/9] overflow-hidden bg-night-900">
            <Image src={s.photo.src} alt={s.photo.alt} fill preload sizes="100vw" className="object-cover" />
          </div>
        </figure>
      )}
      <div className="container-x mt-14 max-w-3xl">
        <RichText value={s.body} />
        {related.length > 0 && (
          <p className="mt-14 text-sm text-ink-500">
            Places in this story:{" "}
            {related.map((d, i) => (
              <span key={d.slug}>
                {i > 0 && " · "}
                <Link href={d.body ? `/destinations/${d.slug}` : `/destinations#${d.slug}`} className="text-ink-900 underline decoration-brand-500/60 underline-offset-4">
                  {d.title}
                </Link>
              </span>
            ))}
          </p>
        )}
        <div className="mt-14">
          <ArrowLink href="/stories">All stories &amp; guides</ArrowLink>
        </div>
      </div>
    </article>
  );
}
