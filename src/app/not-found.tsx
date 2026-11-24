import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { photos } from "@/content/photos";

export const metadata: Metadata = { title: "Page not found", description: "This page does not exist on Alfa Delta Travels." };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night-950 text-cloud-50">
        <Image src={photos.pumori.src} alt="" fill sizes="100vw" placeholder="blur" className="object-cover opacity-45" />
        <div className="container-x relative py-32">
          <p className="eyebrow text-brand-300">404 · Off the trail</p>
          <h1 className="mt-5 max-w-3xl font-display text-display-lg font-medium">This path doesn&rsquo;t lead anywhere</h1>
          <p className="mt-6 max-w-md text-cloud-100/85">The page may have moved, or the link may be mistyped.</p>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {[
              ["Home", "/"],
              ["Treks", "/treks"],
              ["Destinations", "/destinations"],
              ["Plan your journey", "/plan-your-journey"],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="border-b border-cloud-50/40 pb-1 hover:border-brand-300">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
