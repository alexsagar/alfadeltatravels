// Maps raw Sanity query results to the site's own content types
// (src/content/types.ts), so page templates never see Sanity structures.
// Pure functions — no Next.js imports — so they are unit-tested directly.
import type { Photo } from "../content/photos";
import type { Destination, ExperienceCategory, ExperienceGuide, HomeContent, Offering, Seo, SiteSettings, Story, Tour, Trek } from "../content/types";

type Raw = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const licenceUrls: Record<string, string> = {
  "CC0 1.0": "https://creativecommons.org/publicdomain/zero/1.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
};

/**
 * Sanity image → Photo. Shaped like a static import ({src,width,height,
 * blurDataURL}) so next/image and every existing component work unchanged.
 * Returns null for an image without an uploaded asset or required text.
 */
export function mapPhoto(p: Raw | null | undefined): Photo | null {
  if (!p?.url || !p.width || !p.height || !p.alt || !p.location) return null;
  const own = p.license === "own";
  return {
    src: { src: `${p.url}?auto=format&fit=max&w=2400`, width: Math.min(p.width, 2400), height: Math.round((p.height * Math.min(p.width, 2400)) / p.width), blurDataURL: p.lqip },
    alt: p.alt,
    location: p.location,
    artist: own ? "Alfa Delta Travels" : (p.artist ?? ""),
    license: own ? "Own photo" : p.license === "permission" ? "Used with permission" : p.license,
    licenseUrl: licenceUrls[p.license] ?? "",
    sourceUrl: p.sourceUrl ?? "",
  };
}

const photos = (list: Raw[] | null | undefined) => (list ?? []).map(mapPhoto).filter((p): p is Photo => !!p);

/** Commercial details reach the site only when an editor has confirmed them. */
export function mapOffering(o: Raw | null | undefined): Offering {
  if (!o?.confirmed || !o.durationDays || !o.itinerary?.length) return null;
  return {
    durationDays: o.durationDays,
    itinerary: o.itinerary.map((d: Raw) => ({ day: d.day, title: d.title, text: d.text ?? "" })),
    inclusions: o.inclusions ?? [],
    exclusions: o.exclusions ?? [],
    price: o.price?.amount != null && o.price.currency ? { amount: o.price.amount, currency: o.price.currency, basis: o.price.basis ?? "" } : undefined,
    departures: o.departures ?? undefined,
    availability: o.availability ?? undefined,
  };
}

/** Indexing is opt-in: anything but an explicit `true` is noindex. */
export const mapSeo = (s: Raw | null | undefined): Seo => ({ index: s?.index === true, title: s?.title ?? undefined, description: s?.description ?? undefined });

export function mapTrek(t: Raw): Trek<Photo> | null {
  const photo = mapPhoto(t.photo);
  if (!t.slug || !t.title || !t.region || !photo) return null;
  const g = t.guide;
  const hero = mapPhoto(g?.hero);
  const guide =
    g && hero && g.route?.length >= 2
      ? {
          hero,
          intro: g.intro ?? "",
          overview: g.overview ?? [],
          facts: g.facts ?? [],
          highlights: (g.highlights ?? []).map((h: Raw) => ({ title: h.title, text: h.text, photo: mapPhoto(h.photo) ?? undefined })),
          preparation: g.preparation ?? [],
          seasons: g.seasons ?? [],
          routeTitle: g.routeTitle ?? "",
          route: g.route,
          routeNote: g.routeNote ?? "",
          considerations: g.considerations ?? [],
          gallery: photos(g.gallery),
          faqs: g.faqs ?? [],
          sources: g.sources ?? [],
        }
      : undefined;
  return { slug: t.slug, title: t.title, region: t.region, difficulty: t.difficulty ?? undefined, photo, summary: t.summary ?? "", highPoint: t.highPoint ?? undefined, guide, offering: mapOffering(t.offering), seo: mapSeo(t.seo) };
}

export function mapTour(t: Raw): Tour<Photo> | null {
  const photo = mapPhoto(t.photo);
  if (!t.slug || !t.title || !photo) return null;
  return { slug: t.slug, title: t.title, category: t.category, photo, summary: t.summary ?? "", destinations: (t.destinations ?? []).filter(Boolean), highlights: t.highlights ?? [], body: t.body ?? undefined, gallery: photos(t.gallery), faqs: t.faqs ?? [], offering: mapOffering(t.offering), seo: mapSeo(t.seo) };
}

export function mapDestination(d: Raw): Destination<Photo> | null {
  const photo = mapPhoto(d.photo);
  if (!d.slug || !d.title || !photo) return null;
  return { slug: d.slug, title: d.title, kind: d.kind, photo, summary: d.summary ?? "", treks: d.treks ?? [], body: d.body?.length ? d.body : undefined, thingsToDo: d.thingsToDo ?? [], bestTime: d.bestTime ?? undefined, gallery: photos(d.gallery), sources: d.sources ?? [], nearby: (d.nearby ?? []).filter((n: Raw | null) => n?.slug && n.title && n.hasPage).map((n: Raw) => ({ slug: n.slug, title: n.title })), seo: mapSeo(d.seo) };
}

