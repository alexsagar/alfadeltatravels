// Reusable per-route SEO. Every page exports `metadata = pageMetadata({...})`
// (or returns it from generateMetadata), so titles, canonicals, Open Graph and
// robots stay consistent. The route registry below is the single source for
// what is indexable; sitemap.ts reads it, and pageMetadata() refuses to mark a
// path indexable unless the registry agrees.
import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { site } from "@/content/site";

export type RouteEntry = { path: string; index: boolean; reason?: string };

/**
 * Index policy for the fixed routes. Content pages (treks, tours, destinations,
 * stories) take `index` from their content: CMS documents are indexable only
 * when an editor ticks "Show in search engines" (see sitemap.ts).
 * Pages built on verified general information are indexable;
 * pages that are mostly placeholders for company content stay noindex until
 * the company approves real copy (flip `index` then).
 */
export const routes: RouteEntry[] = [
  { path: "/", index: true },
  { path: "/treks", index: true },
  { path: "/destinations", index: true },
  { path: "/experiences", index: true },
  { path: "/tours", index: false, reason: "Tour programmes not yet supplied" },
  { path: "/about", index: false, reason: "Company story awaiting approval" },
  { path: "/stories", index: false, reason: "No published articles yet" },
  { path: "/plan-your-journey", index: false, reason: "Enquiry form not connected to a backend" },
  { path: "/contact", index: false, reason: "Contact details not yet supplied" },
  { path: "/image-credits", index: false, reason: "Utility page" },
];

export const isIndexable = (path: string) => routes.some((r) => r.path === path && r.index);

export function pageMetadata({
  title,
  description,
  path,
  image,
  index: contentIndex,
}: {
  title: string;
  description: string;
  path: string;
  image?: StaticImageData;
  /** For content pages: the document's own index decision. */
  index?: boolean;
}): Metadata {
  const index = contentIndex ?? isIndexable(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index ? undefined : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: site.name,
      url: path,
      title,
      description,
      images: image ? [{ url: image.src, width: image.width, height: image.height }] : undefined,
    },
  };
}

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();
