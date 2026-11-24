// Site footer (Milestone 9.4): an editorial ending in three tiers.
//
// 1. Invitation band (charcoal): shown only on pages that do not already end
//    with their own planning CTA. Pages mark that CTA with `data-page-cta`
//    (CtaBand, the homepage closing panel, the planning form) and a CSS
//    `:has()` rule hides the band, so there is never a second CTA in a row
//    and no JavaScript is involved.
// 2. Main footer (mist grey): logo, a short brand line and three curated link
//    groups. The transparent SVG logo stays on a light ground.
// 3. Signature and legal line: an oversized, decorative wordmark, then the
//    copyright, the CC attribution notice and the image-credits link.
//
// Contact details and social links come only from published Sanity settings
// (Company & contact). None are verified yet, so nothing is shown: no
// placeholders, no `#` links, no empty rows.
import Link from "next/link";
import type { ReactNode } from "react";
import { contactHref, planHref, site, storiesHref } from "@/content/site";
import { getSettings } from "@/lib/content";
import { Logo } from "./Logo";

const fallbackTagline = "Journeys across Nepal, from Himalayan trails and white-water gorges to jungle lowlands and the old cities of the Kathmandu Valley.";

const groups: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explore Nepal",
    links: [
      { label: "Treks", href: "/treks" },
      { label: "Experiences", href: "/experiences" },
      { label: "Tours", href: "/tours" },
      { label: "Destinations", href: "/destinations" },
    ],
  },
  {
    title: "Alfa Delta Travels",
    links: [
      { label: "About us", href: "/about" },
      { label: "Stories", href: storiesHref },
      { label: "Contact", href: contactHref },
    ],
  },
];

export async function SiteFooter() {
  const settings = await getSettings();
  const { email, phone, whatsapp } = settings.contact;
  const contactLines = [
    email && { label: email, href: `mailto:${email}` },
    phone && { label: phone, href: `tel:${phone.replace(/[^+\d]/g, "")}` },
    whatsapp && { label: `WhatsApp ${whatsapp}`, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}` },
  ].filter((x): x is { label: string; href: string } => !!x);
  const social = settings.social.filter((s) => /^https:\/\//.test(s.url));

  return (
    <>
      <section data-footer-invite aria-labelledby="footer-invite-title" className="footer-invite bg-night-950 text-cloud-50">
        <div className="container-x grid gap-10 py-20 md:grid-cols-12 md:items-end md:gap-14 md:py-28">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5 text-brand-300">Plan your journey</p>
            <h2 id="footer-invite-title" className="font-display text-display-lg font-semibold">
              Your Nepal story <em>starts here.</em>
            </h2>
          </div>
          <div className="md:col-span-5 md:pb-2">
            <p className="max-w-md text-[17px] leading-relaxed text-cloud-50/80">
              High trails and white water, jungle mornings, temple squares and still lakes. Start with what draws you, and shape a journey around it.
            </p>
            <Link href={planHref} className="btn-primary group mt-8">
              Start planning
              <span aria-hidden className="transition-transform duration-300 ease-cinematic group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-900/10 bg-cloud-200 text-ink-700">
        <div className="container-x pt-16 md:pt-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Link href="/" className="inline-block" aria-label="Alfa Delta Travels, home">
                <Logo className="h-16 w-auto sm:h-[4.5rem]" />
              </Link>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-700">{settings.footerTagline ?? fallbackTagline}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:col-span-4 lg:col-start-6">
              {groups.map((g) => (
                <FooterGroup key={g.title} title={g.title}>
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="footer-link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </FooterGroup>
              ))}
            </div>

            {/* The footer's one action, plus verified contact details and social links once they exist. */}
            <div className="border-t border-ink-900/12 pt-8 lg:col-span-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <h2 className="eyebrow text-ink-500">Planning a journey</h2>
              <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-ink-700">Gather your dates, interests and the places that draw you in one place.</p>
              <Link href={planHref} className="group mt-6 inline-flex items-center gap-3 font-display text-[15px] font-semibold text-ink-900">
                <span className="footer-link">Plan your journey</span>
                <span aria-hidden className="text-brand-500 transition-transform duration-300 ease-cinematic group-hover:translate-x-1">
                  →
                </span>
              </Link>
              {(contactLines.length > 0 || social.length > 0) && (
                <ul aria-label="Contact and social" className="mt-8 space-y-3 font-display text-[15px] font-medium text-ink-900">
                  {contactLines.map((c) => (
                    <li key={c.href}>
                      <a href={c.href} className="footer-link break-all">
                        {c.label}
                      </a>
                    </li>
                  ))}
                  {social.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} rel="noopener me" className="footer-link">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Brand signature: decorative, so hidden from assistive tech (the logo above names the brand). */}
          <p aria-hidden className="mt-16 overflow-hidden font-display text-[clamp(2rem,11.4vw,11.5rem)] leading-[0.85] font-semibold tracking-[-0.045em] whitespace-nowrap text-ink-900/[0.07] select-none md:mt-20">
            Alfa Delta Travels
          </p>

          <div className="flex flex-col gap-4 border-t border-ink-900/12 py-8 text-xs leading-relaxed text-ink-500 md:flex-row md:items-start md:justify-between md:gap-10">
            <p className="shrink-0">
              © <Year /> {site.name}
            </p>
            {/* Full CC attribution lives on /image-credits (linked from every page). */}
            <p className="max-w-2xl md:text-right">
              Photography by Wikimedia Commons contributors under Creative Commons licences; hummingbird animation by Michael Mills (LottieFiles).{" "}
              <Link href="/image-credits" className="font-medium text-ink-900 underline underline-offset-4 hover:text-brand-500">
                Image credits &amp; licences
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title}>
      <h2 className="eyebrow text-ink-500">{title}</h2>
      <ul className="mt-5 space-y-3 font-display text-[15px] font-medium text-ink-900">{children}</ul>
    </nav>
  );
}

// Cached so the page stays statically prerendered (Cache Components).
async function Year() {
  "use cache";
  return new Date().getFullYear();
}
