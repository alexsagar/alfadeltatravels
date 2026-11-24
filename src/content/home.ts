// Homepage copy and picks: local source (Milestone 9.3). Mirrors the Sanity
// `homePage` singleton, which replaces this once it is published. Every
// string here is approved copy from Milestones 9.1–9.2.
import type { HomeContent } from "./types";

export const home: HomeContent = {
  heroEyebrow: "Mountains · Rivers · Culture",
  heroSubline: "From Himalayan trails to winding rivers, ancient cities and wild lowlands.",
  treksIntro: "Classic Himalayan routes, from the foot of Everest to the Annapurna Sanctuary and the forested valleys north of Kathmandu.",
  featuredTreks: [
    { slug: "everest-base-camp-trek", title: "Everest Base Camp", region: "Khumbu", photo: "amadablam" },
    { slug: "annapurna-base-camp-trek", title: "Annapurna Base Camp", region: "Annapurna", photo: "abc" },
    { slug: "langtang-valley-trek", title: "Langtang Valley", region: "Langtang", photo: "forest" },
  ],
  beyondTitle: "Beyond the Mountains",
  beyondIntro:
    "Nepal is more than its mountains: open sky above Pokhara, rivers fed by Himalayan snow, ancient cities, lowland jungle and the quiet gardens of Lumbini.",
  beyondPhoto: "paragliding",
  toursTitle: "Journeys across Nepal",
  toursIntro: "Heritage cities, lakeside towns and lowland jungle: Nepal at a gentler pace than the trail.",
  closingTitle: "Your Nepal journey, planned with care",
  closingText: "Treks and high passes, rivers and sky, jungle, old cities and quiet sanctuaries. Gather your ideas and dates on the planning page.",
  closingPhoto: "panorama",
};
