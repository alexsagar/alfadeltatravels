// Milestone 8: write general route guides for three trek drafts that only had
// card data, and narrow wording on the Everest Base Camp draft. Development only.
// Usage: node --no-warnings --env-file=.env.local scripts/m8-trek-guides.mts [--dry-run]
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { createClient } from "@sanity/client";
import { assertWritableDataset } from "../src/sanity/guard.ts";

const dataset = assertWritableDataset("development");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (projectId !== "4qnp14bk") throw new Error("Unexpected or missing Sanity project ID");
const { authToken: token } = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, "utf8"));
const client = createClient({ projectId, dataset, apiVersion: "2026-11-01", useCdn: false, token, perspective: "raw" });
if (client.config().dataset !== "development") throw new Error("development only");
const dryRun = process.argv.includes("--dry-run");

const CHECKED = "2026-11-22";
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);
const keyed = <T extends object>(type: string, items: T[]) => items.map((i) => ({ _key: key(), _type: type, ...i }));

const src = {
  tims: { label: "TIMS card and licensed-guide requirement — Nepal Tourism Board", url: "https://ntb.gov.np/en/plan-your-trip/before-you-come/tims-card", checkedAt: CHECKED },
  fees: { label: "Protected area entry fees — Nepal Tourism Board", url: "https://ntb.gov.np/en/plan-your-trip/before-you-come/park-entry-fees", checkedAt: CHECKED },
  acap: { label: "Annapurna Conservation Area — Nepal Tourism Board", url: "https://ntb.gov.np/en/annapurna-conservation-area", checkedAt: CHECKED },
  langtang: { label: "Langtang National Park — Nepal Tourism Board", url: "https://ntb.gov.np/en/langtang", checkedAt: CHECKED },
  immigration: { label: "Trekking routes and permit fees — Department of Immigration", url: "https://immigration.gov.np/trekking-route-and-permit-fee", checkedAt: CHECKED },
  wms: { label: "Wilderness Medical Society — acute altitude illness guidelines", url: "https://wms.org" },
};

const altitude = (top: string) => ({
  title: "Altitude",
  text: `Acute mountain sickness can affect anyone above about 2,500 m, whatever their fitness. This route reaches ${top}, so climb gradually and tell your guide about headache, nausea or unusual tiredness. Going down is the treatment for worsening symptoms.`,
});
const insurance = {
  title: "Health & insurance",
  text: "See a doctor before travelling to altitude. Check that your travel insurance covers trekking at the heights involved, including emergency evacuation.",
};
const responsible = {
  title: "Responsible trekking",
  text: "Carry your rubbish out, use a refillable bottle with purification rather than buying plastic, and keep to the trail on fragile ground. Ask before photographing people, and pass chortens and mani walls on the left.",
};
const elevationNote = "Elevations are approximate and differ between maps; they are not taken from a single official survey.";

