# Asset licenses

Every third-party asset shipped in this repo. Code-side source of truth for
photo credits: `src/content/photos.ts` (rendered in the site footer).

## Scene photography — `src/assets/scenes/`

All sourced from Wikimedia Commons on 2026-11-19. License and author taken
from each file's Commons metadata. Modifications: resized to max 2400px wide (forest.jpg: 1920px, the largest size Commons served)
and re-encoded as progressive JPEG (q78–80). No crops, retouching or compositing.
No watermarks present.

| File | Pictured (real location) | Author | License | Source |
|---|---|---|---|---|
| `hero.jpg` | Poon Hill, Ghorepani — Annapurna South | Aditya Pal | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Sunrise_from_Poon_Hill,_Ghorepani.jpg) |
| `village.jpg` | Ghandruk, Kaski | Gerd Eichmann | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Ghandruk-234-Ortsbild-2013-gje.jpg) |
| `forest.jpg` | Near Cholangpati, Langtang National Park | Ananda Raj Devkota | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Path_through_Pine_Forest_Langtang.JPG) |
| `alpine.jpg` | Gokyo Ri slopes, Khumbu | Vyacheslav Argenberg | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Gokyo_Ri_slopes,_Stones,_Nepal,_Himalayas.jpg) |
| `viewpoint.jpg` | Gokyo Ri summit / Gokyo Lake, Khumbu | Vyacheslav Argenberg | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Gokyo_Ri,_Gokyo_Lake,_Nepal,_Himalayas.jpg) |

Added 2026-11-20 (Milestone 5.1 Stage B), same process: Commons API metadata
(author, license, description) checked per file, previewed for watermarks
(none), resized to max 2400px wide (kathmandu 1400px portrait, panorama 3000px)
and re-encoded as progressive JPEG q80. No crops or retouching.

| File | Pictured (real location) | Author | License | Source |
|---|---|---|---|---|
| `kathmandu.jpg` | Prayer flags, Boudhanath, Kathmandu | Bernard Gagnon | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Prayer_flags_in_Boudhanath.jpg) |
| `pokhara.jpg` | Phewa Lake, Pokhara (Machapuchare behind) | Jean-Marie Hullot | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Phewa_Lake_in_Pokhara_(15715573565).jpg) |
| `chitwan.jpg` | Rhino Lake, Chitwan National Park | Bharatadhikarimb | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Rhino_Lake_Chitwan_National_Park_20161015_145853.jpg) |
| `lumbini.jpg` | Maya Devi Temple and Ashoka Pillar, Lumbini | Shadow Ayush | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Maya_Devi_Temple_and_Ashoka_Pillar,_Lumbini,_Rupandehi,_Nepal.jpg) |
| `sarangkot.jpg` | Annapurna South and Machapuchare from Sarangkot | Bijay Chaurasia | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:View_of_Annapurna_South_and_Machapuchare_from_Sarangkot,_Nepal-WLV-1659.jpg) |
| `panorama.jpg` | Annapurna range (exact viewpoint not stated on Commons; captioned "Annapurna range" only) | Ali Sabbagh | CC0 1.0 (no attribution required; credited anyway) | [Commons](https://commons.wikimedia.org/wiki/File:Snowy_Annapurna_Range_-_panorama.jpg) |
| `amadablam.jpg` | Pangboche, Ama Dablam, Imja Khola valley, Khumbu | Vyacheslav Argenberg | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Pangboche,_Ama_Dablam,_Imja_Khola_Valley,_Mountains_of_Nepal.jpg) |
| `manang.jpg` | Manang valley, Annapurna Circuit (file removed from the repo in Milestone 9.3; still stored as a Sanity `development` asset) | Sergey Ashmarin | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Manang_valley_-_Annapurna_Circuit,_Nepal_-_panoramio.jpg) |

Added 2026-11-20 (Milestone 6A), same process and checks. Photos uploaded by
trekking companies and photos with identifiable people were skipped.

