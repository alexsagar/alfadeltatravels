// Hard 404 for unknown content slugs.
//
// With Cache Components, /treks/[slug] (and the other detail routes) send
// their prerendered shell — and a 200 status — before the page reads
// `params`, so `notFound()` for an unknown slug can only stream the 404 UI
// with status 200 (Next docs: file-conventions/loading → Status codes). The
// docs recommend checking the slug in Proxy instead.
//
// The known slugs come from src/generated/content-manifest.json, written at
// build time by scripts/content-manifest.mts from the same source as the
// pages (Sanity when configured, otherwise local content). Proxy itself makes
// no network request. A slug published in Sanity after the build is unknown
// here — and has no prerendered page either — until the publish webhook
// triggers a rebuild (ARCHITECTURE.md → Content publishing).
import { NextResponse, type NextRequest } from "next/server";
import manifest from "@/generated/content-manifest.json";

const known: Record<string, Set<string>> = {
  treks: new Set(manifest.treks),
  tours: new Set(manifest.tours),
  destinations: new Set(manifest.destinations),
  stories: new Set(manifest.stories),
  experiences: new Set(manifest.experiences),
};

export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  if (known[section]?.has(slug)) return NextResponse.next();
  // Unmatched internal path → the app's not-found page with a real 404.
  return NextResponse.rewrite(new URL("/__not-found", request.url));
}

export const config = { matcher: ["/treks/:slug", "/tours/:slug", "/destinations/:slug", "/stories/:slug", "/experiences/:slug"] };
