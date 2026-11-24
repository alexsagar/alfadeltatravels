// Typed content access for pages. Templates call these functions and get the
// site's own types (src/content/types.ts) with resolved photos — they never
// see Sanity documents.
//
// Source of truth:
//   - Sanity (published documents only) when NEXT_PUBLIC_SANITY_PROJECT_ID is set;
//   - otherwise the local files in src/content — the documented development
//     fallback. Local content is also used per type when the CMS has no
//     published documents of that type yet, so an empty dataset can never
//     blank out a working page.
//
// Caching: every reader is a `"use cache"` function with `cacheLife("max")`
// and the "content" tag, so pages prerender at build time and make no
// runtime CMS requests. New content goes live by rebuilding (Sanity webhook →
// deploy hook); see ARCHITECTURE.md → Content publishing.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { destinations as localDestinations, stories as localStories, tourThemes as localThemes } from "@/content/places";
import { experienceGuides } from "@/content/experience-guides";
import { experienceCategories } from "@/content/experiences";
import { home } from "@/content/home";
import { photos, type Photo } from "@/content/photos";
import { site } from "@/content/site";
import { treks as localTreks } from "@/content/treks";
import type { Destination, ExperienceCategory, ExperienceGuide, HomeContent, SiteSettings, Story, Tour, TourTheme, Trek, TrekGuide } from "@/content/types";
import { sanityClient } from "@/sanity/client";
import { cutover, type CutoverType } from "@/sanity/cutover";
import { compact, mapDestination, mapExperienceCategory, mapExperienceGuide, mapHome, mapSettings, mapStory, mapTour, mapTrek } from "@/sanity/map";
import { destinationsQuery, experienceCategoriesQuery, experienceGuidesQuery, homeQuery, settingsQuery, storiesQuery, toursQuery, treksQuery } from "@/sanity/queries";

export const contentSource = sanityClient ? "sanity" : "local";

function cached() {
  cacheLife("max");
  cacheTag("content");
}

/** Sanity client for a gated type: null (local content) unless the type is in SANITY_CUTOVER. */
const gated = (type: CutoverType) => (cutover.has(type) ? sanityClient : null);

async function fromSanity<T>(query: string, client = sanityClient): Promise<T[] | null> {
  if (!client) return null;
  return client.fetch<T[]>(query);
}

// ── Local fallback: resolve photo keys to Photo objects ─────────────────────
const resolveGuide = (g: TrekGuide): TrekGuide<Photo> => ({
  ...g,
  hero: photos[g.hero],
  highlights: g.highlights.map((h) => ({ ...h, photo: h.photo ? photos[h.photo] : undefined })),
  gallery: g.gallery.map((k) => photos[k]),
});
// Local treks predate the CMS: their guides are reviewed general information,
// so they keep the indexing decided in Milestone 6A (see lib/seo.ts).
const localTrekViews = (): Trek<Photo>[] =>
  localTreks.map((t) => ({ ...t, photo: photos[t.photo], guide: t.guide && resolveGuide(t.guide), seo: { index: !!t.guide } }));

// ── Readers ─────────────────────────────────────────────────────────────────
export async function getTreks(): Promise<Trek<Photo>[]> {
  "use cache";
  cached();
  const raw = await fromSanity<Record<string, unknown>>(treksQuery, gated("treks"));
  const cms = raw && compact(raw.map(mapTrek));
  return cms?.length ? cms : localTrekViews();
}

export async function getTrek(slug: string) {
  return (await getTreks()).find((t) => t.slug === slug);
}

export async function getDestinations(): Promise<Destination<Photo>[]> {
  "use cache";
  cached();
  const raw = await fromSanity<Record<string, unknown>>(destinationsQuery, gated("destinations"));
  const cms = raw && compact(raw.map(mapDestination));
  return cms?.length ? cms : localDestinations.map((d) => ({ ...d, photo: photos[d.photo], gallery: [] }));
}

export async function getDestination(slug: string) {
  return (await getDestinations()).find((d) => d.slug === slug);
}

/** Tour themes stay local (editorial framing, not packages). */
export async function getTourThemes(): Promise<TourTheme<Photo>[]> {
  return localThemes.map((t) => ({ ...t, photo: photos[t.photo] }));
}

// ── Experiences and homepage (Milestone 9.3) ────────────────────────────────
// Each has a pure `resolve*` step (raw CMS result → site types, falling back
// to local content when the CMS has nothing published). Public readers feed
// it published data at build time; the dev-only draft preview feeds it
// exported draft fixtures. Same mapping, so preview and site cannot drift.
type Raw = Record<string, unknown>;

