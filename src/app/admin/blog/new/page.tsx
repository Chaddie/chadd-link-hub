import Link from "next/link";
import { AdminBlogLabelsField } from "@/components/admin/AdminBlogLabelsField";
import { createBlogPost } from "../../blog-actions";

export default function AdminBlogNewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Blog posts
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">New post</h1>
      </div>
      <form action={createBlogPost} className="admin-card space-y-4">
        <div>
          <label htmlFor="title" className="admin-label">
            Title
          </label>
          <input id="title" name="title" required className="admin-input" />
        </div>
        <div>
          <label htmlFor="slug" className="admin-label">
            Slug (optional)
          </label>
          <input
            id="slug"
            name="slug"
            placeholder="auto from title"
            className="admin-input font-mono text-sm"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="admin-label">
            Excerpt
          </label>
          <textarea id="excerpt" name="excerpt" rows={2} className="admin-input min-h-[4rem]" />
        </div>
        <div>
          <label htmlFor="content" className="admin-label">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={16}
            className="admin-input min-h-[12rem] font-mono text-sm"
          />
        </div>
        <AdminBlogLabelsField />
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="published"
            className="rounded border-border accent-[color:var(--accent)]"
          />
          Published
        </label>
        <button type="submit" className="admin-btn-primary">
          Create post
        </button>
      </form>
    </div>
  );
}
