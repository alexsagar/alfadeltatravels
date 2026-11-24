// Document types editors work with. Publishing in Sanity = approved for the
// website; drafts are never read by the site. Commercial details additionally
// need "Confirmed" on the package, and indexing needs "Show in search engines".
import { defineArrayMember, defineField, defineType } from "sanity";

const slug = defineField({
  name: "slug",
  title: "Web address",
  type: "slug",
  description: "Generated from the title. Changing it later breaks existing links.",
  options: { source: "title", maxLength: 80 },
  validation: (r) => r.required(),
});
const seoField = defineField({ name: "seo", title: "Search engines", type: "seo", group: "seo" });
const groups = [
  { name: "main", title: "Main", default: true },
  { name: "guide", title: "General guide" },
  { name: "package", title: "Company package" },
  { name: "media", title: "Photos" },
  { name: "seo", title: "Search engines" },
];

export const trek = defineType({
  name: "trek",
  title: "Trek",
  type: "document",
  groups,
  fields: [
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required() }),
    { ...slug, group: "main" },
    defineField({ name: "region", type: "reference", to: [{ type: "destination" }], group: "main", options: { filter: 'kind == "region"' }, validation: (r) => r.required() }),
    defineField({ name: "difficulty", type: "string", group: "main", options: { list: ["easy", "moderate", "challenging", "strenuous"], layout: "radio" } }),
    defineField({ name: "photo", title: "Card photo", type: "photo", group: ["main", "media"], validation: (r) => r.required() }),
    defineField({ name: "summary", type: "text", rows: 3, group: "main", description: "One or two sentences for cards and search results.", validation: (r) => r.required().max(300) }),
    defineField({ name: "highPoint", title: "High point", type: "string", group: "main", description: "e.g. “Kala Patthar, about 5,545 m”" }),
    defineField({
      name: "guide",
      title: "General route guide",
      type: "object",
      group: "guide",
      description: "General, verifiable information about the route — not your package. Leave empty to list the trek without a detail page.",
      fields: [
        defineField({ name: "hero", title: "Hero photo", type: "photo", validation: (r) => r.required() }),
        defineField({ name: "intro", title: "Intro line", type: "string", description: "One sentence under the page title.", validation: (r) => r.required() }),
        defineField({ name: "overview", title: "Overview paragraphs", type: "array", of: [{ type: "text" }], validation: (r) => r.required().min(1) }),
        defineField({ name: "facts", type: "array", of: [{ type: "fact" }] }),
        defineField({
          name: "highlights",
          type: "array",
          of: [defineArrayMember({ type: "object", name: "highlight", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "text", type: "text" }), defineField({ name: "photo", type: "photo" })] })],
        }),
        defineField({ name: "preparation", type: "array", of: [{ type: "titledText" }] }),
        defineField({ name: "seasons", type: "array", of: [{ type: "season" }] }),
        defineField({ name: "routeTitle", title: "Route section heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "route", title: "Route stops", type: "array", of: [{ type: "routeStop" }], validation: (r) => r.required().min(2) }),
        defineField({ name: "routeNote", title: "Note under the route", type: "text", rows: 2, initialValue: "This is the commonly walked line of the route with approximate elevations, not a company itinerary." }),
        defineField({ name: "considerations", type: "array", of: [{ type: "titledText" }] }),
        defineField({ name: "gallery", type: "array", of: [{ type: "photo" }] }),
        defineField({ name: "faqs", title: "FAQs", type: "array", of: [{ type: "faq" }] }),
        defineField({ name: "sources", type: "array", of: [{ type: "sourceLink" }], description: "Where the facts come from.", validation: (r) => r.required().min(1) }),
      ],
    }),
    defineField({ name: "offering", type: "offering", group: "package" }),
    seoField,
  ],
  // Subtitle flags unfinished guides so editors can spot them in the list.
  preview: {
    select: { title: "title", region: "region.title", guide: "guide.routeTitle", media: "photo" },
    prepare: ({ title, region, guide, media }) => ({ title, media, subtitle: `${region ?? "No region"} · ${guide ? "Guide written" : "Guide needed"}` }),
  },
});

