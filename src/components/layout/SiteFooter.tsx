// Site footer (Milestone 9.4, revised): clean editorial navigation above, a
// hairline copyright row, and a full-width dithered mountain range with
// drifting mist below (features/footer/RidgelineScene, adapted from the
// supplied RidgelineDitherFooter reference in the brand's glacier tones).
//
// Server component; only the canvas scene is client-side. Contact details and
// social links render only from published Sanity settings (none verified yet),
// so there are no placeholders. Photo and animation credits live on
// /image-credits and in ASSET_LICENSES.md, not in the visible footer.
import Link from "next/link";
import { contactHref, planHref, site, storiesHref } from "@/content/site";
import { RidgelineScene } from "@/features/footer/RidgelineScene";
import { getSettings } from "@/lib/content";
import { Logo } from "./Logo";

const fallbackTagline = "Journeys across Nepal, from Himalayan trails and white-water gorges to jungle lowlands and the old cities of the Kathmandu Valley.";

const groups = [
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
      { label: "Plan your journey", href: planHref },
    ],
  },
];

export async function SiteFooter() {
  const settings = await getSettings();
  const { email, phone, whatsapp } = settings.contact;
  const reach = [
    email && { label: email, href: `mailto:${email}` },
    phone && { label: phone, href: `tel:${phone.replace(/[^+\d]/g, "")}` },
    whatsapp && { label: `WhatsApp ${whatsapp}`, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}` },
    ...settings.social.filter((s) => /^https:\/\//.test(s.url)).map((s) => ({ label: s.label, href: s.url })),
  ].filter((x): x is { label: string; href: string } => !!x);

  return (
    <footer className="relative overflow-hidden border-t border-ink-900/8 bg-cloud-100 text-ink-900">
      {/* Frame: fine vertical hairlines on wide screens, as in the reference. */}
      <div className="relative z-10 mx-auto max-w-[90rem] lg:border-x lg:border-ink-900/8">
        <div className="container-x grid gap-12 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block" aria-label="Alfa Delta Travels, home">
              <Logo className="h-16 w-auto sm:h-[4.5rem]" />
            </Link>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-700">{settings.footerTagline ?? fallbackTagline}</p>
            {reach.length > 0 && (
              <ul aria-label="Contact and social" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-display text-sm font-medium">
                {reach.map((r) => (
                  <li key={r.href}>
                    <a href={r.href} rel={r.href.startsWith("http") ? "noopener me" : undefined} className="footer-link">
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:col-span-6 lg:col-start-7">
            {groups.map((g) => (
              <nav key={g.title} aria-label={g.title}>
                <h2 className="eyebrow text-ink-500">{g.title}</h2>
                <ul className="mt-5 space-y-3 font-display text-[15px] font-medium">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="footer-link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="container-x mt-14 flex items-center justify-between gap-6 md:mt-16">
          <p className="text-xs text-ink-500">
            © <Year /> {site.name}
          </p>
          <a href="#main" className="footer-link text-xs font-medium text-ink-700">
            Back to top <span aria-hidden>↑</span>
          </a>
        </div>
        <div className="container-x">
          <div className="mt-5 h-px bg-ink-900/10" />
        </div>
      </div>

      <RidgelineScene className="-mt-2 h-[clamp(190px,24vw,330px)]" />
    </footer>
  );
}

// Cached so the page stays statically prerendered (Cache Components).
async function Year() {
  "use cache";
  return new Date().getFullYear();
}
