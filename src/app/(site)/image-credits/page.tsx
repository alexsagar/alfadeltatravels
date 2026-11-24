import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { getImageCredits } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Image credits",
  description: "Photographers, licences and sources for the images used on this site.",
  path: "/image-credits",
});

// Full attribution for every third-party image (CC licences require author,
// licence with link, source and a note of changes). Linked from every footer.
// Source: every photo the content layer can serve (local photos.ts + CMS images).
export default async function ImageCreditsPage() {
  const list = (await getImageCredits()).sort((a, b) => a.location.localeCompare(b.location));
  return (
    <section aria-labelledby="credits-title" className="bg-cloud-100 pt-36 pb-24 md:pt-44 md:pb-36">
      <div className="container-x">
        <Breadcrumbs light={false} items={[{ label: "Image credits", href: "/image-credits" }]} />
        <h1 id="credits-title" className="mt-10 max-w-3xl font-display text-display-lg font-medium">
          Image credits
        </h1>
        <p className="mt-6 max-w-2xl leading-relaxed text-ink-700">
          Unless marked as the company&rsquo;s own, the photographs on this site come from Wikimedia Commons and are used under the licences shown. Each has been resized and recompressed for the web; none has been
          otherwise edited. Licence names link to the licence text; locations link to the original file.
        </p>

        {/* A list rather than a table so it reflows on phones without sideways scrolling. */}
        <ul className="mt-16 divide-y divide-ink-900/10 border-y border-ink-900/15 text-sm">
          {list.map((p) => (
            <li key={p.sourceUrl} className="grid gap-1 py-4 sm:grid-cols-[1.6fr_1fr_8rem] sm:gap-6">
              {p.sourceUrl ? (
                <a href={p.sourceUrl} rel="noopener" className="underline decoration-ink-500/40 underline-offset-4 hover:decoration-brand-500">
                  {p.location}
                </a>
              ) : (
                <span>{p.location}</span>
              )}
              <span className="text-ink-700">
                <span className="sr-only">Photographer: </span>
                {p.artist}
              </span>
              {p.licenseUrl ? (
                <a href={p.licenseUrl} rel="noopener license" className="text-ink-700 underline decoration-ink-500/40 underline-offset-4 hover:decoration-brand-500">
                  {p.license}
                </a>
              ) : (
                <span className="text-ink-700">{p.license}</span>
              )}
            </li>
          ))}
        </ul>

        <h2 className="mt-20 font-display text-display-md">Animation</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-700">
          Hummingbird animation &ldquo;Hummingbird no Background&rdquo; by Michael Mills,{" "}
          <a href="https://lottiefiles.com/free-animation/hummingbird-no-background-XEfYomK8GX" rel="noopener" className="underline decoration-ink-500/40 underline-offset-4 hover:decoration-brand-500">
            LottieFiles
          </a>
          , used under the{" "}
          <a href="https://lottiefiles.com/page/license" rel="noopener license" className="underline decoration-ink-500/40 underline-offset-4 hover:decoration-brand-500">
            Lottie Simple License
          </a>
          , unmodified.
        </p>
      </div>
    </section>
  );
}
