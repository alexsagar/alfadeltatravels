import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/page/CtaBand";
import { PageHero } from "@/components/page/PageHero";
import { SectionHeading } from "@/components/ui/editorial";
import { getDestinations, getTourThemes, getTours } from "@/lib/content";
import { photos } from "@/content/photos";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tours in Nepal: heritage, wildlife & lakeside journeys",
  description: "Cultural, wildlife, leisure and adventure travel in Nepal — Kathmandu Valley, Pokhara, Chitwan and Lumbini.",
  path: "/tours",
  image: photos.kathmandu.src,
});

export default async function ToursPage() {
  const [tourThemes, destinations, tours] = await Promise.all([getTourThemes(), getDestinations(), getTours()]);
  return (
    <>
      <PageHero
        photo={photos.kathmandu}
        crumbs={[{ label: "Tours", href: "/tours" }]}
        eyebrow="Tours"
        title={
          <>
            Nepal <em>beyond the trail</em>
          </>
        }
        intro="Heritage cities, a lake beneath the Annapurnas, lowland jungle and the birthplace of the Buddha — journeys for travelers who want more than a trek, or no trek at all."
        position="object-[50%_30%]"
      />

      <section aria-labelledby="themes-title" className="bg-cloud-100 py-24 md:py-36">
        <div className="container-x">
          <SectionHeading eyebrow="Ways to travel" id="themes-title" title="Four kinds of journey" />
          <ul className="mt-20 space-y-24 md:space-y-32">
            {tourThemes.map((t, i) => {
              const p = t.photo;
              return (
                <li key={t.slug} className="grid items-end gap-10 md:grid-cols-12 md:gap-14">
                  <figure className={`md:col-span-6 ${i % 2 ? "md:order-2 md:col-start-7" : ""}`}>
                    <div data-fx="parallax" className="relative aspect-[5/4] overflow-hidden bg-night-900">
                      <Image data-fx-img src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 50vw, 100vw" placeholder="blur" className="object-cover will-change-transform" />
                    </div>
                  </figure>
                  <div className={`reveal pb-8 md:col-span-5 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-8"}`}>
                    <p className="font-display text-5xl text-brand-500/80">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-4 font-display text-display-md">{t.title}</h3>
                    <p className="mt-5 max-w-md leading-relaxed text-ink-700">{t.text}</p>
                    <p className="mt-6 text-sm text-ink-500">
                      Where:{" "}
                      {t.places.map((slug, j) => {
                        const d = destinations.find((x) => x.slug === slug);
                        if (!d) return null;
                        return (
                          <span key={slug}>
                            {j > 0 && " · "}
                            <Link href={`/destinations#${slug}`} className="text-ink-900 underline decoration-brand-500/60 underline-offset-4 hover:decoration-brand-500">
                              {d.title}
                            </Link>
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Published tour packages from the CMS. None exist locally, so this section is absent until the company publishes one. */}
      {tours.length > 0 && (
        <section aria-labelledby="packages-title" className="bg-night-950 py-24 text-cloud-50 md:py-36">
          <div className="container-x">
            <SectionHeading light eyebrow="Tour programmes" id="packages-title" title="Our tours" />
            <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {tours.map((t) => (
                <li key={t.slug} className="reveal">
                  <Link href={`/tours/${t.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-night-900">
                      <Image src={t.photo.src} alt={t.photo.alt} fill sizes="(min-width: 768px) 30vw, 100vw" placeholder={t.photo.src.blurDataURL ? "blur" : "empty"} className="object-cover transition-transform duration-1000 ease-cinematic group-hover:scale-[1.04]" />
                    </div>
                    <p className="eyebrow mt-5 text-brand-300">{t.category}</p>
                    <h3 className="mt-2 font-display text-3xl">{t.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-cloud-100/75">{t.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand photo={photos.chitwan} title="A journey at your own pace" text="Heritage cities, lakes and lowland jungle, combined in the order and at the pace that suits you." />
    </>
  );
}
