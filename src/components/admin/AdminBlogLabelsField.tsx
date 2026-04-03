import { BLOG_LABELS } from "@/lib/blog-labels";

export function AdminBlogLabelsField({
  defaultSelected = [],
}: {
  defaultSelected?: string[];
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="admin-label">Labels</legend>
      <p className="text-xs text-muted-foreground">
        Choose any that apply. Visitors can filter the blog by these labels.
      </p>
      <div className="mt-2 grid max-h-64 gap-2 overflow-y-auto rounded-lg border border-border/80 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_LABELS.map((l) => (
          <label
            key={l}
            className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
          >
            <input
              type="checkbox"
              name="labels"
              value={l}
              defaultChecked={defaultSelected.includes(l)}
              className="rounded border-border accent-[color:var(--accent)]"
            />
            {l}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
