// Content model shared by pages, local fallback content and Sanity.
//
// Every type is generic over its image type `P`:
//   - local files (treks.ts, places.ts) use `PhotoKey` strings, so they stay
//     plain data that Node scripts and tests can import without image files;
//   - pages receive `P = Photo` (resolved image + credit) from the content
//     layer (src/lib/content), whether the data came from Sanity or local files.
// Field names mirror the Sanity schemas in src/sanity/schemaTypes.
import type { Photo } from "./photos";
import type { PhotoKey } from "./photo-credits";

export type { Photo, PhotoKey };

export type SourceLink = { label: string; url: string; publisher?: string; checkedAt?: string };
export type Fact = { label: string; value: string; note?: string };

export type RouteStop = {
  name: string;
  /** Approximate elevation in metres; published figures differ slightly by source. */
  elevationM: number;
  note: string;
  /** Commonly used as an acclimatisation stop. */
  acclimatise?: boolean;
};

export type Highlight<P = PhotoKey> = { title: string; text: string; photo?: P };
export type Season = { name: string; months: string; text: string; tone: "best" | "good" | "quiet" };
export type Faq = { q: string; a: string };

/** Portable Text from Sanity; absent for local content. Rendered by <RichText>. */
export type RichText = unknown[];

/** SEO overrides. `index` must be explicitly true for a CMS page to be indexable. */
export type Seo = { title?: string; description?: string; index: boolean };

/**
 * General, verifiable destination information about a trek. Kept strictly
 * separate from `offering`, which is the company's own package.
 */
export type TrekGuide<P = PhotoKey> = {
  hero: P;
  intro: string;
  overview: string[];
  facts: Fact[];
  highlights: Highlight<P>[];
  preparation: { title: string; text: string }[];
  seasons: Season[];
  routeTitle: string;
  route: RouteStop[];
  routeNote: string;
  considerations: { title: string; text: string }[];
  gallery: P[];
  faqs: Faq[];
  sources: SourceLink[];
};

export type Price = { amount: number; currency: string; basis: string };

/**
 * The company's own package. The content layer returns `null` unless an
 * editor has ticked "confirmed" — unconfirmed packages never reach a page.
 */
export type Offering = {
  durationDays?: number;
  itinerary: { day: number; title: string; text: string }[];
  inclusions: string[];
  exclusions: string[];
  price?: Price;
  departures?: string[];
  availability?: string;
} | null;
/** @deprecated alias kept for older imports */
export type TrekOffering = Offering;

export type RegionSlug = "khumbu" | "annapurna" | "langtang";
export type Difficulty = "easy" | "moderate" | "challenging" | "strenuous";

export type Trek<P = PhotoKey> = {
  slug: string;
  title: string;
  region: RegionSlug;
  photo: P;
  summary: string;
  difficulty?: Difficulty;
  /** Highest commonly visited point, as shown on cards. */
  highPoint?: string;
  guide?: TrekGuide<P>;
  offering: Offering;
  seo?: Seo;
};

export type Destination<P = PhotoKey> = {
  slug: string;
  title: string;
  kind: "region" | "place";
  photo: P;
  summary: string;
  /** Slugs of treks that pass through this destination. */
  treks?: string[];
  /** Detail-page content (CMS only). A destination with no body has no detail page. */
  body?: RichText;
  thingsToDo?: string[];
  bestTime?: string;
  gallery?: P[];
  sources?: SourceLink[];
  /** Related destinations that have a published page. */
  nearby?: { slug: string; title: string }[];
  seo?: Seo;
};

export type TourTheme<P = PhotoKey> = {
  slug: string;
  title: string;
  photo: P;
  text: string;
  /** Places that suit this theme (destination slugs). */
  places: string[];
};

/** A tour package (CMS only; none exist locally). */
export type Tour<P = PhotoKey> = {
  slug: string;
  title: string;
  category: "culture" | "wildlife" | "leisure" | "adventure";
  photo: P;
  summary: string;
  destinations: string[];
  highlights: string[];
  body?: RichText;
  gallery: P[];
  faqs: Faq[];
  offering: Offering;
  seo?: Seo;
};

export type Story<P = PhotoKey> = {
  slug: string;
  title: string;
  category: "Guide" | "Journal";
  summary: string;
  status: "planned" | "published";
  author?: string;
  publishedAt?: string;
  photo?: P;
  body?: RichText;
  destinations?: string[];
  seo?: Seo;
};

/** Company settings. Every field is optional; pages show "to be supplied" for blanks. */
export type SiteSettings = {
  name: string;
  description: string;
  contact: { email?: string; phone?: string; whatsapp?: string; address?: string; hours?: string };
  enquiryEmail?: string;
  registration?: string;
  memberships: string[];
  social: { label: string; url: string }[];
  about?: { story?: RichText; approach?: RichText };
  team: { name: string; role: string; bio?: string; photo?: Photo }[];
};

/** One activity inside an experience category. `slug` reserves a future detail page. */
export type ExperienceActivity = {
  slug: string;
  title: string;
  text: string;
  /** Detail page slug in experience-guides.ts, when one exists. */
  guide?: string;
  /** Destination slugs where it genuinely takes place, set by hand (never inferred from the category). */
  places: string[];
};

/** Experience category (Sky, Rivers, …): general information only, never a company product. */
export type ExperienceCategory<P = PhotoKey> = {
  slug: string;
  title: string;
  photo: P;
  intro: string;
  season: string;
  activities: ExperienceActivity[];
};

/**
 * Experience detail page (Milestone 9.2): general, sourced visitor
 * information about one experience in one place. Mirrors the `experience`
 * Sanity schema (summary, body, bestTime, preparation, safety, faqs, sources,
 * photo, gallery, destinations, seo); `story` and `facts` map to `body`.
 */
export type ExperienceGuide<P = PhotoKey> = {
  slug: string;
  title: string;
  /** Category slug in experiences.ts. */
  category: string;
  eyebrow: string;
  /** H1; `emphasis` renders as the lighter-weight phrase. */
  heading: string;
  emphasis: string;
  intro: string;
  hero: P;
  heroPosition?: string;
  /** Main place, for structured data. */
  place: string;
  overviewTitle: string;
  overview: string[];
  facts: Fact[];
  /** Editorial sections with alternating photographs. */
  story: { title: string; text: string[]; photo?: P; layout?: "left" | "right" | "wide" }[];
  highlights: { title: string; text: string }[];
  bestTime: string;
  preparation: { title: string; text: string }[];
  safety: { title: string; text: string }[];
  /** Destination slugs (linked only if the destination exists on the site). */
  destinations: string[];
  /** Related catalogue activity slugs. */
  related: string[];
  faqs: Faq[];
  sources: SourceLink[];
  seo: Seo & { title: string; description: string };
  ctaPhoto?: P;
};

/** A homepage featured-trek card. `href` only when the trek has a public guide page. */
export type FeaturedTrek<P = PhotoKey> = { slug: string; title: string; region: string; photo: P; highPoint?: string; href?: string };

/**
 * Homepage copy and picks (Milestone 9.3). Mirrors the `homePage` Sanity
 * singleton; layout, section order and animation stay in code.
 */
export type HomeContent<P = PhotoKey> = {
  heroEyebrow: string;
  heroSubline: string;
  treksIntro: string;
  featuredTreks: FeaturedTrek<P>[];
  beyondTitle: string;
  beyondIntro: string;
  beyondPhoto: P;
  toursTitle: string;
  toursIntro: string;
  closingTitle: string;
  closingText: string;
  closingPhoto: P;
};
