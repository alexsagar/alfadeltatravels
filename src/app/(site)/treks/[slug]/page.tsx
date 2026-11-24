// Trek detail template. Renders any trek that has a `guide`; others 404.
// General destination information and the company's own package are kept in
// visibly separate sections (see the "Our itinerary" block).
import { notFound } from "next/navigation";
import { getDestination, getTrek, getTreks } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { TrekView } from "./TrekView";

export async function generateStaticParams() {
  return (await getTreks()).filter((t) => t.guide).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/treks/[slug]">) {
  const trek = await getTrek((await params).slug);
  if (!trek?.guide) return {};
  return pageMetadata({
    title: trek.seo?.title ?? `${trek.title} — route guide`,
    description: trek.seo?.description ?? `${trek.summary} Route, seasons, altitude and preparation.`,
    path: `/treks/${trek.slug}`,
    image: trek.guide.hero.src,
    index: trek.seo?.index ?? false,
  });
}

export default async function TrekPage({ params }: PageProps<"/treks/[slug]">) {
  const trek = await getTrek((await params).slug);
  if (!trek?.guide) notFound();
  const region = (await getDestination(trek.region)) ?? { slug: trek.region, title: trek.region };
  const related = (await getTreks()).filter((t) => t.slug !== trek.slug).slice(0, 3);

  return <TrekView trek={{ ...trek, guide: trek.guide }} region={region} related={related} />;
}
