import Link from "next/link";
import { contactHref, nav, planHref, site, storiesHref } from "@/content/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-900/10 bg-cloud-200 py-16 text-ink-700">
      <div className="container-x flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo className="h-14 w-auto" />
          <p className="mt-3 max-w-xs text-sm">Treks, experiences and journeys in Nepal.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-6 text-sm">
            {[...nav, { label: "Stories", href: storiesHref }, { label: "Plan your journey", href: planHref }, { label: "Contact", href: contactHref }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink-900">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs">© <Year /> {site.name}</p>
      </div>
      {/* Full CC attribution lives on /image-credits (linked from every page). */}
      <div className="container-x mt-12 border-t border-ink-900/10 pt-6 text-xs leading-relaxed text-ink-500">
        <p>
          Photography by Wikimedia Commons contributors under Creative Commons licences; hummingbird animation by Michael Mills (LottieFiles).{" "}
          <Link href="/image-credits" className="text-ink-900 underline underline-offset-4 hover:text-brand-500">
            Image credits &amp; licences
          </Link>
        </p>
      </div>
    </footer>
  );
}

// Cached so the page stays statically prerendered (Cache Components).
async function Year() {
  "use cache";
  return new Date().getFullYear();
}
