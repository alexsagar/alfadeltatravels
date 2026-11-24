// Experiences catalogue (Milestone 9): local content source for the homepage
// "Beyond the Mountains" section and /experiences. It holds general,
// verifiable information about activities in Nepal. It does not describe
// company products: no prices, operators, departures or availability promises.
//
// `places` lists destination slugs where the activity genuinely takes place.
// Each one is set by hand per activity and is never inferred from the
// category. Pages link a place only if that destination exists on the site.
//
// Mirrors the `experience` Sanity schema (src/sanity/schemaTypes/documents.ts).
// Nothing is migrated to the CMS yet; see ARCHITECTURE.md → Experiences.
import type { ExperienceCategory } from "./types";

export const experienceCategories: ExperienceCategory[] = [
  {
    slug: "sky",
    title: "Sky Adventures",
    photo: "skyfishtail",
    intro: "Nepal seen from the air: thermals above Pokhara's lake and dawn flights along the highest peaks on earth.",
    season: "Clear skies from October to April; the monsoon (June–September) grounds many flights.",
    activities: [
      { slug: "paragliding", guide: "paragliding", title: "Paragliding", text: "Tandem flights launch from the ridge at Sarangkot and glide down over Phewa Lake, with the Annapurna range behind on clear mornings.", places: ["pokhara"] },
      { slug: "skydiving", title: "Skydiving", text: "Organised as occasional events rather than an everyday activity, so whether a jump is possible depends on the year and season.", places: [] },
      { slug: "mountain-flights", title: "Mountain flights", text: "Early-morning sightseeing flights from Kathmandu follow the Himalaya east towards Everest and return without landing, in about an hour.", places: ["kathmandu"] },
      { slug: "ultralight-flights", title: "Ultralight flights", text: "Small open aircraft fly from Pokhara over the lakes and foothills towards the Annapurnas, weather permitting.", places: ["pokhara"] },
    ],
  },
  {
    slug: "rivers",
    title: "Rivers & Adventure",
    photo: "rafting",
    intro: "Snowmelt rivers cut deep gorges through the hills, from family-friendly rapids to remote multi-day descents.",
    season: "Usually October to December and March to May. Monsoon water is high and many sections close.",
    activities: [
      { slug: "white-water-rafting", guide: "white-water-rafting", title: "White-water rafting", text: "The Trishuli, beside the main road between Kathmandu and Pokhara, is the most accessible river; the Seti, Kali Gandaki and Sun Kosi offer longer trips.", places: [] },
      { slug: "kayaking", title: "Kayaking", text: "Calm-water paddling on Phewa Lake, and river kayaking for those with experience or on an instruction course.", places: ["pokhara"] },
      { slug: "canyoning", title: "Canyoning", text: "Abseiling and sliding down waterfalls in side canyons of the Bhote Kosi valley, north-east of Kathmandu.", places: [] },
      { slug: "bungee-jumping", title: "Bungee jumping", text: "Jumps from a suspension bridge high above the Bhote Kosi gorge, near the Tibetan border.", places: [] },
    ],
  },
  {
    slug: "land",
    title: "Land Adventures",
    photo: "climbing",
    intro: "Crags, ridgelines and hill trails close to the cities, for a day out or a few active days between journeys.",
    season: "Most of the year outside the wettest monsoon weeks; autumn and spring are the most reliable.",
    activities: [
      { slug: "rock-climbing", title: "Rock climbing", text: "Bolted crags such as Hattiban and Nagarjun on the edge of the Kathmandu Valley, with routes for beginners and experienced climbers.", places: ["kathmandu"] },
      { slug: "hill-hiking", title: "Hill hiking", text: "Day walks on the valley rim at Nagarkot, Chandragiri and Shivapuri, and above Pokhara to Sarangkot and the World Peace Pagoda.", places: ["kathmandu", "pokhara"] },
      { slug: "mountain-biking", title: "Mountain biking", text: "Village tracks and ridge trails around the Kathmandu Valley, and dirt roads into the hills around Pokhara.", places: ["kathmandu", "pokhara"] },
      { slug: "ziplining", title: "Ziplining", text: "A long, steep zipline runs from the Sarangkot ridge down towards the Seti valley near Pokhara.", places: ["pokhara"] },
    ],
  },
  {
    slug: "wildlife",
    title: "Wildlife & Nature",
    photo: "rhino",
    intro: "Below the hills lie the Terai's sal forests and grasslands, home to rhinoceros, gharial and hundreds of bird species.",
    season: "Chitwan is best from October to March; sightings get easier from February, when the tall grass is cut.",
    activities: [
      { slug: "jungle-safaris", guide: "chitwan-wildlife-safari", title: "Jungle safaris", text: "Jeep drives, guided jungle walks and dugout-canoe trips on the Rapti River in Chitwan National Park.", places: ["chitwan"] },
      { slug: "birdwatching", title: "Birdwatching", text: "More than 500 species have been recorded in Chitwan. Near Kathmandu, the forested slopes of Phulchoki are a well-known birding hill.", places: ["chitwan", "kathmandu"] },
      { slug: "nature-walks", title: "Nature walks", text: "Forest trails in Shivapuri Nagarjun National Park on the valley's northern rim, and community forests on the edge of Chitwan.", places: ["kathmandu", "chitwan"] },
      { slug: "conservation", title: "Conservation experiences", text: "Chitwan's gharial breeding centre and the community-managed buffer zone show how the park's wildlife is protected.", places: ["chitwan"] },
    ],
  },
  {
    slug: "culture",
    title: "Culture & Heritage",
    photo: "bhaktapur",
    intro: "Royal squares, living temples and village life, from the Newar cities of the Kathmandu Valley to the Tharu villages of the plains.",
    season: "Year-round. Autumn brings Dashain and Tihar; festival dates follow the lunar calendar.",
    activities: [
      { slug: "heritage-cities", title: "Heritage cities", text: "The Durbar Squares of Kathmandu, Patan and Bhaktapur, part of the Kathmandu Valley UNESCO World Heritage Site.", places: ["kathmandu"] },
      { slug: "local-traditions", title: "Local traditions", text: "Pottery in Bhaktapur, metalwork and wood carving in Patan, and the daily rituals of neighbourhood shrines.", places: ["kathmandu"] },
      { slug: "village-experiences", title: "Village experiences", text: "Tharu villages on the edge of Chitwan, and Gurung villages in the Annapurna foothills.", places: ["chitwan", "annapurna"] },
      { slug: "festivals", title: "Festivals and cultural activities", text: "Indra Jatra in Kathmandu, Bisket Jatra in Bhaktapur at the Nepali New Year, and the family festivals of Dashain and Tihar.", places: ["kathmandu"] },
    ],
  },
  {
    slug: "spirit",
    title: "Spirituality & Leisure",
    photo: "lumbinipool",
    intro: "Places of pilgrimage and quiet, and unhurried days by the water.",
    season: "Year-round. Lumbini is hot from April to June; Pokhara is clearest from October to March.",
    activities: [
      { slug: "lumbini", guide: "lumbini-spiritual-heritage", title: "Lumbini", text: "The birthplace of the Buddha: the Maya Devi Temple, the Ashoka Pillar and a monastic zone of temples built by many nations.", places: ["lumbini"] },
      { slug: "pilgrimage", title: "Pilgrimage", text: "Lumbini for Buddhists, and in Kathmandu the Pashupatinath temple and the great stupa of Boudhanath.", places: ["lumbini", "kathmandu"] },
      { slug: "meditation", title: "Meditation", text: "Monasteries and meditation centres in the Kathmandu Valley and Lumbini run courses lasting from a day to several weeks.", places: ["kathmandu", "lumbini"] },
      { slug: "lakeside", title: "Lakeside experiences", text: "Rowing boats on Phewa Lake to the Tal Barahi island temple, and the quieter shores of Begnas and Rupa lakes.", places: ["pokhara"] },
      { slug: "wellness", title: "Wellness and relaxation", text: "Yoga and slower days in Pokhara's lakeside and in the green edges of the Kathmandu Valley.", places: ["pokhara", "kathmandu"] },
    ],
  },
];
