// Shared editorial building blocks used by the homepage and internal pages.
// Server components only; `.reveal` / `.reveal-mask` are CSS scroll-driven.
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Photo } from "@/content/photos";

export function SectionHeading({
  eyebrow,
  title,
  id,
  light,
  as: Tag = "h2",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  id: string;
  light?: boolean;
  as?: "h2" | "h3";
  children?: ReactNode;
}) {
  return (
    <header className="reveal max-w-3xl">
      <p className={`eyebrow mb-5 ${light ? "text-brand-300" : "text-brand-500"}`}>{eyebrow}</p>
      <Tag id={id} className="font-display text-display-lg font-medium">
        {title}
      </Tag>
      {children && <div className={`mt-6 max-w-xl leading-relaxed ${light ? "text-cloud-100/80" : "text-ink-700"}`}>{children}</div>}
    </header>
  );
}

/** Photo card (alt text only, no visible caption). Pass `group` on a parent for the hover zoom. */
export function PhotoCard({ photo, ratio, sizes, position }: { photo: Photo; ratio: string; sizes: string; position?: string }) {
  return (
    <>
      <div className={`relative ${ratio} overflow-hidden bg-night-900`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          className={`object-cover transition-transform duration-1000 ease-cinematic group-hover:scale-[1.04] ${position ?? ""}`}
        />
      </div>
    </>
  );
}

/** Understated text link with a copper arrow; used for "see all" and cross-links. */
export function ArrowLink({ href, children, light }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 border-b pb-1 text-sm tracking-wide transition-colors ${
        light ? "border-cloud-50/30 text-cloud-50 hover:border-brand-300" : "border-ink-900/25 text-ink-900 hover:border-brand-500"
      }`}
    >
      {children}
      <span aria-hidden className="text-brand-400 transition-transform duration-500 ease-cinematic group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
