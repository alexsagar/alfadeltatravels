// DEV-ONLY Experience detail preview from Sanity drafts (Milestone 9.3): /preview/experience?slug=paragliding
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DraftBar } from "@/components/page/DraftBar";
import { getDestinations } from "@/lib/content";
import { loadDraftPreview } from "@/lib/draft-preview";
import { ExperienceView } from "../../experiences/[slug]/ExperienceView";

export const instant = false;
export const metadata: Metadata = { title: "Draft preview · Experience", robots: { index: false, follow: false } };

export default async function ExperiencePreview({ searchParams }: { searchParams: Promise<{ slug?: string | string[] }> }) {
  const slug = (await searchParams).slug;
  const d = await loadDraftPreview();
  const g = d?.guides.find((x) => x.slug === slug);
  if (!d || !g) notFound();
  const allDestinations = await getDestinations();
  const activities = d.categories.flatMap((category) => category.activities.map((activity) => ({ activity, category })));
  return (
    <>
      <ExperienceView
        guide={g}
        category={d.categories.find((c) => c.slug === g.category)}
        destinations={g.destinations.map((s) => allDestinations.find((x) => x.slug === s)).filter((x) => x !== undefined)}
        related={g.related.map((s) => activities.find((x) => x.activity.slug === s)).filter((x) => x !== undefined)}
      />
      <DraftBar label={g.title} exportedAt={d.exportedAt} />
    </>
  );
}
