// Embedded Sanity Studio at /studio. Never indexed (noindex metadata +
// robots.txt disallow). Editors sign in with their Sanity account; Studio
// itself enforces who may read or write — no token is stored in this app.
import type { Metadata } from "next";
import { Studio } from "./Studio";

export { viewport } from "next-sanity/studio";

export const metadata: Metadata = {
  title: "Studio",
  referrer: "same-origin",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <Studio />;
}