const localCategories = () => experienceCategories.map((c) => ({ ...c, photo: photos[c.photo] }));
const localGuides = () =>
  experienceGuides.map((g) => ({ ...g, hero: photos[g.hero], ctaPhoto: g.ctaPhoto && photos[g.ctaPhoto], story: g.story.map((s) => ({ ...s, photo: s.photo && photos[s.photo] })) }));

export function resolveExperienceCategories(raw: Raw[] | null): ExperienceCategory<Photo>[] {
  const cms = raw && compact(raw.map(mapExperienceCategory));
  return cms?.length ? cms : localCategories();
}

export function resolveExperienceGuides(raw: { count: number; items: Raw[] } | null): ExperienceGuide<Photo>[] {
  return raw?.count ? compact(raw.items.map(mapExperienceGuide)) : localGuides();
}

/** Local homepage copy, with each featured trek linked only if its guide page exists. */
export async function localHome(treks: Trek<Photo>[]): Promise<HomeContent<Photo>> {
  return {
    ...home,
    beyondPhoto: photos[home.beyondPhoto],
    closingPhoto: photos[home.closingPhoto],
    featuredTreks: home.featuredTreks.map((f) => {
      const t = treks.find((x) => x.slug === f.slug);
      return { ...f, photo: photos[f.photo], highPoint: t?.highPoint, href: t?.guide ? `/treks/${f.slug}` : undefined };
    }),
  };
}

export async function getExperienceCategories(): Promise<ExperienceCategory<Photo>[]> {
  "use cache";
  cached();
  return resolveExperienceCategories(await fromSanity<Raw>(experienceCategoriesQuery, gated("experiences")));
}

/** Experience detail pages; noindex until each is approved (seo.index). */
export async function getExperienceGuides(): Promise<ExperienceGuide<Photo>[]> {
  "use cache";
  cached();
  return resolveExperienceGuides(gated("experiences") ? await sanityClient!.fetch(experienceGuidesQuery) : null);
}

export async function getExperienceGuide(slug: string) {
  return (await getExperienceGuides()).find((g) => g.slug === slug);
}

export async function getHome(): Promise<HomeContent<Photo>> {
  "use cache";
  cached();
  const raw = gated("home") ? await sanityClient!.fetch(homeQuery) : null;
  return mapHome(raw, await localHome(await getTreks()));
}

/** Tour packages exist only in the CMS; locally there are none (nothing is invented). */
export async function getTours(): Promise<Tour<Photo>[]> {
  "use cache";
  cached();
  const raw = await fromSanity<Record<string, unknown>>(toursQuery);
  return raw ? compact(raw.map(mapTour)) : [];
}

export async function getTour(slug: string) {
  return (await getTours()).find((t) => t.slug === slug);
}

/** Published stories from the CMS, or the planned (unlinked) titles locally. */
export async function getStories(): Promise<Story<Photo>[]> {
  "use cache";
  cached();
  const raw = await fromSanity<Record<string, unknown>>(storiesQuery);
  const cms = raw && compact(raw.map(mapStory));
  return cms?.length ? cms : localStories.map((s) => ({ ...s, photo: undefined }));
}

export async function getStory(slug: string) {
  return (await getStories()).find((s) => s.slug === slug && s.status === "published");
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cached();
  const raw = sanityClient ? await sanityClient.fetch(settingsQuery) : null;
  return mapSettings(raw, site);
}

/** Every photo the site can show, de-duplicated — feeds /image-credits. */
export async function getImageCredits(): Promise<Photo[]> {
  const [treks, dests, tours, stories, settings] = await Promise.all([getTreks(), getDestinations(), getTours(), getStories(), getSettings()]);
  const all: (Photo | undefined)[] = [
    ...Object.values(photos),
    ...treks.flatMap((t) => [t.photo, t.guide?.hero, ...(t.guide?.highlights.map((h) => h.photo) ?? []), ...(t.guide?.gallery ?? [])]),
    ...dests.flatMap((d) => [d.photo, ...(d.gallery ?? [])]),
    ...tours.flatMap((t) => [t.photo, ...t.gallery]),
    ...stories.map((s) => s.photo),
    ...settings.team.map((m) => m.photo),
  ];
  const seen = new Map<string, Photo>();
  for (const p of all) if (p && !seen.has(p.src.src)) seen.set(p.src.src, p);
  return [...seen.values()];
}
