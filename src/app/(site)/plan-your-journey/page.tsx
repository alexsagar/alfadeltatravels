import { Suspense } from "react";
import { PageHero } from "@/components/page/PageHero";
import { SectionHeading } from "@/components/ui/editorial";
import { photos } from "@/content/photos";
import { EnquiryForm } from "@/features/plan/EnquiryForm";
import { getTreks } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Plan your journey",
  description: "Tell Alfa Delta Travels about the trek or tour you have in mind in Nepal.",
  path: "/plan-your-journey",
  image: photos.mardi.src,
});

const steps = [
  { title: "Tell us your plans", text: "Dates, interests, fitness and anything else that matters to you." },
  { title: "We suggest a route", text: "Honest options based on season, altitude and the time you have." },
  { title: "Shape it together", text: "Adjust pace, stops and style until the journey suits you." },
];

export default async function PlanPage() {
  const treks = (await getTreks()).map(({ slug, title }) => ({ slug, title }));
  return (
    <>
      <PageHero
        photo={photos.mardi}
        crumbs={[{ label: "Plan your journey", href: "/plan-your-journey" }]}
        eyebrow="Plan your journey"
        title={
          <>
            Your Himalaya, <em>planned with care</em>
          </>
        }
        intro="A custom trip starts with a conversation. Share as much or as little as you like."
        position="object-[50%_60%]"
      />

      <section aria-labelledby="form-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.8fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="How it works" id="form-title" title="Start with a few details" />
            <ol className="mt-12 space-y-8">
              {steps.map((s, i) => (
                <li key={s.title} className="reveal grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="font-display text-3xl text-brand-500/80">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-700">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:pt-16">
            {/* useSearchParams (trek preset) needs a Suspense boundary to keep the page static. */}
            <Suspense fallback={<div className="min-h-[900px]" />}>
              <EnquiryForm treks={treks} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
