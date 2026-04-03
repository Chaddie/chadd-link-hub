import Link from "next/link";
import { BLOG_LABELS, blogLabelFilterChipClass } from "@/lib/blog-labels";

export function BlogLabelFilter({ activeLabel }: { activeLabel?: string }) {
  const allPostsClass = (selected: boolean) =>
    `inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-[13px] ${
      selected
        ? "border-[color:var(--accent)] bg-[color:var(--accent-muted)] text-[color:var(--accent)] ring-2 ring-[color:var(--accent)]/30 ring-offset-2 ring-offset-background"
        : "border-border/80 bg-black/[0.03] text-muted-foreground hover:border-border hover:text-foreground dark:bg-white/[0.05]"
    }`;

  const labelPill = (label: string) =>
    `inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-[13px] ${blogLabelFilterChipClass(label, activeLabel === label)}`;

  return (
    <nav
      className="mb-8 flex flex-col gap-3 border-b border-border/70 pb-6 dark:border-white/10"
      aria-label="Filter posts by label"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Filter by label
      </p>
      <div className="flex max-h-[min(40vh,280px)] flex-wrap gap-2 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5">
        <Link href="/blog" className={allPostsClass(!activeLabel)} scroll={false}>
          All posts
        </Link>
        {BLOG_LABELS.map((l) => (
          <Link
            key={l}
            href={`/blog?label=${encodeURIComponent(l)}`}
            className={labelPill(l)}
            scroll={false}
          >
            {l}
          </Link>
        ))}
      </div>
    </nav>
  );
}
