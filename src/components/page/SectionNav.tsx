"use client";

import { useEffect, useState } from "react";

/**
 * Compact in-page navigation for long pages (trek guides, Experiences).
 * Sticks under the fixed header (h-18 = 4.5rem); target sections use
 * `scroll-mt-32`/`scroll-mt-36` so headings land below both bars. Plain
 * anchor links: keyboard, back/forward and no-JS all work.
 *
 * The section currently in view is marked with aria-current="location" and a
 * red underline (IntersectionObserver; progressive enhancement only).
 *
 * Narrow screens: the tab row scrolls sideways inside the bar (never the
 * page), snaps to tabs, and fades out at the right edge with a small chevron
 * so it is obvious more tabs follow. Focusing a tab scrolls it into view.
 */
export function SectionNav({ items, label }: { items: { id: string; label: string }[]; label: string }) {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el) => el !== null);
    // A section is "current" while it crosses a band just below the sticky bars.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    for (const t of targets) io.observe(t);
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className="sticky top-18 z-40 border-b border-ink-900/10 bg-cloud-100/95 backdrop-blur-md">
      <div className="relative">
        <ul className="section-nav container-x flex snap-x snap-mandatory scroll-px-5 gap-1 overflow-x-auto py-2 pr-12 [scrollbar-width:none] sm:gap-2 md:pr-14">
          {items.map((i) => (
            <li key={i.id} className="shrink-0 snap-start">
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? "location" : undefined}
                className="relative block px-3 py-2.5 font-display text-[13px] font-semibold tracking-[0.01em] text-ink-500 transition-colors after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-500 after:transition-transform after:duration-300 hover:text-ink-900 focus-visible:text-ink-900 focus-visible:outline-offset-[-2px] aria-[current=location]:text-ink-900 aria-[current=location]:after:scale-x-100"
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
        {/* "More tabs" cue; decorative, hidden once everything fits. */}
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end pr-3 text-brand-500 lg:hidden">
          ›
        </span>
      </div>
    </nav>
  );
}
