// Destination detail template. Only destinations with CMS body text have a
// page; the listing links the others to their section on /destinations.
import { notFound } from "next/navigation";
import { DestinationView } from "./DestinationView";
import { getDestination, getDestinations, getTreks } from "@/lib/content";
import { staticSlugs } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/page/JsonLd";

export async function generateStaticParams() {
  return staticSlugs((await getDestinations()).filter((d) => d.body).map((d) => d.slug));
}

export async function generateMetadata({ params }: PageProps<"/destinations/[slug]">) {
  const d = await getDestination((await params).slug);
  if (!d?.body) return {};
  return pageMetadata({
    title: d.seo?.title ?? `${d.title}, Nepal`,
    description: d.seo?.description ?? d.summary,
    path: `/destinations/${d.slug}`,
    image: d.photo.src,
    index: d.seo?.index ?? false,
  });
}

export default async function DestinationPage({ params }: PageProps<"/destinations/[slug]">) {
  const d = await getDestination((await params).slug);
  if (!d?.body) notFound();
  const treks = (await getTreks()).filter((t) => d.treks?.includes(t.slug));
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: d.title,
          description: d.seo?.description ?? d.summary,
          url: absoluteUrl(`/destinations/${d.slug}`),
          image: absoluteUrl(d.photo.src.src),
        }}
      />
      <DestinationView d={d} treks={treks} />
    </>
  );
}
