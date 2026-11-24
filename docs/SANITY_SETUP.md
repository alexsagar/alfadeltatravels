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
The site is prerendered at build time and makes no runtime CMS requests, so
**a published change appears after the next build**. Rebuild-on-publish is
the chosen mechanism (simplest; routes, the 404 manifest, sitemap and pages
always change together):
1. In Vercel (project settings → Git → Deploy Hooks) create a deploy hook for
   the review branch.
2. In Sanity Manage → API → Webhooks add a webhook on the `development`
   dataset: trigger on create / update / delete, **drafts off** (published
   documents only), URL = the deploy hook.
3. Each publish then rebuilds the site (a few minutes).

Do not create the webhook or the Vercel project without approval.

## 6. Editing content (Milestone 9.5.1: Sanity is the only source)
1. Open `/studio` (locally `http://localhost:3000/studio`) and sign in.
2. Pick the document: **Company & contact**, **Homepage**, **Treks**,
   **Experience categories**, **Experiences**, **Tour themes**, **Tours**,
   **Destinations** or **Stories & guides**.
3. Edit. Changes are saved as a draft that the website never shows.
4. Press **Publish**. The website shows the change after the next build
   (automatic once the webhook exists; locally run `npm run build`).
5. Check the page. To undo, open the document's history in Studio and
   restore the previous version, then publish again.

**Replacing a photograph:** open the document, click the photo field, upload
or choose another image, and fill in alt text, location, licence,
photographer and source link (required for anything not owned by the
company). Publish. `/image-credits` updates with the next build.

**Rules that still apply**
- Required: the Homepage text fields and photos, and the company name and
  description. If one is missing, the build fails and names the field, so a
  broken page is never published.
- Optional fields that are empty are simply not shown (for example contact
  details). Never type placeholder text into them.
- Pages are indexed by search engines only when "Show in search engines" is
  ticked; the client-review site stays noindex regardless (no
  `NEXT_PUBLIC_SITE_URL` ⇒ robots.txt blocks all crawling).
- Company packages appear only when marked "Confirmed".

**Stays in code by design:** layout, interface labels and buttons,
animation, the logo, the cinematic hero headline and its photographs.

## 7. Vercel client-review site (prepared, not deployed)
Environment variables (all public, no tokens):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=4qnp14bk
NEXT_PUBLIC_SANITY_DATASET=development
# leave NEXT_PUBLIC_SITE_URL unset: canonicals stay on localhost and robots.txt disallows everything
```

- Build command `npm run build` (runs the content manifest first). No
  `SANITY_ALLOW_PRODUCTION_READ`; the site can never read `production`.
- Add the review domain to Sanity CORS origins (with credentials) so `/studio`
  works there.
- Verify a change: publish in Studio → wait for the deploy → reload the page.

## Notes
- Builds fail if Sanity is unreachable or required content is missing —
  deliberately, so a network problem can never publish an empty site.
- `npx sanity dataset export development <file>` makes a backup (keep it out
  of Git, e.g. under `review/`).
- Document ids must not contain "." (dotted ids are private in Sanity and
  invisible to the website). Studio-created documents are fine.
