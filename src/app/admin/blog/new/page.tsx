import Link from "next/link";
import { createBlogPost } from "../../blog-actions";

export default function AdminBlogNewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/blog" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Blog posts
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900">New post</h1>
      </div>
      <form action={createBlogPost} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-zinc-800">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium text-zinc-800">
            Slug (optional)
          </label>
          <input
            id="slug"
            name="slug"
            placeholder="auto from title"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="text-sm font-medium text-zinc-800">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="text-sm font-medium text-zinc-800">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={16}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-800">
          <input type="checkbox" name="published" className="rounded border-zinc-300" />
          Published
        </label>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Create post
        </button>
      </form>
    </div>
  );
}
