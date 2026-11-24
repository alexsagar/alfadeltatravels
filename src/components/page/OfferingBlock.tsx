import type { Offering } from "@/content/types";
import { ArrowLink, Pending } from "@/components/ui/editorial";

/**
 * The company's own package, always visually separate from general
 * destination information. The content layer only passes an offering an
 * editor has marked "Confirmed"; anything else shows the pending notice.
 */
export function OfferingBlock({ offering, title, enquireHref }: { offering: Offering; title: string; enquireHref: string }) {
  return (
    <div className="grid gap-8 bg-cloud-50 p-8 md:grid-cols-[1fr_1.5fr] md:p-12">
      <div>
        <p className="eyebrow text-brand-500">Company package</p>
        <h3 className="mt-3 font-display text-3xl">{title}</h3>
        <p className="mt-2 text-sm text-ink-500">{offering ? "Confirmed by Alfa Delta Travels" : "Not yet confirmed"}</p>
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
          <Pending>Day-by-day itinerary, trip length, departure dates, inclusions and price have not been confirmed yet and are deliberately not shown.</Pending>
          <p className="text-sm leading-relaxed text-ink-700">The information above describes the destination in general. Until a company package is confirmed, you can describe what you have in mind in an enquiry.</p>
          <ArrowLink href={enquireHref}>Send an enquiry</ArrowLink>
        </div>
      )}
    </div>
  );
}
