/** Structured data. Only factual fields — never ratings, prices or reviews we don't have. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // `<` escaped so content can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
