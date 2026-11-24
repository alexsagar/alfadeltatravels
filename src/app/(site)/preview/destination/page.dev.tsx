// DEV-ONLY draft preview. The `.dev.tsx` extension is a page extension only
// under `next dev` (next.config.ts → pageExtensions), so this route does not
// exist in production builds. It reads a local fixture exported by
// scripts/export-preview-fixture.mts (gitignored review/preview/), so the app
// never holds a token and never queries drafts.
import { readFile } from "node:fs/promises";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationView } from "../../destinations/[slug]/DestinationView";

// Reads a local file per request; dev-only, so blocking is fine.
export const instant = false;

export const metadata: Metadata = { title: "Draft preview", robots: { index: false, follow: false } };

const slugs = new Set(["annapurna", "chitwan", "kathmandu", "khumbu", "langtang", "lumbini", "pokhara"]);

export default async function DestinationPreview({ searchParams }: { searchParams: Promise<{ slug?: string | string[] }> }) {
  const requested = (await searchParams).slug;
  const slug = typeof requested === "string" && slugs.has(requested) ? requested : null;
  const path = slug ? `review/m79/fixtures/${slug}.json` : "review/preview/destination.json";
  const json = await readFile(`${process.cwd()}/${path}`, "utf8").catch(() => null);
  if (!json) notFound();
  const { d, treks } = JSON.parse(json);
  // Draft destinations do not have public routes. Suppress draft-to-draft
  // nearby links so a review page never offers a link that resolves to 404.
  d.nearby = [];
  return (
    <>
      <p className="fixed inset-x-0 bottom-0 z-50 bg-brand-500 px-4 py-2 text-center text-xs tracking-wide text-cloud-50">Draft preview · local only · {d.seo?.title}</p>
      <DestinationView d={d} treks={treks} />
    </>
  );
}
