// DEV-ONLY trek draft preview; see ../destination/page.dev.tsx. Reads fixtures
// exported by scripts/export-trek-preview-fixtures.mts (gitignored review/m8/).
import { readFile } from "node:fs/promises";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrekView } from "../../treks/[slug]/TrekView";

export const instant = false;

export const metadata: Metadata = { title: "Draft preview", robots: { index: false, follow: false } };

const slugs = new Set(["annapurna-base-camp-trek", "everest-base-camp-trek", "langtang-valley-trek", "mardi-himal-trek"]);

export default async function TrekPreview({ searchParams }: { searchParams: Promise<{ slug?: string | string[] }> }) {
  const requested = (await searchParams).slug;
  const slug = typeof requested === "string" && slugs.has(requested) ? requested : null;
  const json = slug && (await readFile(`${process.cwd()}/review/m8/fixtures/${slug}.json`, "utf8").catch(() => null));
  if (!json) notFound();
  const { trek, region } = JSON.parse(json);
  return (
    <>
      <p className="fixed inset-x-0 bottom-0 z-50 bg-brand-500 px-4 py-2 text-center text-xs tracking-wide text-cloud-50">Draft preview · local only · {trek.seo?.title}</p>
      {/* Related trek drafts have no public route yet, so none are linked. */}
      <TrekView trek={trek} region={region} related={[]} />
    </>
  );
}
