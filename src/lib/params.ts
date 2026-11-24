// generateStaticParams helper. With Cache Components a dynamic route must
// prerender at least one param; when the CMS has no documents of a type yet
// we prerender a sentinel slug that resolves to notFound(). Proxy 404s every
// real request for an unknown slug anyway (see src/proxy.ts).
export const NO_CONTENT = "__none";
export const staticSlugs = (slugs: string[]) => (slugs.length ? slugs : [NO_CONTENT]).map((slug) => ({ slug }));
