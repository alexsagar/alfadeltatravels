# Project progress

Consolidated record of the milestone reports (Milestone 7.9 to 9.3). Permanent decisions live in `DESIGN.md`, `ARCHITECTURE.md`, `ASSET_LICENSES.md` and `docs/SANITY_SETUP.md`. This file keeps the provenance and the facts that still need checking, so the individual `MILESTONE_*.md` reports can be retired.

## Current state (24 November 2026)

**Public site**
- Renders from local content (`src/content/*`). Nothing in Sanity is published.
- Every route is statically prerendered.
- `robots.txt` disallows everything until `NEXT_PUBLIC_SITE_URL` is set.

**Sanity `development` dataset**

| Type | Drafts |
|---|---|
| Destination | 7 |
| Trek | 4 |
| Experience category | 6 |
| Experience | 25 (4 with a detail page) |
| Homepage | 1 |
| **Total** | **43** |

- 30 image assets (every licensed scene photo).
- Nothing is published, and `seo.index` is false everywhere.

**Sanity `production` dataset**
- 11 Sanity system records only: 10 access groups and 1 retention policy.
- Fingerprint `f5d5df49…120d`, unchanged since Milestone 8.

**Design (approved)**
- Manrope and DM Sans.
- Charcoal, slate and cool-white palette with a restrained red accent.
- The transparent SVG logo on a cool-white navbar and a mist-grey footer.

## Milestones

| Milestone | Outcome | Key decisions |
|---|---|---|
| 7.9 | Audit of seven destinations | Destination drafts corrected in `development` only. |
| 8 | Branding, trek review | Logo integrated. Trek guides drafted for Everest Base Camp, Annapurna Base Camp, Langtang and Mardi Himal. |
| 8.1 / 8.2 | Editorial verification | All elevations are qualified as "approximate; maps differ". Mardi Himal Upper Viewpoint and Base Camp split. Kyanjin cheese dairy and Langtang 2015 avalanche wording verified. |
| 8.3 | Verification report | WMS 2024 altitude guideline reviewed (no contradictions). Department of Tourism request drafted, not sent. Local guide checklist prepared. Production dataset shown to hold system records only. |
| 9 | Experiences | "Beyond the Mountains" homepage section added. `/experiences` catalogue (6 categories, 25 activities). Navigation now Treks · Experiences · Tours · Destinations · About. |
| 9.1 | Visual identity | Fonts changed from Cormorant/Manrope to Manrope/DM Sans. Palette changed from forest/ivory/copper to night/cloud/ink/brand red. |
| 9.2 | Detail pages | `/experiences/{paragliding, white-water-rafting, chitwan-wildlife-safari, lumbini-spiritual-heritage}` (noindex). Rhino and Lumbini photos replaced. Unverified legal name removed from the site. SVG logo. |
| 9.3 | Sanity-first | Experience category and homepage schemas. 32 drafts migrated. All photos in Sanity. Dev-only draft preview. Cleanup proposal. |

## Open verification items

Fact checks, pending correspondence and company/legal details are tracked in `docs/internal/` (kept locally; excluded from the public repository).

## Remaining before launch

- Approve the Sanity drafts, then publish them in Studio.
- Set the production domain, then run the production migration as its own approved milestone.
- Connect the enquiry form after legal approval.
- Set up the webhook that rebuilds the site on publish.
