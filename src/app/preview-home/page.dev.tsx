// DEV-ONLY homepage preview from Sanity drafts (Milestone 9.3). `.dev.tsx`
// routes exist only under `next dev`; data comes from the exported draft
// fixture, so no token is held by the app. Outside the (site) group because
// the homepage composes its own header and footer.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DraftBar } from "@/components/page/DraftBar";
import { HomeView } from "@/components/sections/HomeView";
import { loadDraftPreview } from "@/lib/draft-preview";

export const instant = false;
export const metadata: Metadata = { title: "Draft preview · Homepage", robots: { index: false, follow: false } };

export default async function HomePreview() {
  const d = await loadDraftPreview();
  if (!d) notFound();
  return (
    <>
      <HomeView home={d.home} categories={d.categories} />
      <DraftBar label="Homepage" exportedAt={d.exportedAt} />
    </>
  );
}
