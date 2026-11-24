"use client";

// Custom-trip enquiry form. Validates in the browser and builds the enquiry,
// but there is no backend yet, so it says plainly that nothing was sent.
// Wire `submitEnquiry` to a real endpoint (email/CRM) in a later milestone.

import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { validate, type Errors } from "./validate";


const interests = ["Trekking", "Culture & heritage", "Wildlife", "Leisure", "Adventure"];
const field = "mt-2 w-full border border-ink-900/20 bg-cloud-50 px-4 py-3 text-base text-ink-900 transition-colors placeholder:text-ink-500/70 focus:border-night-800 focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-500";
const label = "eyebrow text-[11px] text-ink-700";

/** `treks` comes from the server (content layer), so the form lists whatever is published. */
export function EnquiryForm({ treks }: { treks: { slug: string; title: string }[] }) {
  const params = useSearchParams();
  const preset = treks.find((t) => t.slug === params.get("interest"))?.slug ?? "";
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState<[string, string][] | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const status = useRef<HTMLDivElement>(null);

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    const e = validate({ name: get("name"), email: get("email"), message: get("message"), consent: fd.get("consent") === "on" });
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      setSummary(null);
      return;
    }
    const trek = treks.find((t) => t.slug === get("trek"))?.title;
    setSummary(
      (
        [
          ["Name", get("name")],
          ["Email", get("email")],
          ["Country", get("country")],
          ["Interests", fd.getAll("interests").join(", ")],
          ["Trek", trek ?? ""],
          ["When", get("when")],
          ["Length", get("days") && `${get("days")} days`],
          ["Travelers", get("people")],
          ["Altitude experience", get("experience")],
          ["Message", get("message")],
        ] as [string, string][]
      ).filter(([, v]) => v),
    );
    requestAnimationFrame(() => status.current?.focus());
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-sm text-brand-500">
        {errors[k]}
      </p>
    ) : null;
  const described = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  return (
    <>
      <form ref={form} onSubmit={onSubmit} noValidate className="grid gap-8 sm:grid-cols-2" aria-describedby="form-note">
        <div>
          <label htmlFor="name" className={label}>
            Name <span aria-hidden>*</span>
          </label>
          <input id="name" name="name" autoComplete="name" required className={field} {...described("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email <span aria-hidden>*</span>
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required className={field} {...described("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="country" className={label}>
            Country of residence
          </label>
          <input id="country" name="country" autoComplete="country-name" className={field} />
        </div>
        <div>
          <label htmlFor="trek" className={label}>
            A trek you are considering
          </label>
          <select id="trek" name="trek" defaultValue={preset} className={field}>
            <option value="">Not sure yet</option>
            {treks.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={label}>Interests</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {interests.map((i) => (
              <label key={i} className="flex cursor-pointer items-center gap-2 border border-ink-900/20 bg-cloud-50 px-4 py-2.5 text-sm has-[:checked]:border-night-800 has-[:checked]:bg-night-800 has-[:checked]:text-cloud-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-500">
                <input type="checkbox" name="interests" value={i} defaultChecked={i === "Trekking" && !!preset} className="sr-only" />
                {i}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="when" className={label}>
            When would you like to travel?
          </label>
          <input id="when" name="when" placeholder="e.g. October next year" className={field} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="days" className={label}>
              Days available
            </label>
            <input id="days" name="days" type="number" min={1} max={90} inputMode="numeric" className={field} />
          </div>
          <div>
            <label htmlFor="people" className={label}>
              Travelers
            </label>
            <input id="people" name="people" type="number" min={1} max={30} inputMode="numeric" className={field} />
          </div>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={label}>Have you trekked above 4,000 m before?</legend>
          <div className="mt-3 flex flex-wrap gap-6 text-sm">
            {["Yes", "No", "Not sure"].map((o) => (
              <label key={o} className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="experience" value={o} className="h-4 w-4 accent-night-800" />
                {o}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={label}>
            Your plans <span aria-hidden>*</span>
          </label>
          <textarea id="message" name="message" rows={6} required className={field} placeholder="Pace, interests, anything we should know." {...described("message")} />
          {err("message")}
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-700">
            <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-night-800" {...described("consent")} />
            I agree that Alfa Delta Travels may use these details to reply to my enquiry. <span aria-hidden>*</span>
          </label>
          {err("consent")}
        </div>

        <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
          <button type="submit" className="btn-primary">
            Review enquiry
          </button>
          <p id="form-note" className="text-xs text-ink-500">
            * Required. Online sending is not connected yet — nothing is transmitted from this page.
          </p>
        </div>
      </form>

      <div ref={status} tabIndex={-1} role="status" aria-live="polite" className="mt-12 focus:outline-none">
        {summary && (
          <div className="border-l-2 border-brand-500 bg-cloud-50 p-8">
            <p className="eyebrow text-brand-500">Not sent</p>
            <h3 className="mt-3 font-display text-3xl">Your enquiry is ready, but online sending isn&rsquo;t live yet</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-700">
              Nothing has been transmitted. Contact details for Alfa Delta Travels are still being added to this site; until then please keep a copy of the summary below.
            </p>
            <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[12rem_1fr]">
              {summary.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="whitespace-pre-line text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </>
  );
}
