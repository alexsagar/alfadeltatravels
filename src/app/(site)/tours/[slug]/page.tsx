// Tour detail template. Renders published CMS tours only (none exist locally).
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/page/CtaBand";
import { OfferingBlock } from "@/components/page/OfferingBlock";
import { PageHero } from "@/components/page/PageHero";
import { Faqs, Gallery } from "@/components/trek/TrekBlocks";
import { SectionHeading } from "@/components/ui/editorial";
import { RichText } from "@/components/ui/RichText";
import { photos } from "@/content/photos";
import { getDestinations, getTour, getTours } from "@/lib/content";
import { staticSlugs } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return staticSlugs((await getTours()).map((t) => t.slug));
}

export async function generateMetadata({ params }: PageProps<"/tours/[slug]">) {
  const tour = await getTour((await params).slug);
  if (!tour) return {};
  return pageMetadata({
    title: tour.seo?.title ?? tour.title,
    description: tour.seo?.description ?? tour.summary,
    path: `/tours/${tour.slug}`,
    image: tour.photo.src,
    index: tour.seo?.index ?? false,
  });
}

export default async function TourPage({ params }: PageProps<"/tours/[slug]">) {
  const tour = await getTour((await params).slug);
  if (!tour) notFound();
  const places = (await getDestinations()).filter((d) => tour.destinations.includes(d.slug));
  return (
    <>
      <PageHero
        photo={tour.photo}
        crumbs={[
          { label: "Tours", href: "/tours" },
          { label: tour.title, href: `/tours/${tour.slug}` },
        ]}
        eyebrow={`Tour · ${tour.category}`}
        title={tour.title}
        intro={tour.summary}
      />
      <section aria-labelledby="overview-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="Overview" id="overview-title" title="About this tour" />
            <div className="reveal mt-10">
              <RichText value={tour.body} />
            </div>
          </div>
          <div className="reveal space-y-10 lg:pt-24">
            {tour.highlights.length > 0 && (
              <div>
                <h3 className="eyebrow text-[11px] text-ink-500">Highlights</h3>
                <ul className="mt-3 space-y-2 text-ink-700">
                  {tour.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
            {places.length > 0 && (
              <div>
                <h3 className="eyebrow text-[11px] text-ink-500">Destinations</h3>
                <ul className="mt-3 space-y-2">
                  {places.map((d) => (
                    <li key={d.slug}>
                      <Link href={d.body ? `/destinations/${d.slug}` : `/destinations#${d.slug}`} className="underline decoration-brand-500/60 underline-offset-4 hover:decoration-brand-500">
                        {d.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="container-x mt-20">
          <OfferingBlock offering={tour.offering} title="Tour programme" enquireHref={`/plan-your-journey?interest=${tour.slug}`} />
        </div>
      </section>
      {tour.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="bg-cloud-50 py-24 md:py-36">
          <div className="container-x">
            <SectionHeading eyebrow="Gallery" id="gallery-title" title="In pictures" />
            <div className="mt-14">
              <Gallery items={tour.gallery} />
            </div>
          </div>
        </section>
      )}
      {tour.faqs.length > 0 && (
        <section aria-labelledby="faq-title" className="bg-cloud-100 py-24 md:py-36">
          <div className="container-x grid gap-12 md:grid-cols-[1fr_1.8fr] md:gap-20">
            <SectionHeading eyebrow="Questions" id="faq-title" title="Frequently asked" />
            <div className="md:pt-16">
              <Faqs items={tour.faqs} />
            </div>
          </div>
        </section>
      )}
      <CtaBand photo={tour.gallery[0] ?? photos.pokhara} title="Shape this tour around you" text="Bring your dates and interests to the planning page." query={tour.slug} />
    </>
  );
}
