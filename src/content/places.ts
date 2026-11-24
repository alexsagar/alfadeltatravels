// Destinations, tour themes and planned stories. General information only;
// nothing here describes a company programme.
import type { Destination, Story, TourTheme } from "./types";

export const destinations: Destination[] = [
  {
    slug: "annapurna",
    title: "Annapurna",
    kind: "region",
    photo: "village",
    summary:
      "West-central Nepal above Pokhara: terraced Gurung and Magar villages, rhododendron forest and some of the most varied trekking in the country, from short ridge walks to the Annapurna Sanctuary.",
    treks: ["annapurna-base-camp-trek", "mardi-himal-trek"],
  },
  {
    slug: "khumbu",
    title: "Khumbu",
    kind: "region",
    photo: "amadablam",
    summary:
      "The Everest region in Sagarmatha National Park: Sherpa villages, monasteries and glacial valleys beneath Everest, Lhotse and Ama Dablam.",
    treks: ["everest-base-camp-trek"],
  },
  {
    slug: "langtang",
    title: "Langtang",
    kind: "region",
    photo: "forest",
    summary:
      "The closest major trekking region to Kathmandu, in Langtang National Park near the Tibetan border: forested gorges opening into high pastures and Tamang villages.",
    treks: ["langtang-valley-trek"],
  },
  {
    slug: "kathmandu",
    title: "Kathmandu Valley",
    kind: "place",
    photo: "kathmandu",
    summary:
      "Nepal's capital valley and its historic Newar cities. Seven groups of monuments here, including Boudhanath and the Durbar Squares, form a UNESCO World Heritage Site.",
  },
  {
    slug: "pokhara",
    title: "Pokhara",
    kind: "place",
    photo: "pokhara",
    summary: "A lakeside city on Phewa Lake beneath Machhapuchhre and the Annapurna range, and the usual starting point for Annapurna treks.",
  },
  {
    slug: "chitwan",
    title: "Chitwan",
    kind: "place",
    photo: "chitwan",
    summary:
      "Lowland sal forest and grassland in Chitwan National Park, a UNESCO World Heritage Site known for the greater one-horned rhinoceros.",
  },
  {
    slug: "lumbini",
    title: "Lumbini",
    kind: "place",
    photo: "lumbini",
    summary: "The birthplace of the Buddha in the Terai, with the Maya Devi Temple and the Ashoka Pillar. A UNESCO World Heritage Site and a major place of pilgrimage.",
  },
];

export const getDestination = (slug: string) => destinations.find((d) => d.slug === slug);

export const tourThemes: TourTheme[] = [
  {
    slug: "culture",
    title: "Culture & heritage",
    photo: "lumbini",
    text: "Temples, stupas and royal squares in the Kathmandu Valley, and the pilgrimage gardens of Lumbini.",
    places: ["kathmandu", "lumbini"],
  },
  {
    slug: "wildlife",
    title: "Wildlife",
    photo: "chitwan",
    text: "Jungle walks, canoe and jeep safaris in the lowland national parks, home to rhinoceros, gharial and many bird species.",
    places: ["chitwan"],
  },
  {
    slug: "leisure",
    title: "Leisure",
    photo: "pokhara",
    text: "Slower days by Phewa Lake, sunrise viewpoints over the Annapurnas and easy walks through the foothills.",
    places: ["pokhara"],
  },
  {
    slug: "adventure",
    title: "Adventure",
    photo: "sarangkot",
    text: "Paragliding from Sarangkot above Pokhara, river rafting and mountain biking — and, of course, trekking.",
    places: ["pokhara", "annapurna"],
  },
];

// Planned guides. Titles only; none are published, so none are linked.
export const stories: Story[] = [
  { slug: "altitude-and-acclimatisation", title: "Altitude and acclimatisation on Himalayan treks", category: "Guide", summary: "How altitude affects trekkers, and how a sensible ascent profile helps.", status: "planned" },
  { slug: "trekking-permits-in-nepal", title: "Understanding trekking permits in Nepal", category: "Guide", summary: "Which permits common routes need, and where to check current rules.", status: "planned" },
  { slug: "when-to-trek-in-nepal", title: "When to trek in Nepal", category: "Guide", summary: "Seasons, weather and crowds month by month.", status: "planned" },
  { slug: "packing-for-a-teahouse-trek", title: "Packing for a teahouse trek", category: "Guide", summary: "What to carry when you sleep in lodges along the trail.", status: "planned" },
  { slug: "traveler-journals", title: "Traveler journals", category: "Journal", summary: "Accounts from travelers, published only with their consent.", status: "planned" },
];
