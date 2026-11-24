import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Until NEXT_PUBLIC_SITE_URL is configured the whole site is disallowed, so a
// preview or local build can never be indexed under a wrong origin.
export default function robots(): MetadataRoute.Robots {
  if (!site.isPublic) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/lab/", "/studio"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
