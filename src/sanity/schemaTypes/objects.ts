// Reusable field groups: photo (with credit), SEO, FAQ, source link, facts,
// route stops, seasons, itinerary days and the commercial "offering".
import { defineArrayMember, defineField, defineType } from "sanity";

const licences = [
  { title: "Own photo (Alfa Delta Travels)", value: "own" },
  { title: "Used with photographer's permission", value: "permission" },
  { title: "CC0 1.0 (public domain)", value: "CC0 1.0" },
  { title: "CC BY 2.0", value: "CC BY 2.0" },
  { title: "CC BY 3.0", value: "CC BY 3.0" },
  { title: "CC BY 4.0", value: "CC BY 4.0" },
  { title: "CC BY-SA 2.0", value: "CC BY-SA 2.0" },
  { title: "CC BY-SA 3.0", value: "CC BY-SA 3.0" },
  { title: "CC BY-SA 4.0", value: "CC BY-SA 4.0" },
];
const needsCredit = (licence?: string) => !!licence && licence !== "own";

/** Image + everything the site needs to show and credit it honestly. */
export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "image",
  options: { hotspot: true, metadata: ["lqip"] },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe what is in the picture for people who cannot see it, e.g. “Tengboche Monastery with Ama Dablam behind”.",
      validation: (r) => r.required().min(10).max(160),
    }),
    defineField({
      name: "location",
      title: "Where it was taken",
      type: "string",
      description: "The real place shown — appears as “Pictured: …”. Never label a photo with a place it does not show.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "license",
      title: "Licence",
      type: "string",
      options: { list: licences },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "artist",
      title: "Photographer",
      type: "string",
      hidden: ({ parent }) => !needsCredit(parent?.license),
      validation: (r) => r.custom((v, ctx) => (needsCredit((ctx.parent as { license?: string })?.license) && !v ? "Photographer is required for this licence" : true)),
    }),
    defineField({
      name: "sourceUrl",
      title: "Source link",
      type: "url",
      description: "Page where the original photo and its licence can be checked (e.g. the Wikimedia Commons file page).",
      hidden: ({ parent }) => !needsCredit(parent?.license),
      validation: (r) => r.custom((v, ctx) => (needsCredit((ctx.parent as { license?: string })?.license) && !v ? "Source link is required for this licence" : true)),
    }),
  ],
});

export const seo = defineType({
  name: "seo",
  title: "Search engines",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "index",
      title: "Show in search engines",
      type: "boolean",
      initialValue: false,
      description: "Leave off until the page's content has been checked and approved. Off = the page is published but marked noindex and left out of the sitemap.",
    }),
    defineField({ name: "title", title: "Search title", type: "string", description: "Optional. Defaults to the page title.", validation: (r) => r.max(60).warning("Keep under 60 characters") }),
    defineField({ name: "description", title: "Search description", type: "text", rows: 3, validation: (r) => r.max(160).warning("Keep under 160 characters") }),
  ],
});

export const faq = defineType({
  name: "faq",
  title: "Question",
  type: "object",
  fields: [
    defineField({ name: "q", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "a", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "q" } },
});

export const sourceLink = defineType({
  name: "sourceLink",
  title: "Source",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Source title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "publisher", title: "Publisher or organisation", type: "string" }),
    defineField({ name: "url", title: "Original URL", type: "url", validation: (r) => r.required() }),
    defineField({ name: "checkedAt", title: "Date checked", type: "date" }),
  ],
  preview: { select: { title: "label", publisher: "publisher", checkedAt: "checkedAt" }, prepare: ({ title, publisher, checkedAt }) => ({ title, subtitle: [publisher, checkedAt && `checked ${checkedAt}`].filter(Boolean).join(" · ") }) },
});

export const fact = defineType({
  name: "fact",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
    defineField({ name: "note", type: "string", description: "Caveat, e.g. “Published heights vary by survey.”" }),
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});

export const routeStop = defineType({
  name: "routeStop",
  title: "Route stop",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "elevationM", title: "Approx. elevation (m)", type: "number", validation: (r) => r.required().min(0).max(9000) }),
    defineField({ name: "note", type: "string", validation: (r) => r.required() }),
    defineField({ name: "acclimatise", title: "Common acclimatisation stop", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { name: "name", m: "elevationM", acc: "acclimatise" },
    prepare: ({ name, m, acc }) => ({ title: name, subtitle: `${m != null ? `${m.toLocaleString("en")} m` : "No elevation"}${acc ? " · acclimatisation stop" : ""}` }),
  },
});

export const season = defineType({
  name: "season",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "months", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tone", type: "string", options: { list: ["best", "good", "quiet"], layout: "radio" }, validation: (r) => r.required() }),
    defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { name: "name", months: "months", tone: "tone" }, prepare: ({ name, months, tone }) => ({ title: name, subtitle: [months, tone && `${tone} season`].filter(Boolean).join(" · ") }) },
});

export const titledText = defineType({
  name: "titledText",
  title: "Titled paragraph",
  type: "object",
  fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), defineField({ name: "text", type: "text", rows: 4, validation: (r) => r.required() })],
});

/**
 * The company's commercial package. Nothing in here is shown on the website
 * until "Confirmed" is ticked — so a half-filled package can be saved safely.
 */
export const offering = defineType({
  name: "offering",
  title: "Company package",
  type: "object",
  description: "Your own itinerary, inclusions and price. Hidden on the website until “Confirmed” is ticked.",
  fields: [
    defineField({ name: "confirmed", title: "Confirmed — show on website", type: "boolean", initialValue: false }),
    defineField({ name: "durationDays", title: "Length (days)", type: "number", validation: (r) => r.min(1).max(60) }),
    defineField({
      name: "itinerary",
      title: "Day-by-day itinerary",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "itineraryDay",
          fields: [
            defineField({ name: "day", type: "number", validation: (r) => r.required().min(1) }),
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", type: "text", rows: 3 }),
          ],
          preview: { select: { day: "day", title: "title" }, prepare: ({ day, title }) => ({ title: `Day ${day} · ${title}` }) },
        }),
      ],
    }),
    defineField({ name: "inclusions", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "exclusions", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "price",
      type: "object",
      description: "Optional. Leave empty to show no price.",
      fields: [
        defineField({ name: "amount", type: "number", validation: (r) => r.min(0) }),
        defineField({ name: "currency", type: "string", options: { list: ["USD", "EUR", "GBP", "NPR"] } }),
        defineField({ name: "basis", type: "string", description: "e.g. “per person, group of 2–4”" }),
      ],
    }),
    defineField({ name: "departures", title: "Fixed departures", type: "array", of: [{ type: "date" }] }),
    defineField({ name: "availability", type: "string", description: "e.g. “Private departures on request”" }),
  ],
  validation: (r) =>
    r.custom((v: { confirmed?: boolean; durationDays?: number; itinerary?: unknown[] } | undefined) =>
      v?.confirmed && (!v.durationDays || !v.itinerary?.length) ? "A confirmed package needs a length and an itinerary" : true,
    ),
});

/** Rich text with optional inline photos (stories, destination pages). */
export const richText = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "Heading", value: "h2" }, { title: "Subheading", value: "h3" }, { title: "Quote", value: "blockquote" }] }),
    defineArrayMember({ type: "photo" }),
  ],
});

export const objects = [photo, seo, faq, sourceLink, fact, routeStop, season, titledText, offering, richText];