| File | Pictured (real location) | Author | License | Source |
|---|---|---|---|---|
| `everest.jpg` | Everest, Nuptse and the Khumbu Glacier | Vyacheslav Argenberg | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Everest,_Nuptse,_Khumbu_Glacier,_Nepal,_Himalayas.jpg) |
| `kalapatthar.jpg` | Everest and Nuptse from the climb up Kala Patthar | Gerd Eichmann | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Kala_Patthar-90-Everest-Lhotse-2007-gje.jpg) |
| `namche.jpg` | Namche Bazaar, Sagarmatha National Park | Nir Gurung | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Namche_bazzar.jpg) |
| `tengboche.jpg` | Tengboche Monastery with Everest, Lhotse, Ama Dablam | Rohit Sharma | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Tengboche_Monastery_with_Views_of_Mount_Everest,_Lhotse_and_Ama_Dablam.jpg) |
| `pumori.jpg` | Pumori from Kala Patthar | Vyacheslav Argenberg | CC BY 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Mount_Pumori,_Kala_Patthar,_Nepal,_Himalayas.jpg) |
| `abc.jpg` | Annapurna Sanctuary, between MBC and ABC | Bijay Chaurasia | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Mt._Moditse_as_seen_from_Annapurna_Base_Camp-5324.jpg) |
| `mardi.jpg` | Badal Danda, Mardi Himal trek | Kuber Rana Magar | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Golden_Hour_View_from_Badal_Dada_in_Mardi_Himal_Trek.jpg) |

### Obligations
- **Attribution (all):** author, license name + link, source link, and note of
  modification. Satisfied by the `/image-credits` page (author, licence + link,
  source link, "resized and recompressed" note), linked from the footer of
  every page, plus "Pictured:" captions beside each photo.
- **ShareAlike (BY-SA files):** applies to *adaptations of the image itself*.
  Resizing is not treated as creating a new work, and the photos are not
  composited into derived images. If any BY-SA photo is later cut out, masked
  into a foreground layer or graded into a new image, that derived image must be
  released under the same BY-SA license. Prefer CC BY / CC0 or owned photography
  for any layer-separated art.
- Commercial use is permitted by all listed licenses.
- Location captions ("Pictured: …") describe where each photo was actually
  taken. Scene titles ("The forest", "The ascent") are narrative, not claims
  that the photo shows a specific trek's route.

### Recommendation
Replace with commissioned or owned photography before launch where possible,
especially for marketing-critical scenes (hero, treks).

Added 2026-11-24 (Milestone 9, Experiences), same process: Commons API metadata
(author, licence, description, date) checked per file and each photo previewed
for location relevance, watermarks (none) and identifiable faces (none prominent).
Resized to max 2400px on the long side (bhaktapur 1629px and climbing 2048px,
their original sizes) and re-encoded as JPEG q78 (mozjpeg). No crops or retouching.
All require attribution (BY / BY-SA); credited on /image-credits.

| File | Pictured (real location) | Author | License | Source |
|---|---|---|---|---|
| `paragliding.jpg` | Paragliders above Pokhara and Phewa Lake (Commons: "seen from paragliding", 2019) | Nirmal Dulal | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Arial_view_of_Pokhara_03.jpg) |
| `skyfishtail.jpg` | Paragliders against a snow peak, from Lakeside, Pokhara. Commons title says "Mt. Annapurna"; the peak is not named on the site | Sushila Gurung | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Mt._Annapurna_with_Para_gliders.jpg) |
| `rafting.jpg` | Rafting on the Trishuli River (2019) | Bijay Chaurasia | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Trishuli_River_Rafting,_Nepal-3118.jpg) |
| `climbing.jpg` | Rock climbing at Hattiban, Kathmandu Valley (location from the 500px tags; 2015) | Veneeta Singha | CC BY 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Rock_Climbing_In_Nepal_(128592637).jpeg) |
| `bhaktapur.jpg` | Bhaktapur Durbar Square, early morning (2014) | Bikram Pratap Singh | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:View_of_Bhaktapur_Durbar_Square.jpg) |
| `egret.jpg` | Great egret, Kumal Lake, Chitwan National Park (2021) | Prasan Shrestha | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Great_Egret,_Kumal_lake,_Chitwan,_Nepal.jpg) |

