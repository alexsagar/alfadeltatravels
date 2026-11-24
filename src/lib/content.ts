// Typed content access for pages. Templates call these functions and get the
// site's own types (src/content/types.ts) with resolved photos — they never
// see Sanity documents.
//
// Source of truth: Sanity, published documents only, from the dataset named
// by NEXT_PUBLIC_SANITY_DATASET (src/sanity/env.ts). There is no local
// fallback: required content that is missing fails the build with a clear
// error (MissingContentError); optional content is simply omitted; empty
// collections render their section's empty state.
//
// Caching: every reader is a `"use cache"` function with `cacheLife("max")`
// and the "content" tag, so pages prerender at build time and make no
// runtime CMS requests. New content goes live by rebuilding (Sanity webhook →
// deploy hook); see ARCHITECTURE.md → Content publishing.
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { photos, type Photo } from "@/content/photos";
import type { Destination, ExperienceCategory, ExperienceGuide, HomeContent, SiteSettings, Story, Tour, TourTheme, Trek } from "@/content/types";
import { sanityClient } from "@/sanity/client";
import { compact, mapDestination, mapExperienceCategory, mapExperienceGuide, mapHome, mapSettings, mapStory, mapTour, mapTourTheme, mapTrek } from "@/sanity/map";
import { destinationsQuery, experienceCategoriesQuery, experienceGuidesQuery, homeQuery, settingsQuery, storiesQuery, tourThemesQuery, toursQuery, treksQuery } from "@/sanity/queries";

type Raw = Record<string, unknown>;

function cached() {
  cacheLife("max");
  cacheTag("content");
}

async function fetchCms<T>(query: string, label: string): Promise<T> {
  try {
    // no-store: bypass Next's persistent fetch cache, which survives rebuilds and
    // would otherwise serve content from before the latest publish. Caching is
    // decided once per build by the "use cache" readers below.
    return await sanityClient.fetch<T>(query, {}, { cache: "no-store" });
  } catch (e) {
    throw new Error(`Sanity: could not load ${label} (${(e as Error).message}). Check NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET and network access.`, { cause: e });
  }
}
const list = async <T,>(query: string, label: string, map: (r: Raw) => T | null) => compact((await fetchCms<Raw[]>(query, label)).map(map));

export async function getTreks(): Promise<Trek<Photo>[]> {
  "use cache";
  cached();
  return list(treksQuery, "treks", mapTrek);
}

export async function getTrek(slug: string) {
  return (await getTreks()).find((t) => t.slug === slug);
}

export async function getDestinations(): Promise<Destination<Photo>[]> {
  "use cache";
  cached();
  return list(destinationsQuery, "destinations", mapDestination);
}

export async function getDestination(slug: string) {
  return (await getDestinations()).find((d) => d.slug === slug);
}

/** Tour themes (editorial framing on /tours, not packages). */
export async function getTourThemes(): Promise<TourTheme<Photo>[]> {
  "use cache";
  cached();
  return list(tourThemesQuery, "tour themes", mapTourTheme);
}

export async function getExperienceCategories(): Promise<ExperienceCategory<Photo>[]> {
  "use cache";
  cached();
  return list(experienceCategoriesQuery, "experience categories", mapExperienceCategory);
}

/** Experience detail pages; noindex until each is approved (seo.index). */
export async function getExperienceGuides(): Promise<ExperienceGuide<Photo>[]> {
  "use cache";
  cached();
  const raw = await fetchCms<{ items: Raw[] }>(experienceGuidesQuery, "experience pages");
  return compact(raw.items.map(mapExperienceGuide));
}

export async function getExperienceGuide(slug: string) {
  return (await getExperienceGuides()).find((g) => g.slug === slug);
}

export async function getHome(): Promise<HomeContent<Photo>> {
  "use cache";
  cached();
  return mapHome(await fetchCms<Raw | null>(homeQuery, "homepage"));
}

/** Tour packages; none are published yet, so the section is absent. */
export async function getTours(): Promise<Tour<Photo>[]> {
  "use cache";
  cached();
  return list(toursQuery, "tours", mapTour);
}

export async function getTour(slug: string) {
  return (await getTours()).find((t) => t.slug === slug);
}

export async function getStories(): Promise<Story<Photo>[]> {
  "use cache";
  cached();
  return list(storiesQuery, "stories", mapStory);
}

export async function getStory(slug: string) {
  return (await getStories()).find((s) => s.slug === slug && s.status === "published");
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cached();
  return mapSettings(await fetchCms<Raw | null>(settingsQuery, "company settings"));
}

/**
 * Every photo the site can show, de-duplicated — feeds /image-credits.
 * Includes the bundled scene photos still used by page heroes and the
 * cinematic sequence (src/content/photos.ts), plus every CMS photo.
 */
export async function getImageCredits(): Promise<Photo[]> {
  const [treks, dests, tours, stories, settings, home, themes, categories, guides] = await Promise.all([
    getTreks(), getDestinations(), getTours(), getStories(), getSettings(), getHome(), getTourThemes(), getExperienceCategories(), getExperienceGuides(),
  ]);
  const all: (Photo | undefined)[] = [
    ...Object.values(photos),
    ...treks.flatMap((t) => [t.photo, t.guide?.hero, ...(t.guide?.highlights.map((h) => h.photo) ?? []), ...(t.guide?.gallery ?? [])]),
    ...dests.flatMap((d) => [d.photo, ...(d.gallery ?? [])]),
    ...tours.flatMap((t) => [t.photo, ...t.gallery]),
    ...stories.map((s) => s.photo),
    ...settings.team.map((m) => m.photo),
    home.beyondPhoto, home.closingPhoto, ...home.featuredTreks.map((f) => f.photo), ...home.tourCards.map((c) => c.photo), ...home.regions.map((r) => r.photo),
    ...themes.map((t) => t.photo),
    ...categories.map((c) => c.photo),
    ...guides.flatMap((g) => [g.hero, g.ctaPhoto, ...g.story.map((s) => s.photo)]),
  ];
  // De-duplicate by credit, not URL: a bundled photo and its CMS copy are the same picture.
  const seen = new Map<string, Photo>();
  for (const p of all) if (p && !seen.has(p.sourceUrl || p.src.src)) seen.set(p.sourceUrl || p.src.src, p);
  return [...seen.values()];
}
