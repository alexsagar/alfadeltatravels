// Homepage composition (extracted in Milestone 9.3 so the dev draft preview
// renders exactly the same page). Layout and animation live here; copy,
// featured treks, categories and photos come in as content.
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { About, BeyondMountains, Destinations, FeaturedTreks, PlanCta, Stories, Tours } from "@/components/sections/HomeSections";
import { PhotoBridge } from "@/components/sections/PhotoBridge";
import { ScrollFx } from "@/components/sections/ScrollFx";
import { photos } from "@/content/photos";
import type { ExperienceCategory, HomeContent, Photo } from "@/content/types";
import { BirdJourney } from "@/features/bird/BirdJourney";

export function HomeView({ home, categories }: { home: HomeContent<Photo>; categories: ExperienceCategory<Photo>[] }) {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <BirdJourney eyebrow={home.heroEyebrow} subline={home.heroSubline} />
        <FeaturedTreks intro={home.treksIntro} treks={home.featuredTreks} />
        <BeyondMountains title={home.beyondTitle} intro={home.beyondIntro} photo={home.beyondPhoto} categories={categories} />
        <Tours title={home.toursTitle} intro={home.toursIntro} cards={home.tourCards} />
        <PhotoBridge photo={photos.viewpoint} className="bg-night-900" />
        <Destinations regions={home.regions} />
        <About />
        <Stories />
        <PlanCta title={home.closingTitle} text={home.closingText} photo={home.closingPhoto} />
        <ScrollFx />
      </main>
      <SiteFooter />
    </>
  );
}
