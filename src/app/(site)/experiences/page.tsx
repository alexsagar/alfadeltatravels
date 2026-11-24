import { photos } from "@/content/photos";
import { getDestinations, getExperienceCategories } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { ExperiencesView } from "./ExperiencesView";

export const metadata = pageMetadata({
  title: "Experiences in Nepal: adventure, wildlife, culture & spiritual travel",
  description:
    "Paragliding over Pokhara, rafting, rock climbing, jungle safaris in Chitwan, heritage cities and Lumbini: the experiences Nepal offers beyond trekking, and where to find them.",
  path: "/experiences",
  image: photos.paragliding.src,
});

export default async function ExperiencesPage() {
  const [categories, destinations] = await Promise.all([getExperienceCategories(), getDestinations()]);
  return <ExperiencesView categories={categories} destinations={destinations} />;
}
