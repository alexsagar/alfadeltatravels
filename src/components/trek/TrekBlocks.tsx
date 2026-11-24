// Reusable trek building blocks: listing card, elevation profile, seasons,
// FAQs and gallery. Server components; data comes from content/types.ts.
import Image from "next/image";
import Link from "next/link";
import type { Faq, Photo, RouteStop, Season, Trek } from "@/content/types";

// Region slugs are destination slugs; the label is derived so CMS regions work too.
const regionName = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

/**
 * Route card. Numbered and region-tagged so routes read as distinct; links
 * only when a detail guide exists, otherwise says so plainly (no dead links).
 */
/** `feature`: a single trek shown wide — photo and text side by side from md up. */
export function TrekCard({ trek, sizes, ratio = "aspect-[4/5]", light, index, feature }: { trek: Trek<Photo>; sizes: string; ratio?: string; light?: boolean; index?: number; feature?: boolean }) {
  const photo = trek.photo;
  const href = trek.guide ? `/treks/${trek.slug}` : undefined;
  const muted = light ? "text-cloud-100/75" : "text-ink-700";
  const media = (
    <>
      <div className={`relative ${ratio} overflow-hidden bg-night-900`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} placeholder="blur" className="object-cover transition-transform duration-1000 ease-cinematic group-hover:scale-[1.04]" />
        {href && <span className="absolute top-3 left-3 bg-brand-500 px-2.5 py-1 text-[11px] font-semibold tracking-[0.2em] text-cloud-50 uppercase">Route guide</span>}
      </div>
    </>
  );
  const text = (
    <>
      <div className={`${feature ? "mt-5 md:mt-0" : "mt-5"} flex items-baseline gap-3 border-t pt-4 ${light ? "border-cloud-50/15" : "border-ink-900/15"}`}>
        {index !== undefined && <span className={`font-display text-xl tabular-nums ${light ? "text-brand-300" : "text-brand-500"}`}>{String(index + 1).padStart(2, "0")}</span>}
        <p className={`eyebrow ${light ? "text-brand-300" : "text-brand-500"}`}>{regionName(trek.region)}</p>
      </div>
      <h3 className="mt-2 font-display text-3xl leading-tight">{trek.title}</h3>
      {trek.highPoint && <p className={`mt-2 text-sm ${light ? "text-cloud-50" : "text-ink-900"}`}>High point: {trek.highPoint}</p>}
      <p className={`mt-3 text-sm leading-relaxed ${muted}`}>{trek.summary}</p>
      {href && (
        <p className="mt-5 text-sm">
          <span className="border-b border-brand-500/70 pb-0.5">
            Read the route guide <span aria-hidden className="text-brand-400">→</span>
          </span>
        </p>
      )}
    </>
  );
  const body = feature ? (
    <div className="grid gap-x-12 md:grid-cols-[1.5fr_1fr] md:items-end">
      <div>{media}</div>
      <div className="md:pb-8">{text}</div>
    </div>
  ) : (
    <>
      {media}
      {text}
    </>
  );
  return href ? (
    <Link href={href} className="group block focus-visible:outline-offset-8">
      {body}
    </Link>
  ) : (
    <div className="group">{body}</div>
  );
}

/**
 * Elevation profile drawn from route stops. The line is a stretched SVG
 * (non-scaling stroke); every label, dot and number is HTML positioned in %,
 * so text stays legible at any width and never scales down with the graphic.
 * Stops are evenly spaced — it shows the shape of the climb, not distances.
 * Decorative for assistive tech: the same data is in <RouteStops> and the
 * sr-only summary.
 */