export function mapStory(s: Raw): Story<Photo> | null {
  if (!s.slug || !s.title || !s.body?.length) return null;
  return { slug: s.slug, title: s.title, category: s.category, summary: s.summary ?? "", status: "published", author: s.author, publishedAt: s.publishedAt, photo: mapPhoto(s.photo) ?? undefined, body: s.body, destinations: s.destinations ?? [], seo: mapSeo(s.seo) };
}

/** Blank settings fall back to the site name only — never invented details. */
export function mapSettings(s: Raw | null | undefined, fallback: { name: string; description: string }): SiteSettings {
  return {
    name: s?.name || fallback.name,
    description: s?.description || fallback.description,
    footerTagline: s?.footerTagline || undefined,
    contact: { email: s?.contact?.email, phone: s?.contact?.phone, whatsapp: s?.contact?.whatsapp, address: s?.contact?.address, hours: s?.contact?.hours },
    enquiryEmail: s?.enquiryEmail ?? undefined,
    registration: s?.registration ?? undefined,
    memberships: s?.memberships ?? [],
    social: s?.social ?? [],
    about: s?.about ?? undefined,
    team: (s?.team ?? []).map((m: Raw) => ({ name: m.name, role: m.role, bio: m.bio, photo: mapPhoto(m.photo) ?? undefined })),
  };
}

export const compact = <T,>(list: (T | null)[]) => list.filter((x): x is T => x !== null);

// ── Experiences and homepage (Milestone 9.3) ───────────────────────────────
const titled = (list: Raw[] | null | undefined) => (list ?? []).filter((x) => x?.title && x?.text).map((x) => ({ title: x.title as string, text: x.text as string }));
const slugs = (list: (string | null)[] | null | undefined) => (list ?? []).filter((s): s is string => !!s);

/** Category with its published activities; an activity links to a page only when its guide exists. */
export function mapExperienceCategory(c: Raw): ExperienceCategory<Photo> | null {
  const photo = mapPhoto(c.photo);
  if (!c.slug || !c.title || !photo) return null;
  const activities = (c.activities ?? [])
    .filter((a: Raw) => a?.slug && a.title && a.summary)
    .map((a: Raw) => ({ slug: a.slug, title: a.title, text: a.summary, places: slugs(a.places), ...(a.hasGuide ? { guide: a.slug } : {}) }));
  return { slug: c.slug, title: c.title, photo, intro: c.intro ?? "", season: c.season ?? "", activities };
}

/** Detail page; null unless the guide has a hero, heading, overview and sources. */
export function mapExperienceGuide(e: Raw): ExperienceGuide<Photo> | null {
  const g = e.guide;
  const hero = mapPhoto(g?.hero);
  if (!e.slug || !e.title || !g?.heading || !hero || !g.overview?.length || !g.sources?.length) return null;
  const seo = mapSeo(e.seo);
  return {
    slug: e.slug,
    title: g.pageTitle ?? e.title,
    category: e.category ?? "",
    eyebrow: g.eyebrow ?? "",
    heading: g.heading,
    emphasis: g.emphasis ?? "",
    intro: g.intro ?? "",
    hero,
    place: g.place ?? "",
    overviewTitle: g.overviewTitle ?? "",
    overview: g.overview,
    facts: g.facts ?? [],
    story: (g.story ?? []).filter((s: Raw) => s?.title && s.text?.length).map((s: Raw) => ({ title: s.title, text: s.text, photo: mapPhoto(s.photo) ?? undefined, layout: s.layout ?? undefined })),
    highlights: titled(g.highlights),
    bestTime: g.bestTime ?? "",
    preparation: titled(g.preparation),
    safety: titled(g.safety),
    destinations: slugs(e.places),
    related: slugs(g.related),
    faqs: g.faqs ?? [],
    sources: g.sources ?? [],
    seo: { ...seo, title: seo.title ?? g.pageTitle ?? e.title, description: seo.description ?? g.intro ?? "" },
    ctaPhoto: mapPhoto(g.ctaPhoto) ?? undefined,
  };
}

/** Homepage: each blank CMS field keeps the built-in (local) value. */
export function mapHome(h: Raw | null | undefined, local: HomeContent<Photo>): HomeContent<Photo> {
  if (!h) return local;
  const featured = (h.featuredTreks ?? [])
    .map((t: Raw | null) => {
      const photo = mapPhoto(t?.photo);
      return t?.slug && t.title && photo ? { slug: t.slug, title: t.title, region: t.region ?? "", photo, highPoint: t.highPoint ?? undefined, href: t.hasGuide ? `/treks/${t.slug}` : undefined } : null;
    })
    .filter((t: unknown) => t !== null);
  const text = (k: keyof HomeContent) => (typeof h[k] === "string" && h[k].trim() ? h[k] : local[k]) as string;
  return {
    heroEyebrow: text("heroEyebrow"),
    heroSubline: text("heroSubline"),
    treksIntro: text("treksIntro"),
    featuredTreks: featured.length ? featured : local.featuredTreks,
    beyondTitle: text("beyondTitle"),
    beyondIntro: text("beyondIntro"),
    beyondPhoto: mapPhoto(h.beyondPhoto) ?? local.beyondPhoto,
    toursTitle: text("toursTitle"),
    toursIntro: text("toursIntro"),
    closingTitle: text("closingTitle"),
    closingText: text("closingText"),
    closingPhoto: mapPhoto(h.closingPhoto) ?? local.closingPhoto,
  };
}
