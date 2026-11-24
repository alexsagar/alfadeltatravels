// Experience detail pages (Milestone 9.2). Only slugs with a written guide
// exist; Proxy (src/proxy.ts) returns a real 404 for any other slug. All
// pages are noindex and absent from the sitemap until editorially approved.
import { notFound } from "next/navigation";
import { getDestinations, getExperienceCategories, getExperienceGuide, getExperienceGuides } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { ExperienceView } from "./ExperienceView";

export async function generateStaticParams() {
  return (await getExperienceGuides()).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/experiences/[slug]">) {
  const g = await getExperienceGuide((await params).slug);
  if (!g) return {};
  return pageMetadata({ title: g.seo.title, description: g.seo.description, path: `/experiences/${g.slug}`, image: g.hero.src, index: g.seo.index });
}

export default async function ExperiencePage({ params }: PageProps<"/experiences/[slug]">) {
  const g = await getExperienceGuide((await params).slug);
  if (!g) notFound();
  const [categories, allDestinations] = await Promise.all([getExperienceCategories(), getDestinations()]);
  const activities = categories.flatMap((category) => category.activities.map((activity) => ({ activity, category })));
  const related = g.related.map((slug) => activities.find((x) => x.activity.slug === slug)).filter((x) => x !== undefined);
  // Only destinations that exist on the site (linked as /destinations anchors, never draft pages).
  const destinations = g.destinations.map((s) => allDestinations.find((d) => d.slug === s)).filter((d) => d !== undefined);
  return <ExperienceView guide={g} category={categories.find((c) => c.slug === g.category)} destinations={destinations} related={related} />;
}