export const tour = defineType({
  name: "tour",
  title: "Tour",
  type: "document",
  groups: groups.filter((g) => g.name !== "guide"),
  fields: [
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required() }),
    { ...slug, group: "main" },
    defineField({ name: "category", type: "string", group: "main", options: { list: ["culture", "wildlife", "leisure", "adventure"], layout: "radio" }, validation: (r) => r.required() }),
    defineField({ name: "destinations", type: "array", group: "main", of: [{ type: "reference", to: [{ type: "destination" }] }], validation: (r) => r.required().min(1) }),
    defineField({ name: "photo", type: "photo", group: "media", validation: (r) => r.required() }),
    defineField({ name: "summary", type: "text", rows: 3, group: "main", validation: (r) => r.required().max(300) }),
    defineField({ name: "highlights", type: "array", group: "main", of: [{ type: "string" }] }),
    defineField({ name: "body", title: "Overview", type: "richText", group: "main" }),
    defineField({ name: "gallery", type: "array", group: "media", of: [{ type: "photo" }] }),
    defineField({ name: "faqs", title: "FAQs", type: "array", group: "main", of: [{ type: "faq" }] }),
    defineField({ name: "offering", type: "offering", group: "package" }),
    seoField,
  ],
  preview: { select: { title: "title", subtitle: "category", media: "photo" } },
});

export const destination = defineType({
  name: "destination",
  title: "Destination",
  type: "document",
  groups: groups.filter((g) => g.name !== "guide" && g.name !== "package"),
  fields: [
    defineField({ name: "title", title: "Name", type: "string", group: "main", validation: (r) => r.required() }),
    { ...slug, group: "main" },
    defineField({ name: "kind", type: "string", group: "main", options: { list: [{ title: "Trekking region", value: "region" }, { title: "City / park / place", value: "place" }], layout: "radio" }, validation: (r) => r.required() }),
    defineField({ name: "photo", type: "photo", group: "media", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Introduction", type: "text", rows: 3, group: "main", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Geography & culture", type: "richText", group: "main", description: "Optional. With text here the destination gets its own page." }),
    defineField({ name: "thingsToDo", title: "Things to do", type: "array", group: "main", of: [{ type: "string" }] }),
    defineField({ name: "bestTime", title: "Best time to visit", type: "text", rows: 3, group: "main" }),
    defineField({ name: "gallery", type: "array", group: "media", of: [{ type: "photo" }] }),
    defineField({ name: "sources", type: "array", group: "main", of: [{ type: "sourceLink" }], description: "Where the facts on this page come from. Editorial record; listed quietly at the foot of the page." }),
    defineField({
      name: "nearby",
      title: "Nearby destinations",
      type: "array",
      group: "main",
      // Weak: never blocks publishing this page; the link only appears once the other destination has a published page.
      of: [{ type: "reference", to: [{ type: "destination" }], weak: true }],
    }),
    seoField,
  ],
  preview: { select: { title: "title", subtitle: "kind", media: "photo" } },
});

/**
 * Experience category (Milestone 9.3): the six groups on /experiences and the
 * homepage "Beyond the Mountains" mosaic. Order = position in both places.
 */
