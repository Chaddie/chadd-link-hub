import Link from "next/link";
import { blogLabelChipClass } from "@/lib/blog-labels";

export function BlogPostLabels({
  labels,
  linkToFilter = true,
}: {
  labels: string[];
  linkToFilter?: boolean;
}) {
  if (!labels.length) return null;

  const base =
    "inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition";

  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Post labels">
      {labels.map((l) =>
        linkToFilter ? (
          <li key={l}>
            <Link
              href={`/blog?label=${encodeURIComponent(l)}`}
              className={`${base} ${blogLabelChipClass(l)} hover:brightness-95 dark:hover:brightness-110`}
            >
              {l}
            </Link>
          </li>
        ) : (
          <li key={l}>
            <span className={`${base} ${blogLabelChipClass(l)}`}>{l}</span>
          </li>
        )
      )}
    </ul>
  );
}
