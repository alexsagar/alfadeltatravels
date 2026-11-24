// Trek content. General route information only — widely published facts,
// written conservatively and sourced at the bottom of each guide. No prices,
// durations, departures or inclusions: `offering` stays null until the
// company supplies its own package.
import type { Trek } from "./types";

const ebc: Trek = {
  slug: "everest-base-camp-trek",
  title: "Everest Base Camp Trek",
  region: "khumbu",
  photo: "everest",
  summary:
    "The classic walk up the Khumbu valley from Lukla, through Sherpa villages and monasteries, to the foot of Everest and the viewpoint of Kala Patthar.",
  highPoint: "Kala Patthar, about 5,545 m",
  offering: null,
  guide: {
    hero: "everest",
    intro: "Up the Khumbu valley, through Sherpa villages and monasteries, to the foot of the world's highest mountain.",
    overview: [
      "The Everest Base Camp trek follows the Dudh Koshi and Khumbu valleys inside Sagarmatha National Park, a UNESCO World Heritage Site. Most trekkers fly from Kathmandu to the mountain airstrip at Lukla and walk north through Phakding and Namche Bazaar, the trading hub of the Khumbu.",
      "Beyond Namche the trail passes Tengboche Monastery and climbs past Dingboche and Lobuche onto the moraine of the Khumbu Glacier. The walk ends at the climbers' base camp below the Khumbu Icefall; the classic view of Everest's summit comes from the nearby hill of Kala Patthar.",
      "It is a walking trek with no technical climbing, on a well-used trail served by teahouse lodges. The challenge is altitude: the route spends several days above 4,000 m, so a gradual ascent with acclimatisation stops is essential.",
    ],
    facts: [
      { label: "Region", value: "Khumbu, Solukhumbu District" },
      { label: "Protected area", value: "Sagarmatha National Park (UNESCO World Heritage Site)" },
      { label: "Usual start", value: "Lukla (Tenzing–Hillary Airport), about 2,860 m" },
      { label: "Base camp", value: "About 5,364 m" },
      { label: "Highest viewpoint", value: "Kala Patthar, about 5,545 m", note: "Nepal Tourism Board figure; other maps and surveys give different heights." },
      { label: "Trekking style", value: "Teahouse lodges, no technical climbing" },
    ],
    highlights: [
      {
        title: "Namche Bazaar",
        text: "The horseshoe-shaped Sherpa town on a steep hillside is the Khumbu's market and the usual first acclimatisation stop, with short hikes above town for early views of Everest and Ama Dablam.",
        photo: "namche",
      },
      {
        title: "Tengboche Monastery",
        text: "The region's best-known Buddhist monastery stands on a forested ridge facing Everest, Lhotse and Ama Dablam.",
        photo: "tengboche",
      },
      {
        title: "Kala Patthar",
        text: "A dark rocky hill above Gorak Shep. Base camp itself sits too close beneath the mountain to show the summit well; Kala Patthar gives the classic full view of Everest and Nuptse.",
        photo: "kalapatthar",
      },
    ],
    preparation: [
      {
        title: "Altitude",
        text: "Acute mountain sickness can affect anyone above about 2,500 m, regardless of fitness. Widely used medical guidance is to sleep no more than about 500 m higher each night once above 3,000 m and to take a rest day every three to four days. Descending is the treatment for worsening symptoms.",
      },
      {
        title: "Fitness",
        text: "Expect consecutive days of several hours' walking on uneven, often steep trail, much of it at altitude. Regular hill walking or stair training in the months before helps more than short bursts of exercise.",
      },
      {
        title: "Health & insurance",
        text: "See a doctor before travelling to high altitude. Travel insurance should explicitly cover trekking at the altitudes involved and emergency helicopter evacuation.",
      },
    ],
    seasons: [
      { name: "Autumn", months: "Late Sep – Nov", tone: "best", text: "Settled weather after the monsoon and the clearest mountain views. The busiest season on the trail." },
      { name: "Spring", months: "Mar – May", tone: "best", text: "Warmer days and rhododendron forest in flower lower down. Haze and afternoon cloud build later in the season." },
      { name: "Winter", months: "Dec – Feb", tone: "quiet", text: "Clear but very cold, especially at night above Dingboche. Fewer trekkers; some higher lodges may close." },
      { name: "Monsoon", months: "Jun – mid Sep", tone: "quiet", text: "Rain and cloud below the high valleys, frequent flight disruption at Lukla and limited views." },
    ],
    routeTitle: "From Lukla to the foot of Everest",
    route: [
      { name: "Lukla", elevationM: 2860, note: "Mountain airstrip and trailhead." },
      { name: "Phakding", elevationM: 2610, note: "A short first day down to the Dudh Koshi river." },
      { name: "Namche Bazaar", elevationM: 3440, note: "Gateway town of the Khumbu.", acclimatise: true },
      { name: "Tengboche", elevationM: 3867, note: "Monastery on a ridge facing Everest and Ama Dablam." },
      { name: "Dingboche", elevationM: 4410, note: "Walled fields in the Imja valley.", acclimatise: true },
      { name: "Lobuche", elevationM: 4940, note: "Small settlement beside the Khumbu Glacier moraine." },
      { name: "Gorak Shep", elevationM: 5164, note: "Last lodges before base camp." },
      { name: "Everest Base Camp", elevationM: 5364, note: "Expedition base below the Khumbu Icefall." },
      { name: "Kala Patthar", elevationM: 5545, note: "Viewpoint for Everest; the Nepal Tourism Board gives about 5,545 m." },
    ],
    routeNote:
      "This is the commonly walked line of the route with approximate elevations, not a company itinerary. Most itineraries return the same way to Lukla; variations add Gokyo or the high passes.",
    considerations: [
      {
        title: "Flights to Lukla",
        text: "Flights depend on mountain weather and are often delayed or cancelled. In busy seasons flights have also operated from Ramechhap (Manthali) instead of Kathmandu. Build spare days into any plan.",
      },
      {
        title: "Permits",
        text: "Four separate things apply. Park entry: visitors entering Sagarmatha National Park need a park entry permit, sold in Kathmandu or at the park entry point. TIMS: the Nepal Tourism Board's revised TIMS provision (from 31 March 2023) lists the Everest Base Camp trek among routes that need a TIMS card issued through a registered trekking agency, with a licensed guide. Local entry: Khumbu Pasang Lhamu Rural Municipality may apply its own local entry arrangements; ask your agency what is currently in force. Restricted areas: the Department of Immigration issues permits for listed restricted areas, including Ward 5 of the same municipality, so check with your agency whether your exact itinerary enters one. Rules and fees change; confirm everything before you travel.",
      },
      {
        title: "Lodges",
        text: "Teahouses offer simple rooms and meals. Higher up, rooms are basic and cold, and charging, hot showers and Wi-Fi are usually paid extras.",
      },
      {
        title: "Responsible trekking",
        text: "Carry out what you bring in, use refillable bottles with purification, and respect monasteries, chortens and mani walls by passing them on the left.",
      },
    ],
    gallery: ["kalapatthar", "namche", "tengboche", "amadablam", "pumori", "everest"],
    faqs: [
      {
        q: "How high is Everest Base Camp?",
        a: "The south base camp sits at about 5,364 m. The nearby viewpoint of Kala Patthar is higher, at about 5,545 m according to the Nepal Tourism Board; other maps give slightly different figures.",
      },
      {
        q: "Do I need climbing experience?",
        a: "No. The standard route is a walking trek on established trails with no technical climbing. Fitness and a careful acclimatisation schedule matter far more.",
      },
      {
        q: "Can you see Everest from base camp?",
        a: "Only partially. Base camp lies close beneath the mountain, which hides the summit. The best views are from Kala Patthar and from points along the trail such as above Namche and at Tengboche.",
      },
      {
        q: "Which permits are required?",
        a: "Visitors entering Sagarmatha National Park need a park entry permit. The Nepal Tourism Board's 2023 TIMS rules also list this trek among routes that need a TIMS card arranged through a registered trekking agency, with a licensed guide. Local municipality arrangements may apply, and Ward 5 of the municipality is a listed restricted area with its own permit, so confirm your exact itinerary and the current rules with your agency before you go.",
      },
      {
        q: "When is the best time to go?",
        a: "Autumn (late September to November) and spring (March to May) offer the most reliable weather. Winter is possible but very cold; the monsoon brings cloud, rain and flight disruption.",
      },
    ],
    sources: [
      { label: "UNESCO World Heritage Centre — Sagarmatha National Park", url: "https://whc.unesco.org/en/list/120" },
      { label: "Nepal Tourism Board", url: "https://ntb.gov.np" },
      { label: "Wilderness Medical Society — acute altitude illness guidelines", url: "https://wms.org" },
      { label: "Tengboche (Kala Pattar elevation)", publisher: "Nepal Tourism Board", url: "https://ntb.gov.np/en/tengboche", checkedAt: "2026-11-22" },
      { label: "Park entry fees", publisher: "Nepal Tourism Board", url: "https://ntb.gov.np/en/plan-your-trip/before-you-come/park-entry-fees", checkedAt: "2026-11-22" },
      { label: "TIMS card", publisher: "Nepal Tourism Board", url: "https://ntb.gov.np/en/plan-your-trip/before-you-come/tims-card", checkedAt: "2026-11-22" },
      { label: "Trekking permits (restricted areas)", publisher: "Nepal Tourism Board", url: "https://ntb.gov.np/en/plan-your-trip/before-you-come/trekking-permit", checkedAt: "2026-11-22" },
    ],
  },
};

