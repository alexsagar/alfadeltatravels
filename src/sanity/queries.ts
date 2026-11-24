// GROQ queries. The client already uses the "published" perspective; the
// explicit `!(_id in path("drafts.**"))` filter is a second guard so a
// misconfigured client (e.g. a future preview token) still can't leak drafts
// into public pages.
const published = `!(_id in path("drafts.**")) && defined(slug.current)`;

/** Rich text with inline photo assets expanded. */
const rich = (f: string) => `${f}[]{ ..., _type == "photo" => { ..., asset->{ url, metadata { dimensions, lqip } } } }`;

const photo = `{ alt, location, license, artist, sourceUrl, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip }`;

export const treksQuery = `*[_type == "trek" && ${published}] | order(title asc) {
  "slug": slug.current, title, "region": region->slug.current, difficulty, summary, highPoint,
  photo ${photo},
  guide { hero ${photo}, intro, overview, facts, highlights[]{ title, text, photo ${photo} }, preparation, seasons, routeTitle, route, routeNote, considerations, gallery[] ${photo}, faqs, sources },
  offering, seo
}`;

export const toursQuery = `*[_type == "tour" && ${published}] | order(title asc) {
  "slug": slug.current, title, category, summary, highlights, "body": ${rich("body")}, faqs, offering, seo,
  "destinations": destinations[]->slug.current, photo ${photo}, gallery[] ${photo}
}`;

export const destinationsQuery = `*[_type == "destination" && ${published}] | order(kind desc, title asc) {
  "slug": slug.current, title, kind, summary, "body": ${rich("body")}, thingsToDo, bestTime, sources, seo,
  "nearby": nearby[]->{ "slug": slug.current, title, "hasPage": count(body) > 0 },
  photo ${photo}, gallery[] ${photo},
  "treks": *[_type == "trek" && ${published} && references(^._id)].slug.current
}`;

export const storiesQuery = `*[_type == "story" && ${published} && (category != "Journal" || consent == true)] | order(publishedAt desc) {
  "slug": slug.current, title, category, summary, author, publishedAt, "body": ${rich("body")}, seo,
  photo ${photo}, "destinations": destinations[]->slug.current
}`;

export const settingsQuery = `*[_id == "siteSettings"][0] {
  name, description, footerTagline, contact, enquiryEmail, registration, memberships, social[]{ label, url }, "about": { "story": ${rich("about.story")}, "approach": ${rich("about.approach")} },
  "team": team[consent == true]{ name, role, bio, photo ${photo} }
}`;

/**
 * Slugs that have a detail page — for the build-time route manifest used by
 * Proxy. Conditions mirror the mappers (map.ts): a slug is listed only if its
 * page will actually render.
 */
export const manifestQuery = `{
  "treks": *[_type == "trek" && ${published} && defined(guide.hero.asset) && count(guide.route) >= 2].slug.current,
  "tours": *[_type == "tour" && ${published} && defined(photo.asset)].slug.current,
  "destinations": *[_type == "destination" && ${published} && count(body) > 0].slug.current,
  "stories": *[_type == "story" && ${published} && count(body) > 0 && (category != "Journal" || consent == true)].slug.current,
  "experiences": *[_type == "experience" && ${published} && defined(guide.heading) && defined(guide.hero.asset)].slug.current
}`;

// ── Experiences and homepage (Milestone 9.3) ───────────────────────────────
// Categories carry their published activities in order; an activity links
// to a detail page only when its guide is filled in.
export const experienceCategoriesQuery = `*[_type == "experienceCategory" && ${published}] | order(order asc) {
  "slug": slug.current, title, intro, season, photo ${photo},
  "activities": *[_type == "experience" && ${published} && category._ref == ^._id] | order(order asc) {
    "slug": slug.current, title, summary, "places": destinations[]->slug.current, "hasGuide": defined(guide.heading)
  }
}`;

/** `count` decides the source: any published experience switches catalogue and pages to the CMS (same rule as the manifest). */
export const experienceGuidesQuery = `{ "count": count(*[_type == "experience" && ${published}]), "items": *[_type == "experience" && ${published} && defined(guide.heading)] | order(title asc) {
  "slug": slug.current, title, "category": category->slug.current, "places": guide.destinations[]->slug.current, seo,
  guide { pageTitle, eyebrow, heading, emphasis, intro, place, overviewTitle, overview, facts, bestTime, preparation, safety, faqs, sources,
    highlights, hero ${photo}, ctaPhoto ${photo}, story[]{ title, text, layout, photo ${photo} }, "related": related[]->slug.current }
} }`;

export const homeQuery = `*[_id == "homePage"][0] {
  heroEyebrow, heroSubline, treksIntro, beyondTitle, beyondIntro, toursTitle, toursIntro, closingTitle, closingText,
  beyondPhoto ${photo}, closingPhoto ${photo},
  "featuredTreks": featuredTreks[]{ "card": { title, "photo": photo ${photo} }, "trek": trek->{ "slug": slug.current, title, "region": region->title, highPoint, photo ${photo}, "hasGuide": defined(guide.hero.asset) && count(guide.route) >= 2 } },
  tourCards[]{ title, theme, photo ${photo} }, regions[]{ title, note, photo ${photo} }
}`;

/** Tour themes on /tours, in editor order. */
export const tourThemesQuery = `*[_type == "tourTheme" && ${published}] | order(order asc) {
  "slug": slug.current, title, text, photo ${photo}, "places": places[]->slug.current
}`;
