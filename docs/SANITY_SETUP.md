# Sanity setup

**Status (Milestone 7.2, 2026-11-20)**
- Project `4qnp14bk`. Datasets: `development` (public, created 7.2) and
  `production` (public). Both hold 0 content documents (`development` also
  has Sanity's 11 automatic `system.*` documents).
- Local work uses `development` (`.env.local`, git-ignored). Studio title
  shows the dataset: “Alfa Delta Travels · development”.
- CORS: `http://localhost:3000` (credentials) is allowed. Sanity CLI is
  logged in on this machine (`npx sanity login --provider sanity`).

## Production isolation (src/sanity/guard.ts, tested)
- `NEXT_PUBLIC_SANITY_DATASET` is required whenever a project id is set — no
  default, no fallback. Missing/invalid ⇒ build, dev, manifest script and CLI
  stop with a clear error.
- `production` is locked: the site/manifest only read it when
  `SANITY_ALLOW_PRODUCTION_READ=true` is also set (production deployment
  only); Studio and `sanity.cli.ts` never accept it.
- Write scripts must call `assertWritableDataset(target)` with an explicit
  `--dataset` argument; `production` is refused.
- **Known gap:** Sanity CLI commands that take a dataset as an explicit
  argument or `--dataset` flag (e.g. `sanity dataset import x production`,
  `sanity documents query --dataset production`) bypass the config. Never run
  CLI write commands against `production`; migrations go through our scripts.
- No tokens are used or stored by the site.

## 1. Create the project (free plan)
1. Sign in at <https://www.sanity.io/manage> with the company account.
2. Create a project ("Alfa Delta Travels") with a dataset named `production`,
   visibility **Public** (the site reads published content anonymously; no
   token is needed or stored). Drafts are never public, whatever the setting.
3. Copy the **Project ID**.

## 2. Configure the site
Create `.env.local` (never commit it) — see `.env.example`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<project id>
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SITE_URL=https://<real domain>   # only once the domain is confirmed
```

Set the same variables in the hosting provider's build settings.

## 3. Allow the Studio origin
In Manage → API → CORS origins add `http://localhost:3000` (with
credentials) and later the production origin. Studio runs at `/studio`.

## 4. Invite editors
Manage → Members. Editors sign in with their own Sanity account; the
website stores no Sanity tokens.

## 5. Publishing → live site (rebuild on publish)
The site is prerendered at build time and makes no runtime CMS requests.
To make published changes go live automatically:
1. In the host (Cloudflare Pages / Workers Builds) create a **deploy hook**.
2. In Sanity Manage → API → Webhooks add a webhook: trigger on create /
   update / delete, filter `_type in ["trek","tour","destination","story","siteSettings"]`,
   **drafts off** (published documents only), URL = the deploy hook.
3. Each publish then rebuilds the site (a few minutes). The build fetches
   content and the slug manifest from the same dataset in one step, so new
   pages, listings, sitemap and Proxy 404 rules always agree.

## 6. First content
Follow the internal content checklist (docs/internal/, not in the repository). Start with **Company & contact**.
Migrating the existing local content is described in ARCHITECTURE.md →
"Content migration".

## Notes
- Builds fail if Sanity is configured but unreachable — deliberately, so a
  network problem can never publish an empty site.
- `npx sanity schema deploy` / `npx sanity dataset export` use `sanity.cli.ts`
  with the same environment variables.

## Milestone 9.3: Sanity-first content

**Editable in Studio (development, drafts)**
- Homepage (singleton): hero eyebrow and subline, featured treks, Experiences and Tours copy, closing CTA and photos.
- Experience categories (6) and Experiences (25). Fill in an experience's "Detail page" group to give it its own page.
- Destinations and Treks (existing drafts).
- Company & contact. A footer tagline field was added.

**Stays in code by design**
- Layout, section order and animation (GSAP, Lottie, clouds).
- The logo, favicon and UI icons.
- The cinematic hero headline and photo sequence.

**Migration (repeatable, development only)**
```
npx sanity exec scripts/m93-migrate-experiences.mts --with-user-token -- --dataset=development            # dry run
npx sanity exec scripts/m93-migrate-experiences.mts --with-user-token -- --dataset=development --execute  # create drafts
```
- It refuses to run if any planned id already exists, so it never overwrites drafts.
- Image assets are content-addressed and reused.

**Editorial preview (local, drafts)**
1. Export the drafts. The Sanity CLI token stays in these scripts; the app never holds a token:
   ```
   npx sanity exec scripts/export-draft-preview.mts --with-user-token
   node --no-warnings --env-file=.env.local scripts/export-trek-preview-fixtures.mts
   node --no-warnings --env-file=.env.local scripts/export-destination-audit-fixtures.mts
   ```
2. Run `npm run dev` and open:
   - `/preview-home`
   - `/preview/experiences`
   - `/preview/experience?slug=paragliding`
   - `/preview/trek?slug=…`
   - `/preview/destination?slug=…`
3. These routes are `.dev.tsx` pages: they do not exist in production builds (they return 404) and they are marked noindex.

**Switching the public site to Sanity**

- Treks, destinations, experiences and the homepage use local content until they are opted in with `SANITY_CUTOVER` (for example `SANITY_CUTOVER=experiences,home`). Tours, stories and settings exist only in Sanity and are not gated.
- Opt a type in only after **all** of its documents are published, then rebuild. The manifest, sitemap and pages switch together, so publishing a few documents can never replace a complete local set with an incomplete one.
- An unknown type name fails the build loudly.
- Indexing still needs `seo.index` on each document.