type Guide = Record<string, unknown>;
const guides: Record<string, { seo: { title: string; description: string }; difficulty: string; summary?: string; highPoint?: string; guide: (hero: unknown) => Guide }> = {
  "drafts.trek.annapurna-base-camp-trek": {
    difficulty: "moderate",
    seo: {
      title: "Annapurna Base Camp Trek Guide: Route, Permits & Seasons",
      description: "General guide to the Annapurna Base Camp trek: the route through Chhomrong into the Annapurna Sanctuary, altitude, best seasons, permits and preparation.",
    },
    guide: (hero) => ({
      hero,
      intro: "Up the Modi Khola valley, through Gurung villages and forest, into the high basin of the Annapurna Sanctuary.",
      overview: [
        "The Annapurna Base Camp trek, often shortened to ABC, climbs the Modi Khola valley north of Pokhara inside the Annapurna Conservation Area. It ends in the Annapurna Sanctuary, a glacial basin enclosed by Annapurna I, Annapurna South, Hiunchuli and Machapuchare.",
        "Most routes start from a roadhead in the hills above Pokhara and pass through the Gurung village of Chhomrong. From there the trail drops and climbs through bamboo and rhododendron forest, then follows the narrow upper valley past Machapuchare Base Camp to the sanctuary.",
        "It is a walking trek on a well-used teahouse trail, with no technical climbing. Expect long stone staircases, especially around Chhomrong, and a final climb to about 4,130 m.",
      ],
      facts: [
        { label: "Region", value: "Annapurna, Kaski District" },
        { label: "Protected area", value: "Annapurna Conservation Area" },
        { label: "Gateway city", value: "Pokhara" },
        { label: "High point", value: "Annapurna Base Camp, about 4,130 m", note: "Figures vary slightly between maps." },
        { label: "Trekking style", value: "Teahouse lodges, no technical climbing" },
        { label: "Guide", value: "Licensed guide and agency-issued TIMS card required", note: "Nepal Tourism Board TIMS provision, effective 31 March 2023." },
      ],
      highlights: [
        { title: "Chhomrong", text: "A large Gurung village on a steep hillside facing Annapurna South and Machapuchare. It is the last big settlement before the trail enters the upper valley." },
        { title: "Machapuchare Base Camp", text: "A cluster of lodges at the mouth of the sanctuary, below the fishtail peak of Machapuchare. The mountain itself is closed to climbing." },
        { title: "The Annapurna Sanctuary", text: "At base camp the valley opens into a bowl of ice and rock. Sunrise on the south face of Annapurna I is the reason most people make the climb." },
      ],
      routeTitle: "From the Pokhara hills to the sanctuary",
      route: keyed("routeStop", [
        { name: "Ghandruk", elevationM: 1940, note: "Large Gurung village; one of several common starting points.", acclimatise: false },
        { name: "Chhomrong", elevationM: 2170, note: "Last large village; long stone staircases either side.", acclimatise: false },
        { name: "Bamboo", elevationM: 2310, note: "Lodges in dense bamboo and rhododendron forest.", acclimatise: false },
        { name: "Deurali", elevationM: 3230, note: "Upper valley; check local advice on avalanche-prone sections.", acclimatise: false },
        { name: "Machapuchare Base Camp", elevationM: 3700, note: "Lodges at the entrance to the sanctuary.", acclimatise: false },
        { name: "Annapurna Base Camp", elevationM: 4130, note: "Lodges inside the sanctuary, below Annapurna I.", acclimatise: false },
      ]),
      routeNote: `This is the commonly walked line of the route, not a company itinerary. Starting points depend on road access, and many walkers return the same way or link with Poon Hill. ${elevationNote}`,
      seasons: keyed("season", [
        { name: "Autumn", months: "Late Sep – Nov", tone: "best", text: "Usually settled after the monsoon, with clear mornings. The busiest time on the trail." },
        { name: "Spring", months: "Mar – May", tone: "best", text: "Warmer, with rhododendrons in flower lower down. Haze and afternoon cloud become more common later in the season." },
        { name: "Winter", months: "Dec – Feb", tone: "quiet", text: "Cold nights and snow in the upper valley. Avalanche risk can close the trail above Deurali for periods." },
        { name: "Monsoon", months: "Jun – mid Sep", tone: "quiet", text: "Rain, cloud, leeches and slippery steps lower down. Views are often hidden." },
      ]),
      preparation: keyed("titledText", [
        altitude("about 4,130 m"),
        { title: "Fitness", text: "Expect several hours of walking a day, with thousands of stone steps up and down. Regular hill walking or stair training before you travel makes the biggest difference." },
        insurance,
      ]),
      considerations: keyed("titledText", [
        { title: "Permits", text: "You need an Annapurna Conservation Area entry permit. The Nepal Tourism Board's revised TIMS provision lists the Poon Hill–ABC trek among routes that need a licensed guide and a TIMS card issued through a registered agency. Fees change, so confirm current amounts before you travel." },
        { title: "Avalanche risk", text: "The upper valley between Deurali and Machapuchare Base Camp is narrow and has a history of avalanches after heavy snow. Follow your guide's and lodge owners' advice on the day." },
        { title: "Lodges and meals", text: "Teahouses offer simple rooms and set menus. In the upper valley, rooms are basic and limited in peak season, and hot showers and charging usually cost extra." },
        responsible,
      ]),
      gallery: [],
      faqs: keyed("faq", [
        { q: "How difficult is the Annapurna Base Camp trek?", a: "It is a moderate trek with no climbing, but the many stone staircases and the altitude make it tiring. Reasonable fitness and a gradual ascent matter more than experience." },
        { q: "How high is Annapurna Base Camp?", a: "About 4,130 m. Machapuchare Base Camp, the last stop before it, is about 3,700 m. Map figures differ slightly." },
        { q: "How many days does the trek take?", a: "It depends on where you start, how far vehicles can reach, and whether you add Poon Hill. Ask us for an itinerary that fits your time and pace." },
        { q: "Which permits are required?", a: "An Annapurna Conservation Area entry permit, plus a TIMS card arranged through a registered trekking agency with a licensed guide. Rules and fees change, so confirm them before you go." },
        { q: "When is the best time to go?", a: "Autumn and spring usually bring the most stable weather. Winter is quieter but colder, and snow can close the upper valley." },
      ]),
      sources: keyed("sourceLink", [src.acap, src.tims, src.fees, src.wms]),
    }),
  },

  "drafts.trek.mardi-himal-trek": {
    difficulty: "moderate",
    summary: "A quieter ridge route east of the Annapurna Sanctuary, rising from forest onto open grassy ridges directly beneath Machapuchare and Mardi Himal.",
    seo: {
      title: "Mardi Himal Trek Guide: Ridge Route, Permits & Seasons",
      description: "General guide to the Mardi Himal trek near Pokhara: the forest and ridge route to High Camp and the base camp viewpoint, altitude, seasons and permits.",
    },
    guide: (hero) => ({
      hero,
      intro: "A forest trail and an open ridge leading north towards Machapuchare, starting close to Pokhara.",
      overview: [
        "The Mardi Himal trek follows a long ridge east of the Modi Khola valley, inside the Annapurna Conservation Area. It climbs from farmland near Pokhara through oak and rhododendron forest, then leaves the trees for open grass with close views of Machapuchare, Mardi Himal and Annapurna South.",
        "The trail is newer and quieter than the Annapurna Base Camp route. Lodges are smaller and more spread out, especially above the forest.",
        "There is no technical climbing, but the ridge above High Camp is steep and exposed to wind. In snow or poor visibility the upper section can be unsafe, and many walkers turn back at a lower viewpoint.",
      ],
      facts: [
        { label: "Region", value: "Annapurna, Kaski District" },
        { label: "Protected area", value: "Annapurna Conservation Area" },
        { label: "Gateway city", value: "Pokhara" },
        { label: "High point", value: "Mardi Himal Base Camp viewpoint, about 4,500 m", note: "Figures vary between maps." },
        { label: "Trekking style", value: "Small teahouse lodges, no technical climbing" },
        { label: "Guide", value: "Licensed guide and agency-issued TIMS card required", note: "Nepal Tourism Board TIMS provision, effective 31 March 2023." },
      ],
      highlights: [
        { title: "Forest Camp", text: "Lodges in a clearing of moss-hung oak and rhododendron forest. In spring the trees above here are often in flower." },
        { title: "High Camp", text: "The last lodges on the ridge, above the treeline. Machapuchare rises directly ahead, closer than on most trekking routes." },
        { title: "Base camp viewpoint", text: "An early-morning climb along the ridge leads to views over the Modi Khola valley to Annapurna South and Hiunchuli. Many walkers stop at the upper viewpoint below base camp." },
      ],
      routeTitle: "From the Pokhara hills to the ridge",
      route: keyed("routeStop", [
        { name: "Kande", elevationM: 1770, note: "Roadhead on the Pokhara–Baglung road; one common start.", acclimatise: false },
        { name: "Australian Camp", elevationM: 2060, note: "Open meadow with early views of the Annapurna range.", acclimatise: false },
        { name: "Forest Camp", elevationM: 2520, note: "Lodges in dense forest.", acclimatise: false },
        { name: "Low Camp", elevationM: 2990, note: "Near the top of the forest.", acclimatise: false },
        { name: "High Camp", elevationM: 3580, note: "Last lodges, above the treeline.", acclimatise: false },
        { name: "Mardi Himal Base Camp", elevationM: 4500, note: "Day climb from High Camp; turn back if weather or snow makes the ridge unsafe.", acclimatise: false },
      ]),
      routeNote: `This is the commonly walked line of the route, not a company itinerary. Several trailheads and descent routes are used, including via Siding. ${elevationNote}`,
      seasons: keyed("season", [
        { name: "Autumn", months: "Late Sep – Nov", tone: "best", text: "Usually clear after the monsoon, with the best chance of open views from the ridge." },
        { name: "Spring", months: "Mar – May", tone: "best", text: "Rhododendron forest in flower. Cloud tends to build on the ridge by midday." },
        { name: "Winter", months: "Dec – Feb", tone: "quiet", text: "Clear but cold, with snow possible above High Camp. The upper ridge may not be passable." },
        { name: "Monsoon", months: "Jun – mid Sep", tone: "quiet", text: "Rain, leeches and muddy forest trail. Views from the ridge are rarely clear." },
      ]),
      preparation: keyed("titledText", [
        altitude("about 4,500 m on the day climb"),
        { title: "Fitness", text: "Daily stages are shorter than on many treks, but the climb to the base camp viewpoint is long and steep. Good footing and steady pacing matter on the narrow ridge." },
        insurance,
      ]),
      considerations: keyed("titledText", [
        { title: "Permits", text: "You need an Annapurna Conservation Area entry permit. The Nepal Tourism Board's revised TIMS provision lists the Mardi Himal trek among routes that need a licensed guide and a TIMS card issued through a registered agency. Confirm current fees before you travel." },
        { title: "Weather on the ridge", text: "The upper ridge is exposed. Wind, snow or cloud can make the climb from High Camp unsafe, so be ready to turn back." },
        { title: "Lodges and meals", text: "Lodges are small and fill quickly in peak season. Menus are simpler than on busier routes, and charging and hot water often cost extra." },
        responsible,
      ]),
      gallery: [],
      faqs: keyed("faq", [
        { q: "How difficult is the Mardi Himal trek?", a: "It is a moderate trek with no climbing. The steep, exposed climb from High Camp is the hardest part, and conditions can make it unsafe." },
        { q: "How high does the trek go?", a: "High Camp is about 3,580 m. The base camp viewpoint is about 4,500 m and is usually reached on a day climb and back. Map figures vary." },
        { q: "Which permits are required?", a: "An Annapurna Conservation Area entry permit, plus a TIMS card arranged through a registered trekking agency with a licensed guide. Confirm the current rules before you go." },
        { q: "How does it compare with Annapurna Base Camp?", a: "Mardi Himal is quieter and follows a ridge with open views, while ABC climbs a valley into an enclosed glacial basin. Lodges on Mardi Himal are smaller and fewer." },
      ]),
      sources: keyed("sourceLink", [src.acap, src.tims, src.fees, src.wms]),
    }),
  },

  "drafts.trek.langtang-valley-trek": {
    difficulty: "moderate",
    seo: {
      title: "Langtang Valley Trek Guide: Route to Kyanjin Gompa",
      description: "General guide to the Langtang Valley trek north of Kathmandu: the route from Syabrubesi to Kyanjin Gompa, altitude, seasons, permits and preparation.",
    },
    guide: (hero) => ({
      hero,
      intro: "From the Bhote Koshi up through forest into a high glacial valley of yak pastures and Tamang villages.",
      overview: [
        "The Langtang Valley trek follows the Langtang Khola east from Syabrubesi, inside Langtang National Park. It is the closest major trekking valley to Kathmandu, reached by road rather than a mountain flight.",
        "The lower trail climbs through forest where red pandas and langur monkeys live. Higher up, the valley widens into pasture below Langtang Lirung, with Tamang villages, yak herders and the monastery at Kyanjin Gompa.",
        "It is a teahouse trek with no technical climbing. From Kyanjin Gompa, day hikes lead to higher viewpoints such as Kyanjin Ri for those who are well acclimatised.",
      ],
      facts: [
        { label: "Region", value: "Langtang, Rasuwa District" },
        { label: "Protected area", value: "Langtang National Park" },
        { label: "Road access", value: "By road from Kathmandu; no flight needed" },
        { label: "High point", value: "Kyanjin Gompa, about 3,870 m", note: "Optional day hikes go higher." },
        { label: "Trekking style", value: "Teahouse lodges, no technical climbing" },
        { label: "Guide", value: "Licensed guide and agency-issued TIMS card required", note: "Nepal Tourism Board TIMS provision, effective 31 March 2023." },
      ],
      highlights: [
        { title: "Forest of the lower valley", text: "The trail climbs beside the river through oak, maple and rhododendron. Langtang National Park records red panda, Himalayan black bear and langur monkeys among its wildlife." },
        { title: "Langtang village", text: "The village was rebuilt after a landslide triggered by the 2015 earthquake buried the old settlement. A memorial near the trail remembers those who died." },
        { title: "Kyanjin Gompa", text: "A small monastery and cheese factory at the head of the valley, surrounded by peaks and glaciers. It is a common place to rest and acclimatise before day hikes." },
      ],
      routeTitle: "From Syabrubesi to Kyanjin Gompa",
      route: keyed("routeStop", [
        { name: "Syabrubesi", elevationM: 1460, note: "Roadhead on the Bhote Koshi.", acclimatise: false },
        { name: "Lama Hotel", elevationM: 2470, note: "Lodges in the forest.", acclimatise: false },
        { name: "Langtang village", elevationM: 3430, note: "Rebuilt Tamang village in the upper valley.", acclimatise: false },
        { name: "Kyanjin Gompa", elevationM: 3870, note: "Monastery at the head of the valley; base for day hikes.", acclimatise: true },
      ]),
      routeNote: `This is the commonly walked line of the route, not a company itinerary. Most walkers return the same way; some link Gosainkunda or the Tamang Heritage Trail. ${elevationNote}`,
      seasons: keyed("season", [
        { name: "Autumn", months: "Oct – Nov", tone: "best", text: "The Nepal Tourism Board lists October–November as a main season. Usually clear and dry, and cold higher up." },
        { name: "Spring", months: "Mar – May", tone: "best", text: "Rhododendrons flower in the lower forest. Cold at the head of the valley." },
        { name: "Winter", months: "Dec – Feb", tone: "quiet", text: "Snow is likely in the upper valley and some lodges may close." },
        { name: "Monsoon", months: "Jun – Sep", tone: "quiet", text: "Rain and landslide risk on roads and lower trail. Views are often hidden." },
      ]),
      preparation: keyed("titledText", [
        altitude("about 3,870 m, and higher on optional day hikes"),
        { title: "Fitness", text: "Days involve steady climbing on rocky trail, gaining most height between Syabrubesi and Langtang village. Regular walking with ascents before you travel is the best preparation." },
        insurance,
      ]),
      considerations: keyed("titledText", [
        { title: "Permits", text: "You need a Langtang National Park entry permit. The Nepal Tourism Board's revised TIMS provision lists the Langtang trek among routes that need a licensed guide and a TIMS card issued through a registered agency. Some wards of Gosaikunda Rural Municipality are restricted areas with their own permit, so check whether your exact route enters one." },
        { title: "Road travel", text: "The drive from Kathmandu to Syabrubesi is on a mountain road. Journey times vary with road works, landslides and the season, so allow spare time." },
        { title: "Lodges and meals", text: "Teahouses offer simple rooms and meals, run mostly by Tamang families. Charging and hot showers usually cost extra higher up." },
        responsible,
      ]),
      gallery: [],
      faqs: keyed("faq", [
        { q: "How difficult is the Langtang Valley trek?", a: "It is a moderate trek with no climbing. It is lower than Everest or Annapurna Base Camp, but altitude still affects many walkers above 3,000 m." },
        { q: "How do you get to the start?", a: "By road from Kathmandu to Syabrubesi. Travel times vary with road and weather conditions, so plan a buffer day." },
        { q: "Which permits are required?", a: "A Langtang National Park entry permit and a TIMS card arranged through a registered agency with a licensed guide. Check whether your route enters a restricted area." },
        { q: "When is the best time to go?", a: "The Nepal Tourism Board gives October–November and March–May as the main seasons. Winter brings snow higher up, and the monsoon brings rain and landslide risk." },
      ]),
      sources: keyed("sourceLink", [src.langtang, src.tims, src.fees, src.immigration, src.wms]),
    }),
  },
};