export const treks: Trek[] = [
  ebc,
  {
    slug: "annapurna-base-camp-trek",
    title: "Annapurna Base Camp Trek",
    region: "annapurna",
    photo: "abc",
    summary:
      "Through Gurung villages and rhododendron forest into the Annapurna Sanctuary, a high glacial basin ringed by Annapurna I, Annapurna South and Machapuchare.",
    highPoint: "Annapurna Base Camp, about 4,130 m",
    offering: null,
  },
  {
    slug: "langtang-valley-trek",
    title: "Langtang Valley Trek",
    region: "langtang",
    photo: "forest",
    summary:
      "A valley walk north of Kathmandu near the Tibetan border, climbing through forest into yak pastures, Tamang villages and the monastery at Kyanjin Gompa.",
    highPoint: "Kyanjin Gompa, about 3,870 m",
    offering: null,
  },
  {
    slug: "mardi-himal-trek",
    title: "Mardi Himal Trek",
    region: "annapurna",
    photo: "mardi",
    summary:
      "A quieter ridge route east of the Annapurna Sanctuary, rising from forest onto open grassy ridges directly beneath Machapuchare and Mardi Himal.",
    highPoint: "Mardi Himal Base Camp, about 4,500 m",
    offering: null,
  },
];

export const getTrek = (slug: string) => treks.find((t) => t.slug === slug);
