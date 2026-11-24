import type { MetadataRoute } from "next";
import { getDestinations, getStories, getTours, getTreks } from "@/lib/content";
import { absoluteUrl, routes } from "@/lib/seo";

// Indexable pages only: fixed routes marked index in lib/seo.ts, plus content
// pages that exist AND are approved for indexing (CMS "Show in search
// engines"). Drafts never reach the content layer. /lab/ and /studio are never listed.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treks, tours, destinations, stories] = await Promise.all([getTreks(), getTours(), getDestinations(), getStories()]);
  const paths = [
    ...routes.filter((r) => r.index).map((r) => r.path),
    ...treks.filter((t) => t.guide && t.seo?.index).map((t) => `/treks/${t.slug}`),
    ...tours.filter((t) => t.seo?.index).map((t) => `/tours/${t.slug}`),
    ...destinations.filter((d) => d.body && d.seo?.index).map((d) => `/destinations/${d.slug}`),
    ...stories.filter((s) => s.status === "published" && s.seo?.index).map((s) => `/stories/${s.slug}`),
  ];
  return paths.map((p) => ({ url: absoluteUrl(p) }));
}
