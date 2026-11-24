// Dataset safety rules (pure, unit-tested in guard.test.mts).
//
// Milestone 7.2: all CMS work happens in `development`. `production` is
// locked: reading it requires an explicit opt-in on the production
// deployment, and writing to it is refused outright until a migration
// milestone lifts the lock here.

const NAME = /^[a-z0-9][a-z0-9_-]{0,63}$/;
export const PRODUCTION = "production";

/** Which dataset the site and Studio read. Never defaults; never falls back. */
export function resolveDataset(raw: string | undefined, allowProductionRead: string | undefined): string {
  const name = raw?.trim() ?? "";
  if (!name) throw new Error("NEXT_PUBLIC_SANITY_DATASET is not set. Use NEXT_PUBLIC_SANITY_DATASET=development for local work (see .env.example).");
  if (!NAME.test(name)) throw new Error(`NEXT_PUBLIC_SANITY_DATASET="${name}" is not a valid Sanity dataset name.`);
  if (name === PRODUCTION && allowProductionRead !== "true")
    throw new Error(
      'The "production" dataset is locked during development. Use NEXT_PUBLIC_SANITY_DATASET=development. ' +
        "Only the production deployment may read production, by also setting SANITY_ALLOW_PRODUCTION_READ=true.",
    );
  return name;
}

/**
 * Gate for any script that writes to Sanity (imports, migrations, deletes).
 * The destination must be passed explicitly — never taken from the
 * environment — and production writes are blocked.
 */
export function assertWritableDataset(target: string | undefined): string {
  if (!target) throw new Error("Refusing to write: pass the destination dataset explicitly, e.g. --dataset=development.");
  if (!NAME.test(target)) throw new Error(`Refusing to write: "${target}" is not a valid dataset name.`);
  if (target === PRODUCTION) throw new Error("Refusing to write to production: production writes are blocked until an approved migration milestone.");
  return target;
}
