// Embedded Sanity Studio at /studio. Never indexed (noindex metadata +
// robots.txt disallow). Editors sign in with their Sanity account; Studio
// itself enforces who may read or write — no token is stored in this app.
// Without a configured project it shows setup steps instead of erroring.
import type { Metadata } from "next";
import { isSanityConfigured } from "@/sanity/env";
import { Studio } from "./Studio";

export { viewport } from "next-sanity/studio";

export const metadata: Metadata = {
  title: "Studio",
  referrer: "same-origin",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (isSanityConfigured) return <Studio />;
  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-24 text-ink-900">
      <p className="eyebrow text-brand-500">Content studio</p>
      <h1 className="mt-4 font-display text-display-md">Sanity is not connected yet</h1>
      <p className="mt-6 leading-relaxed text-ink-700">
        The website is running on its built-in content. To edit content here, add the project&rsquo;s identifiers to <code>.env.local</code> and restart:
      </p>
      <pre className="mt-6 overflow-x-auto bg-cloud-50 p-5 text-sm">
        {`NEXT_PUBLIC_SANITY_PROJECT_ID=<your project id>
NEXT_PUBLIC_SANITY_DATASET=development`}
      </pre>
      <p className="mt-6 text-sm text-ink-500">Full steps: docs/SANITY_SETUP.md in the project repository.</p>
    </main>
  );
}
