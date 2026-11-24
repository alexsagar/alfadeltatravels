/** Fixed notice on dev-only draft previews, so a preview can never be mistaken for the live page. */
export function DraftBar({ label, exportedAt }: { label: string; exportedAt: string }) {
  return (
    <p className="fixed inset-x-0 bottom-0 z-50 bg-brand-500 px-4 py-2 text-center text-xs tracking-wide text-cloud-50">
      Sanity draft preview · local only · {label} · exported {exportedAt.slice(0, 16).replace("T", " ")} UTC
    </p>
  );
}
