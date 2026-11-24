import type { Metadata } from "next";
import { HomeView } from "@/components/sections/HomeView";
import { photos } from "@/content/photos";
import { JsonLd } from "@/components/page/JsonLd";
import { site } from "@/content/site";
import { getExperienceCategories, getHome } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.name, title: site.name, description: site.description, url: "/", images: [{ url: photos.hero.src.src, width: photos.hero.src.width, height: photos.hero.src.height }] },
};

export default async function HomePage() {
  const [home, categories] = await Promise.all([getHome(), getExperienceCategories()]);
  return (
    <>
      {/* Name and URL only — no address, ratings or claims until the company supplies them. */}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "TravelAgency", name: site.name, url: site.url, logo: `${site.url}/brand/alfa-delta-logo.svg`, description: site.description }} />
      <HomeView home={home} categories={categories} />
    </>
  );
}