Added 2026-11-24 (Milestone 9.2), same process. Each Commons page was checked
for author, licence (both "Own work", CC BY-SA 4.0, commercial reuse allowed
with attribution and share-alike), description and GPS coordinates: rhino.jpg
27.50, 84.33 (inside Chitwan National Park; a Commons "Quality image");
lumbinipool.jpg 27.4692, 83.2755 (Maya Devi Temple, Lumbini). Resized to 2400px
and re-encoded as JPEG q78. No crops or retouching. These replace the egret and
the Maya Devi/Ashoka Pillar photo as the Wildlife and Spirituality category
images; both older files remain in use elsewhere.

| File | Pictured (real location) | Author | License | Source |
|---|---|---|---|---|
| `rhino.jpg` | Greater one-horned rhinoceros mother and calf, Chitwan National Park (2019) | Aditya Pal | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Greater_one-horned_rhinoceros_at_Chitwan.jpg) |
| `lumbinipool.jpg` | Maya Devi Temple and the sacred pool (Puskarni), Lumbini; Ashoka Pillar at left (2019) | Twothreethree | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Sacred_pool_reflecting_beauty_and_wisdom.jpg) |
| `lumbinithai.jpg` | Royal Thai Monastery, monastic zone, Lumbini (Commons category "Thai Monastery (Lumbini)", 2019) | Ricky Partel | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Thai_Monastery_123.jpg) |
| `rafting2.jpg` | Rafting on the Trishuli River (2019) | Bijay Chaurasia | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Trishuli_River_Rafting,_Nepal-3174.jpg) |

## Trekker character

| File | Source | Author | License |
|---|---|---|---|
| `tools/trekker-render/hiker.glb` (pipeline removed in Milestone 9.3) | [tevy.dev/models/hiker](https://tevy.dev/models/hiker) v1 LOD0 | tevy.dev | CC0 1.0 (stated on the page, in the site's JSON-LD and in the GLB `asset.copyright`) |
| `public/trekker/walk.webp`, `rest.webp` | Rendered locally from the GLB (`tools/trekker-render`) | — | CC0 derivative; no obligations |

CC0 needs no attribution; it is recorded here for provenance. The model is a
stylised real-time game character, **not photorealistic** (see DEVELOPMENT_PLAN.md).

## Lab: bird journey (`/lab/bird-journey`)

| File | Source | License |
|---|---|---|
| `public/lab/hummingbird/hummingbird.lottie` | "Hummingbird no Background" by **Michael Mills**, LottieFiles — <https://lottiefiles.com/free-animation/hummingbird-no-background-XEfYomK8GX> (asset `https://assets-v2.lottiefiles.com/a/0fe3b54e-117b-11ee-9680-1348928cad93/p9OWgrS1tu.lottie`, downloaded 2026-11-19, SHA-256 `4c6a4a63391cd61db6f719bbe804acacdf9658036dd1f6107de440bcfded3f0f`) | [Lottie Simple License](https://lottiefiles.com/page/license) |
| `public/lab/hummingbird/dotlottie-player.wasm` | Copied from `@lottiefiles/dotlottie-web@0.82.1` (self-hosted, no CDN) | MIT |
| `public/lab/clouds/*.webp` | Generated by `tools/clouds/make_clouds.py` | Original work |

Approved bird (selected by Alfa Delta Travels). Verification: the page's
structured data names creator "Michael Mills" and its `lottiePath` is the exact
file above; page hash `XEfYomK8GX`. The dotLottie (v1.0, one animation,
1080×1080, 30 fps, 56 frames, layers "hummingbird2 Outlines") is shipped
unmodified; the wing beat is its own loop. Credit shown in the lab overlay:
"Hummingbird animation by Michael Mills (LottieFiles)". Homepage: credited in the footer "Credits" list.

The earlier CC0 hooded-crow stand-in has been removed from the scene and its
sprite sheets deleted (`tools/trekker-render/crow.glb` kept only as render-tool history).
Reference videos in the project root (`bee flying.mp4`, `bird flying.mp4`,
screen recordings) were used for design analysis only; nothing from them is
shipped.

## Fonts

Cormorant Garamond and Manrope — SIL Open Font License 1.1, self-hosted at
build time by `next/font/google`.