export function ElevationProfile({ stops }: { stops: RouteStop[] }) {
  const min = 2000;
  const max = Math.max(...stops.map((s) => s.elevationM)) + 300;
  const x = (i: number) => (i / (stops.length - 1)) * 100;
  const y = (m: number) => (1 - (m - min) / (max - min)) * 100;
  const line = stops.map((s, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(s.elevationM).toFixed(2)}`).join(" ");
  const top = stops.reduce((a, b) => (b.elevationM > a.elevationM ? b : a));
  const fmt = (m: number) => m.toLocaleString("en");
  return (
    <figure>
      <p className="sr-only">
        Elevation profile: the route climbs from {stops[0].name} at about {fmt(stops[0].elevationM)} m to {top.name} at about {fmt(top.elevationM)} m. Every stop is listed below.
      </p>
      <div aria-hidden className="relative mr-14 ml-2 h-52 sm:mr-16 md:h-72">
        {[3000, 4000, 5000].map((m) => (
          <div key={m} className="absolute inset-x-0 border-t border-dashed border-ink-500/25" style={{ top: `${y(m)}%` }}>
            <span className="absolute -right-14 -translate-y-1/2 text-xs text-ink-500 tabular-nums sm:-right-16">{fmt(m)} m</span>
          </div>
        ))}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <path d={`${line} L100,100 L0,100 Z`} className="fill-night-800/10" />
          <path d={line} className="fill-none stroke-night-800" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {stops.map((s, i) => (
          <span
            key={s.name}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-cloud-100 ${s.acclimatise ? "h-3 w-3 bg-brand-500" : "h-2.5 w-2.5 bg-night-800"}`}
            style={{ left: `${x(i)}%`, top: `${y(s.elevationM)}%` }}
          />
        ))}
        {/* Peak value, the one number worth reading off the graph. */}
        <span className="absolute -translate-x-full -translate-y-[160%] text-xs whitespace-nowrap text-ink-900 tabular-nums" style={{ left: `${x(stops.indexOf(top))}%`, top: `${y(top.elevationM)}%` }}>
          {top.name} ≈ {fmt(top.elevationM)} m
        </span>
      </div>
      {/* Stop numbers under the graph match the numbered list below. */}
      <div aria-hidden className="relative mt-3 mr-14 ml-2 h-5 sm:mr-16">
        {stops.map((s, i) => (
          <span key={s.name} className={`absolute -translate-x-1/2 text-xs tabular-nums ${s.acclimatise ? "text-brand-500" : "text-ink-500"}`} style={{ left: `${x(i)}%` }}>
            {String(i + 1).padStart(2, "0")}
          </span>
        ))}
      </div>
      <figcaption className="mt-4 text-xs leading-relaxed text-ink-500">
        Approximate elevations; stops evenly spaced, numbered as in the list below. <span className="text-brand-500">●</span> common acclimatisation stop.
      </figcaption>
    </figure>
  );
}

export function RouteStops({ stops }: { stops: RouteStop[] }) {
  return (
    <ol className="divide-y divide-ink-900/10 border-y border-ink-900/10">
      {stops.map((s, i) => (
        <li key={s.name} className="reveal grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-1 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:gap-x-4 md:grid-cols-[3rem_1fr_1.4fr_auto] md:gap-8">
          <span className="font-display text-xl text-ink-500 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <span className="font-display text-2xl">
            {s.name}
            {s.acclimatise && <span className="eyebrow block text-[11px] text-brand-500 sm:ml-3 sm:inline sm:align-middle">Acclimatise</span>}
          </span>
          <span className="col-span-2 col-start-2 text-sm text-ink-700 md:col-span-1 md:col-start-auto">{s.note}</span>
          <span className="col-start-3 row-start-1 text-sm text-ink-500 tabular-nums md:col-start-auto md:row-start-auto">≈ {s.elevationM.toLocaleString("en")} m</span>
        </li>
      ))}
    </ol>
  );
}

const toneLabel = { best: "Recommended", good: "Good", quiet: "Off season" } as const;

export function SeasonGrid({ seasons, light }: { seasons: Season[]; light?: boolean }) {
  return (
    <ul className={`grid gap-px sm:grid-cols-2 lg:grid-cols-4 ${light ? "bg-cloud-50/15" : "bg-ink-900/10"}`}>
      {seasons.map((s) => (
        <li key={s.name} className={`reveal flex flex-col p-7 ${light ? "bg-night-950" : "bg-cloud-100"}`}>
          <p className={`eyebrow text-[11px] ${s.tone === "best" ? "text-brand-500" : light ? "text-cloud-100/50" : "text-ink-500"}`}>{toneLabel[s.tone]}</p>
          <h3 className="mt-4 font-display text-3xl">{s.name}</h3>
          <p className={`mt-1 text-sm ${light ? "text-cloud-100/70" : "text-ink-500"}`}>{s.months}</p>
          <p className={`mt-5 text-sm leading-relaxed ${light ? "text-cloud-100/80" : "text-ink-700"}`}>{s.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Native <details> accordion: keyboard and screen-reader support for free, no JS. No FAQ rich-result markup. */
export function Faqs({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-ink-900/10 border-y border-ink-900/10">
      {items.map((f) => (
        <details key={f.q} className="group py-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-2xl [&::-webkit-details-marker]:hidden">
            <h3>{f.q}</h3>
            <span aria-hidden className="mt-1 text-brand-500 transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-700">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Editorial gallery: one large frame and a staggered column, each with its real-location caption. */
export function Gallery({ items }: { items: Photo[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-6">
      {items.map((p, i) => {
        const span = i === 0 ? "col-span-2 md:col-span-4 md:row-span-2" : i < 3 ? "md:col-span-2" : "md:col-span-2";
        return (
          <li key={p.src.src} className={`reveal-mask ${span}`}>
            <figure className="h-full">
              <div className={`relative overflow-hidden bg-night-900 ${i === 0 ? "aspect-[4/3] md:aspect-auto md:h-[calc(100%-1.5rem)]" : "aspect-[4/3]"}`}>
                <Image src={p.src} alt={p.alt} fill sizes={i === 0 ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 30vw, 50vw"} placeholder="blur" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-xs text-ink-500">{p.location}</figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
