# Sanity content models

Implemented in Milestone 7: `src/sanity/schemaTypes/`. Not yet connected to a
live project (docs/SANITY_SETUP.md). The text below is the design reference;
the schema files are authoritative. Field names match `src/content/types.ts`, so
pages keep working when static files in `src/content/` are replaced by GROQ
queries returning the same shapes.

## Shared objects

| Object | Fields |
|---|---|
| `photo` | `image` (Sanity image + hotspot), `alt` (required), `location` (required, where it was actually taken), `artist`, `license`, `licenseUrl`, `sourceUrl` |
| `seo` | `title`, `description`, `ogImage` (photo), `index` (boolean, default **false**) — drives robots and the sitemap |
| `fact` | `label`, `value`, `note` |
| `faq` | `q`, `a` (portable text, short) |
| `sourceLink` | `label`, `url` |

## Documents

**`trek`** — `title`, `slug`, `region` (ref → destination), `photo`, `summary`,
`highPoint`, `seo`, and two clearly separated groups:

- `guide` (general, verifiable route information): `hero`, `intro`,
  `overview[]`, `facts[]`, `highlights[]` (title, text, photo),
  `preparation[]`, `seasons[]` (name, months, tone, text), `routeTitle`,
  `route[]` (`routeStop`: name, elevationM, note, acclimatise), `routeNote`,
  `considerations[]`, `gallery[]` (photo), `faqs[]`, `sources[]`.
- `offering` (the company's package, editor-approved only): `durationDays`,
  `itinerary[]` (`itineraryDay`: day, title, text, overnight, elevationM),
  `inclusions[]`, `exclusions[]`, `price` (optional, with currency and basis),
  `departures[]` (optional), `approvedBy`, `approvedAt`.
  Pages render the "Awaiting company" notice while `offering` is empty.

**`tour`** — `title`, `slug`, `theme` (ref → tourTheme), `destinations[]`
(refs), `photo`, `summary`, `offering` (same shape as trek offering), `seo`.

**`tourTheme`** — `title`, `slug`, `photo`, `text`, `places[]` (refs).

**`destination`** — `title`, `slug`, `kind` (region | place), `photo`,
`summary`, `body` (portable text), `gallery[]`, `seo`. Treks link back via
their `region` reference.

**`story`** — `title`, `slug`, `category` (Guide | Journal), `summary`,
`body`, `hero` (photo), `author`, `publishedAt`, `status`
(planned | published), `consent` (required true for Journal), `related[]`
(refs to treks/destinations), `seo`.

**`siteSettings`** (singleton) — company name, contact details (email,
phone, address, hours), registration and memberships, social links. Every
field optional; the Contact and About pages show "To be supplied" for blanks.

## Rules enforced in schema validation
- `photo.location` and `photo.alt` required.
- `seo.index` defaults to false; publishing a page to the sitemap is an explicit editor choice.
- No rating/review fields — structured data never carries ratings we don't have.
