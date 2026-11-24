import { PageHero } from "@/components/page/PageHero";
import { ArrowLink, SectionHeading } from "@/components/ui/editorial";
import { photos } from "@/content/photos";
import { planHref } from "@/content/site";
import { getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "How to reach Alfa Delta Travels.",
  path: "/contact",
  image: photos.tengboche.src,
});


export default async function ContactPage() {
  // Values come from Site settings; unsupplied fields are omitted, never filled in.
  const { contact: c, registration } = await getSettings();
  const details = [
    { label: "Email", value: c.email },
    { label: "Telephone / WhatsApp", value: [c.phone, c.whatsapp && `WhatsApp ${c.whatsapp}`].filter(Boolean).join(" · ") || undefined },
    { label: "Office address", value: c.address },
    { label: "Office hours (Nepal time)", value: c.hours },
    { label: "Company registration", value: registration },
  ].filter((d) => d.value);
  return (
    <>
      <PageHero
        photo={photos.tengboche}
        crumbs={[{ label: "Contact", href: "/contact" }]}
        eyebrow="Contact"
        title={
          <>
            Get in <em>touch</em>
          </>
        }
        position="object-[60%_40%]"
      />

      <section aria-labelledby="details-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x grid gap-14 md:grid-cols-[1fr_1.4fr] md:gap-24">
          <div>
            <SectionHeading eyebrow="Contact details" id="details-title" title="Where to find us">
              {details.length ? "Reach Alfa Delta Travels directly using the details below." : "Start by outlining your route, dates and group size on the planning page."}
            </SectionHeading>
            <div className="reveal mt-10">
              <ArrowLink href={planHref}>Plan your journey</ArrowLink>
            </div>
          </div>
          {details.length > 0 && (
          <dl className="reveal self-start border-t border-ink-900/15 md:mt-16">
            {details.map((d) => (
              <div key={d.label} className="grid gap-2 border-b border-ink-900/15 py-6 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="eyebrow pt-1 text-[11px] text-ink-500">{d.label}</dt>
                <dd className="font-display text-2xl whitespace-pre-line text-ink-900">{d.value}</dd>
              </div>
            ))}
          </dl>
          )}
        </div>
      </section>
    </>
  );
}