const ids = [...Object.keys(guides), "drafts.trek.everest-base-camp-trek"];
const docs: { _id: string; photo: unknown; guide?: { considerations: { title: string; text: string }[]; faqs: { q: string; a: string }[] } }[] = await client.fetch(`*[_id in $ids]{ _id, photo, guide }`, { ids });
if (docs.length !== 4) throw new Error(`Expected 4 trek drafts; found ${docs.length}`);

let tx = client.transaction();
for (const doc of docs) {
  const g = guides[doc._id];
  if (g) {
    if (doc.guide) throw new Error(`${doc._id} already has a guide; refusing to overwrite`);
    const set: Record<string, unknown> = { guide: g.guide(doc.photo), difficulty: g.difficulty, "seo.title": g.seo.title, "seo.description": g.seo.description, "seo.index": false };
    if (g.summary) set.summary = g.summary;
    tx = tx.patch(doc._id, (p) => p.set(set));
    continue;
  }
  // Everest Base Camp: scope park-entry wording to visitors entering the park (as on the Khumbu destination), add difficulty.
  const narrow = (t: string) => t.replace("Park entry: every visitor needs a Sagarmatha National Park entry permit", "Park entry: visitors entering Sagarmatha National Park need a park entry permit").replace("Every visitor needs a Sagarmatha National Park entry permit.", "Visitors entering Sagarmatha National Park need a park entry permit.");
  const considerations = doc.guide!.considerations.map((c) => ({ ...c, text: narrow(c.text) }));
  const faqs = doc.guide!.faqs.map((f) => ({ ...f, a: narrow(f.a) }));
  tx = tx.patch(doc._id, (p) => p.set({ "guide.considerations": considerations, "guide.faqs": faqs, difficulty: "challenging", "seo.index": false }));
}
if (dryRun) {
  console.log(JSON.stringify({ dataset, mutations: tx.toJSON().length }));
} else {
  const res = await tx.commit();
  console.log(JSON.stringify({ dataset, transactionId: res.transactionId, documents: res.documentIds }));
}
