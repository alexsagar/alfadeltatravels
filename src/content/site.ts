// Technical site configuration: brand name, canonical origin and route
// constants. Editorial content lives in Sanity (src/lib/content.ts).

// Canonical origin. Set NEXT_PUBLIC_SITE_URL (e.g. https://www.alfadeltatravels.com)
// at build time once the real domain is confirmed. Without it the site builds
// with a localhost origin and robots.ts blocks all crawling, so no misleading
// production URLs are ever published. See ARCHITECTURE.md → SEO.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const site = {
  name: "Alfa Delta Travels",
  // No legal name: the registered company name is unverified (Milestone 9.2), so
  // only the brand appears on the site and in structured data.
  url: siteUrl ?? "http://localhost:3000",
  /** True only when a real public origin has been configured. */
  isPublic: Boolean(siteUrl),
};

/**
 * Primary navigation (header + mobile menu + footer). Five links plus the
 * "Plan your journey" button fit the desktop bar at 1024px; Home is the logo,
 * Contact sits in the mobile menu and footer, Stories in the footer.
 */
export const nav = [
  { label: "Treks", href: "/treks" },
  { label: "Experiences", href: "/experiences" },
  { label: "Tours", href: "/tours" },
  { label: "Destinations", href: "/destinations" },
  { label: "About", href: "/about" },
];
export const storiesHref = "/stories";
export const planHref = "/plan-your-journey";
export const contactHref = "/contact";

