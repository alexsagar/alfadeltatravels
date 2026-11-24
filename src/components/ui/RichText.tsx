import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import type { RichText as RichTextValue } from "@/content/types";
import { mapPhoto } from "@/sanity/map";

// Portable Text in the site's editorial style. Inline photos keep their
// "Pictured:" caption like every other image on the site.
const blocks = {
    normal: ({ children }) => <p className="leading-relaxed text-ink-700">{children}</p>,
    h2: ({ children }) => <h2 className="pt-6 font-display text-display-md">{children}</h2>,
    h3: ({ children }) => <h3 className="pt-4 font-display text-3xl">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-brand-500/70 pl-6 font-display text-2xl text-ink-700 italic">{children}</blockquote>,
} satisfies PortableTextComponents["block"];

const components: PortableTextComponents = {
  block: blocks,
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} rel="noopener" className="underline decoration-brand-500/60 underline-offset-4 hover:decoration-brand-500">
        {children}
      </a>
    ),
  },
  types: {
    photo: ({ value }) => {
      const p = mapPhoto({ ...value, url: value?.asset?.url, width: value?.asset?.metadata?.dimensions?.width, height: value?.asset?.metadata?.dimensions?.height, lqip: value?.asset?.metadata?.lqip });
      if (!p) return null;
      return (
        <figure className="my-4">
          <div className="relative aspect-[3/2] overflow-hidden bg-night-900">
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-2 text-xs text-ink-500">Pictured: {p.location}</figcaption>
        </figure>
      );
    },
  },
};

// For body text nested under a section heading (e.g. "About Khumbu"): headings
// drop one level (h2 → h3, h3 → h4) and one size step, so they stay
// subordinate to the page's own section heading.
const nested: PortableTextComponents = {
  ...components,
  block: {
    ...blocks,
    h2: ({ children }) => <h3 className="pt-6 font-display text-3xl leading-tight first:pt-0 md:pt-8 md:text-[2.125rem]">{children}</h3>,
    h3: ({ children }) => <h4 className="pt-2 font-display text-2xl leading-tight first:pt-0">{children}</h4>,
  },
};

export function RichText({ value, nested: isNested }: { value?: RichTextValue; nested?: boolean }) {
  if (!value?.length) return null;
  return (
    <div className="space-y-5 text-lg">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <PortableText value={value as any} components={isNested ? nested : components} />
    </div>
  );
}
