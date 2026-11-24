// Experience detail pages (Milestone 9.2): local content source for
// /experiences/[slug]. General, sourced visitor information only: no prices,
// operators, departures, availability promises or reviews. Rules that change
// (flying zones, safari seasons, elephant activities) are written as "check
// before you go", with the latest source recorded in `sources`.
//
// `checkedAt` is set only where the page itself was read on that date; other
// sources were consulted through search summaries and await editor checks.
// Future CMS home: the `experience` document type (see ARCHITECTURE.md →
// Experiences). These pages are noindex until content and SEO are approved.
import type { ExperienceGuide } from "./types";

const checked = "2026-11-24";

export const experienceGuides: ExperienceGuide[] = [
  {
    slug: "paragliding",
    title: "Paragliding in Pokhara",
    category: "sky",
    eyebrow: "Sky Adventures · Pokhara",
    heading: "Paragliding",
    emphasis: "above Phewa Lake",
    intro: "Launch from the Sarangkot ridge, circle on warm air above Pokhara and glide down to the shore of Phewa Lake, with the Annapurna range behind on clear days.",
    hero: "paragliding",
    heroPosition: "object-[50%_40%]",
    place: "Pokhara",
    overviewTitle: "Flying over Pokhara",
    overview: [
      "Pokhara is Nepal's best-known place to fly. The Sarangkot ridge rises above the north shore of Phewa Lake, and on sunny days the slopes below it produce thermals that let paragliders stay aloft well above their launch.",
      "Most visitors fly in tandem: a licensed pilot sits behind you and does the flying, so no experience is needed. Solo flying is for qualified pilots only and follows the same zone rules.",
      "Flights must stay within designated paragliding zones because Pokhara International Airport lies close by. After the airport opened, launch and landing sites were moved for a time; in 2025 the authorities again allowed flights over the lake to land at Khapaudi, at the lake's end. Routes can change, so treat any description of take-off and landing points as current only when confirmed locally.",
    ],
    facts: [
      { label: "Where", value: "Sarangkot ridge above Phewa Lake, Pokhara" },
      { label: "Usual format", value: "Tandem flight with a licensed pilot" },
      { label: "Best conditions", value: "Dry months, roughly October to April", note: "Weather decides on the day" },
      { label: "Airspace", value: "Designated zones only, near Pokhara International Airport" },
    ],
    story: [
      {
        title: "The ridge and the lake",
        text: [
          "Sarangkot sits roughly 1,600 m up, about 800 m above the lake. On a clear morning the view runs from Dhaulagiri in the west across the Annapurnas to Machhapuchhre, which is why many people come up for sunrise even when they are not flying.",
          "From the air the town spreads along the eastern shore, the lake fills the valley floor and the forested hills of the far shore rise toward the World Peace Pagoda.",
        ],
        photo: "skyfishtail",
        layout: "right",
      },
      {
        title: "What a tandem flight involves",
        text: [
          "Flights start with a short briefing at the launch site, where the pilot fits the harness and explains the take-off: a few steps of running downhill into the wind until the wing lifts you. Once airborne you sit back in the harness; the pilot steers and decides how long to stay up.",
          "Flight length depends on the air that day, from a short glide to a long thermal flight. Landing is a slow approach onto a field by the lake, normally on your feet or seated in the harness.",
        ],
        photo: "sarangkot",
        layout: "wide",
      },
    ],
    highlights: [
      { title: "Mountains at eye level", text: "On clear days the Annapurna range and Machhapuchhre fill the horizon as you gain height." },
      { title: "No experience needed", text: "Tandem flights are flown by the pilot; you need only to follow the take-off instructions." },
      { title: "Raptors on the same thermals", text: "Large birds of prey often circle in the same rising air above the ridge." },
      { title: "An easy half day", text: "Launch, flight and landing fit comfortably into a morning or afternoon in Pokhara." },
    ],
    bestTime:
      "The dry months from about October to April are the main flying season, with the clearest mountain views from October to December. Spring brings more haze but often good thermals. Monsoon rain from June to September grounds many flights. Wind, cloud and rain can cancel a flight on any day, so keep your schedule flexible.",
    preparation: [
      { title: "Clothing", text: "Closed shoes with grip for the take-off run, long trousers and a warm layer: it is cooler in the air than on the lakeshore." },
      { title: "Keep a spare day", text: "If the weather closes in, flights are postponed. A flexible day in Pokhara gives you a second chance." },
      { title: "Cameras", text: "Secure phones and cameras with a strap. Many pilots carry a camera on a pole; ask before the flight." },
    ],
    safety: [
      { title: "Choose a licensed operator", text: "Fly only with registered companies and licensed pilots, and ask whether the operator follows the current airspace rules." },
      { title: "Check your insurance", text: "Many travel policies exclude air sports or need an add-on. Confirm cover before you fly." },
      { title: "Health", text: "Tell the pilot about back, heart or other medical conditions, and about pregnancy. The pilot can decline a flight if conditions or health make it unsafe." },
    ],
    destinations: ["pokhara", "annapurna"],
    related: ["ultralight-flights", "ziplining", "lakeside", "hill-hiking"],
    faqs: [
      { q: "Do I need any experience?", a: "No. On a tandem flight the pilot flies and lands the glider. You only need to be able to run a few steps downhill at take-off and follow simple instructions." },
      { q: "When is the best time of day to fly?", a: "It depends on the season and the day's weather. Mornings are usually clearer for mountain views; thermals often build later in the day. Your pilot will choose suitable flying times." },
      { q: "Can flights be cancelled?", a: "Yes. Wind, cloud, rain and airspace restrictions can all stop flights at short notice. Plan a spare day if paragliding matters to you." },
      { q: "Where do flights take off and land?", a: "Sarangkot is the classic take-off. Since 2025, flights have again been permitted to land at Khapaudi at the end of Phewa Lake. Sites have changed before because of airport airspace, so confirm the current arrangement locally." },
    ],
    sources: [
      { label: "Paragliding, ultralight and cable car — Nepal Tourism Board (trade site)", publisher: "Nepal Tourism Board", url: "https://trade.ntb.gov.np/tourist-activities/paragliding" },
      { label: "Khapaudi designated as landing site for paragliders in Pokhara", publisher: "Himal Press", url: "https://en.himalpress.com/khapaudi-designated-as-landing-site-for-paragliders-in-pokhara/" },
      { label: "Paragliding over Phewatal started again (May 2025)", publisher: "Kantipur", url: "https://ekantipur.com/news/2025/05/21/en/paragliding-over-phewatal-started-again-18-50.html" },
    ],
    seo: {
      index: false,
      title: "Paragliding in Pokhara: Sarangkot flights over Phewa Lake",
      description: "Tandem paragliding from Sarangkot above Pokhara and Phewa Lake: what a flight involves, the best season, airspace rules, preparation and safety.",
    },
    ctaPhoto: "pokhara",
  },
  {
    slug: "white-water-rafting",
    title: "White-water rafting in Nepal",
    category: "rivers",
    eyebrow: "Rivers & Adventure · Nepal",
    heading: "White-water rafting",
    emphasis: "on Himalayan rivers",
    intro: "Snow-fed rivers carve through gorges and forested hills on their way to the plains. Nepal has short, lively day trips and remote descents that last more than a week.",
    hero: "rafting",
    heroPosition: "object-[50%_55%]",
    place: "Nepal",
    overviewTitle: "Rivers from the high Himalaya",
    overview: [
      "Nepal's rivers rise among the world's highest mountains and grow as they fall toward the Terai. The Nepal Tourism Board lists more than a dozen rivers used for rafting, from short sections suitable for first-timers to long expeditions with camps on sandy beaches.",
      "Rapids are graded on the international scale from I (moving water) to VI (not normally run). Grades describe a particular section at a particular water level. The same river can be gentle in one stretch and powerful in another, and much harder after rain.",
    ],
    facts: [
      { label: "Most accessible", value: "Trishuli River, beside the Kathmandu–Pokhara road" },
      { label: "Trip length", value: "From one day to more than a week" },
      { label: "Main seasons", value: "October to mid-December; March to early May" },
      { label: "Grades", value: "Vary by section and water level", note: "Confirm for your dates" },
    ],
    story: [
      {
        title: "The Trishuli: a first river",
        text: [
          "The Trishuli is Nepal's most popular rafting river because it runs right beside the main road between Kathmandu and Pokhara, so put-ins and take-outs are easy to reach. Sections are commonly run as one- or two-day trips, with lively rapids separated by calmer water.",
          "Some trips continue downstream toward Narayanghat, where the road leads on to Chitwan, a natural way to combine river and jungle.",
        ],
        photo: "rafting2",
        layout: "left",
      },
    ],
    highlights: [
      { title: "Trishuli", text: "The most accessible river, with sections commonly run in one or two days between Kathmandu and Pokhara." },
      { title: "Seti", text: "Generally gentler water near Pokhara, often chosen by families and first-timers." },
      { title: "Bhote Kosi", text: "A short, steep, technical river north-east of Kathmandu, toward the Tibetan border, for experienced rafters." },
      { title: "Kali Gandaki and Marsyangdi", text: "Rivers in the Annapurna region with stronger rapids and multi-day trips." },
      { title: "Sun Kosi and Karnali", text: "Long expedition rivers. The Sun Kosi descent is about 270 km and takes roughly 8 to 10 days; the remote Karnali is similar in length." },
    ],
    bestTime:
      "The Nepal Tourism Board recommends the drier months: October to mid-December, and March to early May. Autumn brings high, clear water after the monsoon; spring water is lower and warmer. Monsoon flows (June to September) are large and many sections close. Winter water is very cold.",
    preparation: [
      { title: "Match the river to the group", text: "Ask which section, grade and water level a trip will run, and whether it suits your swimming ability and experience." },
      { title: "What to wear", text: "Quick-drying clothes, secure sandals or water shoes, sun protection, and a warm layer for cold water outside summer." },
      { title: "Multi-day trips", text: "Longer descents camp on beaches. Ask what equipment is provided and what you need to bring." },
    ],
    safety: [
      { title: "Licensed operators and guides", text: "Raft with registered operators whose guides are trained in swift-water rescue, and ask about safety kayakers on harder sections." },
      { title: "Equipment and briefing", text: "Expect a helmet, a properly fitted buoyancy aid and a full safety briefing, including what to do if you fall in." },
      { title: "Water levels change", text: "Heavy rain raises rivers quickly. Operators may change sections or cancel trips; that decision is for your safety." },
      { title: "Insurance", text: "Check that your travel insurance covers white-water rafting at the grade you plan to run." },
    ],
    destinations: ["kathmandu", "pokhara", "chitwan"],
    related: ["kayaking", "canyoning", "bungee-jumping", "jungle-safaris"],
    faqs: [
      { q: "Can beginners raft in Nepal?", a: "Yes. Several rivers have sections suitable for first-timers in the main seasons, the Trishuli and Seti among them. Choose a section and season that match your experience, and tell the operator if you are not a confident swimmer." },
      { q: "What do the grades mean?", a: "Grades describe how difficult a section of river is, from I (easy moving water) to VI. They apply to a particular stretch at a particular water level, so the same river can change grade with the season." },
      { q: "Can I raft in the monsoon?", a: "Monsoon rivers are high and fast, and many sections are not run. The main seasons are October to mid-December and March to early May." },
      { q: "Can rafting be combined with a visit to Chitwan?", a: "Yes. The Trishuli flows toward Narayanghat, near Chitwan, so a river trip can end close to the start of a jungle visit." },
    ],
    sources: [
      { label: "Rafting & kayaking — Nepal Tourism Board", publisher: "Nepal Tourism Board", url: "https://ntb.gov.np/things-to-do/rafting-&-kayaking", checkedAt: checked },
    ],
    seo: {
      index: false,
      title: "White-water rafting in Nepal: Trishuli and other rivers",
      description: "Rafting in Nepal, from day trips on the Trishuli to long descents of the Sun Kosi and Karnali: rivers, grades, seasons, preparation and safety.",
    },
  },
  {
    slug: "chitwan-wildlife-safari",
    title: "Chitwan wildlife safari",
    category: "wildlife",
    eyebrow: "Wildlife & Nature · Chitwan",
    heading: "Wildlife of",
    emphasis: "Chitwan National Park",
    intro: "Sal forest, tall grassland and slow rivers in the lowlands of central Nepal: home to the greater one-horned rhinoceros, the gharial and hundreds of bird species.",
    hero: "rhino",
    heroPosition: "object-[40%_55%]",
    place: "Chitwan National Park",
    overviewTitle: "Nepal's first national park",
    overview: [
      "Chitwan National Park was established in 1973 and became a UNESCO World Heritage Site in 1984. It covers about 950 km² of the inner Terai, between the Rapti and Narayani rivers, with a community-managed buffer zone around it.",
      "The park is one of the strongholds of the greater one-horned rhinoceros, and it also protects Bengal tigers, sloth bears, gaur, leopards, several species of deer, gharial and mugger crocodiles. More than 500 bird species have been recorded here.",
      "Wild animals keep their own hours. Rhinos and deer are seen often; tigers and sloth bears are elusive, and no visit can guarantee them.",
    ],
    facts: [
      { label: "Established", value: "1973; UNESCO World Heritage Site since 1984" },
      { label: "Area", value: "About 950 km², plus a buffer zone" },
      { label: "Main gateway", value: "Sauraha, on the park's northern edge" },
      { label: "Best season", value: "October to March; sightings often easier from February" },
    ],
    story: [
      {
        title: "Forest, grassland and river",
        text: [
          "Most of the park is sal forest, broken by tall elephant grass and the riverine forest along the Rapti and Narayani. Oxbow lakes and wetlands draw rhinos to wallow and birds to feed, which makes the edges of the water some of the best places to watch quietly.",
          "In January and February local people are allowed into the park to cut grass for thatch. The shorter grass afterwards can make animals easier to see.",
        ],
        photo: "chitwan",
        layout: "right",
      },
      {
        title: "Birds of the lowlands",
        text: [
          "With grassland, forest and wetland side by side, Chitwan is one of the richest birding areas in Nepal. Oxbow lakes and the river banks hold herons, egrets, storks and kingfishers; the forest has hornbills, woodpeckers and many migrants in winter.",
          "Early mornings, with a local naturalist, are the most rewarding.",
        ],
        photo: "egret",
        layout: "left",
      },
    ],
    highlights: [
      { title: "Jeep safaris", text: "Drives on the park's forest roads with a guide. They usually stop during the monsoon and resume after it." },
      { title: "Guided jungle walks", text: "On foot with licensed nature guides, for tracks, birds and a slower view of the forest. Follow your guides' instructions at all times." },
      { title: "Canoe trips", text: "Quiet drifts on the Rapti River in a dugout canoe, good for birds and crocodiles on the banks." },
      { title: "Conservation in practice", text: "The gharial breeding centre at Kasara and the buffer-zone community forests show how the park is protected and how local communities share in it." },
    ],
    bestTime:
      "October to March is the most comfortable time, with mild days and cool mornings. Sightings often improve from February, after the annual grass cutting. April to June is very hot. During the monsoon (roughly June to September) jeep safaris inside the park are suspended and many trails flood; they usually resume around late September.",
    preparation: [
      { title: "Permits and guides", text: "Entry to the park needs a permit, and activities inside are made with licensed guides. Check current rules and fees at the park office or visitor centre in Sauraha." },
      { title: "Clothing", text: "Muted greens and browns, long sleeves and trousers against insects and grass, closed shoes, a hat and a warm layer for early winter mornings." },
      { title: "Health", text: "Use insect repellent, carry water and ask a travel clinic about any recommended precautions for the lowlands." },
    ],
    safety: [
      { title: "Keep your distance", text: "Rhinos, elephants, bears and tigers can be dangerous. Stay with your guides, keep quiet and never approach or feed wildlife." },
      { title: "Responsible choices", text: "Elephant rides have not been allowed inside the park for many years, and Nepal's Supreme Court has called for elephant-back safaris to be replaced by welfare-friendly alternatives. Choose observation-based activities." },
      { title: "Respect the rules", text: "Do not use drones without permission, leave no litter, and follow the park's hours and routes." },
    ],
    destinations: ["chitwan"],
    related: ["birdwatching", "nature-walks", "conservation", "village-experiences"],
    faqs: [
      { q: "Will I see a tiger?", a: "Possibly, but it is rare. Tigers are shy and range widely. Rhinos, deer, crocodiles and many birds are seen far more often. No safari can guarantee a particular animal." },
      { q: "How many days should I spend in Chitwan?", a: "Two to three nights allows for an early-morning activity, a jeep drive or walk and a canoe trip without rushing." },
      { q: "Can I ride an elephant?", a: "Elephant rides are not permitted inside the national park and are under review in the buffer zone after a 2025 Supreme Court order on elephant welfare. We recommend observation-based activities instead." },
      { q: "Is Chitwan open all year?", a: "The park is open, but jeep safaris inside it are usually suspended in the monsoon, and heat and flooding limit activities from June to September." },
    ],
    sources: [
      { label: "Chitwan National Park — UNESCO World Heritage List", publisher: "UNESCO", url: "https://whc.unesco.org/en/list/284" },
      { label: "Chitwan National Park brochure (2019)", publisher: "Department of National Parks and Wildlife Conservation", url: "https://dnpwc.gov.np/media/publication/Chitwan_brochure_2019.pdf" },
      { label: "Jeep safari inside Chitwan National Park suspended for monsoon season (July 2026)", publisher: "The Kathmandu Post", url: "https://kathmandupost.com/national/2026/07/01/jeep-safari-inside-chitwan-national-park-suspended-for-monsoon-season", checkedAt: checked },
      { label: "Elephant safaris at crossroads as Chitwan weighs ethical tourism shift (July 2026)", publisher: "The Kathmandu Post", url: "https://kathmandupost.com/national/2026/07/19/elephant-safaris-at-crossroads-as-chitwan-weighs-ethical-tourism-shift", checkedAt: checked },
    ],
    seo: {
      index: false,
      title: "Chitwan wildlife safari: rhinos, birds and jungle walks",
      description: "Wildlife experiences in Chitwan National Park: rhinos and other animals, jeep safaris, jungle walks, canoe trips, birdwatching, seasons and responsible visiting.",
    },
    ctaPhoto: "chitwan",
  },
  {
    slug: "lumbini-spiritual-heritage",
    title: "Lumbini: spiritual and heritage experiences",
    category: "spirit",
    eyebrow: "Spirituality & Heritage · Lumbini",
    heading: "Lumbini,",
    emphasis: "birthplace of the Buddha",
    intro: "A quiet garden in the plains of southern Nepal, where an emperor's pillar, ancient foundations and monasteries from across the Buddhist world mark one of its holiest places.",
    hero: "lumbinipool",
    heroPosition: "object-[50%_60%]",
    place: "Lumbini",
    overviewTitle: "History and tradition",
    overview: [
      "Buddhist tradition holds that Siddhartha Gautama, who became the Buddha, was born in the Lumbini garden, where his mother Maya Devi stopped on her journey to her family home. Tradition also places her bath before the birth in the sacred pool.",
      "The strongest historical evidence is a stone pillar raised by the Mauryan emperor Ashoka, dated to around 249 BC. Its inscription records the emperor's visit and states that the Buddha was born here. Excavations beneath the Maya Devi Temple have uncovered the remains of much older shrines.",
      "Lumbini was inscribed as a UNESCO World Heritage Site in 1997. Today the core sacred area sits within a master-planned site, with a long canal leading north from the Sacred Garden through zones of monasteries built by many nations.",
    ],
    facts: [
      { label: "Where", value: "Rupandehi district, southern Nepal, near the Indian border" },
      { label: "World Heritage", value: "Inscribed by UNESCO in 1997" },
      { label: "Key evidence", value: "Ashoka's inscribed pillar, around 249 BC" },
      { label: "Best season", value: "October to March", note: "April to June is very hot" },
    ],
    story: [
      {
        title: "The Sacred Garden",
        text: [
          "At the centre of Lumbini is the Sacred Garden. Its white Maya Devi Temple shelters excavated foundations and a marker stone, displayed beneath walkways so visitors can see the ancient layers below.",
          "Beside it stand the Ashoka Pillar and the Puskarini, the sacred pool, its terraced banks used for quiet sitting at dawn and dusk. Prayer flags are strung between the old trees, and pilgrims of many traditions walk around the temple.",
        ],
        photo: "lumbini",
        layout: "wide",
      },
      {
        title: "The monastic zones",
        text: [
          "North of the Sacred Garden, the master plan divides monasteries into two zones on either side of a long canal: one for the Theravada tradition and one for the Mahayana and Vajrayana traditions. Temples built by communities from Thailand, Myanmar, Sri Lanka, China, Korea, Germany and many other countries make it a walk through the Buddhist world's architecture.",
          "Some monasteries welcome visitors to their halls and offer meditation sessions or retreats. Ask locally about times and quiet hours.",
        ],
        photo: "lumbinithai",
        layout: "right",
      },
    ],
    highlights: [
      { title: "Maya Devi Temple", text: "The shrine over the traditional birth site, enclosing excavated ancient foundations." },
      { title: "Ashoka Pillar", text: "The emperor's inscribed pillar, the key historical record of the Buddha's birthplace." },
      { title: "The sacred pool", text: "The Puskarini beside the temple, where tradition says Maya Devi bathed." },
      { title: "Monasteries of many nations", text: "Temples and meditation halls in the Theravada and Mahayana zones along the central canal." },
      { title: "Quiet hours", text: "Early morning and late afternoon bring cooler air, softer light and fewer visitors in the Sacred Garden." },
    ],
    bestTime:
      "October to March is the most comfortable period, with mild days; mornings can be foggy in midwinter. April to June is very hot. The full moon of Baisakh (usually April or May) marks Buddha Jayanti, celebrated with large gatherings, so expect crowds if you visit then.",
    preparation: [
      { title: "Getting around", text: "The site is large. Walking, cycling or a local rickshaw along the canal helps you reach the more distant monasteries." },
      { title: "Clothing", text: "Dress modestly, with shoulders and knees covered, and wear shoes that are easy to remove at temple entrances." },
      { title: "Time", text: "Allow at least a full day for the Sacred Garden and a selection of monasteries; two days for a slower visit or meditation." },
    ],
    safety: [
      { title: "Temple etiquette", text: "Remove shoes where asked, walk clockwise around shrines and stupas, and keep voices low." },
      { title: "Photography", text: "Photography inside the Maya Devi Temple is restricted. Ask before photographing monks, nuns or people at prayer." },
      { title: "Heat", text: "In the hot months, carry water, cover your head and plan visits for the early morning and late afternoon." },
    ],
    destinations: ["lumbini", "kathmandu"],
    related: ["pilgrimage", "meditation", "heritage-cities", "festivals"],
    faqs: [
      { q: "Is Lumbini the proven birthplace of the Buddha?", a: "Buddhist tradition places the birth here, and Ashoka's inscribed pillar of around 249 BC records the emperor's visit to the Buddha's birthplace. Archaeological remains beneath the Maya Devi Temple are much older than the present building. Exact dates for the Buddha's life are still debated by historians." },
      { q: "Can I meditate in Lumbini?", a: "Yes. Several monasteries and centres offer meditation, from short sessions to longer retreats. Ask locally about schedules and how to join." },
      { q: "How long should I spend there?", a: "One full day covers the Sacred Garden and a few monasteries. Two days allows a slower pace, early-morning visits and time for meditation." },
      { q: "Do I need to be Buddhist to visit?", a: "No. Visitors of every faith are welcome. Please be respectful in sacred spaces, especially during prayers and ceremonies." },
    ],
    sources: [
      { label: "Lumbini, the Birthplace of the Lord Buddha — UNESCO World Heritage List", publisher: "UNESCO", url: "https://whc.unesco.org/en/list/666" },
      { label: "Lumbini, the Birthplace of the Lord Buddha — UNESCO Silk Roads Programme", publisher: "UNESCO", url: "https://en.unesco.org/silkroad/silk-road-themes/world-heritage-sites/lumbini-birthplace-lord-buddha" },
      { label: "Lumbini Development Trust", publisher: "Government of Nepal", url: "https://www.lumbinidevtrust.gov.np/" },
    ],
    seo: {
      index: false,
      title: "Lumbini: visiting the birthplace of the Buddha",
      description: "Visiting Lumbini: the Maya Devi Temple, Ashoka Pillar, Sacred Garden and monastic zones, with history, tradition, etiquette and the best time to go.",
    },
    ctaPhoto: "lumbinithai",
  },
];

export const getExperienceGuide = (slug: string) => experienceGuides.find((g) => g.slug === slug);
