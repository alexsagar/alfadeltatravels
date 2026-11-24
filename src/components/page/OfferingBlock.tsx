import type { Offering } from "@/content/types";
import { ArrowLink } from "@/components/ui/editorial";

/**
 * The company's own package, always visually separate from general
 * destination information. The content layer only passes an offering an
 * editor has marked "Confirmed"; without one, only a short planning prompt shows.
 */
export function OfferingBlock({ offering, title, enquireHref }: { offering: Offering; title: string; enquireHref: string }) {
  return (
    <div className="grid gap-8 bg-cloud-50 p-8 md:grid-cols-[1fr_1.5fr] md:p-12">
      <div>
        <p className="eyebrow text-brand-500">{offering ? "Company package" : "Plan this trip"}</p>
        <h3 className="mt-3 font-display text-3xl">{title}</h3>
        {offering?.price && (
          <p className="mt-6 font-display text-2xl">
            {offering.price.currency} {offering.price.amount.toLocaleString("en")}
            <span className="mt-1 block font-sans text-xs text-ink-500">{offering.price.basis}</span>
          </p>
        )}
      </div>
      {offering ? (
        <div className="space-y-8">
          {offering.durationDays && <p className="text-sm text-ink-700">{offering.durationDays} days{offering.availability ? ` · ${offering.availability}` : ""}</p>}
          <ol className="divide-y divide-ink-900/10 border-y border-ink-900/10">
            {offering.itinerary.map((d) => (
              <li key={d.day} className="grid grid-cols-[4rem_1fr] gap-4 py-4">
                <span className="eyebrow pt-1 text-[11px] text-ink-500">Day {d.day}</span>
                <div>
                  <p className="font-display text-xl">{d.title}</p>
                  {d.text && <p className="mt-1 text-sm leading-relaxed text-ink-700">{d.text}</p>}
                </div>
              </li>
            ))}
          </ol>
          {(offering.inclusions.length > 0 || offering.exclusions.length > 0) && (
            <div className="grid gap-8 sm:grid-cols-2">
              {[
                ["Included", offering.inclusions],
                ["Not included", offering.exclusions],
              ].map(([label, items]) =>
                (items as string[]).length ? (
                  <div key={label as string}>
                    <p className="eyebrow text-[11px] text-ink-500">{label as string}</p>
                    <ul className="mt-3 space-y-1.5 text-sm text-ink-700">
                      {(items as string[]).map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </div>
          )}
          {offering.departures?.length ? <p className="text-sm text-ink-700">Departures: {offering.departures.join(" · ")}</p> : null}
          <ArrowLink href={enquireHref}>Enquire about this package</ArrowLink>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="leading-relaxed text-ink-700">Share your dates, pace and interests on the planning page to start shaping this trip.</p>
          <ArrowLink href={enquireHref}>Plan this trip</ArrowLink>
        </div>
      )}
    </div>
  );
}