export const experienceCategory = defineType({
  name: "experienceCategory",
  title: "Experience category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    { ...slug, description: "Used for in-page links (/experiences#slug). Changing it breaks existing links." },
    defineField({ name: "order", title: "Display order", type: "number", validation: (r) => r.required().integer().min(1) }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 3, validation: (r) => r.required().max(300) }),
    defineField({ name: "season", title: "When to go", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "photo", title: "Category photo (catalogue and homepage)", type: "photo", validation: (r) => r.required() }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", order: "order", media: "photo" }, prepare: ({ title, order, media }) => ({ title, subtitle: `Position ${order ?? "?"}`, media }) },
});

/**
 * Experience (Milestones 9 and 9.3): one activity in the catalogue. General
 * information only, so no package, price or operator fields (company offers
 * stay on Tour). Like Trek, the optional `guide` turns it into a detail page
 * at /experiences/<slug>; without a guide it is a catalogue entry only.
 * Publication = Sanity's published state; indexing needs seo.index.
 */
export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  groups: [{ name: "main", title: "Main", default: true }, { name: "guide", title: "Detail page" }, { name: "home", title: "Homepage" }, { name: "seo", title: "Search engines" }],
  fields: [
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required() }),
    { ...slug, group: "main" },
    defineField({ name: "category", type: "reference", to: [{ type: "experienceCategory" }], group: "main", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order within category", type: "number", group: "main", validation: (r) => r.required().integer().min(1) }),
    defineField({ name: "summary", title: "Catalogue description", type: "text", rows: 3, group: "main", validation: (r) => r.required().max(300) }),
    defineField({
      name: "destinations",
      title: "Where it happens",
      type: "array",
      group: "main",
      description: "Only places where this activity actually happens, never every place in the same category.",
      // Weak: a destination that is still a draft never blocks this one; its link appears once it is published.
      of: [{ type: "reference", to: [{ type: "destination" }], weak: true }],
    }),
    defineField({
      name: "guide",
      title: "Detail page",
      type: "object",
      group: "guide",
      description: "Fill in to give this experience its own page. Leave empty for a catalogue entry only.",
      fields: [
        defineField({ name: "pageTitle", title: "Page name", type: "string", description: "e.g. “Paragliding in Pokhara” (breadcrumb and structured data)", validation: (r) => r.required() }),
        defineField({ name: "eyebrow", type: "string", validation: (r) => r.required() }),
        defineField({ name: "heading", title: "Heading (H1)", type: "string", validation: (r) => r.required() }),
        defineField({ name: "emphasis", title: "Heading emphasis", type: "string", description: "Shown after the heading in a lighter weight." }),
        defineField({ name: "intro", title: "Intro", type: "text", rows: 3, validation: (r) => r.required() }),
        defineField({ name: "hero", title: "Hero photo", type: "photo", validation: (r) => r.required() }),
        defineField({ name: "place", title: "Main place", type: "string", description: "For structured data, e.g. “Pokhara”.", validation: (r) => r.required() }),
        defineField({ name: "overviewTitle", title: "Overview heading", type: "string", validation: (r) => r.required() }),
        defineField({ name: "overview", title: "Overview paragraphs", type: "array", of: [{ type: "text" }], validation: (r) => r.required().min(1) }),
        defineField({ name: "facts", title: "Key facts", type: "array", of: [{ type: "fact" }] }),
        defineField({
          name: "story",
          title: "Photo sections",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "storySection",
              fields: [
                defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "text", title: "Paragraphs", type: "array", of: [{ type: "text" }], validation: (r) => r.required().min(1) }),
                defineField({ name: "photo", type: "photo" }),
                defineField({ name: "layout", type: "string", options: { list: ["wide", "left", "right"], layout: "radio" }, initialValue: "left" }),
              ],
            }),
          ],
        }),
        defineField({ name: "highlights", type: "array", of: [{ type: "titledText" }] }),
        defineField({ name: "bestTime", title: "Best time to go", type: "text", rows: 4, validation: (r) => r.required() }),
        defineField({ name: "preparation", type: "array", of: [{ type: "titledText" }] }),
        defineField({ name: "safety", title: "Safety and responsible travel", type: "array", of: [{ type: "titledText" }] }),
        defineField({ name: "destinations", title: "Destinations on this page", type: "array", of: [{ type: "reference", to: [{ type: "destination" }], weak: true }] }),
        defineField({ name: "related", title: "Related experiences", type: "array", of: [{ type: "reference", to: [{ type: "experience" }], weak: true }] }),
        defineField({ name: "faqs", title: "FAQs", type: "array", of: [{ type: "faq" }] }),
        defineField({ name: "sources", type: "array", of: [{ type: "sourceLink" }], description: "Where the facts come from.", validation: (r) => r.required().min(1) }),
        defineField({ name: "ctaPhoto", title: "Closing photo", type: "photo" }),
      ],
    }),
    defineField({ name: "featured", title: "Feature on the homepage", type: "boolean", group: "home", initialValue: false }),
    defineField({ name: "homeOrder", title: "Homepage display order", type: "number", group: "home", hidden: ({ document }) => !document?.featured, validation: (r) => r.min(1).integer() }),
    seoField,
  ],
  orderings: [{ title: "Category order", name: "order", by: [{ field: "category.order", direction: "asc" }, { field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", category: "category.title", page: "guide.heading", media: "guide.hero" },
    prepare: ({ title, category, page, media }) => ({ title, media, subtitle: `${category ?? "No category"}${page ? " · Detail page" : ""}` }),
  },
});

/**
 * Homepage (Milestone 9.3), singleton. Copy and picks only: layout, sections
 * and animation stay in code. The site reads only the published document;
 * required fields must be filled before publishing.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroSubline", title: "Hero supporting line", type: "text", rows: 2, description: "The headline “Walk the roof of the world” is part of the cinematic sequence and stays in code." }),
    defineField({ name: "treksIntro", title: "Featured treks introduction", type: "text", rows: 2 }),
    defineField({
      name: "featuredTreks",
      title: "Featured treks",
      type: "array",
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "featuredTrek",
          fields: [
            defineField({ name: "trek", type: "reference", to: [{ type: "trek" }], weak: true, validation: (r) => r.required() }),
            defineField({ name: "title", title: "Card title", type: "string", description: "Optional. Defaults to the trek title." }),
            defineField({ name: "photo", title: "Card photo", type: "photo", description: "Optional. Defaults to the trek photo." }),
          ],
          preview: { select: { title: "title", subtitle: "trek.title", media: "photo" } },
        }),
      ],
    }),
    defineField({ name: "beyondTitle", title: "Experiences section title", type: "string" }),
    defineField({ name: "beyondIntro", title: "Experiences section introduction", type: "text", rows: 3 }),
    defineField({ name: "beyondPhoto", title: "Experiences section opening photo", type: "photo" }),
    defineField({ name: "toursTitle", title: "Tours section title", type: "string" }),
    defineField({ name: "toursIntro", title: "Tours section introduction", type: "text", rows: 2 }),
    defineField({ name: "tourCards", title: "Tours section places", type: "array", of: [defineArrayMember({ type: "object", name: "tourCard", fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), defineField({ name: "theme", type: "string", validation: (r) => r.required() }), defineField({ name: "photo", type: "photo", validation: (r) => r.required() })], preview: { select: { title: "title", subtitle: "theme", media: "photo" } } })] }),
    defineField({ name: "regions", title: "Destinations section regions", type: "array", description: "The first region is shown large.", of: [defineArrayMember({ type: "object", name: "homeRegion", fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), defineField({ name: "note", type: "string", validation: (r) => r.required() }), defineField({ name: "photo", type: "photo", validation: (r) => r.required() })], preview: { select: { title: "title", subtitle: "note", media: "photo" } } })] }),
    defineField({ name: "closingTitle", title: "Closing title", type: "string" }),
    defineField({ name: "closingText", title: "Closing text", type: "text", rows: 3, description: "Do not promise replies or bookings while the enquiry form is not connected." }),
    defineField({ name: "closingPhoto", title: "Closing photo", type: "photo" }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});


export const story = defineType({
  name: "story",
  title: "Story",
  type: "document",
  groups: groups.filter((g) => g.name !== "guide" && g.name !== "package"),
  fields: [
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required() }),
    { ...slug, group: "main" },
    defineField({ name: "category", type: "string", group: "main", options: { list: ["Guide", "Journal"], layout: "radio" }, validation: (r) => r.required() }),
    defineField({ name: "author", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({ name: "publishedAt", title: "Publish date", type: "date", group: "main", validation: (r) => r.required() }),
    defineField({ name: "photo", title: "Main image", type: "photo", group: "media" }),
    defineField({ name: "summary", type: "text", rows: 3, group: "main", validation: (r) => r.required().max(300) }),
    defineField({ name: "body", type: "richText", group: "main", validation: (r) => r.required() }),
    defineField({ name: "destinations", title: "Related destinations", type: "array", group: "main", of: [{ type: "reference", to: [{ type: "destination" }] }] }),
    defineField({
      name: "consent",
      title: "Traveler consent on file",
      type: "boolean",
      group: "main",
      initialValue: false,
      description: "Journals quoting or naming a traveler need their written consent.",
      hidden: ({ document }) => document?.category !== "Journal",
      validation: (r) => r.custom((v, ctx) => (ctx.document?.category === "Journal" && !v ? "A journal can only be published with the traveler's consent" : true)),
    }),
    seoField,
  ],
  orderings: [{ title: "Newest", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "photo" } },
});

/** Singleton. Name and description are required; every other field is optional and simply not shown when blank. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Company & contact",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Company name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Short description", type: "text", rows: 2, description: "Used as the default search description." , validation: (r) => r.required() }),
    defineField({ name: "footerTagline", title: "Footer tagline", type: "string" }),
    defineField({ name: "logo", type: "image" }),
    defineField({
      name: "contact",
      type: "object",
      fields: [
        defineField({ name: "email", type: "string", validation: (r) => r.email() }),
        defineField({ name: "phone", title: "Telephone", type: "string" }),
        defineField({ name: "whatsapp", title: "WhatsApp", type: "string" }),
        defineField({ name: "address", title: "Office address", type: "text", rows: 3 }),
        defineField({ name: "hours", title: "Office hours (Nepal time)", type: "string" }),
      ],
    }),
    defineField({ name: "enquiryEmail", title: "Enquiry inbox", type: "string", description: "Where website enquiries should go once sending is switched on.", validation: (r) => r.email() }),
    defineField({ name: "registration", title: "Company registration / licence", type: "string" }),
    defineField({ name: "memberships", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "social", title: "Social links", type: "array", of: [{ type: "sourceLink" }] }),
    defineField({ name: "about", title: "About page", type: "object", fields: [defineField({ name: "story", title: "Our story", type: "richText" }), defineField({ name: "approach", title: "How we travel", type: "richText" })] }),
    defineField({
      name: "team",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "member",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "role", type: "string", validation: (r) => r.required() }),
            defineField({ name: "bio", type: "text", rows: 3 }),
            defineField({ name: "photo", type: "photo" }),
            defineField({ name: "consent", title: "Consent to publish", type: "boolean", validation: (r) => r.required().custom((v) => (v ? true : "Only publish team members who have agreed")) }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Company & contact" }) },
});

/** Tour theme: the "ways to travel" on /tours (editorial framing, not packages). Order = position. */
export const tourTheme = defineType({
  name: "tourTheme",
  title: "Tour theme",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slug,
    defineField({ name: "order", type: "number", validation: (r) => r.required() }),
    defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "photo", type: "photo", validation: (r) => r.required() }),
    defineField({ name: "places", title: "Places", type: "array", of: [{ type: "reference", to: [{ type: "destination" }], weak: true }] }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", media: "photo" } },
});

export const documents = [homePage, trek, tour, tourTheme, experienceCategory, experience, destination, story, siteSettings];
