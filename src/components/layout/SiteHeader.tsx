"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contactHref, nav, planHref, storiesHref } from "@/content/site";
import { Logo } from "./Logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const current = (href: string) => (path === href || path.startsWith(`${href}/`) ? "page" : undefined);

  // Close the mobile menu after any navigation.
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Pages without a dark photo hero need the solid bar from the top.
  const solid = scrolled || open || path === "/image-credits";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-cloud-50/95 backdrop-blur-md transition-[border-color,box-shadow] duration-500 ${
        solid ? "border-ink-900/10 shadow-[0_6px_24px_rgb(10_15_22/0.08)]" : "border-transparent"
      }`}
    >
      <div className="container-x flex h-18 items-center justify-between text-ink-900">
        <Link href="/" className="shrink-0">
          <Logo className="h-12 w-auto sm:h-14" eager />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 font-display text-[13.5px] font-medium tracking-[0.01em] xl:gap-9">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current(item.href)} className="relative py-2 text-ink-700 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-500 after:transition-transform after:duration-300 hover:text-ink-900 aria-[current=page]:text-ink-900 aria-[current=page]:after:scale-x-100">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={planHref}
                aria-current={current(planHref)}
                className="rounded-full border border-ink-900/25 px-5 py-2.5 text-ink-900 transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-cloud-50 aria-[current=page]:border-brand-500 aria-[current=page]:bg-brand-500 aria-[current=page]:text-cloud-50"
              >
                Plan your journey
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="block w-6 space-y-1.5">
            <span className={`block h-px bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`block h-px bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="container-x h-[calc(100svh-4.5rem)] overflow-y-auto overscroll-contain border-t border-ink-900/10 bg-cloud-50 pb-8 text-ink-900 lg:hidden"
      >
        <ul className="flex flex-col gap-1 pt-4 font-display text-2xl font-semibold tracking-tight">
          {[...nav, { label: "Stories", href: storiesHref }, { label: "Plan your journey", href: planHref }, { label: "Contact", href: contactHref }].map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={current(item.href)} onClick={() => setOpen(false)} className="flex items-center gap-3 py-1.5 text-ink-700 hover:text-ink-900 aria-[current=page]:text-ink-900 aria-[current=page]:before:h-5 aria-[current=page]:before:w-0.5 aria-[current=page]:before:bg-brand-500">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
