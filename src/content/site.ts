// Static content for Milestone 1. Moves to Sanity in a later milestone.
// Anything marked `placeholder: true` is NOT real company data.

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
  description:
    "Treks, adventures and cultural journeys across Nepal, from the Himalaya to the lowland jungle, planned by Alfa Delta Travels.",
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

// Tour placeholders: real places, generic themes only. No itineraries yet.
export const tours: { title: string; theme: string; photo: "kathmandu" | "pokhara" | "chitwan" | "lumbini"; placeholder: true }[] = [
  { title: "Kathmandu Valley", theme: "Heritage", photo: "kathmandu", placeholder: true },
  { title: "Pokhara", theme: "Lakes & hills", photo: "pokhara", placeholder: true },
  { title: "Chitwan", theme: "Jungle & wildlife", photo: "chitwan", placeholder: true },
  { title: "Lumbini", theme: "Pilgrimage", photo: "lumbini", placeholder: true },
];

// Destination regions, each shown with a licensed photo actually taken there.
export const regions: { title: string; note: string; photo: "village" | "alpine" | "forest" }[] = [
  { title: "Annapurna", note: "Stone villages, terraced hillsides and high passes.", photo: "village" },
  { title: "Khumbu", note: "Moraine, cairns and glacial lakes beneath the highest peaks on earth.", photo: "alpine" },
  { title: "Langtang", note: "Forest trails into a valley north of Kathmandu.", photo: "forest" },
];
