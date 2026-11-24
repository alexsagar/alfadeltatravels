// DEV-ONLY Experiences catalogue preview from Sanity drafts (Milestone 9.3); see src/lib/draft-preview.ts.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DraftBar } from "@/components/page/DraftBar";
import { getDestinations } from "@/lib/content";
import { loadDraftPreview } from "@/lib/draft-preview";
import { ExperiencesView } from "../../experiences/ExperiencesView";

export const instant = false;
export const metadata: Metadata = { title: "Draft preview · Experiences", robots: { index: false, follow: false } };

export default async function ExperiencesPreview() {
  const d = await loadDraftPreview();
  if (!d) notFound();
  return (
    <>
      <ExperiencesView categories={d.categories} destinations={await getDestinations()} />
      <DraftBar label="Experiences catalogue" exportedAt={d.exportedAt} />
    </>
  );
}
