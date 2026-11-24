import type { Metadata } from "next";
import Link from "next/link";
import { CinematicJourney } from "@/features/cinematic/CinematicJourney";

// EXPERIMENTAL prototype (Milestone 3.1). Not linked from the site; not indexed.
export const metadata: Metadata = {
  title: "Journey prototype",
  robots: { index: false, follow: false },
};

export default function JourneyLabPage() {
  return (
    <main id="main" className="bg-night-950 text-cloud-50">
      <header className="container-x flex min-h-[70svh] flex-col justify-end pb-16">
        <p className="eyebrow mb-4 text-brand-300">Lab · cinematic journey prototype</p>
        <h1 className="max-w-3xl font-display text-display-lg">One trek, one camera</h1>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-cloud-100/75">
          Scroll to follow the trekker. Composition and motion test only — the character is a
          non-photorealistic stand-in and the two photos come from different regions of Nepal.
        </p>
        <Link href="/" className="mt-8 text-sm text-brand-300 underline underline-offset-4">
          Back to homepage
        </Link>
      </header>
      <CinematicJourney />
      <footer className="container-x py-32 text-sm text-cloud-100/60">End of prototype.</footer>
    </main>
  );
}
